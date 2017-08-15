"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var messages_1 = require("./messages");
var browser_1 = require("./browser");
var aerial_common_1 = require("aerial-common");
var dom_1 = require("./dom");
var aerial_sandbox_1 = require("aerial-sandbox");
// TODO - add user event stuff here
var RemoteBrowserDocumentMessage = (function (_super) {
    __extends(RemoteBrowserDocumentMessage, _super);
    function RemoteBrowserDocumentMessage(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
    }
    RemoteBrowserDocumentMessage_1 = RemoteBrowserDocumentMessage;
    RemoteBrowserDocumentMessage.NEW_DOCUMENT = "newDocument";
    RemoteBrowserDocumentMessage.DOCUMENT_DIFF = "documentDiff";
    RemoteBrowserDocumentMessage.VM_LOG = "vmLog";
    RemoteBrowserDocumentMessage.DOM_EVENT = "domEvent";
    RemoteBrowserDocumentMessage.STATUS_CHANGE = "statusChange";
    RemoteBrowserDocumentMessage = RemoteBrowserDocumentMessage_1 = __decorate([
        aerial_common_1.serializable("RemoteBrowserDocumentMessage", {
            serialize: function (_a) {
                var type = _a.type, data = _a.data;
                return {
                    type: type,
                    data: aerial_common_1.serialize(data)
                };
            },
            deserialize: function (_a, kernel) {
                var type = _a.type, data = _a.data;
                return new RemoteBrowserDocumentMessage_1(type, aerial_common_1.deserialize(data, kernel));
            }
        })
    ], RemoteBrowserDocumentMessage);
    return RemoteBrowserDocumentMessage;
    var RemoteBrowserDocumentMessage_1;
}(aerial_common_1.CoreEvent));
exports.RemoteBrowserDocumentMessage = RemoteBrowserDocumentMessage;
var RemoteSyntheticBrowser = (function (_super) {
    __extends(RemoteSyntheticBrowser, _super);
    function RemoteSyntheticBrowser(kernel, renderer, parent) {
        var _this = _super.call(this, kernel, renderer, parent) || this;
        _this.status = new aerial_common_1.Status(aerial_common_1.Status.IDLE);
        _this._mutations = [];
        _this._ignoreMutations = false;
        /**
         * Send ALL changes to the back-end to ensure that everything is in sync.
         */
        _this.sendDiffs = lodash_1.debounce(function () {
            var mutations = _this._mutations;
            _this._mutations = [];
            _this._writeConnection(aerial_common_1.serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.DOCUMENT_DIFF, mutations)));
        }, 100);
        _this._bus = aerial_common_1.PrivateBusProvider.getInstance(kernel);
        _this._dispatch = aerial_common_1.MainDispatcherProvider.getInstance(kernel);
        return _this;
    }
    RemoteSyntheticBrowser.prototype.open2 = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var value, done;
            return __generator(this, function (_a) {
                this.status = new aerial_common_1.Status(aerial_common_1.Status.LOADING);
                this.clearLogs();
                if (this._remoteStreamReader)
                    this._remoteStreamReader.cancel("Re-opened");
                this._connection = this._dispatch(messages_1.openRemoteBrowserRequest(options));
                return [2 /*return*/];
            });
        });
    };
    RemoteSyntheticBrowser.prototype.onRemoteBrowserEvent = function (e) {
        if (!e)
            return;
        var payload = e.payload;
        var event = aerial_common_1.deserialize(payload, this.kernel);
        this.logger.debug("Received event: " + event.type);
        if (event.type === RemoteBrowserDocumentMessage.STATUS_CHANGE) {
            this.status = event.data;
            if (this.status.type === aerial_common_1.Status.LOADING) {
                this.clearLogs();
            }
        }
        if (event.type === RemoteBrowserDocumentMessage.NEW_DOCUMENT) {
            var data = event.data;
            this.logger.debug("Received new document");
            var previousDocument = this.window && this.window.document;
            var newDocument = data;
            this._documentEditor = new aerial_sandbox_1.SyntheticObjectTreeEditor(newDocument);
            var window_1 = new dom_1.SyntheticWindow(this.location, this, newDocument);
            this.setWindow(window_1, false);
            this.status = new aerial_common_1.Status(aerial_common_1.Status.COMPLETED);
        }
        else if (event.type === RemoteBrowserDocumentMessage.DOCUMENT_DIFF) {
            var data = event.data;
            var mutations = data;
            this.logger.debug("Received document diffs: >>", mutations.map(function (event) { return event.type; }).join(", "));
            try {
                // dirty, but ensures that changes from the back-end are not re-sent
                // to the back-end.
                this._ignoreMutations = true;
                this._documentEditor.applyMutations(mutations);
                this._ignoreMutations = false;
                // catch for now to ensure that applying edits doesn't break the stream
            }
            catch (e) {
                console.error(e.stack);
            }
            this.status = new aerial_common_1.Status(aerial_common_1.Status.COMPLETED);
        }
        else if (event.type === RemoteBrowserDocumentMessage.VM_LOG) {
            for (var _i = 0, _a = event.data; _i < _a.length; _i++) {
                var _b = _a[_i], level = _b[0], text = _b[1];
                this.addLog(new aerial_common_1.LogEvent(level, text));
            }
        }
        this.notify(event);
        // explicitly request an update since some synthetic objects may not emit
        // a render event in some cases.
        this.renderer.requestRender();
    };
    RemoteSyntheticBrowser.prototype.onDocumentEvent = function (event) {
        _super.prototype.onDocumentEvent.call(this, event);
        if (event instanceof aerial_common_1.MutationEvent) {
            if (!this._ignoreMutations) {
                this._mutations.push(event.mutation);
                this.sendDiffs();
            }
            return;
        }
        // TODO - check if this is a user event
        if (event.target && event.target.clone) {
            this.logger.debug("Passing synthetic event to server: " + event.type);
            this._writeConnection(aerial_common_1.serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.DOM_EVENT, [dom_1.getNodePath(event.target), event])));
        }
    };
    RemoteSyntheticBrowser.prototype._writeConnection = function (value) {
        var _this = this;
        this._connection.next(value).then(function (_a) {
            var value = _a.value;
            _this.onRemoteBrowserEvent(value);
        });
    };
    __decorate([
        aerial_common_1.bindable(true)
    ], RemoteSyntheticBrowser.prototype, "status", void 0);
    RemoteSyntheticBrowser = __decorate([
        aerial_common_1.loggable()
    ], RemoteSyntheticBrowser);
    return RemoteSyntheticBrowser;
}(browser_1.BaseSyntheticBrowser));
exports.RemoteSyntheticBrowser = RemoteSyntheticBrowser;
var prefixedLogger = function (a, b) { return function (c) { }; };
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
//# sourceMappingURL=remote-browser.js.map