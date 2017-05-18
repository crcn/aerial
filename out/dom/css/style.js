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
var sift_1 = require("sift");
var lodash_1 = require("lodash");
var style_rule_1 = require("./style-rule");
var common_1 = require("@tandem/common");
var sandbox_1 = require("@tandem/sandbox");
exports.isValidCSSDeclarationProperty = sift_1.default({ $and: [{ $ne: /^[\$_]/ }, { $ne: "uid" }, { $ne: /^\d+$/ }] });
// https://www.w3.org/TR/CSS21/propidx.html
exports.INHERITED_CSS_STYLE_PROPERTIES = [
    "azimuth",
    "borderCollapse",
    "borderSpacing",
    "captionSide",
    "color",
    "cursor",
    "direction",
    "elevation",
    "emptyCells",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "font",
    "letterSpacing",
    "lineHeight",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "listStyle",
    "orphans",
    "pitchRange",
    "pitch",
    "quotes",
    "richness",
    "speakHeader",
    "speakNumeral",
    "speakPunctuation",
    "speak",
    "speechRate",
    "stress",
    "textAlign",
    "textIndent",
    "textDecoration",
    "textTransform",
    "visibility",
    "voiceFamily",
    "volume",
    "whiteSpace",
    "widows",
    "wordSpacing"
];
function isInheritedCSSStyleProperty(name) {
    return exports.INHERITED_CSS_STYLE_PROPERTIES.indexOf(name) !== -1;
}
exports.isInheritedCSSStyleProperty = isInheritedCSSStyleProperty;
var SyntheticCSSStyle = SyntheticCSSStyle_1 = (function () {
    function SyntheticCSSStyle() {
        this.$source = null;
        this[Symbol.iterator] = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i, n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0, n = this.length || 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < n)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this[i]];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        this.$uid = sandbox_1.generateSyntheticUID();
    }
    SyntheticCSSStyle.prototype.clone = function () {
        return common_1.deserialize(common_1.serialize(this), null);
    };
    Object.defineProperty(SyntheticCSSStyle.prototype, "length", {
        get: function () {
            return this.$length || 0;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSStyle.prototype.item = function (index) {
        return this[index];
    };
    SyntheticCSSStyle.prototype.getProperties = function () {
        var props = [];
        for (var i = 0, n = this.length || 0; i < n; i++) {
            props.push(this[i]);
        }
        return props;
    };
    Object.defineProperty(SyntheticCSSStyle.prototype, "uid", {
        get: function () {
            return this.$uid;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSStyle.prototype.getPropertyIndex = function (name) {
        return this.getProperties().indexOf(name);
    };
    SyntheticCSSStyle.prototype.removeProperty = function (name, notifyOwnerNode) {
        this.setProperty(name, undefined, undefined, undefined, notifyOwnerNode);
    };
    SyntheticCSSStyle.prototype.getPropertyValue = function (name) {
        var value = this[name];
        return value && value.split(/\s*\!important/)[0];
    };
    SyntheticCSSStyle.prototype.getPropertyPriority = function (name) {
        var value = this[name];
        return value && value.indexOf("!important") !== -1 ? "important" : "";
    };
    SyntheticCSSStyle.prototype.setProperty = function (name, newValue, priority, oldName, notifyOwnerNode) {
        if (notifyOwnerNode === void 0) { notifyOwnerNode = true; }
        if (!exports.isValidCSSDeclarationProperty(name))
            return false;
        // fix in case they"re kebab case
        name = lodash_1.camelCase(name);
        oldName = oldName != null ? lodash_1.camelCase(oldName) : oldName;
        var index = oldName ? this.getPropertyIndex(oldName) : this.getPropertyIndex(name);
        // ensure that internal keys are not set
        if (!/^\$/.test(name)) {
            this[~index ? index : this.length] = name;
        }
        if (name != null) {
            this[name] = newValue;
        }
        if (oldName != null) {
            this[oldName] = undefined;
        }
        this.$updatePropertyIndices();
        if (notifyOwnerNode !== true)
            return;
        // I"m not a fan of sending notifications from another object like this -- I"d typically make this
        // object an observable, and notify changes from here. However, since this particular class is used so often, sending
        // notifications from here would be put a notable bottleneck on the app. So, instead we"re notifying the owner of this node (typically the
        // root document). Less ideal, but achieves the same result of notifying the system of any changes to the synthetic document.
        var ownerNode = this.$parentRule && this.$parentRule.ownerNode;
        if (ownerNode) {
            ownerNode.notify(new common_1.PropertyMutation(style_rule_1.SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION, this.$parentRule, name, newValue, undefined, oldName).toEvent(true));
        }
    };
    SyntheticCSSStyle.prototype.$updatePropertyIndices = function () {
        var model = {};
        for (var i_1 = 0; i_1 < this.length; i_1++) {
            var key = this[i_1];
            var value = this[key];
            if (value != null) {
                model[key + ""] = value;
            }
            // reset for now
            this[i_1] = undefined;
        }
        for (var key in this) {
            if (!this.hasOwnProperty(key) || !exports.isValidCSSDeclarationProperty(key))
                continue;
            if (this[key] == null)
                continue;
            model[key + ""] = this[key];
        }
        var i = 0;
        for (var key in model) {
            this[i++] = key;
        }
        this.$length = Object.keys(model).length;
    };
    SyntheticCSSStyle.prototype.equalTo = function (declaration) {
        function compare(a, b) {
            for (var key in a) {
                if (!exports.isValidCSSDeclarationProperty(key))
                    continue;
                if (a[key] !== b[key]) {
                    return false;
                }
            }
            return true;
        }
        return compare(this, declaration) && compare(declaration, this);
    };
    Object.defineProperty(SyntheticCSSStyle.prototype, "parentRule", {
        get: function () {
            return this.$parentRule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSStyle.prototype, "cssText", {
        get: function () {
            var buffer = [];
            for (var i = 0, n = this.length; i < n; i++) {
                var key = this[i];
                var value = this[key];
                if (value) {
                    buffer.push("\t", lodash_1.kebabCase(key), ": ", value, ";\n");
                }
            }
            return buffer.join("");
        },
        set: function (value) {
            var _this = this;
            value.split(";").forEach(function (decl) {
                var _a = decl.split(":"), key = _a[0], value = _a[1];
                _this.setProperty(key, value);
            });
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSStyle.prototype.toString = function () {
        return this.cssText;
    };
    SyntheticCSSStyle.prototype.clearAll = function () {
        for (var _i = 0, _a = this.getProperties(); _i < _a.length; _i++) {
            var key = _a[_i];
            this[key] = undefined;
        }
        this.$updatePropertyIndices();
    };
    SyntheticCSSStyle.fromString = function (source) {
        var decl = new SyntheticCSSStyle_1();
        var items = source.split(";");
        for (var i = 0, n = items.length; i < n; i++) {
            var expr = items[i];
            var _a = expr.split(":"), name_1 = _a[0], value = _a[1];
            if (!name_1 || !value)
                continue;
            decl[lodash_1.camelCase(name_1.trim())] = value.trim();
        }
        decl.$updatePropertyIndices();
        return decl;
    };
    SyntheticCSSStyle.fromObject = function (declaration) {
        var obj = new SyntheticCSSStyle_1();
        if (declaration.length) {
            for (var i = 0, n = declaration.length; i < n; i++) {
                var key = declaration[i];
                obj[key + ""] = declaration[key];
            }
            obj.$updatePropertyIndices();
        }
        else {
            Object.assign(obj, declaration);
            obj.$updatePropertyIndices();
        }
        return obj;
    };
    SyntheticCSSStyle.prototype.toObject = function () {
        var obj = {};
        for (var i = 0, n = this.length; i < n; i++) {
            var key = this[i];
            if (this[key] == null)
                continue;
            obj[key + ""] = this[key];
        }
        return obj;
    };
    SyntheticCSSStyle.prototype.visitWalker = function (walker) { };
    return SyntheticCSSStyle;
}());
SyntheticCSSStyle = SyntheticCSSStyle_1 = __decorate([
    common_1.serializable("SyntheticCSSStyle", {
        serialize: function (style) {
            var props = [];
            for (var i = 0, n = style.length; i < n; i++) {
                props.push(style[i], style[style[i]]);
            }
            return props;
        },
        deserialize: function (props) {
            var style = new SyntheticCSSStyle_1();
            for (var i = 0, n = props.length; i < n; i += 2) {
                style[props[i]] = props[i + 1];
            }
            style.$updatePropertyIndices();
            return style;
        }
    })
], SyntheticCSSStyle);
exports.SyntheticCSSStyle = SyntheticCSSStyle;
var SyntheticCSSStyle_1;
//# sourceMappingURL=style.js.map