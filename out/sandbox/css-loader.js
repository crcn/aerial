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
var sandbox_1 = require("@tandem/sandbox");
var path = require("path");
var sm = require("source-map");
var sandbox_2 = require("@tandem/sandbox");
var common_1 = require("@tandem/common");
var __1 = require("..");
var hasProtocol = function (value) { return /^\w+:\/\//.test(value); };
var CSSDependencyLoader = (function (_super) {
    __extends(CSSDependencyLoader, _super);
    function CSSDependencyLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CSSDependencyLoader.prototype.load = function (dependency, _a) {
        var type = _a.type, content = _a.content, map = _a.map;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var uri, sourceMappingUrl, resolveSourceMappingUrl, protocol, result_1, consumer, sourceRoot, fileDirectory, importedUris, compile, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = dependency.uri;
                        sourceMappingUrl = (String(content).match(/sourceMappingURL=([^\s\*]+)/) || [])[1];
                        if (!(!map && sourceMappingUrl)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.strategy.resolve(sourceMappingUrl, uri)];
                    case 1:
                        resolveSourceMappingUrl = (_a.sent()).uri;
                        protocol = sandbox_2.URIProtocolProvider.lookup(resolveSourceMappingUrl, this._kernel);
                        return [4 /*yield*/, protocol.read(resolveSourceMappingUrl)];
                    case 2:
                        result_1 = _a.sent();
                        map = JSON.parse(String(result_1.content));
                        _a.label = 3;
                    case 3:
                        consumer = map && new sm.SourceMapConsumer(map);
                        sourceRoot = map && map.sourceRoot || uri;
                        fileDirectory = path.dirname(uri);
                        importedUris = [];
                        compile = function (node) { return __awaiter(_this, void 0, void 0, function () {
                            var line, column, origUri, orig, _a, buffer, rule, _b, _c, rule, _d, _e, _f, _g, _h, _j, prop, value, important, _i, _k, match, _l, whole, url, repl;
                            return __generator(this, function (_m) {
                                switch (_m.label) {
                                    case 0:
                                        line = node.source.start.line;
                                        column = node.source.start.column - 1;
                                        origUri = uri;
                                        if (!consumer) return [3 /*break*/, 3];
                                        orig = consumer.originalPositionFor({ line: line, column: column });
                                        line = orig.line;
                                        column = orig.column;
                                        _a = orig.source;
                                        if (!_a) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.strategy.resolve(orig.source, sourceRoot)];
                                    case 1:
                                        _a = (_m.sent()).uri;
                                        _m.label = 2;
                                    case 2:
                                        origUri = _a || uri;
                                        _m.label = 3;
                                    case 3:
                                        if (!(node.type === "root")) return [3 /*break*/, 5];
                                        return [4 /*yield*/, Promise.all(node.nodes.map(compile))];
                                    case 4:
                                        buffer = _m.sent();
                                        return [3 /*break*/, 16];
                                    case 5:
                                        if (!(node.type === "rule")) return [3 /*break*/, 7];
                                        rule = node;
                                        _c = (_b = [rule.selector, " {"]).concat;
                                        return [4 /*yield*/, Promise.all(rule.nodes.map(compile))];
                                    case 6:
                                        buffer = _c.apply(_b, [(_m.sent()), ["}\n"]]);
                                        return [3 /*break*/, 16];
                                    case 7:
                                        if (!(node.type === "atrule")) return [3 /*break*/, 11];
                                        rule = node;
                                        buffer = ["@" + rule.name + " " + rule.params];
                                        if (!rule.nodes) return [3 /*break*/, 9];
                                        _e = (_d = buffer.push).apply;
                                        _f = [buffer];
                                        _h = (_g = ["{"]).concat;
                                        return [4 /*yield*/, Promise.all(rule.nodes.map(compile))];
                                    case 8:
                                        _e.apply(_d, _f.concat([_h.apply(_g, [(_m.sent()), ["}\n"]])]));
                                        return [3 /*break*/, 10];
                                    case 9:
                                        buffer.push(";");
                                        _m.label = 10;
                                    case 10: return [3 /*break*/, 16];
                                    case 11:
                                        if (!(node.type === "decl")) return [3 /*break*/, 16];
                                        _j = node, prop = _j.prop, value = _j.value, important = _j.important;
                                        if (!/url\(.*?\)/.test(value)) return [3 /*break*/, 15];
                                        _i = 0, _k = value.match(/url\((.*?)\)/g);
                                        _m.label = 12;
                                    case 12:
                                        if (!(_i < _k.length)) return [3 /*break*/, 15];
                                        match = _k[_i];
                                        _l = match.match(/url\((.*?)\)/), whole = _l[0], url = _l[1];
                                        repl = void 0;
                                        if (url.substr(0, 5) === "data:")
                                            return [3 /*break*/, 14];
                                        // this can still break, but it's a quick implementation that should work 99% of the time.
                                        // Good for now.
                                        repl = url.replace(/["']/g, "");
                                        return [4 /*yield*/, this.strategy.resolve(repl, uri)];
                                    case 13:
                                        repl = (_m.sent()).uri;
                                        importedUris.push(repl);
                                        value = value.replace(url, "\"" + repl + "\"");
                                        _m.label = 14;
                                    case 14:
                                        _i++;
                                        return [3 /*break*/, 12];
                                    case 15:
                                        if (important) {
                                            value += " !important";
                                        }
                                        buffer = [prop, ':', value, ';'];
                                        _m.label = 16;
                                    case 16: return [2 /*return*/, new sm.SourceNode(line, column, origUri, buffer)];
                                }
                            });
                        }); };
                        return [4 /*yield*/, compile(__1.parseCSS(content, map))];
                    case 4:
                        result = (_a.sent()).toStringWithSourceMap({
                            file: uri
                        });
                        return [2 /*return*/, {
                                type: common_1.CSS_MIME_TYPE,
                                map: result.map.toJSON(),
                                content: result.code,
                                importedDependencyUris: importedUris
                            }];
                }
            });
        });
    };
    return CSSDependencyLoader;
}(sandbox_1.BaseDependencyLoader));
__decorate([
    common_1.inject(common_1.KernelProvider.ID)
], CSSDependencyLoader.prototype, "_kernel", void 0);
exports.CSSDependencyLoader = CSSDependencyLoader;
//# sourceMappingURL=css-loader.js.map