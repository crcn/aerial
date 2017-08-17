import { 
  Box, 
  Boxed,
  Struct, 
  weakMemo, 
  shiftBox,
  updateStruct, 
  getPathById,
  getValueById, 
  getValueByPath,
  traverseObject,
  findParentObject,
  getValuesByType, 
  ExpressionLocation,
  ExpressionPosition,
  createStructFactory, 
  updateStructProperty, 
} from "aerial-common2";

import {
  SEnvNodeTypes
} from "../environment/constants";

export const SYNTHETIC_BROWSER_STORE = "SYNTHETIC_BROWSER_STORE";
export const SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
export const SYNTHETIC_DOCUMENT = "SYNTHETIC_DOCUMENT";
export const SYNTHETIC_TEXT_NODE = "SYNTHETIC_TEXT_NODE";
export const SYNTHETIC_WINDOW = "SYNTHETIC_WINDOW";
export const SYNTHETIC_ELEMENT = "SYNTHETIC_ELEMENT";
export const SYNTHETIC_COMMENT = "SYNTHETIC_COMMENT";


export const DEFAULT_SYNTHETIC_WINDOW_BOX: Box = {
  left: 0,
  top: 0,

  // small screen size
  right: 1366,
  bottom: 768
};

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
} & BasicNode & Struct;

export type SyntheticNode = {
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
  mount: HTMLElement;
  location: string;
  document: SyntheticDocument;
  box: Box;
  computedBoxes: {
    [identifier: string]: Box;
  };
  externalResourceUris: string[],
  computedStyles: {
    [identifier: string]: CSSStyleDeclaration
  }
} & Struct;

export type SyntheticBrowser = {
  windows: SyntheticWindow[];
} & Struct;

export type SyntheticBrowserRootState = {
  browsers: SyntheticBrowser[]
} & Struct;

export const createSyntheticWindow = createStructFactory<SyntheticWindow>(SYNTHETIC_WINDOW, {
  box: DEFAULT_SYNTHETIC_WINDOW_BOX,
  externalResourceUris: []
});

export const createSyntheticBrowser = createStructFactory<SyntheticBrowser>(SYNTHETIC_BROWSER, {
  windows: []
});

export const createSyntheticBrowserRootState = createStructFactory<SyntheticBrowserRootState>(SYNTHETIC_BROWSER_STORE, {
  browsers: []
});

export const addNewSyntheticBrowser = (root: SyntheticBrowserRootState) => {
  const store = getSyntheticBrowserRootState(root);
  const syntheticBrowser = createSyntheticBrowser();
  return {
    root: updateStruct(root, store, {
      ...store,
      browsers: [...store.browsers, syntheticBrowser]
    }),
    syntheticBrowser
  };
}

export const getSyntheticBrowserBox = weakMemo((root: SyntheticBrowserRootState, item: Partial<Struct & Boxed>) => {
  if (!item) return null;
  if (item.box) return item.box;
  const window = getSyntheticNodeWindow(root, item.$$id);
  return window && shiftBox(window.computedBoxes[item.$$id], window.box);
});


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

export const isSyntheticDOMNode = (value) => value && value.constructor === Object && value.nodeType != null;

export const getSyntheticBrowserRootState = (root: SyntheticBrowserRootState): SyntheticBrowserRootState => getValuesByType(root, SYNTHETIC_BROWSER_STORE)[0];

export const getSyntheticBrowsers = weakMemo((root: SyntheticBrowserRootState): SyntheticBrowser[] => getValuesByType(root, SYNTHETIC_BROWSER));

export const getSyntheticBrowser = (root: SyntheticBrowserRootState, id: string): SyntheticBrowser => getValueById(root, id);
export const getSyntheticWindow = (root: SyntheticBrowserRootState, id: string): SyntheticWindow => getValueById(root, id);

export const getSyntheticNodeById = (root: SyntheticBrowserRootState, id: string): SyntheticNode => getValueById(root, id);

export const getSyntheticNodeTextContent = weakMemo((node: SyntheticNode): string => {
  let text = "";
  traverseObject(node, (child) => {
    if (isSyntheticDOMNode(child) && (child as SyntheticNode).nodeType === SEnvNodeTypes.TEXT) {
      text += (child as SyntheticTextNode).nodeValue;
    }
  });
  return text;
});

export const getSyntheticNodeWindow = weakMemo((root: SyntheticBrowserRootState, nodeId: string): SyntheticWindow => findParentObject(root, nodeId, parent => parent.$$type === SYNTHETIC_WINDOW));

export const findSyntheticDOMNodes = weakMemo((root: SyntheticBrowserRootState, filter: (node: SyntheticNode) => boolean): SyntheticNode[] => {
  const found: SyntheticNode[] = [];
  traverseObject(root, (item: any) => {
    if (isSyntheticDOMNode(item) && filter(item)) {
      found.push(item);
    }
  });
  return found;
});

export const getAllSyntheticDOMNodes = weakMemo((root: SyntheticBrowserRootState) => findSyntheticDOMNodes(root, () => true));
export const getAllSyntheticDOMNodesAsIdMap = weakMemo((root: SyntheticBrowserRootState): { [identifier: string]: SyntheticNode } => {
  const allNodes = getAllSyntheticDOMNodes(root);
  const map = {};
  for (const node of allNodes) {
    map[node.$$id] = node;
  }
  return map;
});

export const isSyntheticBrowserItemMovable = (root: SyntheticBrowserRootState, item: Struct) => {
  if (item.$$type === SYNTHETIC_WINDOW) return true;
  if (isSyntheticNodeType(item.$$type) && (item as SyntheticNode).nodeType === SEnvNodeTypes.ELEMENT) {
    const element = item as SyntheticElement;
  }
  return false;
}