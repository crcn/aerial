import { Struct, createStructFactory, Box, getValuesByType, getValueById, updateStructProperty, updateStruct, weakMemo, traverseObject } from "aerial-common2";

export const SYNTHETIC_BROWSER_STORE = "SYNTHETIC_BROWSER_STORE";
export const SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
export const SYNTHETIC_DOCUMENT = "SYNTHETIC_DOCUMENT";
export const SYNTHETIC_TEXT_NODE = "SYNTHETIC_TEXT_NODE";
export const SYNTHETIC_WINDOW = "SYNTHETIC_WINDOW";
export const SYNTHETIC_ELEMENT = "SYNTHETIC_ELEMENT";

export enum DOMNodeTypes {
  
}

const DEFAULT_SYNTHETIC_WINDOW_BOX: Box = {
  left: 0,
  top: 0,

  // small screen size
  right: 800,
  bottom: 600
};

export type SyntheticNode = {
  nodeType: DOMNodeTypes;
  nodeName: string;
} & Struct;

export type SyntheticDocument = {
  title: string;
} & SyntheticNode;

export type SyntheticHTMLElement = {

} & SyntheticNode;

export type SyntheticValueNode = {
  nodeValue: string;
} & SyntheticNode;

export type SyntheticComment = {

} & SyntheticValueNode;

export type SyntheticTextNode = {

} & SyntheticValueNode;

export type SyntheticWindow = {
  mount: HTMLElement;
  location: string;
  document: SyntheticDocument;
  box: Box;
  computedBoxes: {
    [identifier: string]: Box;
  };
  computedStyles: {
    [identifier: string]: CSSStyleDeclaration
  }
} & Struct;

export type SyntheticBrowser = {
  windows: SyntheticWindow[];
} & Struct;

export type SyntheticBrowserStore = {
  browsers: SyntheticBrowser[]
} & Struct;

export const createSyntheticWindow = createStructFactory<SyntheticWindow>(SYNTHETIC_WINDOW, {
  box: DEFAULT_SYNTHETIC_WINDOW_BOX
});

export const createSyntheticBrowser = createStructFactory<SyntheticBrowser>(SYNTHETIC_BROWSER, {
  windows: []
});

export const createSyntheticBrowserStore = createStructFactory<SyntheticBrowserStore>(SYNTHETIC_BROWSER_STORE, {
  browsers: []
});

export const addNewSyntheticBrowser = (root: any) => {
  const store = getSyntheticBrowserStore(root);
  const syntheticBrowser = createSyntheticBrowser();
  return {
    root: updateStruct(root, store, {
      ...store,
      browsers: [...store.browsers, syntheticBrowser]
    }),
    syntheticBrowser
  };
}

export const isSyntheticDOMNode = (value) => value && value.nodeType != null;

export const getSyntheticBrowserStore = (root: any): SyntheticBrowserStore => getValuesByType(root, SYNTHETIC_BROWSER_STORE)[0];

export const getSyntheticBrowsers = weakMemo((root: any): SyntheticBrowser[] => getValuesByType(root, SYNTHETIC_BROWSER));

export const getSyntheticBrowser = (root: any, id: string): SyntheticBrowser => getValueById(root, id);
export const getSyntheticWindow = (root: any, id: string): SyntheticWindow => getValueById(root, id);

export const findSyntheticDOMNodes = weakMemo((root: any, filter: (node: SyntheticNode) => boolean): SyntheticNode[] => {
  const found: SyntheticNode[] = [];
  traverseObject(root, (item: any) => {
    if (isSyntheticDOMNode(item) && filter(item)) {
      found.push(item);
    }
  });
  return found;
});

export const getAllSyntheticDOMNodes = weakMemo((root: any) => findSyntheticDOMNodes(root, () => true));
export const getAllSyntheticDOMNodesAsIdMap = weakMemo((root: any): { [identifier: string]: SyntheticNode } => {
  const allNodes = getAllSyntheticDOMNodes(root);
  const map = {};
  for (const node of allNodes) {
    map[node.$$id] = node;
  }
  return map;
});

export const updateNodeTreeStruct = (nodeStruct: SyntheticNode, node: Node) => [
  
]