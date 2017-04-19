/**
 * The data model for style declarations
 */

import { flattenDeep } from "lodash";
import { SyntheticCSSStyle, isValidCSSDeclarationProperty } from "../style";
import { uniq } from "lodash";
import { Observable, ObservableCollection, bindable, bubble } from "@tandem/common";
import { 
  parseCSSDeclValue, 
  SyntheticCSSColor,   
  SyntheticCSSFilter,
  evaluateCSSDeclValue, 
  SyntheticCSSMeasurment,
} from "./declaration";
export * from "./declaration";

export class SyntheticCSSStylePosition {
  constructor(public left: SyntheticCSSMeasurment, public top: SyntheticCSSMeasurment) {

  }

  toString() {
    if (this.left.value === 0.5 && this.top.value === 0.5) {
      return "center";
    }
  }
}

// blend modes: http://www.w3schools.com/cssref/pr_background-blend-mode.asp
export function isCSSBlendMode(blendMode: string) {
  return /^(normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity)/.test(blendMode);
}

export function isCSSClipType(clip: string) {
  return /^(border-box|padding-box|content-box|initial|inherit|text)/.test(clip);
}

export type CSSBlendModeType = "normal"|"multiply"|"screen"|"overlay"|"darken"|"lighten"|"color-dodge"|"saturation"|"color"|"luminosity";
export type CSSBackgroundClipType = "border-box"|"padding-box"|"content-box"|"text";

export class SyntheticCSSStyleBackground extends Observable {

  @bindable(true)
  public color: SyntheticCSSColor;

  @bindable(true)
  public image: string;

  @bindable(true)
  public position: SyntheticCSSStylePosition;

  @bindable(true)
  public repeat: string;

  @bindable(true)
  public size: string|Array<SyntheticCSSMeasurment>;

  @bindable(true)
  public blendMode: CSSBlendModeType;

  @bindable(true)
  public clip: CSSBackgroundClipType;

  constructor(properties?: any) {
    super();
    if (properties) this.setProperties(properties);
  }

  setPosition(value: string[]) {
    if (value[0] === "center") {
      this.position = new SyntheticCSSStylePosition(new SyntheticCSSMeasurment(0.5, "%"), new SyntheticCSSMeasurment(0.5, "%"));
    }
  }

  setProperties(properties: any[]) {
    let color, clip, image, blendMode, position = [], repeat;

    for (const value of properties) {
      if (typeof value === "object") {
        if (value instanceof SyntheticCSSColor) {
          color = value;
        }
      } else if(/^(left|top|right|bottom|center)$/.test(value)) {
        position.push(value); 
      } else if(/repeat/.test(value)) {
        repeat = value;
      } else if (isCSSBlendMode(value)) {
        blendMode = value;
      } else if(isCSSClipType(value)) {
        clip = value;
      } else {
        image = value;
      }
    }

    if (color) this.color = color;
    if (image) this.image = image;
    if (position.length)  this.setPosition(position);
    if (repeat) this.repeat = repeat;
    if (blendMode) this.blendMode = blendMode;
    if (clip) this.clip = clip;
  }

  setProperty(name: string, value: any) {
    this[name] = evaluateCSSDeclValue2(value, name)[0];
  }

  toString() {
    const params = [];

    if (this.color) params.push(this.color);
    if (this.image) params.push(this.image);
    if (this.position) params.push(this.position);
    if (this.repeat) params.push(this.repeat);

    return params.join(" ");
  }
}

function evaluateCSSDeclValue2(value, property?) {
  
  try {
    value = evaluateCSSDeclValue(parseCSSDeclValue(value));
  } catch(e) {
    // console.warn(String(value), e.stack.toString());
    value = [value];
  }
  
  return property && isUnitBasedCSSProperty(property) ? value.map(SyntheticCSSMeasurment.cast) : value;
}

export class SyntheticCSSBox extends Observable {
  
  @bindable(true)
  @bubble()
  public leftWidth: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public topWidth: SyntheticCSSMeasurment;
  
  @bindable(true)
  @bubble()
  public rightWidth: SyntheticCSSMeasurment;
  
  @bindable(true)
  @bubble()
  public bottomWidth: SyntheticCSSMeasurment;

  setProperty(name: string, value) {
    this[name] = evaluateCSSDeclValue2(value, name)[0];
  }

  get width() {
    return [this.topWidth, this.rightWidth, this.bottomWidth, this.leftWidth];
  }

  set width(params: any) {
    if (params.length !== 4) {
      this.leftWidth = params[1].clone();
      this.rightWidth = params[1].clone();
      this.topWidth = params[0].clone();
      this.bottomWidth = params[0].clone();
    } else {
      [this.topWidth, this.rightWidth, this.bottomWidth, this.leftWidth] = params;
    }
  }

  getStyleProperties() {
    if (String(this.leftWidth) === String(this.rightWidth) && String(this.topWidth) === String(this.bottomWidth)) {
      return `${this.topWidth || 0} ${this.rightWidth || 0}`;
    } else {
      return `${this.topWidth || 0} ${this.rightWidth || 0} ${this.bottomWidth || 0} ${this.leftWidth || 0}`;
    }
  }
}

export class SyntheticCSSBorder extends SyntheticCSSBox {
  
  @bindable(true)
  @bubble()
  public leftColor: SyntheticCSSColor;

  @bindable(true)
  @bubble()
  public leftStyle: string;

  @bindable(true)
  @bubble()
  public topColor: SyntheticCSSColor;

  @bindable(true)
  @bubble()
  public topStyle: string;
  
  @bindable(true)
  @bubble()
  public rightColor: SyntheticCSSColor;

  @bindable(true)
  @bubble()
  public rightStyle: string;
  
  @bindable(true)
  @bubble()
  public bottomColor: SyntheticCSSColor;

  @bindable(true)
  @bubble()
  public bottomStyle: string;

  get left() {
    return this._getSideStyle("left");
  }

  set left(value: any) {
    this._setSideStyle("left", value);
  }

  get top() {
    return this._getSideStyle("top");
  }

  set top(value: any) {
    this._setSideStyle("top", value);
  }

  get right() {
    return this._getSideStyle("right");
  }

  set right(value: any) {
    this._setSideStyle("right", value);
  }

  get bottom() {
    return this._getSideStyle("bottom");
  }

  set width(value: SyntheticCSSMeasurment) {
    this.leftWidth   = value && value.clone();
    this.topWidth    = value && value.clone();
    this.rightWidth  = value && value.clone();
    this.bottomWidth = value && value.clone();
  }

  set color(value: SyntheticCSSColor) {
    this.leftColor   = value && value.clone();
    this.topColor    = value && value.clone();
    this.rightColor  = value && value.clone();
    this.bottomColor = value && value.clone();
  }

  set style(value: string) {
    this.leftStyle   = value;
    this.topStyle    = value;
    this.rightStyle  = value;
    this.bottomStyle = value;
  }

  set bottom(value: any) {
    this._setSideStyle("bottom", value);
  }

  private _getSideStyle(side: string): [SyntheticCSSMeasurment, SyntheticCSSColor, string] {
    return [this[`${side}Width`], this[`${side}Color`], this[`${side}Style`]];
  }

  private _setSideStyle(side: string, value: [SyntheticCSSMeasurment, SyntheticCSSColor, string]) {
    [this[`${side}Width`], this[`${side}Color`], this[`${side}Style`]] = this._sortParams(value);
  }

  setProperties(value: any) {
    [this.width, this.color, this.style] = this._sortParams(value);
  }

  private _sortParams(params: any[]): [SyntheticCSSMeasurment, SyntheticCSSColor, string] {
    const ret = [] as any;
    while(params.length) {
      const v = params.shift();
      if (v instanceof SyntheticCSSColor) {
        ret[1] = v;
      } else if (v instanceof SyntheticCSSMeasurment) {
        ret[0] = v;
      } else {
        ret[2] = v;
      }
    }
    return ret;
  }

  // getStyleProperties() {
    
  // }
}

export class SyntheticCSSStyleBoxShadow  extends Observable {

  @bindable(true)
  @bubble()
  public inset: boolean; 

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
  public color: SyntheticCSSColor;

  constructor(properties?: any) {
    super();
    if (properties) this.setProperties(properties);
  }

  setProperties(properties: any[]) {
    let color, inset, dims = [];

    for (const value of properties) {
      if (value instanceof SyntheticCSSMeasurment || typeof value === "number") {
        dims.push(value);
      } else if (value instanceof SyntheticCSSColor) {
        color = value;
      } else if (value === "inset") {
        inset = true;
      }
    }

    this.color  = color;
    this.inset  = inset;
    this.setProperty("x", dims[0]);
    this.setProperty("y", dims[1]);
    this.setProperty("blur", dims[2]);
    this.setProperty("spread", dims[3]);
  }

  setProperty(name: string, value: any) {
    this[name] = evaluateCSSDeclValue2(value, name)[0];
  }

  toString() {
    let params = [];
    if (this.inset) {
      params.push("inset");
    }
    params.push(this.x, this.y, this.blur, this.spread, this.color);
    return params.join(" ");
  }
}

export function isUnitBasedCSSProperty(property: string) {
  return /^(x|y|blur|spread|letterSpacing|fontSize|lineHeight|width|height|minWidth|minHeight|maxWidth|maxHeight|left|top|right|bottom)$/.test(property);
}

export class SyntheticCSSStyleGraphics extends Observable {

  @bindable(true)
  @bubble()
  public backgrounds: ObservableCollection<SyntheticCSSStyleBackground>;

  @bindable(true)
  @bubble()
  public boxShadows: ObservableCollection<SyntheticCSSStyleBoxShadow>;

  @bindable(true)
  @bubble()
  public filters: ObservableCollection<SyntheticCSSFilter>;

  @bindable(true)
  @bubble()
  public margin: SyntheticCSSBox;

  @bindable(true)
  @bubble()
  public border: SyntheticCSSBorder;

  @bindable(true)
  @bubble()
  public padding: SyntheticCSSBox;

  @bindable(true)
  @bubble()
  public opacity: number;

  @bindable(true)
  @bubble()
  public mixBlendMode: string;

  @bindable(true)
  @bubble()
  public fontFamily: string[];

  @bindable(true)
  @bubble()
  public color: SyntheticCSSColor;

  @bindable(true)
  @bubble()
  public fontSize: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public fontWeight: string;

  @bindable(true)
  @bubble()
  public letterSpacing: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public lineHeight: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public textAlign: string;

  @bindable(true)
  @bubble()
  public wordWrap: string;

  @bindable(true)
  @bubble()
  public textDecoration: string;

  @bindable(true)
  @bubble()
  public textTransform: string;

  @bindable(true)
  @bubble()
  public fontStyle: string;

  @bindable(true)
  @bubble()
  public whiteSpace: string;

  @bindable(true)
  @bubble()
  public textOverflow: string;

  @bindable(true)
  @bubble()
  public width: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public height: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public left: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public top: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public right: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public bottom: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public overflow: string;

  @bindable(true)
  @bubble()
  public minWidth: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public minHeight: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public maxWidth: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public maxHeight: SyntheticCSSMeasurment;

  @bindable(true)
  @bubble()
  public position: string;

  @bindable(true)
  @bubble()
  public display: string;

  @bindable(true)
  @bubble()
  public flex: string;

  @bindable(true)
  @bubble()
  public alignItems: string;

  @bindable(true)
  @bubble()
  public justifyContent: string;

  @bindable(true)
  @bubble()
  public flexFlow: string;

  @bindable(true)
  @bubble()
  public flexWrap: string;

  @bindable(true)
  @bubble()
  public flexDirection: string;

  @bindable(true)
  @bubble()
  public float: string;

  constructor(readonly style: SyntheticCSSStyle) {
    super();
    this.border = new SyntheticCSSBorder();
    this.margin = new SyntheticCSSBox();
    this.padding = new SyntheticCSSBox();
    this.backgrounds = ObservableCollection.create() as ObservableCollection<any>;
    this.boxShadows  = ObservableCollection.create() as ObservableCollection<any>;
    this.filters     = ObservableCollection.create() as ObservableCollection<any>;
    this.fontFamily  = [];
    this.setProperties(style);
  }
  

  public setProperties(style: SyntheticCSSStyle) {
    for (const propertyName of style.getProperties()) {
      this.setProperty(propertyName, style[propertyName]);
    }
  }

  public dispose() {
    // nothing
  }

  public setProperty(name: string, value: any) {

    value = evaluateCSSDeclValue2(value, name);

    const handlers = {
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

      backgroundColor    : ([value]) => this.primaryBackground.color = value,
      backgroundRepeat   : ([value]) => this.primaryBackground.repeat = value,
      backgroundImage    : ([value]) => this.primaryBackground.image = value,
      backgroundPosition : (value) => this.primaryBackground.setPosition(value),
      fontFamily         : (value) => this.fontFamily = flattenDeep<string>(value).map((value) => value),
      opacity            : ([value]) => this.opacity = value,
      mixBlendMode       : ([value]) => this.mixBlendMode = value,
      filter             : (value) => this.filters = ObservableCollection.create(...value) as any,
      background         : (value: any) => {

        // check for background: #F60, #F0F
        if (Array.isArray(value) && Array.isArray(value[0])) {
          for (const background of value) {
            this.addBackground(background);
          }
        } else {
          this.primaryBackground.setProperties(value)
        }
      },
      boxShadow : (value) => {
        if (!Array.isArray(value[0])) value = [value];
        for (const v of value) {
          this.addBoxShadow(v); 
        }
      }
    };

    const handler  = handlers[name];
    if (handler) {
      handler(value);
    } else {

      // set to a blank string to unset the value - null / undefined get ignored
      this[name] = value[0];
    }
  }

  public get primaryBackground() {
    return this.backgrounds.length ? this.backgrounds[0] : this.addBackground();
  }

  public addBackground(params?: any[]) {
    const background = new SyntheticCSSStyleBackground(params);
    this.backgrounds.push(background);
    return background;
  }

  public removeBackground(background: SyntheticCSSStyleBackground) {
    const index = this.backgrounds.indexOf(background);
    if (index !== -1) this.backgrounds.splice(index, 1);
    return background;
  }

  public addBoxShadow(params?: any[]) {
    const boxShadow = new SyntheticCSSStyleBoxShadow(params);
    this.boxShadows.push(boxShadow);
    return boxShadow;
  }


  public addFilter(name: string, params: any[] = []) {
    const filter = evaluateCSSDeclValue2(`${name}(${params.join(" ")})`)[0];
    this.filters.push(filter);
    return filter;
  }

  public renameFilter(filter: SyntheticCSSFilter, newName: string) {
    const newFilter = evaluateCSSDeclValue2(`${newName}(${filter.params.join(" ")})`)[0];
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1, newFilter);
    }
    return filter;
  }

  public removeFilter(filter: SyntheticCSSFilter) {
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
    return filter;
  }

  public removeBoxShadow(boxShadow: SyntheticCSSStyleBoxShadow) {
    const index = this.boxShadows.indexOf(boxShadow);
    if (index !== -1) this.boxShadows.splice(index, 1);
    return boxShadow;
  }

  toStyle() {
    const style = new SyntheticCSSStyle();

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
    ].forEach(([propertyName, styleName, sep]) => {
      const value = this[propertyName];
      const exists = value != null && (!sep || value.length);
      if (exists) {
        style.setProperty(styleName || propertyName, String(sep ? value.join(sep) : value));
      }
    });

    return style;
  }
}