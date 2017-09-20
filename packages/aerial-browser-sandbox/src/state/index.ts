import { 
  Bounds, 
  Point,
  Bounded,
  Struct, 
  dsFind,
  weakMemo, 
  shiftBounds,
  dsIndex,
  DataStore,
  dsUpdate,
  dsInsert,
  dsUpdateOne,
  arrayReplaceItem,
  traverseObject,
  createDataStore,
  StructReference,
  arrayRemoveItem,

  ExpressionLocation,
  ExpressionPosition,
  createStructFactory, 
} from "aerial-common2";

import { FileCacheRootState, createFileCacheStore } from "aerial-sandbox2";

import {
  SEnvNodeTypes,
  CSSRuleType,
} from "../environment/constants";

import {
  SEnvCSSStyleSheetInterface,
  SEnvCSSObjectInterface,
  SEnvCSSRuleInterface,
  SEnvWindowInterface,
  SEnvNodeInterface,
  SEnvCSSStyleDeclaration,
} from "../environment";

export const SYNTHETIC_BROWSER_STORE = "SYNTHETIC_BROWSER_STORE";
export const SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
export const SYNTHETIC_DOCUMENT = "SYNTHETIC_DOCUMENT";
export const SYNTHETIC_TEXT_NODE = "SYNTHETIC_TEXT_NODE";
export const SYNTHETIC_WINDOW = "SYNTHETIC_WINDOW";
export const SYNTHETIC_ELEMENT = "SYNTHETIC_ELEMENT";
export const SYNTHETIC_COMMENT = "SYNTHETIC_COMMENT";
export const SYNTHETIC_CSS_STYLE_SHEET = "SYNTHETIC_CSS_STYLE_SHEET";
export const SYNTHETIC_CSS_STYLE_RULE = "SYNTHETIC_CSS_STYLE_RULE";
export const SYNTHETIC_CSS_MEDIA_RULE = "SYNTHETIC_CSS_MEDIA_RULE";
export const SYNTHETIC_CSS_UNKNOWN_RULE = "SYNTHETIC_CSS_UNKNOWN_RULE";
export const SYNTHETIC_CSS_KEYFRAME_RULE = "SYNTHETIC_CSS_KEYFRAME_RULE";
export const SYNTHETIC_CSS_FONT_FACE_RULE = "SYNTHETIC_CSS_FONT_FACE_RULE";
export const SYNTHETIC_CSS_KEYFRAMES_RULE = "SYNTHETIC_CSS_KEYFRAMES_RULE";
export const SYNTHETIC_CSS_STYLE_DECLARATION = "SYNTHETIC_CSS_STYLE_DECLARATION";

/**
 * CSSOM
 */

export type SyntheticCSSStyleSheet = {
  instance: SEnvCSSStyleSheetInterface;
  cssRules: SyntheticCSSRule[];
} & Struct;

export type SyntheticCSSRule = {
  instance: SEnvCSSRuleInterface;
  type: CSSRuleType;
} & Struct;

export type SyntheticCSSStyleRule = {
  instance: SEnvCSSObjectInterface;
  style: SyntheticCSSStyleDeclaration;
} & SyntheticCSSRule;

export type SyntheticCSSGroupingRule = {
  instance: SEnvCSSObjectInterface;
  style: SyntheticCSSStyleDeclaration;
  rules: SyntheticCSSRule[];
} & SyntheticCSSRule;

export type SyntheticCSSMediaRule = {
  instance: SEnvCSSObjectInterface;
  conditionText: string;
} & SyntheticCSSGroupingRule;

export type SyntheticCSSFontFaceRule = {
  instance: SEnvCSSObjectInterface;
  style: SyntheticCSSStyleDeclaration;
} & SyntheticCSSRule;

export type SyntheticCSSKeyframeRule = {
  instance: SEnvCSSObjectInterface;
  keyText: string;
  style: SyntheticCSSStyleDeclaration;
} & SyntheticCSSRule;

export type SyntheticCSSKeyframesRule = {
  instance: SEnvCSSObjectInterface;
} & SyntheticCSSGroupingRule;

export type SyntheticCSSUnknownGroupingRule = {
  params: string;
} & SyntheticCSSGroupingRule;

export type SyntheticCSSStyleDeclaration = {
  instance: SEnvCSSStyleDeclaration;
  alignContent: string | null;
  alignItems: string | null;
  alignmentBaseline: string | null;
  alignSelf: string | null;
  animation: string | null;
  animationDelay: string | null;
  animationDirection: string | null;
  animationDuration: string | null;
  animationFillMode: string | null;
  animationIterationCount: string | null;
  animationName: string | null;
  animationPlayState: string | null;
  animationTimingFunction: string | null;
  backfaceVisibility: string | null;
  background: string | null;
  backgroundAttachment: string | null;
  backgroundClip: string | null;
  backgroundColor: string | null;
  backgroundImage: string | null;
  backgroundOrigin: string | null;
  backgroundPosition: string | null;
  backgroundPositionX: string | null;
  backgroundPositionY: string | null;
  backgroundRepeat: string | null;
  backgroundSize: string | null;
  baselineShift: string | null;
  border: string | null;
  borderBottom: string | null;
  borderBottomColor: string | null;
  borderBottomLeftRadius: string | null;
  borderBottomRightRadius: string | null;
  borderBottomStyle: string | null;
  borderBottomWidth: string | null;
  borderCollapse: string | null;
  borderColor: string | null;
  borderImage: string | null;
  borderImageOutset: string | null;
  borderImageRepeat: string | null;
  borderImageSlice: string | null;
  borderImageSource: string | null;
  borderImageWidth: string | null;
  borderLeft: string | null;
  borderLeftColor: string | null;
  borderLeftStyle: string | null;
  borderLeftWidth: string | null;
  borderRadius: string | null;
  borderRight: string | null;
  borderRightColor: string | null;
  borderRightStyle: string | null;
  borderRightWidth: string | null;
  borderSpacing: string | null;
  borderStyle: string | null;
  borderTop: string | null;
  borderTopColor: string | null;
  borderTopLeftRadius: string | null;
  borderTopRightRadius: string | null;
  borderTopStyle: string | null;
  borderTopWidth: string | null;
  borderWidth: string | null;
  bottom: string | null;
  boxShadow: string | null;
  boxSizing: string | null;
  breakAfter: string | null;
  breakBefore: string | null;
  breakInside: string | null;
  captionSide: string | null;
  clear: string | null;
  clip: string | null;
  clipPath: string | null;
  clipRule: string | null;
  color: string | null;
  colorInterpolationFilters: string | null;
  columnCount: any;
  columnFill: string | null;
  columnGap: any;
  columnRule: string | null;
  columnRuleColor: any;
  columnRuleStyle: string | null;
  columnRuleWidth: any;
  columns: string | null;
  columnSpan: string | null;
  columnWidth: any;
  content: string | null;
  counterIncrement: string | null;
  counterReset: string | null;
  cssFloat: string | null;
  cursor: string | null;
  direction: string | null;
  display: string | null;
  dominantBaseline: string | null;
  emptyCells: string | null;
  enableBackground: string | null;
  fill: string | null;
  fillOpacity: string | null;
  fillRule: string | null;
  filter: string | null;
  flex: string | null;
  flexBasis: string | null;
  flexDirection: string | null;
  flexFlow: string | null;
  flexGrow: string | null;
  flexShrink: string | null;
  flexWrap: string | null;
  floodColor: string | null;
  floodOpacity: string | null;
  font: string | null;
  fontFamily: string | null;
  fontFeatureSettings: string | null;
  fontSize: string | null;
  fontSizeAdjust: string | null;
  fontStretch: string | null;
  fontStyle: string | null;
  fontVariant: string | null;
  fontWeight: string | null;
  glyphOrientationHorizontal: string | null;
  glyphOrientationVertical: string | null;
  height: string | null;
  imeMode: string | null;
  justifyContent: string | null;
  kerning: string | null;
  layoutGrid: string | null;
  layoutGridChar: string | null;
  layoutGridLine: string | null;
  layoutGridMode: string | null;
  layoutGridType: string | null;
  left: string | null;
  letterSpacing: string | null;
  lightingColor: string | null;
  lineBreak: string | null;
  lineHeight: string | null;
  listStyle: string | null;
  listStyleImage: string | null;
  listStylePosition: string | null;
  listStyleType: string | null;
  margin: string | null;
  marginBottom: string | null;
  marginLeft: string | null;
  marginRight: string | null;
  marginTop: string | null;
  marker: string | null;
  markerEnd: string | null;
  markerMid: string | null;
  markerStart: string | null;
  mask: string | null;
  maxHeight: string | null;
  maxWidth: string | null;
  minHeight: string | null;
  minWidth: string | null;
  msContentZoomChaining: string | null;
  msContentZooming: string | null;
  msContentZoomLimit: string | null;
  msContentZoomLimitMax: any;
  msContentZoomLimitMin: any;
  msContentZoomSnap: string | null;
  msContentZoomSnapPoints: string | null;
  msContentZoomSnapType: string | null;
  msFlowFrom: string | null;
  msFlowInto: string | null;
  msFontFeatureSettings: string | null;
  msGridColumn: any;
  msGridColumnAlign: string | null;
  msGridColumns: string | null;
  msGridColumnSpan: any;
  msGridRow: any;
  msGridRowAlign: string | null;
  msGridRows: string | null;
  msGridRowSpan: any;
  msHighContrastAdjust: string | null;
  msHyphenateLimitChars: string | null;
  msHyphenateLimitLines: any;
  msHyphenateLimitZone: any;
  msHyphens: string | null;
  msImeAlign: string | null;
  msOverflowStyle: string | null;
  msScrollChaining: string | null;
  msScrollLimit: string | null;
  msScrollLimitXMax: any;
  msScrollLimitXMin: any;
  msScrollLimitYMax: any;
  msScrollLimitYMin: any;
  msScrollRails: string | null;
  msScrollSnapPointsX: string | null;
  msScrollSnapPointsY: string | null;
  msScrollSnapType: string | null;
  msScrollSnapX: string | null;
  msScrollSnapY: string | null;
  msScrollTranslation: string | null;
  msTextCombineHorizontal: string | null;
  msTextSizeAdjust: any;
  msTouchAction: string | null;
  msTouchSelect: string | null;
  msUserSelect: string | null;
  msWrapFlow: string;
  msWrapMargin: any;
  msWrapThrough: string;
  opacity: string | null;
  order: string | null;
  orphans: string | null;
  outline: string | null;
  outlineColor: string | null;
  outlineOffset: string | null;
  outlineStyle: string | null;
  outlineWidth: string | null;
  overflow: string | null;
  overflowX: string | null;
  overflowY: string | null;
  padding: string | null;
  paddingBottom: string | null;
  paddingLeft: string | null;
  paddingRight: string | null;
  paddingTop: string | null;
  pageBreakAfter: string | null;
  pageBreakBefore: string | null;
  pageBreakInside: string | null;
  parentRule: CSSRule;
  perspective: string | null;
  perspectiveOrigin: string | null;
  pointerEvents: string | null;
  position: string | null;
  quotes: string | null;
  right: string | null;
  rotate: string | null;
  rubyAlign: string | null;
  rubyOverhang: string | null;
  rubyPosition: string | null;
  scale: string | null;
  stopColor: string | null;
  stopOpacity: string | null;
  stroke: string | null;
  strokeDasharray: string | null;
  strokeDashoffset: string | null;
  strokeLinecap: string | null;
  strokeLinejoin: string | null;
  strokeMiterlimit: string | null;
  strokeOpacity: string | null;
  strokeWidth: string | null;
  tableLayout: string | null;
  textAlign: string | null;
  textAlignLast: string | null;
  textAnchor: string | null;
  textDecoration: string | null;
  textIndent: string | null;
  textJustify: string | null;
  textKashida: string | null;
  textKashidaSpace: string | null;
  textOverflow: string | null;
  textShadow: string | null;
  textTransform: string | null;
  textUnderlinePosition: string | null;
  top: string | null;
  touchAction: string | null;
  transform: string | null;
  transformOrigin: string | null;
  transformStyle: string | null;
  transition: string | null;
  transitionDelay: string | null;
  transitionDuration: string | null;
  transitionProperty: string | null;
  transitionTimingFunction: string | null;
  translate: string | null;
  unicodeBidi: string | null;
  verticalAlign: string | null;
  visibility: string | null;
  webkitAlignContent: string | null;
  webkitAlignItems: string | null;
  webkitAlignSelf: string | null;
  webkitAnimation: string | null;
  webkitAnimationDelay: string | null;
  webkitAnimationDirection: string | null;
  webkitAnimationDuration: string | null;
  webkitAnimationFillMode: string | null;
  webkitAnimationIterationCount: string | null;
  webkitAnimationName: string | null;
  webkitAnimationPlayState: string | null;
  webkitAnimationTimingFunction: string | null;
  webkitAppearance: string | null;
  webkitBackfaceVisibility: string | null;
  webkitBackgroundClip: string | null;
  webkitBackgroundOrigin: string | null;
  webkitBackgroundSize: string | null;
  webkitBorderBottomLeftRadius: string | null;
  webkitBorderBottomRightRadius: string | null;
  webkitBorderImage: string | null;
  webkitBorderRadius: string | null;
  webkitBorderTopLeftRadius: string | null;
  webkitBorderTopRightRadius: string | null;
  webkitBoxAlign: string | null;
  webkitBoxDirection: string | null;
  webkitBoxFlex: string | null;
  webkitBoxOrdinalGroup: string | null;
  webkitBoxOrient: string | null;
  webkitBoxPack: string | null;
  webkitBoxSizing: string | null;
  webkitColumnBreakAfter: string | null;
  webkitColumnBreakBefore: string | null;
  webkitColumnBreakInside: string | null;
  webkitColumnCount: any;
  webkitColumnGap: any;
  webkitColumnRule: string | null;
  webkitColumnRuleColor: any;
  webkitColumnRuleStyle: string | null;
  webkitColumnRuleWidth: any;
  webkitColumns: string | null;
  webkitColumnSpan: string | null;
  webkitColumnWidth: any;
  webkitFilter: string | null;
  webkitFlex: string | null;
  webkitFlexBasis: string | null;
  webkitFlexDirection: string | null;
  webkitFlexFlow: string | null;
  webkitFlexGrow: string | null;
  webkitFlexShrink: string | null;
  webkitFlexWrap: string | null;
  webkitJustifyContent: string | null;
  webkitOrder: string | null;
  webkitPerspective: string | null;
  webkitPerspectiveOrigin: string | null;
  webkitTapHighlightColor: string | null;
  webkitTextFillColor: string | null;
  webkitTextSizeAdjust: any;
  webkitTextStroke: string | null;
  webkitTextStrokeColor: string | null;
  webkitTextStrokeWidth: string | null;
  webkitTransform: string | null;
  webkitTransformOrigin: string | null;
  webkitTransformStyle: string | null;
  webkitTransition: string | null;
  webkitTransitionDelay: string | null;
  webkitTransitionDuration: string | null;
  webkitTransitionProperty: string | null;
  webkitTransitionTimingFunction: string | null;
  webkitUserModify: string | null;
  webkitUserSelect: string | null;
  webkitWritingMode: string | null;
  whiteSpace: string | null;
  widows: string | null;
  width: string | null;
  wordBreak: string | null;
  wordSpacing: string | null;
  wordWrap: string | null;
  writingMode: string | null;
  zIndex: string | null;
  zoom: string | null;
  resize: string | null;
  userSelect: string | null;
} & Struct;

/**
 * Basic nodes contain information that all DOM-like structures share
 */

export type BasicNode = {
  nodeType: SEnvNodeTypes;
  nodeName: string;
  namespaceURI?: string;
  childNodes?: ArrayLike<BasicNode>;
};

export type BasicParentNode = {
  childNodes: ArrayLike<BasicNode>;
} & BasicNode;

export type BasicDocument = {
  title: string;
} & BasicParentNode;

export type BasicAttribute = {
  name: string;
  value: string; 
}

export type BasicElement = {
  title: string;
  attributes: ArrayLike<BasicAttribute>;
} & BasicParentNode;

export type BasicValueNode = {
  nodeValue
} & Node;

export type BasicTextNode = BasicValueNode;
export type BasicComment = BasicValueNode;

/**
 * Synthetic nodes contain information about the synthetic DOM environment
 */

export type SyntheticBaseNode = {
  source: ExpressionLocation;
  parentId?: string;
} & BasicNode & Struct;

export type SyntheticNode = {
  instance: SEnvNodeInterface;
  childNodes?: ArrayLike<SyntheticNode>;
} & SyntheticBaseNode;

export type SyntheticParentNode = {
  childNodes: SyntheticNode[];
} & BasicParentNode & SyntheticNode;

export type SyntheticDocument = {
} & SyntheticParentNode & BasicDocument;

export type SyntheticAttribute = {
} & BasicAttribute & SyntheticNode;

export type SyntheticElement = {
  attributes: SyntheticAttribute[];
} & BasicElement & SyntheticParentNode;

export type SyntheticValueNode = {
} & BasicValueNode & SyntheticNode;

export type SyntheticComment = {
  
} & BasicComment & SyntheticValueNode;

export type SyntheticTextNode = {

} & BasicTextNode & SyntheticValueNode;

export const isSyntheticNodeType = (value: string) => {
  return [SYNTHETIC_DOCUMENT, SYNTHETIC_TEXT_NODE, SYNTHETIC_COMMENT, SYNTHETIC_ELEMENT].indexOf(value) !== -1;
}

export type SyntheticWindow = {
  allNodes: {
    [identifier: string]: SyntheticNode
  }
  scrollPosition: Point;
  renderContainer: HTMLElement;
  location: string;
  document: SyntheticDocument;
  bounds: Bounds;
  allComputedBounds: {
    [identifier: string]: Bounds;
  };
  externalResourceUris: string[],
  allComputedStyles: {
    [identifier: string]: CSSStyleDeclaration
  }
} & Struct;

export type SyntheticBrowser = {
  windows: SyntheticWindow[];
} & Struct;

export type SyntheticBrowserRootState = {
  browserStore: DataStore<SyntheticBrowser>;
  windowStore?: DataStore<SyntheticWindow>;
} & FileCacheRootState;

export const createSyntheticBrowserStore = (syntheticBrowsers?: SyntheticBrowser[]) => dsIndex(createDataStore(syntheticBrowsers), "$id");

export const createSyntheticWindow = createStructFactory<SyntheticWindow>(SYNTHETIC_WINDOW, {
  externalResourceUris: [],
  allNodes: {}
});

export const createSyntheticBrowser = createStructFactory<SyntheticBrowser>(SYNTHETIC_BROWSER, {
  windows: []
});

export const createSyntheticBrowserRootState = (syntheticBrowsers?: SyntheticBrowser[]): SyntheticBrowserRootState => {
  return {
    browserStore: createSyntheticBrowserStore(syntheticBrowsers),
    fileCacheStore: createFileCacheStore(),
  };
}

export const addSyntheticBrowser = <TState extends SyntheticBrowserRootState>(root: TState, syntheticBrowser: SyntheticBrowser = createSyntheticBrowser()): TState => {
  const store = root.browserStore;
  return {
    ...(root as any),
    browserStore: dsInsert(root.browserStore, syntheticBrowser)
  };
};

export const addSyntheticWindow = <TState extends SyntheticBrowserRootState>(root: TState, syntheticBrowserId: string, syntheticWindow: SyntheticWindow): TState => {
  const store = root.browserStore;
  const idQuery = getIdQuery(syntheticBrowserId);
  const { windows } = dsFind(store, idQuery);
  return {
    ...(root as any),
    browserStore: dsUpdateOne(store, idQuery, {
      windows: [...windows, syntheticWindow]
    })
  };
}

export const getSyntheticBrowserItemBounds = weakMemo((root: SyntheticBrowserRootState|SyntheticBrowser, item: Partial<Struct & Bounded>) => {
  if (!item) return null;
  if (item.bounds) return item.bounds;
  const window = getSyntheticNodeWindow(root, item.$id);
  return window && shiftBounds(window.allComputedBounds[item.$id], window.bounds);
});

export const getSyntheticBrowserStoreItemByReference = weakMemo((root: SyntheticBrowserRootState|SyntheticBrowser, [type, id]: StructReference) => {
  if (type === SYNTHETIC_TEXT_NODE || type === SYNTHETIC_ELEMENT) {
    return getSyntheticNodeById(root as any, id);
  } else if (type === SYNTHETIC_WINDOW) {
    return getSyntheticWindow(root as any, id);
  }
});

export const createSyntheticCSSStyleSheet = createStructFactory<SyntheticCSSStyleSheet>(SYNTHETIC_CSS_STYLE_SHEET);

export const createSyntheticCSSStyleRule = createStructFactory<SyntheticCSSStyleRule>(SYNTHETIC_CSS_STYLE_RULE, {
  type: CSSRuleType.STYLE_RULE
});

export const createSyntheticCSSMediaRule = createStructFactory<SyntheticCSSMediaRule>(SYNTHETIC_CSS_MEDIA_RULE, {
  type: CSSRuleType.MEDIA_RULE
});

export const createSyntheticCSSFontFaceRule = createStructFactory<SyntheticCSSFontFaceRule>(SYNTHETIC_CSS_FONT_FACE_RULE, {
  type: CSSRuleType.FONT_FACE_RULE
});

export const createSyntheticCSSKeyframeRule = createStructFactory<SyntheticCSSStyleRule>(SYNTHETIC_CSS_KEYFRAME_RULE, {
  type: CSSRuleType.KEYFRAME_RULE
});

export const createSyntheticCSSKeyframesRule = createStructFactory<SyntheticCSSKeyframesRule>(SYNTHETIC_CSS_KEYFRAMES_RULE, {
  type: CSSRuleType.KEYFRAMES_RULE
});

export const createSyntheticCSSUnknownGroupingRule = createStructFactory<SyntheticCSSUnknownGroupingRule>(SYNTHETIC_CSS_UNKNOWN_RULE, {
  type: CSSRuleType.UNKNOWN_RULE
});

export const createSyntheticCSSStyleDeclaration = createStructFactory<SyntheticCSSStyleDeclaration>(SYNTHETIC_CSS_STYLE_DECLARATION);

export const createSyntheticDocument = createStructFactory<SyntheticDocument>(SYNTHETIC_DOCUMENT, {
  nodeName: "#document",
  nodeType: SEnvNodeTypes.DOCUMENT
});
export const createSyntheticElement  = createStructFactory<SyntheticElement>(SYNTHETIC_ELEMENT, {
  nodeType: SEnvNodeTypes.ELEMENT
});
export const createSyntheticTextNode = createStructFactory<SyntheticTextNode>(SYNTHETIC_TEXT_NODE, {
  nodeName: "#text",
  nodeType: SEnvNodeTypes.TEXT
});
export const createSyntheticComment  = createStructFactory<SyntheticComment>(SYNTHETIC_COMMENT, {
  nodeName: "#comment",
  nodeType: SEnvNodeTypes.COMMENT
});

// TODO - move all utils here to utils folder

export const isSyntheticDOMNode = (value) => value && value.constructor === Object && value.nodeType != null;

export const getSyntheticBrowsers = weakMemo((root: SyntheticBrowserRootState): SyntheticBrowser[] => root.browserStore.records);

const getIdQuery = weakMemo((id: string) => ({
  $id: id
}));

export const getSyntheticBrowser = (root: SyntheticBrowserRootState, id: string): SyntheticBrowser => dsFind(root.browserStore, getIdQuery(id));
export const getSyntheticWindow = (root: SyntheticBrowserRootState|SyntheticBrowser, id: string): SyntheticWindow => {
  const filter = (window: SyntheticWindow) => window.$id === id;
  return (root as SyntheticBrowserRootState).browserStore ? eachSyntheticWindow(root as SyntheticBrowserRootState, filter) : (root as SyntheticBrowser).windows.find(filter);
};

export const getSyntheticBrowserBounds = (browser: SyntheticBrowser) => browser.windows.map(window => window.bounds).reduce((a, b) => ({
    left: Math.min(a.left, b.left),
    top: Math.min(a.top, b.top),
    right: Math.max(a.right, b.right),
    bottom: Math.max(a.bottom, b.bottom)
  }), { left: 0, top: 0, right: 0, bottom: 0 });

export const updateSyntheticBrowser = <TState extends SyntheticBrowserRootState>(root: TState, browserId: string, properties: Partial<SyntheticBrowser>): TState => {
  const browser = getSyntheticBrowser(root, browserId);
  return {
    ...(root as any),
    browserStore: dsUpdate(root.browserStore, { $id: browser.$id }, {
      ...browser,
      ...properties
    })
  };
};

export const updateSyntheticWindow = <TState extends SyntheticBrowserRootState>(root: TState, windowId: string, properties: Partial<SyntheticWindow>): TState => {
  const browser = getSyntheticWindowBrowser(root, windowId);
  const window = getSyntheticWindow(browser, windowId);
  return updateSyntheticBrowser(root, browser.$id, {
    windows: arrayReplaceItem(browser.windows, window, {
      ...window,
      ...properties
    })
  });
}

export const getSyntheticNodeAncestors = weakMemo((node: SyntheticNode, window: SyntheticWindow) => {
  let current = window.allNodes[node.parentId];
  const ancestors: SyntheticNode[] = [];
  while(current) {
    ancestors.push(current);
    current = window.allNodes[current.parentId];
  }
  return ancestors;
});


export const getSyntheticParentNode = (node: SyntheticNode, window: SyntheticWindow) => window.allNodes[node.parentId];

export const removeSyntheticWindow = <TState extends SyntheticBrowserRootState>(root: TState, windowId: string): TState => {
  const browser = getSyntheticWindowBrowser(root, windowId);
  return updateSyntheticBrowser(root, browser.$id, {
    windows: arrayRemoveItem(browser.windows, getSyntheticWindow(browser, windowId))
  });
}

export const getSyntheticWindowBrowser = weakMemo((root: SyntheticBrowserRootState, windowId: string): SyntheticBrowser => {
  for (const browser of getSyntheticBrowsers(root)) {
    for (const window of browser.windows) {
      if (window.$id === windowId) return browser;
    }
  }
  return null;
});

export function getSyntheticNodeById(root: SyntheticBrowserRootState, id: string);
export function getSyntheticNodeById(root: SyntheticBrowser, id: string);
export function getSyntheticNodeById (root: any, id: string): SyntheticNode {
  return getSyntheticNodeWindow(root, id).allNodes[id];
};

export const getSyntheticNodeTextContent = weakMemo((node: SyntheticNode): string => {
  let text = "";
  traverseObject(node, (child) => {
    if (isSyntheticDOMNode(child) && (child as SyntheticNode).nodeType === SEnvNodeTypes.TEXT) {
      text += (child as SyntheticTextNode).nodeValue;
    }
  });
  return text;
});

export const eachSyntheticWindow = weakMemo(({ browserStore }: SyntheticBrowserRootState, each: (syntheticWindow: SyntheticWindow) => void|boolean): SyntheticWindow => {
  for (const syntheticBrowser of browserStore.records) {
    for (const window of syntheticBrowser.windows) {
      if (each(window) === true) return window;
    }
  }
  return null;
});

export const getSyntheticNodeWindow = weakMemo((root: SyntheticBrowserRootState|SyntheticBrowser, nodeId: string): SyntheticWindow => {
  const filter = (window: SyntheticWindow) => syntheticWindowContainsNode(window, nodeId);
  return (root as SyntheticBrowserRootState).browserStore ? eachSyntheticWindow(root as SyntheticBrowserRootState, filter) : (root as SyntheticBrowser).windows.find(filter);
});

export const syntheticWindowContainsNode = weakMemo((window: SyntheticWindow, nodeId: string): boolean => {
  return Boolean(window.allNodes[nodeId]);
});

export const syntheticNodeIsRelative = weakMemo((window: SyntheticWindow, nodeId: string, refNodeId: string): boolean => {
  const node = window.allNodes[nodeId];
  const refNode = window.allNodes[refNodeId];
  if (!node || !refNode) {
    return false;
  }
  const nodeAncestors = getSyntheticNodeAncestors(node, window);
  const refNodeAncestors = getSyntheticNodeAncestors(refNode, window);
  return refNodeAncestors.indexOf(node) !== -1 || nodeAncestors.indexOf(refNode) !== -1;
});

export const isSyntheticBrowserItemMovable = (root: SyntheticBrowserRootState, item: Struct) => {
  if (item.$type === SYNTHETIC_WINDOW) return true;
  if (isSyntheticNodeType(item.$type) && (item as SyntheticNode).nodeType === SEnvNodeTypes.ELEMENT) {
    const element = item as SyntheticElement;
  }
  return false;
}