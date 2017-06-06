import tinyColor =  require("tinycolor2");
const { parse }  =  require("./parser.peg");
import { ITreeWalker, bindable, bubble, Observable, ObservableCollection } from "@tandem/common";
import { ISyntheticObject, generateSyntheticUID, ISyntheticSourceInfo } from "@tandem/sandbox";

import { 
  CSSUnitType,
  CSSDeclCallExpression,
  CSSDeclColorExpression,
  CSSDeclValueExpression,
  CSSDeclDegreeExpression,
  CSSDeclLiteralExpression,
  CSSDeclCommaListExpression,
  CSSDeclSpaceListExpression,
  CSSDeclIdentifierExpression, 
  CSSDeclMeasurementExpression,
} from "./ast";


/*

run this:  http://www.w3schools.com/colors/colors_names.asp

var colorMap = {};

Array.prototype.forEach.call(document.querySelectorAll("td:first-child a[href*='/colors/color_tryit.asp']"), (element) => {
  colorMap[element.textContent.toLowerCase().trim()] =  element.parentNode.nextElementSibling.textContent.toUpperCase().trim();
});

console.log(JSON.stringify(colorMap, null, 2));

Copy stdout and paste below

*/

export const BUILTIN_CSS_COLOR_MAP = {
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

for (const key in BUILTIN_CSS_COLOR_MAP) {
  BUILTIN_CSS_COLOR_MAP[BUILTIN_CSS_COLOR_MAP[key]] = key;
}

export abstract class SyntheticCSSValue extends Observable implements ISyntheticObject {
  readonly $uid: any;
  constructor() {
    super();
    this.$uid = generateSyntheticUID();
  }
  get uid() {
    return this.$uid;
  }
  abstract clone(deep?: boolean);
  visitWalker(walker: ITreeWalker) { }
}

const toHex = (value: number) => {
  return ("0" + value.toString(16)).slice(-2);
}

export interface IRGBA {
  r: number;
  b: number;
  g: number;
  a?: number;
}

export class SyntheticCSSColor extends SyntheticCSSValue {

  @bindable(true)
  public r: number;

  @bindable(true)
  public g: number;

  @bindable(true)
  public b: number;

  @bindable(true)
  public a: number;

  constructor(r: number, g: number, b: number, a: number = 1) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromRGBA({ r, g, b, a }: IRGBA) {
    return new SyntheticCSSColor(r, g, b, a);
  }

  clone() {
    return new SyntheticCSSColor(this.r, this.g, this.b, this.a);
  }
  toHex() {
    return `#${[this.r, this.g, this.b].map(toHex).join("")}`.toUpperCase();
  }
  toString() {
    if(this.a !== 1) {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    const hex = this.toHex();
    const alias = BUILTIN_CSS_COLOR_MAP[hex];
    if (alias) return alias;
    return hex;
  }
}

export abstract class SyntheticCSSFilter extends SyntheticCSSValue {
  constructor(readonly name: string, readonly params: any[]) {
    super();
  }
  clone() {
    return evaluateCSSDeclValue(parse(this.toString()))[0];
  }
  abstract toString();
  abstract setProperty(name: string, value: any);
}

export class SyntheticAmountFilter extends SyntheticCSSFilter {

  @bindable(true)
  @bubble()
  public amount: SyntheticCSSMeasurment;

  constructor(public name: string, params: SyntheticCSSMeasurment[]) {
    super(name, params);
    this.amount = params[0] || new SyntheticCSSMeasurment(0, "px");
  }

  setProperty(name: string, value: any) {
    this[name] = evaluateCSSDeclValue(parse(value))[0];
  }

  toString() {
    return `${this.name}(${this.amount})`;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/filter see drop-shadow options
export class SyntheticDropShadowFilter extends SyntheticCSSFilter {
  @bindable(true)
  @bubble()
  public x: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public y: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public blur: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public spread: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public color: SyntheticCSSColor;


  constructor(name: string, params: any[]) {
    super(name, params);
    params = params.concat();
    this.x = SyntheticCSSMeasurment.cast(params.shift());
    this.y = SyntheticCSSMeasurment.cast(params.shift());
    
    const colorOrMeasurement = params.pop();

    if (colorOrMeasurement instanceof SyntheticCSSColor) {
      this.color = colorOrMeasurement;
    } else {
      params.push(colorOrMeasurement);
    }

    const blur   = params.shift();
    const spread = params.shift();

    if (blur) this.blur = SyntheticCSSMeasurment.cast(blur);
    if (spread) this.spread = SyntheticCSSMeasurment.cast(spread);
  }

  setProperty(name: string, value: any) {
    this[name] = evaluateCSSDeclValue(parse(value))[0];
  }

  toString() {
    const params: any[] = [this.x, this.y];
    if (this.blur) params.push(this.blur);
    if (this.spread) params.push(this.spread);
    if (this.color) params.push(this.color);

    return `drop-shadow(${params.join(" ")})`;
  }
}

export class SyntheticCSSDegree extends SyntheticCSSValue {
  @bindable(true) 
  @bubble()
  public value: number;
  constructor(value: number) {
    super();
    this.value = Math.round(value) % 360;
  }
  clone() {
    return new SyntheticCSSDegree(this.value);
  }
  toString() {
    return `${this.value}deg`;
  }
}


export class SyntheticCSSMeasurment extends SyntheticCSSValue {
  @bindable(true)
  @bubble()
  public value: number;

  @bindable(true)
  @bubble()
  public unit: CSSUnitType;

  constructor(value: number, unit: CSSUnitType) {
    super();
    this.value = value;
    this.unit = unit;
  }
  
  clone() {
    return new SyntheticCSSMeasurment(this.value, this.unit);
  }

  toString() {
    return `${this.value}${this.unit}`;
  }

  static cast(value: any) {
    if (typeof value === "number") return new SyntheticCSSMeasurment(value, "px");

    // check for invalid units -- something like 40p should be defaulted to 40px
    if (typeof value === "string") return new SyntheticCSSMeasurment(Number(/\d/.test(value) ? value.match(/\d+/)[0] : 0), "px");
    if (value == null) return new SyntheticCSSMeasurment(0, "px");
    return value;
  }
}

export class SyntheticCSSGradientColorStop extends SyntheticCSSValue {

  @bindable(true)
  @bubble()
  public color: SyntheticCSSColor;

  @bindable(true)
  public stop: number;

  constructor(color: SyntheticCSSColor, stop?: number) {
    super();
    this.color = color;
    this.stop = stop;
  }
  clone() {
    return new SyntheticCSSGradientColorStop(this.color, this.stop);
  }
}

export class SyntheticCSSLinearGradient extends SyntheticCSSValue {
  @bindable(true)
  public angle: number;

  @bindable(true)
  @bubble()
  public colorStops: ObservableCollection<SyntheticCSSGradientColorStop>;

  constructor(angle: number, colorStops: SyntheticCSSGradientColorStop[]) {
    super();
    this.angle = angle;
    this.colorStops = ObservableCollection.create(...colorStops) as ObservableCollection<SyntheticCSSGradientColorStop>;
  }
  clone() {
    return new SyntheticCSSLinearGradient(this.angle, this.colorStops.map(colorStop => colorStop.clone()));
  }
  toString() {
    let buffer = "linear-gradient(";

    const params = [];

    if (this.angle) {
      params.push(this.angle);
    }

    for (const { color, stop } of this.colorStops) {
      if (stop) {
        params.push(`${color} ${stop * 100}%`);
      } else {
        params.push(`${color}`);
      }
    }

    return `linear-gradient(${params.join(", ")})`;
  }
}

// for now use built-in functions 
const globalContext = {
  rgba([r], [g], [b], [a]) {
    return new SyntheticCSSColor(r, g, b, a);
  },
  rgb([r], [g], [b]) {
    return new SyntheticCSSColor(r, g, b);
  },
  url([value]) {
    return value; 
  },

  // TODO - translate
  translateY([value]) {
    return value;
  },
  translateX([value]) {
    return value;
  },
  translate([value]) {
    return value;
  },
  rotate([value]) {
    return value;
  },
  scale([value]) {
    return value;
  },
  "linear-gradient": (...args: any[]) => {
    const angle = typeof args[0][0] === "number" || typeof args[0][0] === "string" ? args.shift() : 0;
    const colorStops = args.map(([color, measurement]) => {
      return new SyntheticCSSGradientColorStop(color, measurement && (<SyntheticCSSMeasurment>measurement).value / 100);
    });

    return new SyntheticCSSLinearGradient(angle, colorStops);
  }
};

export const CSS_FILTER_TYPES = [
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

for (const filterType of CSS_FILTER_TYPES) {
  globalContext[filterType] = (...params: Array<Array<any>>): SyntheticCSSFilter =>  {

    const params2 = params[0];

    if (filterType === "drop-shadow") {
      return new SyntheticDropShadowFilter(filterType, params2);
    }

    return new SyntheticAmountFilter(filterType, params2);
  }
}

const parseHexColor = (value: string) => {
  const c = tinyColor(value);
  const rgba = c.toRgb();
  return new SyntheticCSSColor(rgba.r, rgba.g, rgba.b, rgba.a);
};

for (const colorName in BUILTIN_CSS_COLOR_MAP) {
  const syntheticColor = parseHexColor(BUILTIN_CSS_COLOR_MAP[colorName]);
  globalContext[colorName] = () => syntheticColor.clone();
}

export const evaluateCSSDeclValue = (expression: CSSDeclValueExpression) => {
  return expression.accept({
    visitCall(call: CSSDeclCallExpression) {
      const name = (<CSSDeclIdentifierExpression>call.identifier).value;
      if (!globalContext[name]) throw new Error(`Cannot call CSS property value ${name}`);
      return globalContext[name](...call.params.map((param) => {
        return param.accept(this);
      }))
    },
    visitColor(color: CSSDeclColorExpression) {
      return parseHexColor(color.value);
    },
    visitDegree(degree: CSSDeclDegreeExpression) {
      return new SyntheticCSSDegree(degree.value);
    },
    visitLiteral(literal: CSSDeclLiteralExpression) {
      return literal.value;
    },
    visitCommaList(list: CSSDeclCommaListExpression) {
      return list.items.map(item => item.accept(this));
    },
    visitSpaceList(list: CSSDeclSpaceListExpression) {
      return list.items.map(item => item.accept(this));
    },
    visitIdentifier(identifier: CSSDeclIdentifierExpression) {
      const create = globalContext[identifier.value];
      return (create && create()) || identifier.value;
    },
    visitMeasurement(measurement: CSSDeclMeasurementExpression) {
      return new SyntheticCSSMeasurment(measurement.value, measurement.unit);
    }
  });
};
