import { debounce } from "lodash";
import { parallel, createDuplex, pump } from "mesh";
import { Dispatcher, logger, logDebugAction, logInfoAction, logWarningAction, logErrorAction } from "aerial-common2";
import { OpenRemoteBrowserRequest, SyntheticRendererEvent, OPEN_REMOTE_BROWSER, openRemoteBrowserRequest } from "./messages";
import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser, SyntheticBrowserOpenOptions } from "./browser";
import { 
  IMessage,
  IBus, 
  DuplexStream, 
  WritableStream, 
  ReadableStream, 
  CallbackBus, 
  IStreamableBus, 
  ReadableStreamDefaultReader, 
} from "mesh7";
import {
  fork,
  Logger,
  Status,
  isMaster,
  loggable,
  Mutation,
  bindable,
  Kernel,
  CoreEvent,
  serialize,
  MutationEvent,
  flattenTree,
  findTreeNode,
  deserialize,
  IInjectable,
  IDisposable,
  LogEvent,
  serializable,
  watchProperty,
  MainDispatcherProvider,
  PrivateBusProvider,
  BaseApplicationService,
} from "aerial-common";

import { 
  getNodePath,
  getNodeByPath,
  SyntheticWindow, 
  SyntheticDOMNode,
  SyntheticDocument, 
  SyntheticDocumentEdit 
} from "./dom";

import {
  Dependency,
  BaseContentEdit,
  DependencyGraph,
  ApplyFileEditRequest,
  ISyntheticObject,
  SyntheticObjectTreeEditor,
  DependencyGraphWatcher,
  DependencyGraphProvider,
  SyntheticObjectChangeWatcher,
  IDependencyGraphStrategyOptions
} from "aerial-sandbox";


// TODO - add user event stuff here
@serializable("RemoteBrowserDocumentMessage", {
  serialize({ type, data }: RemoteBrowserDocumentMessage) {
    return {
      type: type,
      data: serialize(data)
    }
  },
  deserialize({ type, data }: RemoteBrowserDocumentMessage, kernel: Kernel) {
    return new RemoteBrowserDocumentMessage(type, deserialize(data, kernel));
  }
})
export class RemoteBrowserDocumentMessage extends CoreEvent {
  static readonly NEW_DOCUMENT  = "newDocument";
  static readonly DOCUMENT_DIFF = "documentDiff";
  static readonly VM_LOG        = "vmLog";
  static readonly DOM_EVENT     = "domEvent";
  static readonly STATUS_CHANGE = "statusChange";
  constructor(type: string, readonly data: any) {
    super(type);
  }
}


@loggable()
export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {

  readonly logger: Logger;

  private _bus: IStreamableBus<any>;
  private _dispatch: Dispatcher<any>;
  private _documentEditor: SyntheticObjectTreeEditor;
  private _remoteStreamReader: ReadableStreamDefaultReader<any>;
  private _connection: AsyncIterableIterator<any>;

  @bindable(true)
  public status: Status = new Status(Status.IDLE);

  constructor(kernel: Kernel, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(kernel, renderer, parent);
    this._bus = PrivateBusProvider.getInstance(kernel);
    this._dispatch = MainDispatcherProvider.getInstance(kernel);
  }

  async open2(options: SyntheticBrowserOpenOptions) {
    this.status = new Status(Status.LOADING);
    this.clearLogs();
    if (this._remoteStreamReader) this._remoteStreamReader.cancel("Re-opened");

    this._connection = this._dispatch(openRemoteBrowserRequest(options));

    let value, done;

    pump(this._connection, (event) => {
      this.onRemoteBrowserEvent(event);
    }).catch((e) => {
      this.logger.warn("Remote browser connection closed. Re-opening");
      setTimeout(() => {
        this.open(options);
      }, 1000);
    });
  }

  onRemoteBrowserEvent(e) {
    if (!e) return;
    const { payload } = e;

    const event = deserialize(payload, this.kernel) as RemoteBrowserDocumentMessage;

    this.logger.debug(`Received event: ${event.type}`);

    if (event.type === RemoteBrowserDocumentMessage.STATUS_CHANGE) {
      this.status = (<RemoteBrowserDocumentMessage>event).data;
      if (this.status.type === Status.LOADING) {
        this.clearLogs();
      }
    }

    if (event.type === RemoteBrowserDocumentMessage.NEW_DOCUMENT) {
      const { data } = <RemoteBrowserDocumentMessage>event;
      this.logger.debug("Received new document");

      const previousDocument = this.window && this.window.document;
      const newDocument      = data;
      this._documentEditor   = new SyntheticObjectTreeEditor(newDocument);

      const window = new SyntheticWindow(this.location, this, newDocument);
      this.setWindow(window, false);
      this.status = new Status(Status.COMPLETED);
    } else if (event.type === RemoteBrowserDocumentMessage.DOCUMENT_DIFF) {
      const { data } = <RemoteBrowserDocumentMessage>event;
      const mutations: Mutation<any>[] = data;
      this.logger.debug("Received document diffs: >>", mutations.map(event => event.type).join(", "));
      try {

        // dirty, but ensures that changes from the back-end are not re-sent
        // to the back-end.
        this._ignoreMutations = true;
        this._documentEditor.applyMutations(mutations);
        this._ignoreMutations = false;

      // catch for now to ensure that applying edits doesn't break the stream
      } catch(e) {
        console.error(e.stack);
      }
      this.status = new Status(Status.COMPLETED);
    } else if (event.type === RemoteBrowserDocumentMessage.VM_LOG) {
      for (const [level, text] of event.data) {
        this.addLog(new LogEvent(level, text)); 
      }
    }

    this.notify(event);

    // explicitly request an update since some synthetic objects may not emit
    // a render event in some cases.
    this.renderer.requestRender();
  }

  private _mutations: Mutation<any>[] = [];
  private _ignoreMutations = false;

  protected onDocumentEvent(event: CoreEvent) {
    super.onDocumentEvent(event);
    
    if (event instanceof MutationEvent) {
      if (!this._ignoreMutations) {
        this._mutations.push(event.mutation);
        this.sendDiffs();
      }
      return;
    }

    // TODO - check if this is a user event
    if (event.target && event.target.clone) {
      this.logger.debug(`Passing synthetic event to server: ${event.type}`);

      this._writeConnection(serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.DOM_EVENT, [getNodePath(event.target), event])));
    }
  }

  private _writeConnection(value: any) {
    this._connection.next(value).then(({ value }) => {
      this.onRemoteBrowserEvent(value);
    });
  }

  /**
   * Send ALL changes to the back-end to ensure that everything is in sync.
   */

  private sendDiffs = debounce(() => {
    const mutations = this._mutations;
    this._mutations = [];
    this._writeConnection(serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.DOCUMENT_DIFF, mutations)));
  }, 100);
}

const prefixedLogger = (a, b) => (c) => {};

// export const initRemoteSyntheticBrowserService = (kernel: Kernel, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {

//   // TODO - this state needs to eventually live in app state
//   // when the remote browser is a bit more stateless
//   const openBrowsers = {};

//   return parallel(downstream, whenWorker(upstream, whenType(OPEN_REMOTE_BROWSER, (request: OpenRemoteBrowserRequest) => createDuplex((input, output) => {

//     const id = JSON.stringify(request.options);

//     // TODO - memoize opened browser if same session is up
//     const browser: SyntheticBrowser = openBrowsers[id] || (openBrowsers[id] = new SyntheticBrowser(kernel, new NoopRenderer()));

//     const log = prefixedLogger(`${request.options.uri} `, upstream);
//     let editor: SyntheticObjectTreeEditor;

//     // return the current logs of the VM in case the front-end reloads
//     if (browser.logs.length) {
//       output.unshift({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.VM_LOG, browser.logs.map((log) => [log.level, log.text]))) });
//     }

//     const changeWatcher = new SyntheticObjectChangeWatcher<SyntheticDocument>(async (mutations: Mutation<any>[]) => {

//       log(logInfoAction("Sending diffs: << " +  mutations.map(event => event.type).join(", ")));

//       browser.sandbox.pause();
//       await output.unshift({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.DOCUMENT_DIFF, mutations)) });

//       browser.sandbox.resume();
//     }, (clone: SyntheticDocument) => {
//       editor = new SyntheticObjectTreeEditor(clone);
//       log(logInfoAction("Sending <<new document"));
//       output.unshift({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.NEW_DOCUMENT, clone)) });
//     });

//     if (browser.document) {
//       changeWatcher.target = browser.document;
//     }

//     pump(input, (payload: any) => {
//       const message = deserialize(payload, kernel) as RemoteBrowserDocumentMessage;
//       if (message.type === RemoteBrowserDocumentMessage.DOCUMENT_DIFF) {
//         editor.applyMutations(message.data as Mutation<any>[]);
//       } else if (message.type === RemoteBrowserDocumentMessage.DOM_EVENT) {
//         const [nodePath, event] = message.data;
//         const found = getNodeByPath(browser.document, nodePath);
//         if (found) {
//           found.dispatchEvent(event);
//         }
//       }
//     }).then(() => {
//       log(logWarningAction("Closed remote browser connection"));
//     });


//     const onStatusChange = (status: Status) => {
//       if (status) {
//         if (status.type === Status.COMPLETED) {
//           changeWatcher.target = browser.document;
//         } else if (status.type === Status.ERROR) {
//           log(logErrorAction("Sending error status: " + status.data));
//         }
//       }

//       output.unshift({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.STATUS_CHANGE, status)) });
//     };

//     const browserObserver = new CallbackBus((event: CoreEvent) => {
//       if (event.type === LogEvent.LOG) {
//         const logEvent = event as LogEvent;
//         output.unshift({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.VM_LOG, [[logEvent.level, logEvent.text]])) });
//       }
//     });

//     browser.observe(browserObserver);
//     const watcher = watchProperty(browser, "status", onStatusChange);
//     onStatusChange(browser.status);

//     browser.open(request.options);
//   }))));
// };
