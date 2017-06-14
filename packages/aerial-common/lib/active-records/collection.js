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
var sift_1 = require("sift");
var messages_1 = require("../messages");
var observable_1 = require("../observable");
var ioc_1 = require("../ioc");
var mesh_1 = require("mesh");
var mesh_crud_1 = require("mesh-crud");
// TODO - remove global listener
// TODO - listen to DS mediator for updates on record collection
var ActiveRecordCollection = (function (_super) {
    __extends(ActiveRecordCollection, _super);
    function ActiveRecordCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActiveRecordCollection.create = function (collectionName, kernel, createActiveRecord, query) {
        if (query === void 0) { query = {}; }
        return observable_1.ObservableCollection.create.call(this).setup(collectionName, kernel, createActiveRecord, query);
    };
    ActiveRecordCollection.prototype.setup = function (collectionName, kernel, createActiveRecord, query) {
        var _this = this;
        this.collectionName = collectionName;
        this._bus = ioc_1.PrivateBusProvider.getInstance(kernel);
        this.createActiveRecord = createActiveRecord;
        this._globalMessageObserver = new mesh_1.FilterBus(function (message) {
            return (message.type === mesh_crud_1.DSUpdateRequest.DS_UPDATE || message.type === mesh_crud_1.DSInsertRequest.DS_INSERT || message.type === messages_1.PostDSMessage.DS_DID_UPDATE || message.type === messages_1.PostDSMessage.DS_DID_INSERT) && message.collectionName === _this.collectionName && sift_1.default(_this.query)(message.data);
        }, new mesh_1.CallbackBus(this.onPostDSMessage.bind(this)));
        this.query = query || {};
        return this;
    };
    ActiveRecordCollection.prototype.reload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.splice(0, this.length);
                this.load();
                return [2 /*return*/];
            });
        });
    };
    ActiveRecordCollection.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = 
                        // TODO - need to check for duplicates
                        (_a = this.push).apply;
                        _c = [
                            // TODO - need to check for duplicates
                            this];
                        return [4 /*yield*/, mesh_1.readAllChunks(this._bus.dispatch(new mesh_crud_1.DSFindRequest(this.collectionName, this.query, true)))];
                    case 1:
                        // TODO - need to check for duplicates
                        _b.apply(_a, _c.concat([(_d.sent()).map(function (value) {
                                return _this.createActiveRecord(value);
                            })]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ActiveRecordCollection.prototype.sync = function () {
        var _this = this;
        if (this._sync)
            return this._sync;
        // TODO - this is very smelly. Collections should not be registering themselves
        // to the global message bus. Instead they should be registering themselves to a DS manager
        // which handles all incomming and outgoing DS messages from the message bus.
        this._bus.register(this._globalMessageObserver);
        return this._sync = {
            dispose: function () {
                _this._sync = undefined;
                _this._bus.unregister(_this._globalMessageObserver);
            }
        };
    };
    /**
     * loads an item with the given query from the DS
     */
    ActiveRecordCollection.prototype.loadItem = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var test, loaded, _a, value, done, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        test = sift_1.default(query);
                        loaded = this.find(function (model) { return test(model.source); });
                        if (loaded)
                            return [2 /*return*/, loaded];
                        return [4 /*yield*/, mesh_1.readOneChunk(this._bus.dispatch(new mesh_crud_1.DSFindRequest(this.collectionName, query, false)))];
                    case 1:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        // item exists, so add and return it. Otherwise return undefined indicating
                        // that the item does not exist.
                        if (value) {
                            item = this.createActiveRecord(value);
                            this.push(item);
                            return [2 /*return*/, item];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads an item into this collection if it exists, otherwise creates an item
     */
    ActiveRecordCollection.prototype.loadOrInsertItem = function (query, source) {
        if (source === void 0) { source = query; }
        return __awaiter(this, void 0, void 0, function () {
            var loadedItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadItem(query)];
                    case 1:
                        loadedItem = _a.sent();
                        return [2 /*return*/, loadedItem || this.create(source).insert()];
                }
            });
        });
    };
    /**
     * Synchronously creates a new active record (without persisting) with the given data
     * source.
     *
     * @param {U} source The source data represented by the new active record.
     * @returns
     */
    ActiveRecordCollection.prototype.create = function (source) {
        var record = this.createActiveRecord(source);
        this.push(record);
        return record;
    };
    ActiveRecordCollection.prototype.onPostDSMessage = function (message) {
        this._updateActiveRecord(message.data);
    };
    ActiveRecordCollection.prototype._updateActiveRecord = function (source) {
        var record = this.find(function (record) { return record[record.idProperty] === source[record.idProperty]; });
        if (record) {
            record.deserialize(source);
            return record;
        }
        return this.create(source);
    };
    return ActiveRecordCollection;
}(observable_1.ObservableCollection));
exports.ActiveRecordCollection = ActiveRecordCollection;
//# sourceMappingURL=collection.js.map