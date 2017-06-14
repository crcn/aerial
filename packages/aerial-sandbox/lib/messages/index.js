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
// import { IReadFileResultItem } from "@tandem/sandbox/file-system";
var aerial_common_1 = require("aerial-common");
var mesh_1 = require("mesh");
var UpdateFileCacheRequest = UpdateFileCacheRequest_1 = (function () {
    function UpdateFileCacheRequest(uri, content, updatedAt) {
        if (updatedAt === void 0) { updatedAt = Date.now(); }
        this.uri = uri;
        this.content = content;
        this.updatedAt = updatedAt;
        this.type = UpdateFileCacheRequest_1.UPDATE_FILE_CACHE;
    }
    return UpdateFileCacheRequest;
}());
UpdateFileCacheRequest.UPDATE_FILE_CACHE = "updateFileCache";
UpdateFileCacheRequest = UpdateFileCacheRequest_1 = __decorate([
    aerial_common_1.serializable("UpdateFileCacheRequest")
], UpdateFileCacheRequest);
exports.UpdateFileCacheRequest = UpdateFileCacheRequest;
var ApplyFileEditRequest = ApplyFileEditRequest_1 = (function (_super) {
    __extends(ApplyFileEditRequest, _super);
    function ApplyFileEditRequest(mutations, saveFile) {
        if (saveFile === void 0) { saveFile = false; }
        var _this = _super.call(this, ApplyFileEditRequest_1.APPLY_EDITS) || this;
        _this.mutations = mutations;
        _this.saveFile = saveFile;
        return _this;
    }
    return ApplyFileEditRequest;
}(mesh_1.Message));
ApplyFileEditRequest.APPLY_EDITS = "applyMutations";
ApplyFileEditRequest = ApplyFileEditRequest_1 = __decorate([
    aerial_common_1.serializable("ApplyFileEditRequest", {
        serialize: function (_a) {
            var mutations = _a.mutations;
            return {
                mutations: mutations.map(aerial_common_1.serialize)
            };
        },
        deserialize: function (_a, kernel) {
            var mutations = _a.mutations;
            return new ApplyFileEditRequest_1(mutations.map(function (message) { return aerial_common_1.deserialize(message, kernel); }));
        }
    })
], ApplyFileEditRequest);
exports.ApplyFileEditRequest = ApplyFileEditRequest;
var ModuleImporterAction = (function (_super) {
    __extends(ModuleImporterAction, _super);
    function ModuleImporterAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ModuleImporterAction;
}(mesh_1.Message));
ModuleImporterAction.MODULE_CONTENT_CHANGED = "moduleContentChanged";
exports.ModuleImporterAction = ModuleImporterAction;
var SandboxModuleAction = (function (_super) {
    __extends(SandboxModuleAction, _super);
    function SandboxModuleAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SandboxModuleAction;
}(mesh_1.Message));
SandboxModuleAction.EVALUATING = "evaluating";
SandboxModuleAction.EDITED = "edited";
exports.SandboxModuleAction = SandboxModuleAction;
var FileCacheAction = (function (_super) {
    __extends(FileCacheAction, _super);
    function FileCacheAction(type, item) {
        var _this = _super.call(this, type) || this;
        _this.item = item;
        return _this;
    }
    return FileCacheAction;
}(mesh_1.Message));
FileCacheAction.ADDED_ENTITY = "addedEntity";
exports.FileCacheAction = FileCacheAction;
var ReadFileRequest = ReadFileRequest_1 = (function (_super) {
    __extends(ReadFileRequest, _super);
    function ReadFileRequest(uri) {
        var _this = _super.call(this, ReadFileRequest_1.READ_FILE) || this;
        _this.uri = uri;
        return _this;
    }
    ReadFileRequest.dispatch = function (uri, bus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mesh_1.readOneChunk(bus.dispatch(new ReadFileRequest_1(uri)))];
                    case 1: return [2 /*return*/, (_a.sent()).value];
                }
            });
        });
    };
    return ReadFileRequest;
}(mesh_1.Message));
ReadFileRequest.READ_FILE = "readFile";
ReadFileRequest = ReadFileRequest_1 = __decorate([
    aerial_common_1.serializable("ReadFileRequest")
], ReadFileRequest);
exports.ReadFileRequest = ReadFileRequest;
var WriteFileRequest = WriteFileRequest_1 = (function (_super) {
    __extends(WriteFileRequest, _super);
    function WriteFileRequest(uri, content, options) {
        var _this = _super.call(this, WriteFileRequest_1.WRITE_FILE) || this;
        _this.uri = uri;
        _this.content = content;
        _this.options = options;
        return _this;
    }
    WriteFileRequest.dispatch = function (uri, content, options, bus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mesh_1.readOneChunk(bus.dispatch(new WriteFileRequest_1(uri, content, options)))];
                    case 1: return [2 /*return*/, (_a.sent()).value];
                }
            });
        });
    };
    return WriteFileRequest;
}(mesh_1.Message));
WriteFileRequest.WRITE_FILE = "writeFile";
WriteFileRequest = WriteFileRequest_1 = __decorate([
    aerial_common_1.serializable("WriteFileRequest")
], WriteFileRequest);
exports.WriteFileRequest = WriteFileRequest;
// @serializable("ReadDirectoryRequest")
// export class ReadDirectoryRequest extends Message {
//   static readonly READ_DIRECTORY = "readDirectory";
//   constructor(readonly directoryPath: string) {
//     super(ReadDirectoryRequest.READ_DIRECTORY);
//   }
//   static dispatch(directoryPath: string, bus: IStreamableBus<any>): ReadableStream<IReadFileResultItem[]> {
//     return bus.dispatch(new ReadDirectoryRequest(directoryPath)).readable;
//   }
// }
var WatchFileRequest = WatchFileRequest_1 = (function (_super) {
    __extends(WatchFileRequest, _super);
    function WatchFileRequest(uri) {
        var _this = _super.call(this, WatchFileRequest_1.WATCH_FILE) || this;
        _this.uri = uri;
        return _this;
    }
    WatchFileRequest.dispatch = function (uri, bus, onFileChange) {
        var readable = bus.dispatch(new WatchFileRequest_1(uri)).readable;
        readable.pipeTo(new mesh_1.WritableStream({
            write: onFileChange
        }));
        return {
            dispose: function () { return readable.cancel(undefined); }
        };
    };
    return WatchFileRequest;
}(mesh_1.Message));
WatchFileRequest.WATCH_FILE = "watchFile";
WatchFileRequest = WatchFileRequest_1 = __decorate([
    aerial_common_1.serializable("WatchFileRequest")
], WatchFileRequest);
exports.WatchFileRequest = WatchFileRequest;
var UpdateFileCacheRequest_1, ApplyFileEditRequest_1, ReadFileRequest_1, WriteFileRequest_1, WatchFileRequest_1;
//# sourceMappingURL=index.js.map