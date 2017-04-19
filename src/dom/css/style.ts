import sift = require("sift");
import { SyntheticCSSObject } from "./base";
import { kebabCase, camelCase } from "lodash";
import { SyntheticDOMNode } from "@tandem/synthetic-browser/dom";
import { CallbackDispatcher } from "@tandem/mesh";
import { SyntheticCSSElementStyleRuleMutationTypes } from "./style-rule";
import { ISerializable, serializable, diffArray, ITreeWalker, PropertyMutation, serialize, deserialize } from "@tandem/common";
import { IContentEdit , ISyntheticObject, generateSyntheticUID, IEditable, BaseContentEdit } from "@tandem/sandbox";

export interface ISerializedSyntheticCSSStyle extends SyntheticCSSStyle { }

export const isValidCSSDeclarationProperty = sift({ $and: [ { $ne: /^[\$_]/ }, {$ne: "uid" }, { $ne: /^\d+$/ }] });

// https://www.w3.org/TR/CSS21/propidx.html
export const INHERITED_CSS_STYLE_PROPERTIES = [
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
  "textDecoration", // not documented as inherited, but it is under certain conditions.
  "textTransform",
  "visibility",
  "voiceFamily",
  "volume",
  "whiteSpace",
  "widows",
  "wordSpacing"
]

export function isInheritedCSSStyleProperty(name: string) {
  return INHERITED_CSS_STYLE_PROPERTIES.indexOf(name) !== -1;
}

@serializable("SyntheticCSSStyle", {
  serialize(style: SyntheticCSSStyle) {
    const props = [];
    for (let i = 0, n = style.length; i < n; i++) {
      props.push(style[i], style[style[i]]);
    }
    return props;
  },
  deserialize(props) {
    const style = new SyntheticCSSStyle();
    
    for (let i = 0, n = props.length; i < n; i += 2) { 
      style[props[i]] = props[i + 1];
    }
    style.$updatePropertyIndices();
    return style;
  }
})
export class SyntheticCSSStyle implements ISyntheticObject {

  public $uid: any;
  public $source: any = null;
  public $parentRule: SyntheticCSSObject;
  public $length;

  public alignContent: string | null;
  public alignItems: string | null;
  public alignSelf: string | null;
  public alignmentBaseline: string | null;
  public animation: string | null;
  public animationDelay: string | null;
  public animationDirection: string | null;
  public animationDuration: string | null;
  public animationFillMode: string | null;
  public animationIterationCount: string | null;
  public animationName: string | null;
  public animationPlayState: string | null;
  public animationTimingFunction: string | null;
  public backfaceVisibility: string | null;
  public background: string | null;
  public backgroundAttachment: string | null;
  public mixBlendMode: string | null;
  public backgroundClip: string | null;
  public backgroundColor: string | null;
  public backgroundImage: string | null;
  public backgroundOrigin: string | null;
  public backgroundPosition: string | null;
  public backgroundPositionX: string | null;
  public backgroundPositionY: string | null;
  public backgroundRepeat: string | null;
  public backgroundSize: string | null;
  public baselineShift: string | null;
  public border: string | null;
  public borderBottom: string | null;
  public borderBottomColor: string | null;
  public borderBottomLeftRadius: string | null;
  public borderBottomRightRadius: string | null;
  public borderBottomStyle: string | null;
  public borderBottomWidth: string | null;
  public borderCollapse: string | null;
  public borderColor: string | null;
  public borderImage: string | null;
  public borderImageOutset: string | null;
  public borderImageRepeat: string | null;
  public borderImageSlice: string | null;
  public borderImageSource: string | null;
  public borderImageWidth: string | null;
  public borderLeft: string | null;
  public borderLeftColor: string | null;
  public borderLeftStyle: string | null;
  public borderLeftWidth: string | null;
  public borderRadius: string | null;
  public borderRight: string | null;
  public borderRightColor: string | null;
  public borderRightStyle: string | null;
  public borderRightWidth: string | null;
  public borderSpacing: string | null;
  public borderStyle: string | null;
  public borderTop: string | null;
  public borderTopColor: string | null;
  public borderTopLeftRadius: string | null;
  public borderTopRightRadius: string | null;
  public borderTopStyle: string | null;
  public borderTopWidth: string | null;
  public borderWidth: string | null;
  public bottom: string | null;
  public boxShadow: string | null;
  public boxSizing: string | null;
  public breakAfter: string | null;
  public breakBefore: string | null;
  public breakInside: string | null;
  public captionSide: string | null;
  public clear: string | null;
  public clip: string | null;
  public clipPath: string | null;
  public clipRule: string | null;
  public color: string | null;
  public colorInterpolationFilters: string | null;
  public columnCount: any;
  public columnFill: string | null;
  public columnGap: any;
  public columnRule: string | null;
  public columnRuleColor: any;
  public columnRuleStyle: string | null;
  public columnRuleWidth: any;
  public columnSpan: string | null;
  public columnWidth: any;
  public columns: string | null;
  public content: string | null;
  public counterIncrement: string | null;
  public counterReset: string | null;
  public cssFloat: string | null;
  public cursor: string | null;
  public direction: string | null;
  public display: string | null;
  public dominantBaseline: string | null;
  public emptyCells: string | null;
  public enableBackground: string | null;
  public fill: string | null;
  public fillOpacity: string | null;
  public fillRule: string | null;
  public filter: string | null;
  public flex: string | null;
  public flexBasis: string | null;
  public flexDirection: string | null;
  public flexFlow: string | null;
  public flexGrow: string | null;
  public flexShrink: string | null;
  public flexWrap: string | null;
  public floodColor: string | null;
  public floodOpacity: string | null;
  public font: string | null;
  public fontFamily: string | null;
  public fontFeatureSettings: string | null;
  public fontSize: string | null;
  public fontSizeAdjust: string | null;
  public fontStretch: string | null;
  public fontStyle: string | null;
  public fontVariant: string | null;
  public fontWeight: string | null;
  public glyphOrientationHorizontal: string | null;
  public glyphOrientationVertical: string | null;
  public height: string | null;
  public imeMode: string | null;
  public justifyContent: string | null;
  public kerning: string | null;
  public left: string | null;
  public letterSpacing: string | null;
  public lightingColor: string | null;
  public lineHeight: string | null;
  public listStyle: string | null;
  public listStyleImage: string | null;
  public listStylePosition: string | null;
  public listStyleType: string | null;
  public margin: string | null;
  public marginBottom: string | null;
  public marginLeft: string | null;
  public marginRight: string | null;
  public marginTop: string | null;
  public marker: string | null;
  public markerEnd: string | null;
  public markerMid: string | null;
  public markerStart: string | null;
  public mask: string | null;
  public maxHeight: string | null;
  public maxWidth: string | null;
  public minHeight: string | null;
  public minWidth: string | null;
  public msContentZoomChaining: string | null;
  public msContentZoomLimit: string | null;
  public msContentZoomLimitMax: any;
  public msContentZoomLimitMin: any;
  public msContentZoomSnap: string | null;
  public msContentZoomSnapPoints: string | null;
  public msContentZoomSnapType: string | null;
  public msContentZooming: string | null;
  public msFlowFrom: string | null;
  public msFlowInto: string | null;
  public msFontFeatureSettings: string | null;
  public msGridColumn: any;
  public msGridColumnAlign: string | null;
  public msGridColumnSpan: any;
  public msGridColumns: string | null;
  public msGridRow: any;
  public msGridRowAlign: string | null;
  public msGridRowSpan: any;
  public msGridRows: string | null;
  public msHighContrastAdjust: string | null;
  public msHyphenateLimitChars: string | null;
  public msHyphenateLimitLines: any;
  public msHyphenateLimitZone: any;
  public msHyphens: string | null;
  public msImeAlign: string | null;
  public msOverflowStyle: string | null;
  public msScrollChaining: string | null;
  public msScrollLimit: string | null;
  public msScrollLimitXMax: any;
  public msScrollLimitXMin: any;
  public msScrollLimitYMax: any;
  public msScrollLimitYMin: any;
  public msScrollRails: string | null;
  public msScrollSnapPointsX: string | null;
  public msScrollSnapPointsY: string | null;
  public msScrollSnapType: string | null;
  public msScrollSnapX: string | null;
  public msScrollSnapY: string | null;
  public msScrollTranslation: string | null;
  public msTextCombineHorizontal: string | null;
  public msTextSizeAdjust: any;
  public msTouchAction: string | null;
  public msTouchSelect: string | null;
  public msUserSelect: string | null;
  public msWrapFlow: string;
  public msWrapMargin: any;
  public msWrapThrough: string;
  public opacity: string | null;
  public order: string | null;
  public orphans: string | null;
  public outline: string | null;
  public outlineColor: string | null;
  public outlineStyle: string | null;
  public outlineWidth: string | null;
  public overflow: string | null;
  public overflowX: string | null;
  public overflowY: string | null;
  public padding: string | null;
  public paddingBottom: string | null;
  public paddingLeft: string | null;
  public paddingRight: string | null;
  public paddingTop: string | null;
  public pageBreakAfter: string | null;
  public pageBreakBefore: string | null;
  public pageBreakInside: string | null;
  public perspective: string | null;
  public perspectiveOrigin: string | null;
  public pointerEvents: string | null;
  public position: string | null;
  public quotes: string | null;
  public right: string | null;
  public rubyAlign: string | null;
  public rubyOverhang: string | null;
  public rubyPosition: string | null;
  public stopColor: string | null;
  public stopOpacity: string | null;
  public stroke: string | null;
  public strokeDasharray: string | null;
  public strokeDashoffset: string | null;
  public strokeLinecap: string | null;
  public strokeLinejoin: string | null;
  public strokeMiterlimit: string | null;
  public strokeOpacity: string | null;
  public strokeWidth: string | null;
  public tableLayout: string | null;
  public textAlign: string | null;
  public textAlignLast: string | null;
  public textAnchor: string | null;
  public textDecoration: string | null;
  public textIndent: string | null;
  public textJustify: string | null;
  public textKashida: string | null;
  public textKashidaSpace: string | null;
  public textOverflow: string | null;
  public textShadow: string | null;
  public textTransform: string | null;
  public textUnderlinePosition: string | null;
  public top: string | null;
  public touchAction: string | null;
  public transform: string | null;
  public transformOrigin: string | null;
  public transformStyle: string | null;
  public transition: string | null;
  public transitionDelay: string | null;
  public transitionDuration: string | null;
  public transitionProperty: string | null;
  public transitionTimingFunction: string | null;
  public unicodeBidi: string | null;
  public verticalAlign: string | null;
  public visibility: string | null;
  public webkitAlignContent: string | null;
  public webkitAlignItems: string | null;
  public webkitAlignSelf: string | null;
  public webkitAnimation: string | null;
  public webkitAnimationDelay: string | null;
  public webkitAnimationDirection: string | null;
  public webkitAnimationDuration: string | null;
  public webkitAnimationFillMode: string | null;
  public webkitAnimationIterationCount: string | null;
  public webkitAnimationName: string | null;
  public webkitAnimationPlayState: string | null;
  public webkitAnimationTimingFunction: string | null;
  public webkitAppearance: string | null;
  public webkitBackfaceVisibility: string | null;
  public webkitBackgroundClip: string | null;
  public webkitBackgroundOrigin: string | null;
  public webkitBackgroundSize: string | null;
  public webkitBorderBottomLeftRadius: string | null;
  public webkitBorderBottomRightRadius: string | null;
  public webkitBorderImage: string | null;
  public webkitBorderRadius: string | null;
  public webkitBorderTopLeftRadius: string | null;
  public webkitBorderTopRightRadius: string | null;
  public webkitBoxAlign: string | null;
  public webkitBoxDirection: string | null;
  public webkitBoxFlex: string | null;
  public webkitBoxOrdinalGroup: string | null;
  public webkitBoxOrient: string | null;
  public webkitBoxPack: string | null;
  public webkitBoxSizing: string | null;
  public webkitColumnBreakAfter: string | null;
  public webkitColumnBreakBefore: string | null;
  public webkitColumnBreakInside: string | null;
  public webkitColumnCount: any;
  public webkitColumnGap: any;
  public webkitColumnRule: string | null;
  public webkitColumnRuleColor: any;
  public webkitColumnRuleStyle: string | null;
  public webkitColumnRuleWidth: any;
  public webkitColumnSpan: string | null;
  public webkitColumnWidth: any;
  public webkitColumns: string | null;
  public webkitFilter: string | null;
  public webkitFlex: string | null;
  public webkitFlexBasis: string | null;
  public webkitFlexDirection: string | null;
  public webkitFlexFlow: string | null;
  public webkitFlexGrow: string | null;
  public webkitFlexShrink: string | null;
  public webkitFlexWrap: string | null;
  public webkitJustifyContent: string | null;
  public webkitOrder: string | null;
  public webkitPerspective: string | null;
  public webkitPerspectiveOrigin: string | null;
  public webkitTapHighlightColor: string | null;
  public webkitTextFillColor: string | null;
  public webkitTextSizeAdjust: any;
  public webkitTransform: string | null;
  public webkitTransformOrigin: string | null;
  public webkitTransformStyle: string | null;
  public webkitTransition: string | null;
  public webkitTransitionDelay: string | null;
  public webkitTransitionDuration: string | null;
  public webkitTransitionProperty: string | null;
  public webkitTransitionTimingFunction: string | null;
  public webkitUserModify: string | null;
  public webkitUserSelect: string | null;
  public webkitWritingMode: string | null;
  public whiteSpace: string | null;
  public widows: string | null;
  public width: string | null;
  public wordBreak: string | null;
  public wordSpacing: string | null;
  public wordWrap: string | null;
  public writingMode: string | null;
  public zIndex: string | null;
  public zoom: string | null;

  constructor() {
    this.$uid = generateSyntheticUID();
  }

  clone() {
    return deserialize(serialize(this), null);
  }
  
  get length() {
    return this.$length || 0;
  }

  item(index) {
    return this[index];
  }

  [Symbol.iterator] = async function() {
    for (let i = 0, n = this.length || 0; i < n; i++) {
      await this[i];
    }
  }

  getProperties() {
    const props = [];
    for (let i = 0, n = this.length || 0; i < n; i++) {
      props.push(this[i]);
    }
    return props;
  }

  get uid(): any {
    return this.$uid;
  }

  getPropertyIndex(name: string) {
    return this.getProperties().indexOf(name);
  }

  removeProperty(name: string, notifyOwnerNode?: boolean) {
    this.setProperty(name, undefined, undefined, undefined, notifyOwnerNode);
  }

  getPropertyValue(name: string) {
    const value = this[name];
    return value && value.split(/\s*\!important/)[0];
  }

  getPropertyPriority(name: string) {
    const value = this[name];
    return value && value.indexOf("!important") !== -1 ? "important" : "";
  }

  setProperty(name: string, newValue: string, priority?: string, oldName?: string, notifyOwnerNode: boolean = true) {

    if (!isValidCSSDeclarationProperty(name)) return false;

    // fix in case they"re kebab case
    name    = camelCase(name);
    oldName = oldName != null ? camelCase(oldName) : oldName;

    let index = oldName ? this.getPropertyIndex(oldName) : this.getPropertyIndex(name);

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

    if (notifyOwnerNode !== true) return;

    // I"m not a fan of sending notifications from another object like this -- I"d typically make this
    // object an observable, and notify changes from here. However, since this particular class is used so often, sending
    // notifications from here would be put a notable bottleneck on the app. So, instead we"re notifying the owner of this node (typically the
    // root document). Less ideal, but achieves the same result of notifying the system of any changes to the synthetic document.
    const ownerNode = this.$parentRule && this.$parentRule.ownerNode;

    if (ownerNode) {
      ownerNode.notify(new PropertyMutation(SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION, this.$parentRule, name, newValue, undefined, oldName).toEvent(true));
    }
  }

  public $updatePropertyIndices() {

    const model = {};

    for (let i = 0; i < this.length; i++) {
      const key = this[i];
      const value = this[key];

      if (value != null) {
        model[key + ""] = value;
      }

      // reset for now
      this[i] = undefined;
    }

    for (const key in this) {
      if (!this.hasOwnProperty(key) || !isValidCSSDeclarationProperty(key)) continue;
      if (this[key] == null) continue;
      model[key + ""] = this[key];
    }

    let i = 0;
    for (const key in model) {
      this[i++] = key;
    }

    this.$length = Object.keys(model).length;
  }

  equalTo(declaration: SyntheticCSSStyle) {
    function compare(a, b) {
      for (const key in a) {
        if (!isValidCSSDeclarationProperty(key)) continue;
        if (a[key] !== b[key]) {
          return false;
        }
      }
      return true;
    }
    return compare(this, declaration) && compare(declaration, this);
  }

  get parentRule() {
    return this.$parentRule;
  }

  get cssText() {
    const buffer = [];

    for (let i = 0, n = this.length; i < n; i++) {
      const key = this[i];
      const value = this[key];
      if (value) {
        buffer.push("\t", kebabCase(key), ": ", value, ";\n");
      }
    }

    return buffer.join("");
  }

  set cssText(value: string) {
    value.split(";").forEach((decl) => {
      const [key, value] = decl.split(":");
      this.setProperty(key, value);
    });
  }

  toString() {
    return this.cssText;
  }

  clearAll() {
    for (const key of this.getProperties()) {
      this[key] = undefined;
    }
    this.$updatePropertyIndices();
  }

  static fromString(source: string) {
    const decl = new SyntheticCSSStyle();
    const items = source.split(";");
    for (let i = 0, n = items.length; i < n; i++) {
      const expr = items[i];
      const [name, value] = expr.split(":");
      if (!name || !value) continue;
      decl[camelCase(name.trim())] = value.trim();
    }
    decl.$updatePropertyIndices();
    return decl;
  }

  static fromObject(declaration: any): SyntheticCSSStyle {
    const obj = new SyntheticCSSStyle();
    if (declaration.length) {
      for (let i = 0, n = declaration.length; i < n; i++) {
        const key = declaration[i];
        obj[key + ""] = declaration[key];
      }
      obj.$updatePropertyIndices();
    } else {
      Object.assign(obj, declaration);
      obj.$updatePropertyIndices();
    }
    return obj;
  }

  toObject() {
    const obj = {};
    for (let i = 0, n = this.length; i < n; i++) {
      const key = this[i];
      if (this[key] == null) continue;
      obj[key + ""] = this[key];
    }
    return obj;
  }

  visitWalker(walker: ITreeWalker) { }
}
