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
var uri_1 = require("../uri");
var aerial_common_1 = require("aerial-common");
var _i = 0;
// TODO - filePath should be sourceUrl to enable different protocols such as urls
var FileCacheItem = (function (_super) {
    __extends(FileCacheItem, _super);
    function FileCacheItem(source, collectionName) {
        var _this = _super.call(this, source, collectionName) || this;
        _this.idProperty = "sourceUri";
        return _this;
    }
    Object.defineProperty(FileCacheItem.prototype, "synchronized", {
        get: function () {
            return this.sourceUri === this.contentUri;
        },
        enumerable: true,
        configurable: true
    });
    FileCacheItem.prototype.serialize = function () {
        return {
            type: this.type,
            updatedAt: this.updatedAt,
            sourceUri: this.sourceUri,
            contentUpdatedAt: this.contentUpdatedAt,
            contentUri: this.contentUri,
            synchronized: this.synchronized,
            metadata: this.metadata.data
        };
    };
    FileCacheItem.prototype.shouldUpdate = function () {
        return this.source.contentUri !== this.contentUri || this.contentUpdatedAt !== this.source.contentUpdatedAt;
    };
    FileCacheItem.prototype.willSave = function () {
        this.updatedAt = Date.now();
    };
    FileCacheItem.prototype.setDataUrlContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.setContentUri;
                        _b = aerial_common_1.createDataUrl;
                        _c = [content];
                        return [4 /*yield*/, this.read()];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.apply(void 0, _c.concat([(_d.sent()).type]))])];
                }
            });
        });
    };
    FileCacheItem.prototype.setContentUri = function (uri) {
        this.contentUri = uri;
        this.contentUpdatedAt = Date.now();
        return this;
    };
    FileCacheItem.prototype.read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var protocol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol = uri_1.URIProtocolProvider.lookup(this.contentUri, this._kernel);
                        return [4 /*yield*/, protocol.read(this.contentUri)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FileCacheItem.prototype.shouldDeserialize = function (b) {
        return this.updatedAt < b.updatedAt;
    };
    FileCacheItem.prototype.setPropertiesFromSource = function (_a) {
        var sourceUri = _a.sourceUri, type = _a.type, updatedAt = _a.updatedAt, contentUri = _a.contentUri, metadata = _a.metadata, contentUpdatedAt = _a.contentUpdatedAt;
        this.sourceUri = sourceUri;
        this.contentUri = contentUri;
        this.type = type;
        this.updatedAt = updatedAt;
        this.metadata = new aerial_common_1.Metadata(metadata);
        this.contentUpdatedAt = contentUpdatedAt;
    };
    return FileCacheItem;
}(aerial_common_1.BaseActiveRecord));
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], FileCacheItem.prototype, "_kernel", void 0);
__decorate([
    aerial_common_1.bindable(true)
], FileCacheItem.prototype, "type", void 0);
__decorate([
    aerial_common_1.bindable(true)
], FileCacheItem.prototype, "updatedAt", void 0);
__decorate([
    aerial_common_1.bindable(true)
], FileCacheItem.prototype, "contentUpdatedAt", void 0);
__decorate([
    aerial_common_1.bindable(true)
], FileCacheItem.prototype, "contentUri", void 0);
__decorate([
    aerial_common_1.bindable(true)
], FileCacheItem.prototype, "sourceUri", void 0);
__decorate([
    aerial_common_1.bindable(true)
], FileCacheItem.prototype, "metadata", void 0);
exports.FileCacheItem = FileCacheItem;
//# sourceMappingURL=item.js.map