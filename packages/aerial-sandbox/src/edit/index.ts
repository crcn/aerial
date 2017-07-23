import { flatten } from "lodash";
import { FileCache } from "../file-cache";
import { IBus } from "mesh7";
import { CallbackBus } from "mesh7";
import { FileCacheProvider, ContentEditorFactoryProvider, ProtocolURLResolverProvider } from "../providers";
import { URIProtocol, URIProtocolProvider } from "../uri";
import { ISyntheticObject, ISyntheticSourceInfo, syntheticSourceInfoEquals } from "../synthetic";
import {
  inject,
  Logger,
  Mutation,
  Kernel,
  loggable,
  serialize,
  CoreEvent,
  Observable,
  deserialize,
  flattenTree,
  serializable,
  ISerializable,
  MutationEvent,
  getSerializeType,
  MimeTypeProvider,
  KernelProvider,
  SetValueMutation,
  SerializedContentType,
  PropertyMutation,
} from "aerial-common";

export type contentEditorType = { new(uri: string, content: string): IEditor };


export interface IEditor {
  applyMutations(changes: Mutation<ISyntheticObject>[]): any;
}

export interface IEditable {
  createEdit(): IContentEdit;
  createEditor(): IEditor;
}

export interface IDiffable {
  createDiff(source: ISyntheticObject): IContentEdit;
}

@loggable()
export abstract class BaseContentEditor<T> implements IEditor {

  readonly logger: Logger;

  @inject(KernelProvider.ID)
  protected kernel: Kernel;

  protected _rootASTNode: T;

  constructor(readonly uri: string, readonly content: string) { }

  $didInject() {
    this._rootASTNode = this.parseContent(this.content);
  }

  // add uri and content in constructor here instead
  applyMutations(mutations: Mutation<ISyntheticObject>[]): any {
    for (const mutation of mutations) {
      const method = this[mutation.type];
      if (method) {
        const targetASTNode = this.findTargetASTNode(this._rootASTNode, mutation.target);
        if (targetASTNode) {
          method.call(this, targetASTNode, mutation);
        } else {
          this.logger.error(`Cannot apply edit ${mutation.type} on ${this.uri}: AST node for synthetic object not found.`);
        }
      } else {
        this.handleUnknownMutation(mutation);
      }
    }
    return this.getFormattedContent(this._rootASTNode);
  }

  protected handleUnknownMutation(mutation: Mutation<ISyntheticObject>) {
    this.logger.warn(`Cannot apply edit ${mutation.type} on ${this.uri}.`);
  }

  protected abstract findTargetASTNode(root: T, target: ISyntheticObject): T;
  protected abstract parseContent(content: string): T;
  protected abstract getFormattedContent(root: T): string;
}

export interface ISyntheticObjectChild {
  uid: string;
  clone(deep?: boolean);
}

export interface IContentEdit {
  readonly mutations: Mutation<ISyntheticObject>[];
}

export abstract class BaseContentEdit<T extends ISyntheticObject> {

  private _mutations: Mutation<ISyntheticObject>[];
  private _locked: boolean;

  constructor(readonly target: T) {
    this._mutations = [];
  }

  /**
   * Lock the edit from any new modifications
   */

  public lock() {
    this._locked = true;
    return this;
  }

  get locked() {
    return this._locked;
  }

  get mutations(): Mutation<ISyntheticObject>[] {
    return this._mutations;
  }

  /**
   * Applies all edit.changes against the target synthetic object.
   *
   * @param {(T & IEditable)} target the target to apply the edits to
   */

  public applyMutationsTo(target: T & IEditable, each?: (T, mutation: Mutation<ISyntheticObject>) => void) {

    // need to setup an editor here since some events may be intented for
    // children of the target object
    const editor = new SyntheticObjectTreeEditor(target, each);
    editor.applyMutations(this.mutations);
  }

  /**
   * creates a new diff edit -- note that diff edits can only contain diff
   * events since any other event may foo with the diffing.
   *
   * @param {T} newSynthetic
   * @returns
   */

  public fromDiff(newSynthetic: T) {
    const ctor = this.constructor as { new(target:T): BaseContentEdit<T> };

    // TODO - shouldn't be instantiating the constructor property (it may require more params). Use clone method
    // instead.
    const clone = new ctor(this.target);
    return clone.addDiff(newSynthetic).lock();
  }

  protected abstract addDiff(newSynthetic: T): BaseContentEdit<T>;

  protected addChange<T extends Mutation<ISyntheticObject>>(mutation: T) {

    // locked to prevent other events busting this edit.
    if (this._locked) {
      throw new Error(`Cannot modify a locked edit.`);
    }

    this._mutations.push(mutation);

    // return the event so that it can be edited
    return mutation;
  }

  protected addChildEdit(edit: IContentEdit) {
    this._mutations.push(...edit.mutations);
    return this;
  }

}

@loggable()
export class FileEditor {

  protected readonly logger: Logger;

  private _editing: boolean;
  private _mutations: Mutation<ISyntheticObject>[];
  private _shouldEditAgain: boolean;

  private _promise: Promise<any>;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  applyMutations(mutations: Mutation<ISyntheticObject>[]): Promise<any> {

    if (this._mutations == null) {
      this._shouldEditAgain = true;
      this._mutations = [];
    }

    this._mutations.push(...mutations);

    if (!!this._promise) {
      this.logger.info("Waiting for previous edit to finish...");
    }

    return this._promise || (this._promise = new Promise((resolve, reject) => {
      setImmediate(() => {
        let done = () => this._promise = undefined;
        this.run().then(resolve, reject).then(done, done);
      });
    }));
  }

  private async run(): Promise<any> {
    this._shouldEditAgain = false;
    const changes = this._mutations;
    this._mutations = undefined;

    const mutationsByUri: {
      [Identifer: string]: Mutation<ISyntheticObject>[]
    } = {};

    // find all events that are part of the same file and
    // batch them together. Important to ensure that we do not trigger multiple
    // unecessary updates to any file listeners.
    for (const mutation of changes) {
      const target = mutation.target;

      // This may happen if edits are being applied to synthetic objects that
      // do not have the proper mappings. This WILL happen especially with dynamic javascript. In that
      // case, we need to short-cert
      if (!target.source || !target.source.uri) {
        const error = new Error(`Cannot edit file, source property is mising from ${target.clone(false).toString()}.`);
        this.logger.error(error.message);
        return Promise.reject(error);
      }

      const targetSource = target.source;
      const targetUri = await ProtocolURLResolverProvider.resolve(targetSource.uri, this._kernel);

      const fileMutations: Mutation<ISyntheticObject>[] = mutationsByUri[targetUri] || (mutationsByUri[targetUri] = []);
      fileMutations.push(mutation);
    }

    const promises = [];

    for (const uri in mutationsByUri) {

      const fileCache  = await FileCacheProvider.getInstance(this._kernel).findOrInsert(uri);
      const { type, content } = await fileCache.read();

      const contentEditorFactoryProvider = ContentEditorFactoryProvider.find(type, this._kernel);

      if (!contentEditorFactoryProvider) {
        this.logger.error(`No synthetic edit consumer exists for ${uri}:${type}.`);
        continue;
      }

      const autoSave   = contentEditorFactoryProvider.autoSave;

      // error may be thrown if the content is invalid
      try {
        const contentEditor = contentEditorFactoryProvider.create(uri, String(content));

        const changes = mutationsByUri[uri];
        this.logger.info(`Applying file changes ${uri}: >>`, changes.map(event => event.type).join(" "));
        
        const newContent    = contentEditor.applyMutations(changes);

        // This may trigger if the editor does special formatting to the content with no
        // actual edits. May need to have a result come from the content editors themselves to check if anything's changed.
        // Note that checking WS changes won't cut it since formatters may swap certain characters. E.g: HTML may change single quotes
        // to double quotes for attributes.
        if (content !== newContent) {
          await fileCache.setDataUrlContent(newContent);
          promises.push(fileCache.save());
          if (autoSave) {
            promises.push(URIProtocolProvider.lookup(fileCache.sourceUri, this._kernel).write(fileCache.sourceUri, newContent));
          }
        } else {
          this.logger.debug(`No changes to ${uri}`);
        }
      } catch(e) {
        this.logger.error(`Error trying to apply ${changes.map(event => event.type).join(", ")} file edit to ${uri}: ${e.stack}`);
      }
    }

    await Promise.all(promises);

    // edits happened during getEditedContent call
    if (this._shouldEditAgain) {
      this.run();
    }
  }
}

export abstract class BaseEditor<T> {

  constructor(readonly target: T) { }

  applyMutations(mutations: Mutation<T>[]) {
    if (mutations.length === 1) {
      this.applySingleMutation(mutations[0]);
    } else {
      for (let i = 0, n = mutations.length; i < n; i++) {
        this.applySingleMutation(mutations[i]);
      }
    }
  }

  protected applySingleMutation(mutation: Mutation<T>) { }
}

export class GroupEditor implements IEditor {
  readonly editors: IEditor[];
  constructor(...editors: IEditor[]) {
    this.editors = editors;
  }
  applyMutations(mutations: Mutation<any>[]) {
    for (let i = 0, n = this.editors.length; i < n; i++) {
      this.editors[i].applyMutations(mutations);
    }
  }
}

export class SyntheticObjectTreeEditor implements IEditor {

  constructor(readonly root: ISyntheticObject, private _each?: (target: IEditable, change: Mutation<ISyntheticObject>) => void) { }
  applyMutations(mutations: Mutation<ISyntheticObject>[]) {

    const allSyntheticObjects = {};

    flattenTree(this.root).forEach((child) => {
      allSyntheticObjects[child.uid] = child;
    });

    for (let i = 0, n = mutations.length; i < n; i++) {
      const mutation = mutations[i];

      // Assuming that all edit.changes being applied to synthetics are editable. Otherwise
      // they shouldn't be dispatched.
      const target = allSyntheticObjects[mutation.target.uid] as IEditable;

      if (!target) {
        console.error(new Error(`Edit change ${mutation.type} target ${mutation.target.uid} not found.`));
        continue;
      }

      try {
        target.createEditor().applyMutations([mutation]);

        // each is useful particularly for debugging diff algorithms. See tests.
        if (this._each) this._each(target, mutation);
      } catch(e) {
        throw new Error(`Error trying to apply edit ${mutation.type} to ${mutation.target.toString()}: ${e.stack}`);
      }
    }
  }
}

/**
 * Watches synthetic objects, and emits changes over time.
 */

export class SyntheticObjectChangeWatcher<T extends ISyntheticObject & IEditable & Observable> {

  private _clone: T;
  private _target: T
  private _targetObserver: IBus<any, any>;
  private _diffing: boolean;
  private _shouldDiffAgain: boolean;
  private _ticking: boolean;

  constructor(private onChange: (changes: Mutation<ISyntheticObject>[]) => any, private onClone: (clone: T) => any, private filterMessage?: (event: CoreEvent) => boolean) {
    this._targetObserver = new CallbackBus(this.onTargetEvent.bind(this));
    if (!this.filterMessage) {
      this.filterMessage = (event: MutationEvent<any>) => !!event.mutation;
    }
  }

  get target() {
    return this._target;
  }

  set target(value: T) {
    this.dispose();
    this._target = value;
    if (!this._clone) {
      this._clone  = value.clone(true) as T;
      this.onClone(this._clone);
    } else {
      this.diff();
    }

    if (this._target) {
      this._target.observe(this._targetObserver);
    }
  }

  dispose() {
    if (this._target) {
      this._target.unobserve(this._targetObserver);
    }
  }


  private onTargetEvent(event: CoreEvent) {

    if (!this.filterMessage || this.filterMessage(event)) {

      // debounce to batch multiple operations together
      this.requestDiff();
    }
  }

  private requestDiff() {
    if (this._ticking) return;
    this._ticking = true;
    setImmediate(this.diff.bind(this));
  }


  private async diff() {
    this._ticking = false;

    if (this._diffing) {
      this._shouldDiffAgain = true;
      return;
    }

    this._diffing = true;
    const edit = (<BaseContentEdit<any>>this._clone.createEdit()).fromDiff(this._target);

    if (edit.mutations.length) {
      try {
        await this.onChange(edit.mutations);
      } catch(e) {
        this._diffing = false;
        throw e;
      }
      edit.applyMutationsTo(this._clone);
    }

    this._diffing = false;
    if (this._shouldDiffAgain) {
      this._shouldDiffAgain = false;
      this.diff();
    }
  }
}

export namespace SyntheticObjectChangeTypes {
  export const SET_SYNTHETIC_SOURCE_EDIT = "setSyntheticSourceEdit";
}

export abstract class SyntheticObjectEditor<T extends ISyntheticObject> extends BaseEditor<T> {
  applySingleMutation(mutation: Mutation<T>) {
    if (mutation.type === SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT) {
      this.target.$source = (<PropertyMutation<any>>mutation).newValue;
    }
  }
}

export abstract class SyntheticObjectEdit<T extends ISyntheticObject> extends BaseContentEdit<T> {


  setSource(source: ISyntheticSourceInfo) {
    this.addChange(new PropertyMutation(SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, this.target, "$source", source));
  }

  protected addDiff(from: T) {
    if (!syntheticSourceInfoEquals(this.target.$source, from.$source)) {
      this.setSource(from.$source);
    }
    return this;
  }
}
