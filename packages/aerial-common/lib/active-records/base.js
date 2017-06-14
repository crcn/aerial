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
var decorators_1 = require("../decorators");
var mesh_1 = require("mesh");
var mongoid = require("mongoid-js");
var observable_1 = require("../observable");
var mesh_ds_1 = require("mesh-ds");
var ioc_1 = require("../ioc");
var messages_1 = require("../messages");
// TODO - need to queue requests
// TODO - add schema here
var BaseActiveRecord = (function (_super) {
    __extends(BaseActiveRecord, _super);
    function BaseActiveRecord(_source, collectionName) {
        var _this = _super.call(this) || this;
        _this._source = _source;
        _this.collectionName = collectionName;
        // TODO - move this to reflect metadata
        _this.idProperty = "_id";
        if (_this._source) {
            _this.setPropertiesFromSource(_source);
        }
        return _this;
    }
    Object.defineProperty(BaseActiveRecord.prototype, "isNew", {
        get: function () {
            return this[this.idProperty] == null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActiveRecord.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Refreshes the active record from the DS if the source data
     * is stale.
     */
    BaseActiveRecord.prototype.refresh = function () {
        return this.fetch(new mesh_ds_1.DSFindRequest(this.collectionName, this.sourceQuery));
    };
    BaseActiveRecord.prototype.save = function () {
        return this.isNew ? this.insert() : this.update();
    };
    BaseActiveRecord.prototype.dispose = function () {
        this.notify(new messages_1.DisposeEvent());
    };
    BaseActiveRecord.prototype.insert = function () {
        this.willSave();
        var newData = this.serialize();
        if (newData[this.idProperty] == null) {
            newData[this.idProperty] = String(mongoid());
            // console.error(newData, this);
        }
        return this.fetch(new mesh_ds_1.DSInsertRequest(this.collectionName, newData));
    };
    BaseActiveRecord.prototype.remove = function () {
        return this.fetch(new mesh_ds_1.DSRemoveRequest(this.collectionName, this.sourceQuery));
    };
    Object.defineProperty(BaseActiveRecord.prototype, "sourceQuery", {
        get: function () {
            if (this.isNew) {
                throw new Error("Cannot query active record if it does not have an identifier.");
            }
            ;
            var id = this[this.idProperty];
            return _a = {},
                _a[this.idProperty] = id,
                _a;
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    BaseActiveRecord.prototype.shouldUpdate = function () {
        return true;
    };
    /**
     * Called immediately before update()
     * @protected
     */
    BaseActiveRecord.prototype.willUpdate = function () {
    };
    /**
     * Called immediately before insert() and update()
     */
    BaseActiveRecord.prototype.willSave = function () {
    };
    BaseActiveRecord.prototype.update = function () {
        if (!this.shouldUpdate()) {
            return Promise.resolve(this);
        }
        this.willUpdate();
        this.willSave();
        var newData = this.serialize();
        return this.fetch(new mesh_ds_1.DSUpdateRequest(this.collectionName, newData, this.sourceQuery));
    };
    BaseActiveRecord.prototype.toJSON = function () {
        return this.serialize();
    };
    BaseActiveRecord.prototype.deserialize = function (source) {
        if (this.shouldDeserialize(source)) {
            this._source = source;
            this.setPropertiesFromSource(source);
            this.notify(new messages_1.ActiveRecordEvent(messages_1.ActiveRecordEvent.ACTIVE_RECORD_DESERIALIZED));
        }
    };
    BaseActiveRecord.prototype.shouldDeserialize = function (b) {
        return true;
    };
    BaseActiveRecord.prototype.setPropertiesFromSource = function (source) {
        for (var key in source) {
            this[key + ""] = source[key];
        }
    };
    BaseActiveRecord.prototype.fetch = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, value, done;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mesh_1.readOneChunk(this.dispatcher.dispatch(request))];
                    case 1:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        if (value) {
                            this.deserialize(value);
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return BaseActiveRecord;
}(observable_1.Observable));
__decorate([
    decorators_1.inject(ioc_1.PrivateBusProvider.ID)
], BaseActiveRecord.prototype, "dispatcher", void 0);
exports.BaseActiveRecord = BaseActiveRecord;
//# sourceMappingURL=base.js.map