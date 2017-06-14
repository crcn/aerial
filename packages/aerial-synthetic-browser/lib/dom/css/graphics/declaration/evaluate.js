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
Object.defineProperty(exports, "__esModule", { value: true });
var tinyColor = require("tinycolor2");
var parse = require("./parser.peg").parse;
var aerial_common_1 = require("aerial-common");
var aerial_sandbox_1 = require("aerial-sandbox");
/*

run this:  http://www.w3schools.com/colors/colors_names.asp

var colorMap = {};

Array.prototype.forEach.call(document.querySelectorAll("td:first-child a[href*='/colors/color_tryit.asp']"), (element) => {
  colorMap[element.textContent.toLowerCase().trim()] =  element.parentNode.nextElementSibling.textContent.toUpperCase().trim();
});

console.log(JSON.stringify(colorMap, null, 2));

Copy stdout and paste below

*/
exports.BUILTIN_CSS_COLOR_MAP = {
    "aliceblue": "#F0F8FF",
    "antiquewhite": "#FAEBD7",
    "aqua": "#00FFFF",
    "aquamarine": "#7FFFD4",
    "azure": "#F0FFFF",
    "beige": "#F5F5DC",
    "bisque": "#FFE4C4",
    "black": "#000000",
    "blanchedalmond": "#FFEBCD",
    "blue": "#0000FF",
    "blueviolet": "#8A2BE2",
    "brown": "#A52A2A",
    "burlywood": "#DEB887",
    "cadetblue": "#5F9EA0",
    "chartreuse": "#7FFF00",
    "chocolate": "#D2691E",
    "coral": "#FF7F50",
    "cornflowerblue": "#6495ED",
    "cornsilk": "#FFF8DC",
    "crimson": "#DC143C",
    "cyan": "#00FFFF",
    "darkblue": "#00008B",
    "darkcyan": "#008B8B",
    "darkgoldenrod": "#B8860B",
    "darkgray": "#A9A9A9",
    "darkgrey": "#A9A9A9",
    "darkgreen": "#006400",
    "darkkhaki": "#BDB76B",
    "darkmagenta": "#8B008B",
    "darkolivegreen": "#556B2F",
    "darkorange": "#FF8C00",
    "darkorchid": "#9932CC",
    "darkred": "#8B0000",
    "darksalmon": "#E9967A",
    "darkseagreen": "#8FBC8F",
    "darkslateblue": "#483D8B",
    "darkslategray": "#2F4F4F",
    "darkslategrey": "#2F4F4F",
    "darkturquoise": "#00CED1",
    "darkviolet": "#9400D3",
    "deeppink": "#FF1493",
    "deepskyblue": "#00BFFF",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1E90FF",
    "firebrick": "#B22222",
    "floralwhite": "#FFFAF0",
    "forestgreen": "#228B22",
    "fuchsia": "#FF00FF",
    "gainsboro": "#DCDCDC",
    "ghostwhite": "#F8F8FF",
    "gold": "#FFD700",
    "goldenrod": "#DAA520",
    "gray": "#808080",
    "grey": "#808080",
    "green": "#008000",
    "greenyellow": "#ADFF2F",
    "honeydew": "#F0FFF0",
    "hotpink": "#FF69B4",
    "indianred": "#CD5C5C",
    "indigo": "#4B0082",
    "ivory": "#FFFFF0",
    "khaki": "#F0E68C",
    "lavender": "#E6E6FA",
    "lavenderblush": "#FFF0F5",
    "lawngreen": "#7CFC00",
    "lemonchiffon": "#FFFACD",
    "lightblue": "#ADD8E6",
    "lightcoral": "#F08080",
    "lightcyan": "#E0FFFF",
    "lightgoldenrodyellow": "#FAFAD2",
    "lightgray": "#D3D3D3",
    "lightgrey": "#D3D3D3",
    "lightgreen": "#90EE90",
    "lightpink": "#FFB6C1",
    "lightsalmon": "#FFA07A",
    "lightseagreen": "#20B2AA",
    "lightskyblue": "#87CEFA",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#B0C4DE",
    "lightyellow": "#FFFFE0",
    "lime": "#00FF00",
    "limegreen": "#32CD32",
    "linen": "#FAF0E6",
    "magenta": "#FF00FF",
    "maroon": "#800000",
    "mediumaquamarine": "#66CDAA",
    "mediumblue": "#0000CD",
    "mediumorchid": "#BA55D3",
    "mediumpurple": "#9370DB",
    "mediumseagreen": "#3CB371",
    "mediumslateblue": "#7B68EE",
    "mediumspringgreen": "#00FA9A",
    "mediumturquoise": "#48D1CC",
    "mediumvioletred": "#C71585",
    "midnightblue": "#191970",
    "mintcream": "#F5FFFA",
    "mistyrose": "#FFE4E1",
    "moccasin": "#FFE4B5",
    "navajowhite": "#FFDEAD",
    "navy": "#000080",
    "oldlace": "#FDF5E6",
    "olive": "#808000",
    "olivedrab": "#6B8E23",
    "orange": "#FFA500",
    "orangered": "#FF4500",
    "orchid": "#DA70D6",
    "palegoldenrod": "#EEE8AA",
    "palegreen": "#98FB98",
    "paleturquoise": "#AFEEEE",
    "palevioletred": "#DB7093",
    "papayawhip": "#FFEFD5",
    "peachpuff": "#FFDAB9",
    "peru": "#CD853F",
    "pink": "#FFC0CB",
    "plum": "#DDA0DD",
    "powderblue": "#B0E0E6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#FF0000",
    "rosybrown": "#BC8F8F",
    "royalblue": "#4169E1",
    "saddlebrown": "#8B4513",
    "salmon": "#FA8072",
    "sandybrown": "#F4A460",
    "seagreen": "#2E8B57",
    "seashell": "#FFF5EE",
    "sienna": "#A0522D",
    "silver": "#C0C0C0",
    "skyblue": "#87CEEB",
    "slateblue": "#6A5ACD",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#FFFAFA",
    "springgreen": "#00FF7F",
    "steelblue": "#4682B4",
    "tan": "#D2B48C",
    "teal": "#008080",
    "thistle": "#D8BFD8",
    "tomato": "#FF6347",
    "turquoise": "#40E0D0",
    "violet": "#EE82EE",
    "wheat": "#F5DEB3",
    "white": "#FFFFFF",
    "whitesmoke": "#F5F5F5",
    "yellow": "#FFFF00",
    "yellowgreen": "#9ACD32"
};
for (var key in exports.BUILTIN_CSS_COLOR_MAP) {
    exports.BUILTIN_CSS_COLOR_MAP[exports.BUILTIN_CSS_COLOR_MAP[key]] = key;
}
var SyntheticCSSValue = (function (_super) {
    __extends(SyntheticCSSValue, _super);
    function SyntheticCSSValue() {
        var _this = _super.call(this) || this;
        _this.$uid = aerial_sandbox_1.generateSyntheticUID();
        return _this;
    }
    Object.defineProperty(SyntheticCSSValue.prototype, "uid", {
        get: function () {
            return this.$uid;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSValue.prototype.visitWalker = function (walker) { };
    return SyntheticCSSValue;
}(aerial_common_1.Observable));
exports.SyntheticCSSValue = SyntheticCSSValue;
var toHex = function (value) {
    return ("0" + value.toString(16)).slice(-2);
};
var SyntheticCSSColor = (function (_super) {
    __extends(SyntheticCSSColor, _super);
    function SyntheticCSSColor(r, g, b, a) {
        if (a === void 0) { a = 1; }
        var _this = _super.call(this) || this;
        _this.r = r;
        _this.g = g;
        _this.b = b;
        _this.a = a;
        return _this;
    }
    SyntheticCSSColor.fromRGBA = function (_a) {
        var r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        return new SyntheticCSSColor(r, g, b, a);
    };
    SyntheticCSSColor.prototype.clone = function () {
        return new SyntheticCSSColor(this.r, this.g, this.b, this.a);
    };
    SyntheticCSSColor.prototype.toHex = function () {
        return ("#" + [this.r, this.g, this.b].map(toHex).join("")).toUpperCase();
    };
    SyntheticCSSColor.prototype.toString = function () {
        if (this.a !== 1) {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }
        var hex = this.toHex();
        var alias = exports.BUILTIN_CSS_COLOR_MAP[hex];
        if (alias)
            return alias;
        return hex;
    };
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSColor.prototype, "r", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSColor.prototype, "g", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSColor.prototype, "b", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSColor.prototype, "a", void 0);
    return SyntheticCSSColor;
}(SyntheticCSSValue));
exports.SyntheticCSSColor = SyntheticCSSColor;
var SyntheticCSSFilter = (function (_super) {
    __extends(SyntheticCSSFilter, _super);
    function SyntheticCSSFilter(name, params) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.params = params;
        return _this;
    }
    SyntheticCSSFilter.prototype.clone = function () {
        return exports.evaluateCSSDeclValue(parse(this.toString()))[0];
    };
    return SyntheticCSSFilter;
}(SyntheticCSSValue));
exports.SyntheticCSSFilter = SyntheticCSSFilter;
var SyntheticAmountFilter = (function (_super) {
    __extends(SyntheticAmountFilter, _super);
    function SyntheticAmountFilter(name, params) {
        var _this = _super.call(this, name, params) || this;
        _this.name = name;
        _this.amount = params[0] || new SyntheticCSSMeasurment(0, "px");
        return _this;
    }
    SyntheticAmountFilter.prototype.setProperty = function (name, value) {
        this[name] = exports.evaluateCSSDeclValue(parse(value))[0];
    };
    SyntheticAmountFilter.prototype.toString = function () {
        return this.name + "(" + this.amount + ")";
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticAmountFilter.prototype, "amount", void 0);
    return SyntheticAmountFilter;
}(SyntheticCSSFilter));
exports.SyntheticAmountFilter = SyntheticAmountFilter;
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter see drop-shadow options
var SyntheticDropShadowFilter = (function (_super) {
    __extends(SyntheticDropShadowFilter, _super);
    function SyntheticDropShadowFilter(name, params) {
        var _this = _super.call(this, name, params) || this;
        params = params.concat();
        _this.x = SyntheticCSSMeasurment.cast(params.shift());
        _this.y = SyntheticCSSMeasurment.cast(params.shift());
        var colorOrMeasurement = params.pop();
        if (colorOrMeasurement instanceof SyntheticCSSColor) {
            _this.color = colorOrMeasurement;
        }
        else {
            params.push(colorOrMeasurement);
        }
        var blur = params.shift();
        var spread = params.shift();
        if (blur)
            _this.blur = SyntheticCSSMeasurment.cast(blur);
        if (spread)
            _this.spread = SyntheticCSSMeasurment.cast(spread);
        return _this;
    }
    SyntheticDropShadowFilter.prototype.setProperty = function (name, value) {
        this[name] = exports.evaluateCSSDeclValue(parse(value))[0];
    };
    SyntheticDropShadowFilter.prototype.toString = function () {
        var params = [this.x, this.y];
        if (this.blur)
            params.push(this.blur);
        if (this.spread)
            params.push(this.spread);
        if (this.color)
            params.push(this.color);
        return "drop-shadow(" + params.join(" ") + ")";
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticDropShadowFilter.prototype, "x", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticDropShadowFilter.prototype, "y", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticDropShadowFilter.prototype, "blur", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticDropShadowFilter.prototype, "spread", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticDropShadowFilter.prototype, "color", void 0);
    return SyntheticDropShadowFilter;
}(SyntheticCSSFilter));
exports.SyntheticDropShadowFilter = SyntheticDropShadowFilter;
var SyntheticCSSDegree = (function (_super) {
    __extends(SyntheticCSSDegree, _super);
    function SyntheticCSSDegree(value) {
        var _this = _super.call(this) || this;
        _this.value = Math.round(value) % 360;
        return _this;
    }
    SyntheticCSSDegree.prototype.clone = function () {
        return new SyntheticCSSDegree(this.value);
    };
    SyntheticCSSDegree.prototype.toString = function () {
        return this.value + "deg";
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSDegree.prototype, "value", void 0);
    return SyntheticCSSDegree;
}(SyntheticCSSValue));
exports.SyntheticCSSDegree = SyntheticCSSDegree;
var SyntheticCSSMeasurment = (function (_super) {
    __extends(SyntheticCSSMeasurment, _super);
    function SyntheticCSSMeasurment(value, unit) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.unit = unit;
        return _this;
    }
    SyntheticCSSMeasurment.prototype.clone = function () {
        return new SyntheticCSSMeasurment(this.value, this.unit);
    };
    SyntheticCSSMeasurment.prototype.toString = function () {
        return "" + this.value + this.unit;
    };
    SyntheticCSSMeasurment.cast = function (value) {
        if (typeof value === "number")
            return new SyntheticCSSMeasurment(value, "px");
        // check for invalid units -- something like 40p should be defaulted to 40px
        if (typeof value === "string")
            return new SyntheticCSSMeasurment(Number(/\d/.test(value) ? value.match(/\d+/)[0] : 0), "px");
        if (value == null)
            return new SyntheticCSSMeasurment(0, "px");
        return value;
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSMeasurment.prototype, "value", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSMeasurment.prototype, "unit", void 0);
    return SyntheticCSSMeasurment;
}(SyntheticCSSValue));
exports.SyntheticCSSMeasurment = SyntheticCSSMeasurment;
var SyntheticCSSGradientColorStop = (function (_super) {
    __extends(SyntheticCSSGradientColorStop, _super);
    function SyntheticCSSGradientColorStop(color, stop) {
        var _this = _super.call(this) || this;
        _this.color = color;
        _this.stop = stop;
        return _this;
    }
    SyntheticCSSGradientColorStop.prototype.clone = function () {
        return new SyntheticCSSGradientColorStop(this.color, this.stop);
    };
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSGradientColorStop.prototype, "color", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSGradientColorStop.prototype, "stop", void 0);
    return SyntheticCSSGradientColorStop;
}(SyntheticCSSValue));
exports.SyntheticCSSGradientColorStop = SyntheticCSSGradientColorStop;
var SyntheticCSSLinearGradient = (function (_super) {
    __extends(SyntheticCSSLinearGradient, _super);
    function SyntheticCSSLinearGradient(angle, colorStops) {
        var _this = _super.call(this) || this;
        _this.angle = angle;
        _this.colorStops = aerial_common_1.ObservableCollection.create.apply(aerial_common_1.ObservableCollection, colorStops);
        return _this;
    }
    SyntheticCSSLinearGradient.prototype.clone = function () {
        return new SyntheticCSSLinearGradient(this.angle, this.colorStops.map(function (colorStop) { return colorStop.clone(); }));
    };
    SyntheticCSSLinearGradient.prototype.toString = function () {
        var buffer = "linear-gradient(";
        var params = [];
        if (this.angle) {
            params.push(this.angle);
        }
        for (var _i = 0, _a = this.colorStops; _i < _a.length; _i++) {
            var _b = _a[_i], color = _b.color, stop_1 = _b.stop;
            if (stop_1) {
                params.push(color + " " + stop_1 * 100 + "%");
            }
            else {
                params.push("" + color);
            }
        }
        return "linear-gradient(" + params.join(", ") + ")";
    };
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticCSSLinearGradient.prototype, "angle", void 0);
    __decorate([
        aerial_common_1.bindable(true),
        aerial_common_1.bubble()
    ], SyntheticCSSLinearGradient.prototype, "colorStops", void 0);
    return SyntheticCSSLinearGradient;
}(SyntheticCSSValue));
exports.SyntheticCSSLinearGradient = SyntheticCSSLinearGradient;
// for now use built-in functions 
var globalContext = {
    rgba: function (_a, _b, _c, _d) {
        var r = _a[0];
        var g = _b[0];
        var b = _c[0];
        var a = _d[0];
        return new SyntheticCSSColor(r, g, b, a);
    },
    rgb: function (_a, _b, _c) {
        var r = _a[0];
        var g = _b[0];
        var b = _c[0];
        return new SyntheticCSSColor(r, g, b);
    },
    url: function (_a) {
        var value = _a[0];
        return value;
    },
    // TODO - translate
    translateY: function (_a) {
        var value = _a[0];
        return value;
    },
    translateX: function (_a) {
        var value = _a[0];
        return value;
    },
    translate: function (_a) {
        var value = _a[0];
        return value;
    },
    rotate: function (_a) {
        var value = _a[0];
        return value;
    },
    scale: function (_a) {
        var value = _a[0];
        return value;
    },
    "linear-gradient": function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var angle = typeof args[0][0] === "number" || typeof args[0][0] === "string" ? args.shift() : 0;
        var colorStops = args.map(function (_a) {
            var color = _a[0], measurement = _a[1];
            return new SyntheticCSSGradientColorStop(color, measurement && measurement.value / 100);
        });
        return new SyntheticCSSLinearGradient(angle, colorStops);
    }
};
exports.CSS_FILTER_TYPES = [
    "blur",
    "brightness",
    "contrast",
    "drop-shadow",
    "grayscale",
    "hue-rotate",
    "invert",
    "opacity",
    "saturate",
    "sepia"
];
var _loop_1 = function (filterType) {
    globalContext[filterType] = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var params2 = params[0];
        if (filterType === "drop-shadow") {
            return new SyntheticDropShadowFilter(filterType, params2);
        }
        return new SyntheticAmountFilter(filterType, params2);
    };
};
for (var _i = 0, CSS_FILTER_TYPES_1 = exports.CSS_FILTER_TYPES; _i < CSS_FILTER_TYPES_1.length; _i++) {
    var filterType = CSS_FILTER_TYPES_1[_i];
    _loop_1(filterType);
}
var parseHexColor = function (value) {
    var c = tinyColor(value);
    var rgba = c.toRgb();
    return new SyntheticCSSColor(rgba.r, rgba.g, rgba.b, rgba.a);
};
var _loop_2 = function (colorName) {
    var syntheticColor = parseHexColor(exports.BUILTIN_CSS_COLOR_MAP[colorName]);
    globalContext[colorName] = function () { return syntheticColor.clone(); };
};
for (var colorName in exports.BUILTIN_CSS_COLOR_MAP) {
    _loop_2(colorName);
}
exports.evaluateCSSDeclValue = function (expression) {
    return expression.accept({
        visitCall: function (call) {
            var _this = this;
            var name = call.identifier.value;
            if (!globalContext[name])
                throw new Error("Cannot call CSS property value " + name);
            return globalContext[name].apply(globalContext, call.params.map(function (param) {
                return param.accept(_this);
            }));
        },
        visitColor: function (color) {
            return parseHexColor(color.value);
        },
        visitDegree: function (degree) {
            return new SyntheticCSSDegree(degree.value);
        },
        visitLiteral: function (literal) {
            return literal.value;
        },
        visitCommaList: function (list) {
            var _this = this;
            return list.items.map(function (item) { return item.accept(_this); });
        },
        visitSpaceList: function (list) {
            var _this = this;
            return list.items.map(function (item) { return item.accept(_this); });
        },
        visitIdentifier: function (identifier) {
            var create = globalContext[identifier.value];
            return (create && create()) || identifier.value;
        },
        visitMeasurement: function (measurement) {
            return new SyntheticCSSMeasurment(measurement.value, measurement.unit);
        }
    });
};
//# sourceMappingURL=evaluate.js.map