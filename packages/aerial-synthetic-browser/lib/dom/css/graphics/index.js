"use strict";
/**
 * The data model for style declarations
 */
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var style_1 = require("../style");
var aerial_common_1 = require("aerial-common");
var declaration_1 = require("./declaration");
__export(require("./declaration"));
var SyntheticCSSStylePosition = (function () {
    function SyntheticCSSStylePosition(left, top) {
        this.left = left;
        this.top = top;
    }
    SyntheticCSSStylePosition.prototype.toString = function () {
        if (this.left.value === 0.5 && this.top.value === 0.5) {
            return "center";
        }
    };
    return SyntheticCSSStylePosition;
}());
exports.SyntheticCSSStylePosition = SyntheticCSSStylePosition;
// blend modes: http://www.w3schools.com/cssref/pr_background-blend-mode.asp
function isCSSBlendMode(blendMode) {
    return /^(normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity)/.test(blendMode);
}
exports.isCSSBlendMode = isCSSBlendMode;
function isCSSClipType(clip) {
    return /^(border-box|padding-box|content-box|initial|inherit|text)/.test(clip);
}
exports.isCSSClipType = isCSSClipType;
var SyntheticCSSStyleBackground = (function (_super) {
    __extends(SyntheticCSSStyleBackground, _super);
    function SyntheticCSSStyleBackground(properties) {
        var _this = _super.call(this) || this;
        if (properties)
            _this.setProperties(properties);
        return _this;
    }
    SyntheticCSSStyleBackground.prototype.setPosition = function (value) {
        if (value[0] === "center") {
            this.position = new SyntheticCSSStylePosition(new declaration_1.SyntheticCSSMeasurment(0.5, "%"), new declaration_1.SyntheticCSSMeasurment(0.5, "%"));
        }
    };
    SyntheticCSSStyleBackground.prototype.setProperties = function (properties) {
        var color, clip, image, blendMode, position = [], repeat;
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var value = properties_1[_i];
            if (typeof value === "object") {
                if (value instanceof declaration_1.SyntheticCSSColor) {
                    color = value;
                }
            }
            else if (/^(left|top|right|bottom|center)$/.test(value)) {
                position.push(value);
            }
            else if (/repeat/.test(value)) {
                repeat = value;
            }
            else if (isCSSBlendMode(value)) {
                blendMode = value;
            }
            else if (isCSSClipType(value)) {
                clip = value;
            }
            else {
                image = value;
            }
        }
        if (color)
            this.color = color;
        if (image)
            this.image = image;
        if (position.length)
            this.setPosition(position);
        if (repeat)
            this.repeat = repeat;
        if (blendMode)
            this.blendMode = blendMode;
        if (clip)
            this.clip = clip;
    };
    SyntheticCSSStyleBackground.prototype.setProperty = function (name, value) {
        this[name] = evaluateCSSDeclValue2(value, name)[0];
    };
    SyntheticCSSStyleBackground.prototype.toString = function () {
        var params = [];
        if (this.color)
            params.push(this.color);
        if (this.image)
            params.push(this.image);
        if (this.position)
            params.push(this.position);
        if (this.repeat)
            params.push(this.repeat);
        return params.join(" ");
    };
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "color", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "image", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "position", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "repeat", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "size", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "blendMode", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBackground.prototype, "clip", void 0);
    return SyntheticCSSStyleBackground;
}(aerial_common_1.Observable));
exports.SyntheticCSSStyleBackground = SyntheticCSSStyleBackground;
function evaluateCSSDeclValue2(value, property) {
    try {
        value = declaration_1.evaluateCSSDeclValue(declaration_1.parseCSSDeclValue(value));
    }
    catch (e) {
        // console.warn(String(value), e.stack.toString());
        value = [value];
    }
    return property && isUnitBasedCSSProperty(property) ? value.map(declaration_1.SyntheticCSSMeasurment.cast) : value;
}
var SyntheticCSSBox = (function (_super) {
    __extends(SyntheticCSSBox, _super);
    function SyntheticCSSBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSBox.prototype.setProperty = function (name, value) {
        this[name] = evaluateCSSDeclValue2(value, name)[0];
    };
    Object.defineProperty(SyntheticCSSBox.prototype, "width", {
        get: function () {
            return [this.topWidth, this.rightWidth, this.bottomWidth, this.leftWidth];
        },
        set: function (params) {
            if (params.length !== 4) {
                this.leftWidth = params[1].clone();
                this.rightWidth = params[1].clone();
                this.topWidth = params[0].clone();
                this.bottomWidth = params[0].clone();
            }
            else {
                this.topWidth = params[0], this.rightWidth = params[1], this.bottomWidth = params[2], this.leftWidth = params[3];
            }
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSBox.prototype.getStyleProperties = function () {
        if (String(this.leftWidth) === String(this.rightWidth) && String(this.topWidth) === String(this.bottomWidth)) {
            return (this.topWidth || 0) + " " + (this.rightWidth || 0);
        }
        else {
            return (this.topWidth || 0) + " " + (this.rightWidth || 0) + " " + (this.bottomWidth || 0) + " " + (this.leftWidth || 0);
        }
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBox.prototype, "leftWidth", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBox.prototype, "topWidth", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBox.prototype, "rightWidth", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBox.prototype, "bottomWidth", void 0);
    return SyntheticCSSBox;
}(aerial_common_1.Observable));
exports.SyntheticCSSBox = SyntheticCSSBox;
var SyntheticCSSBorder = (function (_super) {
    __extends(SyntheticCSSBorder, _super);
    function SyntheticCSSBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SyntheticCSSBorder.prototype, "left", {
        get: function () {
            return this._getSideStyle("left");
        },
        set: function (value) {
            this._setSideStyle("left", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSBorder.prototype, "top", {
        get: function () {
            return this._getSideStyle("top");
        },
        set: function (value) {
            this._setSideStyle("top", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSBorder.prototype, "right", {
        get: function () {
            return this._getSideStyle("right");
        },
        set: function (value) {
            this._setSideStyle("right", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSBorder.prototype, "bottom", {
        get: function () {
            return this._getSideStyle("bottom");
        },
        set: function (value) {
            this._setSideStyle("bottom", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSBorder.prototype, "width", {
        set: function (value) {
            this.leftWidth = value && value.clone();
            this.topWidth = value && value.clone();
            this.rightWidth = value && value.clone();
            this.bottomWidth = value && value.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSBorder.prototype, "color", {
        set: function (value) {
            this.leftColor = value && value.clone();
            this.topColor = value && value.clone();
            this.rightColor = value && value.clone();
            this.bottomColor = value && value.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSBorder.prototype, "style", {
        set: function (value) {
            this.leftStyle = value;
            this.topStyle = value;
            this.rightStyle = value;
            this.bottomStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSBorder.prototype._getSideStyle = function (side) {
        return [this[side + "Width"], this[side + "Color"], this[side + "Style"]];
    };
    SyntheticCSSBorder.prototype._setSideStyle = function (side, value) {
        _a = this._sortParams(value), this[side + "Width"] = _a[0], this[side + "Color"] = _a[1], this[side + "Style"] = _a[2];
        var _a;
    };
    SyntheticCSSBorder.prototype.setProperties = function (value) {
        _a = this._sortParams(value), this.width = _a[0], this.color = _a[1], this.style = _a[2];
        var _a;
    };
    SyntheticCSSBorder.prototype._sortParams = function (params) {
        var ret = [];
        while (params.length) {
            var v = params.shift();
            if (v instanceof declaration_1.SyntheticCSSColor) {
                ret[1] = v;
            }
            else if (v instanceof declaration_1.SyntheticCSSMeasurment) {
                ret[0] = v;
            }
            else {
                ret[2] = v;
            }
        }
        return ret;
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "leftColor", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "leftStyle", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "topColor", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "topStyle", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "rightColor", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "rightStyle", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "bottomColor", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSBorder.prototype, "bottomStyle", void 0);
    return SyntheticCSSBorder;
}(SyntheticCSSBox));
exports.SyntheticCSSBorder = SyntheticCSSBorder;
var SyntheticCSSStyleBoxShadow = (function (_super) {
    __extends(SyntheticCSSStyleBoxShadow, _super);
    function SyntheticCSSStyleBoxShadow(properties) {
        var _this = _super.call(this) || this;
        if (properties)
            _this.setProperties(properties);
        return _this;
    }
    SyntheticCSSStyleBoxShadow.prototype.setProperties = function (properties) {
        var color, inset, dims = [];
        for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
            var value = properties_2[_i];
            if (value instanceof declaration_1.SyntheticCSSMeasurment || typeof value === "number") {
                dims.push(value);
            }
            else if (value instanceof declaration_1.SyntheticCSSColor) {
                color = value;
            }
            else if (value === "inset") {
                inset = true;
            }
        }
        this.color = color;
        this.inset = inset;
        this.setProperty("x", dims[0]);
        this.setProperty("y", dims[1]);
        this.setProperty("blur", dims[2]);
        this.setProperty("spread", dims[3]);
    };
    SyntheticCSSStyleBoxShadow.prototype.setProperty = function (name, value) {
        this[name] = evaluateCSSDeclValue2(value, name)[0];
    };
    SyntheticCSSStyleBoxShadow.prototype.toString = function () {
        var params = [];
        if (this.inset) {
            params.push("inset");
        }
        params.push(this.x, this.y, this.blur, this.spread, this.color);
        return params.join(" ");
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleBoxShadow.prototype, "inset", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleBoxShadow.prototype, "x", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleBoxShadow.prototype, "y", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleBoxShadow.prototype, "blur", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleBoxShadow.prototype, "spread", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSStyleBoxShadow.prototype, "color", void 0);
    return SyntheticCSSStyleBoxShadow;
}(aerial_common_1.Observable));
exports.SyntheticCSSStyleBoxShadow = SyntheticCSSStyleBoxShadow;
function isUnitBasedCSSProperty(property) {
    return /^(x|y|blur|spread|letterSpacing|fontSize|lineHeight|width|height|minWidth|minHeight|maxWidth|maxHeight|left|top|right|bottom)$/.test(property);
}
exports.isUnitBasedCSSProperty = isUnitBasedCSSProperty;
var SyntheticCSSStyleGraphics = (function (_super) {
    __extends(SyntheticCSSStyleGraphics, _super);
    function SyntheticCSSStyleGraphics(style) {
        var _this = _super.call(this) || this;
        _this.style = style;
        _this.border = new SyntheticCSSBorder();
        _this.margin = new SyntheticCSSBox();
        _this.padding = new SyntheticCSSBox();
        _this.backgrounds = aerial_common_1.ObservableCollection.create();
        _this.boxShadows = aerial_common_1.ObservableCollection.create();
        _this.filters = aerial_common_1.ObservableCollection.create();
        _this.fontFamily = [];
        _this.setProperties(style);
        return _this;
    }
    SyntheticCSSStyleGraphics.prototype.setProperties = function (style) {
        for (var _i = 0, _a = style.getProperties(); _i < _a.length; _i++) {
            var propertyName = _a[_i];
            this.setProperty(propertyName, style[propertyName]);
        }
    };
    SyntheticCSSStyleGraphics.prototype.dispose = function () {
        // nothing
    };
    SyntheticCSSStyleGraphics.prototype.setProperty = function (name, value) {
        var _this = this;
        value = evaluateCSSDeclValue2(value, name);
        var handlers = {
            // border             : (value) => this.border.setProperties(value),
            // borderLeft         : (value) => this.border.left = value,
            // borderLeftWidth    : ([value]) => this.border.leftWidth = value,
            // borderLeftColor    : ([value]) => this.border.leftColor = value,
            // borderLeftStyle    : ([value]) => this.border.leftStyle = value,
            // borderTop          : (value) => this.border.top = value,
            // borderTopWidth     : ([value]) => this.border.topWidth = value,
            // borderTopColor     : ([value]) => this.border.topColor = value,
            // borderTopStyle     : ([value]) => this.border.topStyle = value,
            // borderRight        : (value) => this.border.right = value,
            // borderRightWidth   : ([value]) => this.border.rightWidth = value,
            // borderRightColor   : ([value]) => this.border.rightColor = value,
            // borderRightStyle   : ([value]) => this.border.rightStyle = value,
            // borderBottom       : (value) => this.border.bottom = value,
            // borderBottomtWidth : ([value]) => this.border.bottomWidth = value,
            // borderBottomColor  : ([value]) => this.border.bottomColor = value,
            // borderBottomStyle  : ([value]) => this.border.bottomStyle = value,
            // borderWidth        : ([value]) => this.border.width = value,
            // borderColor        : ([value]) => this.border.color = value,
            // borderStyle        : ([value]) => this.border.style = value,
            // margin             : (value) => this.margin.width = value,
            // marginTop          : (value) => this.margin.topWidth = value.clone(),
            // marginRight        : (value) => this.margin.rightWidth = value.clone(),
            // marginBottom       : (value) => this.margin.bottomWidth = value.clone(),
            // marginLeft         : (value) => this.margin.leftWidth = value.clone(),
            // padding            : (value) => this.padding.width = value,
            // paddingTop          : (value) => this.padding.topWidth = value.clone(),
            // paddingRight        : (value) => this.padding.rightWidth = value.clone(),
            // paddingBottom       : (value) => this.padding.bottomWidth = value.clone(),
            // paddingLeft         : (value) => this.padding.leftWidth = value.clone(),
            backgroundColor: function (_a) {
                var value = _a[0];
                return _this.primaryBackground.color = value;
            },
            backgroundRepeat: function (_a) {
                var value = _a[0];
                return _this.primaryBackground.repeat = value;
            },
            backgroundImage: function (_a) {
                var value = _a[0];
                return _this.primaryBackground.image = value;
            },
            backgroundPosition: function (value) { return _this.primaryBackground.setPosition(value); },
            fontFamily: function (value) { return _this.fontFamily = lodash_1.flattenDeep(value).map(function (value) { return value; }); },
            opacity: function (_a) {
                var value = _a[0];
                return _this.opacity = value;
            },
            mixBlendMode: function (_a) {
                var value = _a[0];
                return _this.mixBlendMode = value;
            },
            filter: function (value) { return _this.filters = aerial_common_1.ObservableCollection.create.apply(aerial_common_1.ObservableCollection, value); },
            background: function (value) {
                // check for background: #F60, #F0F
                if (Array.isArray(value) && Array.isArray(value[0])) {
                    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                        var background = value_1[_i];
                        _this.addBackground(background);
                    }
                }
                else {
                    _this.primaryBackground.setProperties(value);
                }
            },
            boxShadow: function (value) {
                if (!Array.isArray(value[0]))
                    value = [value];
                for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                    var v = value_2[_i];
                    _this.addBoxShadow(v);
                }
            }
        };
        var handler = handlers[name];
        if (handler) {
            handler(value);
        }
        else {
            // set to a blank string to unset the value - null / undefined get ignored
            this[name] = value[0];
        }
    };
    Object.defineProperty(SyntheticCSSStyleGraphics.prototype, "primaryBackground", {
        get: function () {
            return this.backgrounds.length ? this.backgrounds[0] : this.addBackground();
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSStyleGraphics.prototype.addBackground = function (params) {
        var background = new SyntheticCSSStyleBackground(params);
        this.backgrounds.push(background);
        return background;
    };
    SyntheticCSSStyleGraphics.prototype.removeBackground = function (background) {
        var index = this.backgrounds.indexOf(background);
        if (index !== -1)
            this.backgrounds.splice(index, 1);
        return background;
    };
    SyntheticCSSStyleGraphics.prototype.addBoxShadow = function (params) {
        var boxShadow = new SyntheticCSSStyleBoxShadow(params);
        this.boxShadows.push(boxShadow);
        return boxShadow;
    };
    SyntheticCSSStyleGraphics.prototype.addFilter = function (name, params) {
        if (params === void 0) { params = []; }
        var filter = evaluateCSSDeclValue2(name + "(" + params.join(" ") + ")")[0];
        this.filters.push(filter);
        return filter;
    };
    SyntheticCSSStyleGraphics.prototype.renameFilter = function (filter, newName) {
        var newFilter = evaluateCSSDeclValue2(newName + "(" + filter.params.join(" ") + ")")[0];
        var index = this.filters.indexOf(filter);
        if (index !== -1) {
            this.filters.splice(index, 1, newFilter);
        }
        return filter;
    };
    SyntheticCSSStyleGraphics.prototype.removeFilter = function (filter) {
        var index = this.filters.indexOf(filter);
        if (index !== -1) {
            this.filters.splice(index, 1);
        }
        return filter;
    };
    SyntheticCSSStyleGraphics.prototype.removeBoxShadow = function (boxShadow) {
        var index = this.boxShadows.indexOf(boxShadow);
        if (index !== -1)
            this.boxShadows.splice(index, 1);
        return boxShadow;
    };
    SyntheticCSSStyleGraphics.prototype.toStyle = function () {
        var _this = this;
        var style = new style_1.SyntheticCSSStyle();
        [
            // Layout
            ["width"],
            ["height"],
            ["display"],
            ["position"],
            ["minWidth"],
            ["minHeight"],
            ["maxWidth"],
            ["maxHeight"],
            ["left"],
            ["top"],
            ["right"],
            ["bottom"],
            ["overflow"],
            ["float"],
            // flex
            ["flexDirection"],
            ["order"],
            ["flex-grow"],
            ["flex-shrink"],
            ["flex-wrap"],
            ["flex-flow"],
            ["justify-content"],
            ["align-items"],
            // Typography
            ["fontFamily", "fontFamily", ", "],
            ["fontWeight"],
            ["textTransform"],
            ["fontSize"],
            ["fontStyle"],
            ["color"],
            ["letterSpacing"],
            ["lineHeight"],
            ["textAlign"],
            ["wordWrap"],
            ["textDecoration"],
            ["whiteSpace"],
            ["textOverflow"],
            // Appearange
            ["opacity"],
            ["mixBlendMode"],
            // Effects
            ["backgrounds", "background", ", "],
            ["boxShadows", "boxShadow", ", "],
            ["filters", "filter", " "],
        ].forEach(function (_a) {
            var propertyName = _a[0], styleName = _a[1], sep = _a[2];
            var value = _this[propertyName];
            var exists = value != null && (!sep || value.length);
            if (exists) {
                style.setProperty(styleName || propertyName, String(sep ? value.join(sep) : value));
            }
        });
        return style;
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "backgrounds", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "boxShadows", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "filters", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "margin", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "border", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "padding", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "opacity", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "mixBlendMode", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "fontFamily", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "color", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "fontSize", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "fontWeight", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "letterSpacing", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "lineHeight", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "textAlign", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "wordWrap", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "textDecoration", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "textTransform", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "fontStyle", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "whiteSpace", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "textOverflow", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "width", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "height", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "left", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "top", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "right", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "bottom", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "overflow", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "minWidth", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "minHeight", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "maxWidth", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "maxHeight", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "position", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "display", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "flex", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "alignItems", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "justifyContent", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "flexFlow", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "flexWrap", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "flexDirection", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSStyleGraphics.prototype, "float", void 0);
    return SyntheticCSSStyleGraphics;
}(aerial_common_1.Observable));
exports.SyntheticCSSStyleGraphics = SyntheticCSSStyleGraphics;
//# sourceMappingURL=index.js.map