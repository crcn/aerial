import { Sandbox } from "aerial-sandbox";
import { bindable } from "aerial-common";
import { btoa, atob } from "abab"
import { HTML_XMLNS } from "./constants";
import memoize = require("memoizee");
import { URL, FakeURL } from "./url";
import nwmatcher = require("nwmatcher");
import { Blob, FakeBlob } from "./blob";
import { SyntheticHistory } from "./history";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { SyntheticHTMLElement } from "./html";
import { SyntheticLocalStorage } from "./local-storage";
import { SyntheticWindowTimers } from "./timers";
import { bindDOMNodeEventMethods } from "./utils";
import { SyntheticDOMElement, DOMNodeType } from "./markup";
import { SyntheticXMLHttpRequest, XHRServer } from "./xhr";
import { SyntheticCSSStyle, SyntheticCSSElementStyleRule } from "./css";
import { Logger, LogEvent, Observable, PrivateBusProvider, PropertyWatcher, MutationEvent } from "aerial-common";
import { noopBusInstance, IStreamableBus, CallbackBus } from "mesh";
import { 
  DOMEventTypes,
  IDOMEventEmitter,
  SyntheticDOMEvent,
  DOMEventDispatcherMap, 
  DOMEventListenerFunction, 
} from "./events";

export class SyntheticNavigator {
  readonly appCodeName = "Tandem";
  readonly platform =  "synthetic";
  readonly userAgent = "none";
}

export class SyntheticConsole {
  constructor(private _logger: Logger) {

    // Ensure that when the logs get dispatched that they are displayed.
    this._logger.filterable = false;
  }

  log(text, ...rest: any[]) {
    this._logger.debug(text, ...rest);
  }
  info(text, ...rest: any[]) {
    this._logger.info(text, ...rest);
  }
  warn(text, ...rest: any[]) {
    this._logger.warn(text, ...rest);
  }
  error(text, ...rest: any[]) {
    this._logger.error(text, ...rest);
  }
}

// TODO - register element types from kernel
export class SyntheticDOMImplementation {
  constructor(private _window: SyntheticWindow) {

  }
  hasFeature(value: string) {
    return false;
  }

  createHTMLDocument(title?: string) {
    const document = new SyntheticDocument(HTML_XMLNS, this);
    document.registerElementNS(HTML_XMLNS, "default", SyntheticHTMLElement);
    const documentElement = document.createElement("html");

    // head
    documentElement.appendChild(document.createElement("head"));

    // body
    documentElement.appendChild(document.createElement("body"));

    document.appendChild(documentElement);
    return document;

  }
}

export class SyntheticWindow extends Observable {

  readonly navigator = new SyntheticNavigator();

  // TODO - emit events from logs here
  readonly console: SyntheticConsole;

  @bindable()
  public location: SyntheticLocation;

  @bindable()
  public onload: DOMEventListenerFunction;

  @bindable()
  public onpopstate: DOMEventListenerFunction;

  readonly document: SyntheticDocument;
  readonly window: SyntheticWindow;

  // TODO - need to wrap around these
  readonly history: SyntheticHistory;
  readonly setTimeout: Function;
  readonly setInterval: Function;
  readonly setImmediate: Function;
  readonly clearTimeout: Function;
  readonly clearInterval: Function;
  readonly clearImmediate: Function;
  readonly localStorage: SyntheticLocalStorage;
  readonly self: SyntheticWindow;

  private _implementation: SyntheticDOMImplementation;

  readonly XMLHttpRequest:  { new(): SyntheticXMLHttpRequest };

  readonly HTMLElement;
  readonly Element;
  readonly WebSocket: { new(): any };

  @bindable(true)
  public innerWidth: number = 0;

  @bindable(true)
  public innerHeight: number = 0;

  private _windowTimers: SyntheticWindowTimers;
  private _eventListeners: DOMEventDispatcherMap;
  private _server: XHRServer;

  readonly Blob = Blob;
  readonly URL  = URL;
  readonly btoa = btoa;

  readonly selector: any; 

  readonly $synthetic = true;

  readonly requestAnimationFrame = (tick) => setImmediate(tick);

  constructor(location?: SyntheticLocation, readonly browser?: ISyntheticBrowser, document?: SyntheticDocument) {
    super();

    const kernel = browser && browser.kernel;


    const bus = kernel && PrivateBusProvider.getInstance(kernel) || noopBusInstance;
    
    // in case proto gets set - don't want the original to get fudged
    // but doesn't work -- element instanceof HTMLElement 
    this.HTMLElement = SyntheticHTMLElement;
    this.Element     = SyntheticDOMElement;

    const xhrServer = this._server = new XHRServer(this);

    this.WebSocket = class WebSocket { }

    if (kernel) kernel.inject(xhrServer);

    this.XMLHttpRequest = class extends SyntheticXMLHttpRequest { 
      constructor() {
        super(xhrServer);
      }
    };

    this.self = this;

    this._implementation = new SyntheticDOMImplementation(this);
    this._eventListeners = new DOMEventDispatcherMap(this);

    this.localStorage = new SyntheticLocalStorage();
    this.document = document || this._implementation.createHTMLDocument();
    this.document.$window = this;
    this.location = location || new SyntheticLocation("");
    this.history = new SyntheticHistory(this.location.toString());

    this.history.$locationWatcher.connect((newLocation) => {

      // copy props over -- changing the location means a redirect.
      this.location.$copyPropertiesFromUrl(newLocation.toString());
    });

    
    new PropertyWatcher<SyntheticLocation, string>(this.location, "href").connect((newValue) =>  {
      this.notify(new SyntheticDOMEvent(DOMEventTypes.POP_STATE));
    });
    
    this.window   = this;
    this.console  = new SyntheticConsole(
      new Logger(new CallbackBus(this.onVMLog.bind(this)))
    );

    const windowTimers  = this._windowTimers = new SyntheticWindowTimers();
    this.setTimeout     = windowTimers.setTimeout.bind(windowTimers);
    this.setInterval    = windowTimers.setInterval.bind(windowTimers);
    this.setImmediate   = windowTimers.setImmediate.bind(windowTimers);
    this.clearTimeout   = windowTimers.clearTimeout.bind(windowTimers);
    this.clearInterval  = windowTimers.clearInterval.bind(windowTimers);
    this.clearImmediate = windowTimers.clearImmediate.bind(windowTimers);

    bindDOMNodeEventMethods(this, DOMEventTypes.POP_STATE);

    this.selector = nwmatcher(this);

    // VERBOSITY = false to prevent breaking on invalid selector rules
    this.selector.configure({ CACHING: true, VERBOSITY: false });
    
    // TODO - register selectors that are specific to the web browser
  }

  get sandbox() {
    return this.browser && this.browser.sandbox;
  }

  getComputedStyle(element: SyntheticHTMLElement) {
    const style = new SyntheticCSSStyle();
    if (element.nodeType !== DOMNodeType.ELEMENT) return style;
    const copy = (from: SyntheticCSSStyle) => {
      if (from)
      for (let i = 0, n = from.length; i < n; i++) {
        if (style[from[i]]) continue;
        style[from[i]] = from[from[i]];
      }
    }
    copy(element.style);
    for (let i = this.document.styleSheets.length; i--;) {
      const ss = this.document.styleSheets[i];
      for (let j = ss.cssRules.length; j--;) {
        const rule = ss.cssRules[j];
        if (rule instanceof SyntheticCSSElementStyleRule) {

          // may bust if parent is a shadow root
          try {
            if (rule.matchesElement(element)) {
              copy(rule.style);
            }
          } catch(e) {

          }
        }
      }
    }
    style.$updatePropertyIndices();
    return style;
  }
  

  addEventListener(type: string, listener: DOMEventListenerFunction) {
    this._eventListeners.add(type, listener);
  }

  addEvent(type: string, listener: DOMEventListenerFunction) {
    this._eventListeners.add(type, listener);
  }

  removeEventListener(type: string, listener: DOMEventListenerFunction) {
    this._eventListeners.remove(type, listener);
  }

  get depth(): number {
    let i = 0;
    let c = this;
    while (c) {
      i++;
      c = <any>c.parent;
    }
    return i;
  }

  dispose() {
    this._windowTimers.dispose();
  }

  get parent(): SyntheticWindow {
    return this.browser.parent && this.browser.parent.window && this.browser.parent.window;
  }

  /**
   * overridable method that forces the window to wait for any async 
   * processing by the loaded application. Useful to ensure that the app is properly
   * hotswapped.
   */

  public syntheticDOMReadyCallback = () => {

  }

  private onVMLog = (log: LogEvent) => {
    this.notify(log);
  }

  // ugly method invoked by browser to fire load events
  public whenLoaded = memoize(async () => {

    await this.syntheticDOMReadyCallback();

    // always comes before load event since DOM_CONTENT_LOADED assumes that assets
    // such as stylesheets have not yet been loaded in
    this.notify(new SyntheticDOMEvent(DOMEventTypes.DOM_CONTENT_LOADED));

    // sandbox has already mapped & loaded external dependencies, so go ahead and fire
    // the DOM events
    this.notify(new SyntheticDOMEvent(DOMEventTypes.LOAD));
  }, { length: 0, async: true })
}