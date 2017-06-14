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
var path = require("path");
var sm = require("source-map");
var parse5 = require("parse5");
var aerial_sandbox_1 = require("aerial-sandbox");
var aerial_common_1 = require("aerial-common");
var __1 = require("..");
var hasProtocol = function (value) { return !!/\w+:\/\//.test(value); };
// TODO - need to add source maps here. Okay for now since line & column numbers stay
// the same even when src & href attributes are manipulated. However, the editor *will* break
// if there's a manipulated href / src attribute that shares the same line with another one.
var HTMLDependencyLoader = (function (_super) {
    __extends(HTMLDependencyLoader, _super);
    function HTMLDependencyLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLDependencyLoader.prototype.load = function (dependency, _a) {
        var type = _a.type, content = _a.content;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var self, uri, hash, loadableTagNames, expression, imports, dirname, getAttr, mapAttribute, map, sourceNode, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        uri = dependency.uri, hash = dependency.hash;
                        loadableTagNames = this._kernel.queryAll(__1.LoadableElementProvider.getId("**")).map(function (provider) { return provider.tagName; });
                        expression = parse5.parse(String(content), { locationInfo: true });
                        imports = [];
                        dirname = path.dirname(uri);
                        getAttr = function (element, name) {
                            return element.attrs.find(function (attr) { return attr.name === name; });
                        };
                        mapAttribute = function (parent, _a) {
                            var name = _a.name, value = _a.value;
                            return __awaiter(_this, void 0, void 0, function () {
                                var shouldGraph, shouldImport, rel;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            shouldGraph = false;
                                            shouldImport = false;
                                            // must be white listed here to present certain elements such as remote browser & anchor tags from loading resources. 
                                            if ((/^(link|script|img|source)$/.test(parent.nodeName) || loadableTagNames.indexOf(parent.nodeName) !== -1) && value && value.substr(0, 5) !== "data:") {
                                                // do not add these to the dependency graph
                                                shouldImport = !/^(img|source)$/.test(parent.nodeName);
                                                if (parent.nodeName === "link") {
                                                    rel = getAttr(parent, "rel");
                                                    shouldGraph = rel && /(stylesheet|import)/.test(rel.value);
                                                }
                                                else {
                                                    shouldGraph = true;
                                                }
                                            }
                                            else {
                                                shouldGraph = false;
                                            }
                                            if (!shouldGraph) return [3 /*break*/, 2];
                                            if (value.substr(0, 2) === "//") {
                                                value = "http:" + value;
                                            }
                                            if (!/^(src|href)$/.test(name)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, self.strategy.resolve(value, uri)];
                                        case 1:
                                            value = (_a.sent()).uri;
                                            if (shouldImport) {
                                                imports.push(value);
                                            }
                                            _a.label = 2;
                                        case 2: return [2 /*return*/, [" ", name, "=\"", value, "\""].join("")];
                                    }
                                });
                            });
                        };
                        map = function (expression) { return __awaiter(_this, void 0, void 0, function () {
                            var location, _a, _b, _c, elementExpression, nodeName, attrs, childNodes, buffer, _d, _e, textMimeType, textLoaderProvider, textLoader, firstChild, firstChildLocation, lines, textResult, textContent, sourceMappingURL, _f, _g, _h;
                            return __generator(this, function (_j) {
                                switch (_j.label) {
                                    case 0:
                                        location = __1.getHTMLASTNodeLocation(expression) || { line: 1, column: 1 };
                                        if (!(expression.nodeName === "#documentType")) return [3 /*break*/, 1];
                                        return [2 /*return*/, new sm.SourceNode(location.line, location.column, uri, "<!DOCTYPE " + expression.name + ">")];
                                    case 1:
                                        if (!(expression.nodeName === "#comment")) return [3 /*break*/, 2];
                                        return [2 /*return*/, new sm.SourceNode(location.line, location.column, uri, ["<!--" + expression.data + "-->"])];
                                    case 2:
                                        if (!(expression.nodeName === "#text")) return [3 /*break*/, 3];
                                        return [2 /*return*/, new sm.SourceNode(location.line, location.column, uri, [expression.value])];
                                    case 3:
                                        if (!(expression.nodeName === "#document" || expression.nodeName === "#document-fragment")) return [3 /*break*/, 5];
                                        _b = (_a = sm.SourceNode).bind;
                                        _c = [void 0, location.line, location.column, uri];
                                        return [4 /*yield*/, Promise.all(expression.childNodes.map(map))];
                                    case 4: return [2 /*return*/, new (_b.apply(_a, _c.concat([(_j.sent())])))()];
                                    case 5:
                                        elementExpression = expression;
                                        nodeName = elementExpression.nodeName, attrs = elementExpression.attrs, childNodes = elementExpression.childNodes;
                                        _e = (_d = [
                                            "<" + nodeName
                                        ]).concat;
                                        return [4 /*yield*/, Promise.all(attrs.map(function (attrib) { return mapAttribute(elementExpression, attrib); }))];
                                    case 6:
                                        buffer = _e.apply(_d, [(_j.sent()), [
                                                ">"
                                            ]]);
                                        textMimeType = __1.ElementTextContentMimeTypeProvider.lookup(expression, self._kernel);
                                        textLoaderProvider = textMimeType && aerial_sandbox_1.DependencyLoaderFactoryProvider.find(textMimeType, self._kernel);
                                        if (!(textLoaderProvider && elementExpression.childNodes.length)) return [3 /*break*/, 8];
                                        textLoader = textLoaderProvider.create(self.strategy);
                                        firstChild = elementExpression.childNodes[0];
                                        firstChildLocation = __1.getHTMLASTNodeLocation(firstChild);
                                        lines = Array.from({ length: firstChildLocation.line - 1 }).map(function () { return "\n"; }).join("");
                                        return [4 /*yield*/, textLoader.load(dependency, {
                                                type: textMimeType,
                                                content: lines + firstChild.value
                                            })];
                                    case 7:
                                        textResult = _j.sent();
                                        textContent = textResult.content;
                                        if (textResult.map) {
                                            sourceMappingURL = "data:application/json;base64," + new Buffer(JSON.stringify(textResult.map)).toString("base64");
                                            textContent += "/*# sourceMappingURL=" + sourceMappingURL + " */";
                                        }
                                        buffer.push(new sm.SourceNode(firstChildLocation.line, firstChildLocation.column, uri, textContent));
                                        return [3 /*break*/, 10];
                                    case 8:
                                        _g = (_f = buffer.push).apply;
                                        _h = [buffer];
                                        return [4 /*yield*/, Promise.all(childNodes.map(function (child) { return map(child); }))];
                                    case 9:
                                        _g.apply(_f, _h.concat([(_j.sent())]));
                                        _j.label = 10;
                                    case 10:
                                        if (__1.HTML_VOID_ELEMENTS.indexOf(nodeName.toLowerCase()) === -1) {
                                            buffer.push("</" + nodeName + ">");
                                        }
                                        return [2 /*return*/, new sm.SourceNode(location.line, location.column, uri, buffer)];
                                }
                            });
                        }); };
                        return [4 /*yield*/, map(expression)];
                    case 1:
                        sourceNode = _a.sent();
                        result = sourceNode.toStringWithSourceMap({
                            file: uri
                        });
                        return [2 /*return*/, {
                                content: result.code,
                                map: result.map.toJSON(),
                                type: aerial_common_1.HTML_MIME_TYPE,
                                importedDependencyUris: imports
                            }];
                }
            });
        });
    };
    __decorate([
        aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
    ], HTMLDependencyLoader.prototype, "_kernel", void 0);
    return HTMLDependencyLoader;
}(aerial_sandbox_1.BaseDependencyLoader));
exports.HTMLDependencyLoader = HTMLDependencyLoader;
//# sourceMappingURL=html-loader.js.map