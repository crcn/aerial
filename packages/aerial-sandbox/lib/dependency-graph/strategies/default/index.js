"use strict";
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
var md5 = require("md5");
var path = require("path");
var Url = require("url");
var providers_1 = require("../../providers");
var aerial_common_1 = require("aerial-common");
var BaseDependencyLoader = (function () {
    function BaseDependencyLoader(strategy) {
        this.strategy = strategy;
    }
    return BaseDependencyLoader;
}());
exports.BaseDependencyLoader = BaseDependencyLoader;
var DefaultDependencyLoader = (function () {
    function DefaultDependencyLoader(stragegy, options) {
        this.stragegy = stragegy;
        this.options = options;
    }
    DefaultDependencyLoader.prototype.load = function (dependency, content) {
        return __awaiter(this, void 0, void 0, function () {
            var importedDependencyUris, current, loaderProvider, used;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importedDependencyUris = [];
                        current = Object.assign({}, content);
                        used = {};
                        _a.label = 1;
                    case 1:
                        if (!(current.type && (loaderProvider = providers_1.DependencyLoaderFactoryProvider.find(aerial_common_1.MimeTypeAliasProvider.lookup(current.type, this._kernel), this._kernel)) && !used[loaderProvider.id])) return [3 /*break*/, 3];
                        used[loaderProvider.id] = true;
                        return [4 /*yield*/, loaderProvider.create(this.stragegy).load(dependency, current)];
                    case 2:
                        current = _a.sent();
                        if (current.importedDependencyUris) {
                            importedDependencyUris.push.apply(importedDependencyUris, current.importedDependencyUris);
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, {
                            map: current.map,
                            type: current.type,
                            content: current.content,
                            importedDependencyUris: importedDependencyUris
                        }];
                }
            });
        });
    };
    return DefaultDependencyLoader;
}());
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], DefaultDependencyLoader.prototype, "_kernel", void 0);
exports.DefaultDependencyLoader = DefaultDependencyLoader;
var DefaultDependencyGraphStrategy = (function () {
    function DefaultDependencyGraphStrategy(options) {
        this.options = options;
    }
    DefaultDependencyGraphStrategy.prototype.getLoader = function (loaderOptions) {
        return this._kernel.inject(new DefaultDependencyLoader(this, loaderOptions));
    };
    DefaultDependencyGraphStrategy.prototype.createGlobalContext = function () {
        return {};
    };
    DefaultDependencyGraphStrategy.prototype.createModuleContext = function (module) {
        return {
            module: module,
            exports: module.exports,
            __filename: module.source.uri,
            __dirname: path.dirname(module.source.uri)
        };
    };
    /**
     * TODO - move logic here to HTTP resolver since there's some logic such as resolving indexes, and redirects
     * that also need to be considered here.
     */
    DefaultDependencyGraphStrategy.prototype.resolve = function (relativeUri, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var resolvedUri, uriParts, relativeUriPathname, originParts, originParts;
            return __generator(this, function (_a) {
                uriParts = Url.parse(relativeUri);
                relativeUriPathname = uriParts.pathname && path.normalize(uriParts.pathname);
                // strip to ensure that
                if (origin)
                    origin = origin.replace("file://", "");
                // protocol?
                if (aerial_common_1.hasURIProtocol(relativeUri)) {
                    resolvedUri = relativeUri;
                }
                else {
                    // root
                    if (relativeUri.charAt(0) === "/" || !origin) {
                        if (origin && aerial_common_1.hasURIProtocol(origin)) {
                            originParts = Url.parse(origin);
                            // omit slash if relative URI has it
                            resolvedUri = originParts.protocol + "//" + originParts.host + (relativeUriPathname.charAt(0) === "/" ? relativeUriPathname : "/" + relativeUriPathname);
                        }
                        else {
                            resolvedUri = (this.options.rootDirectoryUri || "file:///") + relativeUriPathname;
                        }
                    }
                    else {
                        originParts = aerial_common_1.hasURIProtocol(origin) ? Url.parse(origin) : {
                            protocol: "file:",
                            host: "",
                            pathname: origin
                        };
                        resolvedUri = originParts.protocol + "//" + path.join(originParts.host || "", path.dirname(originParts.pathname), relativeUriPathname);
                    }
                }
                return [2 /*return*/, {
                        uri: resolvedUri,
                        hash: md5(resolvedUri)
                    }];
            });
        });
    };
    return DefaultDependencyGraphStrategy;
}());
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], DefaultDependencyGraphStrategy.prototype, "_kernel", void 0);
exports.DefaultDependencyGraphStrategy = DefaultDependencyGraphStrategy;
//# sourceMappingURL=index.js.map