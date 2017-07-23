import vm =  require("vm");
import Url = require("url");
import path = require("path");
import { IBus } from "mesh7";
import { SyntheticLocation } from "./location";
import { SyntheticRendererEvent } from "./messages";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode, SyntheticDOMElement } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, NoopRenderer } from "./renderers";
import {
  inject,
  Logger,
  Status,
  Kernel,
  bindable,
  loggable,
  isMaster,
  LogEvent,
  CoreEvent,
  Observable,
  IInjectable,
  IObservable,
  bindProperty,
  findTreeNode,
  watchProperty,
  HTML_MIME_TYPE,
  hasURIProtocol,
  KernelProvider,
  BubbleDispatcher,
  PropertyMutation,
  PropertyWatcher,
  MimeTypeProvider,
  PrivateBusProvider,
  MetadataChangeEvent,
  ObservableCollection,
  waitForPropertyChange,
} from "aerial-common";

import {
  Sandbox,
  Dependency,
  DependencyGraph,
  URIProtocolProvider,
  generateSyntheticUID,
  DependencyGraphProvider,
  IDependencyGraphStrategyOptions,
  DependencyGraphStrategyOptionsProvider,
} from "aerial-sandbox";

import {
  SyntheticDOMElementClassProvider,
} from "./providers";

import { CallbackBus } from "mesh7";

export interface ISyntheticBrowserOpenOptions {

  // URI to load
  uri: string;

  // script to inject into the page
  injectScript?: string;

  // additional dependency graph options such as strategies -- webpack, commonjs, amd, etc.
  dependencyGraphStrategyOptions?: IDependencyGraphStrategyOptions;
}

export interface ISyntheticBrowser extends IObservable {
  open(options: ISyntheticBrowserOpenOptions): Promise<any>;
  window: SyntheticWindow;
  uid: any;
  logs: ObservableCollection<LogEvent>;
  sandbox?: Sandbox;
  parent?: ISyntheticBrowser;
  renderer: ISyntheticDocumentRenderer;
  document: SyntheticDocument;
  kernel: Kernel;
  location: SyntheticLocation;
}

export interface IMainEntryExports {

  documentElement?: SyntheticDOMElement;
  bodyElement?: SyntheticDOMElement;

  createDocumentElement: () => SyntheticDOMElement;
  createBodyElement: () => SyntheticDOMElement;
}

@loggable()
export abstract class BaseSyntheticBrowser extends Observable implements ISyntheticBrowser, IInjectable {

  @bindable()
  public status: Status = new Status(Status.IDLE);

  protected readonly logger: Logger;

  private _url: string;
  private _window: SyntheticWindow;
  private _documentObserver: IBus<any, any>;
  private _windowObserver: IBus<any, any>;
  private _location: SyntheticLocation;
  private _openOptions: ISyntheticBrowserOpenOptions;
  private _renderer: ISyntheticDocumentRenderer;
  readonly logs: ObservableCollection<LogEvent>;

  readonly statusWatcher: PropertyWatcher<BaseSyntheticBrowser, Status>;
  
  readonly uid = generateSyntheticUID();

  constructor(protected _kernel: Kernel, renderer?: ISyntheticDocumentRenderer, readonly parent?: ISyntheticBrowser) {
    super();
    _kernel.inject(this);

    this.statusWatcher = new PropertyWatcher<BaseSyntheticBrowser, Status>(this, "status");
    this.logs = new ObservableCollection<LogEvent>();
    this._renderer = _kernel.inject(isMaster ? renderer || new SyntheticDOMRenderer() : new NoopRenderer());
    this._renderer.observe(new CallbackBus(this.onRendererEvent.bind(this)));
    this._documentObserver = new CallbackBus(this.onDocumentEvent.bind(this));
    this._windowObserver = new CallbackBus(this.onWindowEvent.bind(this));
  }

  $didInject() { }

  get document() {
    return this.window && this.window.document;
  }

  get kernel() {
    return this._kernel;
  }

  get location() {
    return this._location;
  }

  get window() {
    return this._window;
  }

  protected onRendererEvent(event: SyntheticRendererEvent) {
    this.notify(event); // bubble
  }

  /**
   * 
   */

  public clearLogs() {
    this.logs.splice(0, this.logs.length);
  }

  protected onRendererNodeEvent(event: SyntheticRendererEvent) {
    // OVERRIDE ME
  }

  protected setWindow(value: SyntheticWindow, clearLogs?: boolean) {
    if (this._window) {
      this._window.document.unobserve(this._documentObserver);
    }
    if (clearLogs !== false) {
      this.clearLogs();
    }
    const oldWindow = this._window;
    this._window = value;
    this._window.observe(this._windowObserver);
    this._renderer.document = value.document;
    this._window.document.observe(this._documentObserver);
    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "window", value, oldWindow).toEvent());
  }

  /**
   * Adds a log from the current VM. Used particularly for debugging.
   */

  protected addLog(log: LogEvent) {
    this.logs.push(log);
    this.notify(log);
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  protected get openOptions(): ISyntheticBrowserOpenOptions {
    return this._openOptions;
  }

  async open(options: ISyntheticBrowserOpenOptions) {
    if (JSON.stringify(this._openOptions) === JSON.stringify(options) && this._window) {
      return;
    }

    const options2 = Object.assign({}, options);
    if (!hasURIProtocol(options2.uri)) options2.uri = "file://" + options2.uri;

    this._openOptions = options;
    this._location = new SyntheticLocation(options2.uri);
    await this.open2(options2);
  }

  protected abstract async open2(options: ISyntheticBrowserOpenOptions);

  protected onDocumentEvent(event: CoreEvent) {
    this.notify(event);
  }

  protected onWindowEvent(event: CoreEvent) {
    if (event.type === LogEvent.LOG) {
      this.addLog(event as LogEvent);
    } else {
      this.notify(event);
    }
  }
}

export class SyntheticBrowser extends BaseSyntheticBrowser {

  private _sandbox: Sandbox;
  private _entry: Dependency;
  private _graph: DependencyGraph;
  private _script: string;

  $didInject() {
    super.$didInject();
    this._sandbox    = new Sandbox(this._kernel, this.createSandboxGlobals.bind(this));
    watchProperty(this._sandbox, "status", this.onSandboxStatusChange.bind(this));
    watchProperty(this._sandbox, "exports", this.onSandboxExportsChange.bind(this));
    watchProperty(this._sandbox, "global", this.setWindow.bind(this));
  }

  get sandbox(): Sandbox {
    return this._sandbox;
  }

  protected async open2({ uri, dependencyGraphStrategyOptions, injectScript }: ISyntheticBrowserOpenOptions) {
    
    // TODO - setup file protocol specific to this CWD

    this._script = injectScript;
    this.logger.info(`Opening ${uri} ...`);
    const timerLogger = this.logger.startTimer();
    const strategyOptions = Object.assign({}, dependencyGraphStrategyOptions || {}) as IDependencyGraphStrategyOptions;
    const uriParts = Url.parse(uri);
    const dirname = uriParts.pathname && path.dirname(uriParts.pathname) || ".";
    strategyOptions.rootDirectoryUri = strategyOptions.rootDirectoryUri || (uriParts.protocol || "file:") + "//" + (uriParts.host || (dirname === "." ? "/" : dirname));
    const graph = this._graph = DependencyGraphProvider.getInstance(strategyOptions, this._kernel);
    this._entry = await graph.getDependency(await graph.resolve(uri));
    await this._sandbox.open(this._entry);
    timerLogger.stop(`Loaded ${uri}`);
  }

  protected onSandboxStatusChange(newStatus: Status) {
    if (newStatus.type !== Status.COMPLETED) {
      this.status = newStatus.clone();
    }
  }

  get document() {
    return this.window && this.window.document;
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const window = new SyntheticWindow(this.location.clone(), this, undefined);
    this._registerElementClasses(window.document);
    Object.assign(window, this._graph.createGlobalContext());

    // user injected script to tweak the state of an app
    this._injectScript(window);
    return window;
  }

  private _injectScript(window: SyntheticWindow) {
    if (!this._script) return;
    vm.runInNewContext(this._script, window);
  }

  private _registerElementClasses(document: SyntheticDocument) {
    for (const dependency of SyntheticDOMElementClassProvider.findAll(this._kernel)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  private async onSandboxExportsChange(exports: IMainEntryExports) {
    const window   = this._sandbox.global as SyntheticWindow;
    const document = window.document;

    let exportsElement: SyntheticDOMNode;

    this.logger.debug("Evaluated entry", this.location.toString());
    
    try {

      if (exports.documentElement || exports.createDocumentElement) {
        document.removeAllChildren();
        document.appendChild(exports.documentElement || exports.createDocumentElement());
      }

      if (exports.bodyElement || exports.createBodyElement) {
        document.removeAllChildren();
        document.body.appendChild(exports.bodyElement || exports.createBodyElement());
      }

    } catch(e) {
      this.status = new Status(Status.ERROR, e);
      throw e;
    }

    // there still maybe async ops that need to be loaded in
    await window.whenLoaded();
    
    // quick fix to get synthetic window to fire load events
    this.status = new Status(Status.COMPLETED);
  }
}
