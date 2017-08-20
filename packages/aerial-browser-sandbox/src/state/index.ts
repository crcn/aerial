import { 
  Box, 
  Point,
  Boxed,
  Struct, 
  dsFind,
  weakMemo, 
  shiftBox,
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
  allNodes: {
    [identifier: string]: SyntheticNode
  }
  scrollPosition: Point;
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
  browserStore: DataStore<SyntheticBrowser>;
  windowStore?: DataStore<SyntheticWindow>;
};

export const createSyntheticBrowserStore = (syntheticBrowsers?: SyntheticBrowser[]) => dsIndex(createDataStore(syntheticBrowsers), "$$id");

export const createSyntheticWindow = createStructFactory<SyntheticWindow>(SYNTHETIC_WINDOW, {
  box: DEFAULT_SYNTHETIC_WINDOW_BOX,
  externalResourceUris: [],
  allNodes: {}
});

export const createSyntheticBrowser = createStructFactory<SyntheticBrowser>(SYNTHETIC_BROWSER, {
  windows: []
});

export const createSyntheticBrowserRootState = (syntheticBrowsers?: SyntheticBrowser[]): SyntheticBrowserRootState => {
  return {
    browserStore: createSyntheticBrowserStore(syntheticBrowsers)
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

export const getSyntheticBrowserBox = weakMemo((root: SyntheticBrowserRootState|SyntheticBrowser, item: Partial<Struct & Boxed>) => {
  if (!item) return null;
  if (item.box) return item.box;
  const window = getSyntheticNodeWindow(root, item.$$id);
  return window && shiftBox(window.computedBoxes[item.$$id], window.box);
});

export const getSyntheticBrowserStoreItemByReference = weakMemo((root: SyntheticBrowserRootState|SyntheticBrowser, [type, id]: StructReference) => {
  if (type === SYNTHETIC_TEXT_NODE || type === SYNTHETIC_ELEMENT) {
    return getSyntheticNodeById(root as any, id);
  } else if (type === SYNTHETIC_WINDOW) {
    return getSyntheticWindow(root as any, id);
  }
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


export const getSyntheticBrowsers = weakMemo((root: SyntheticBrowserRootState): SyntheticBrowser[] => root.browserStore.records);

const getIdQuery = weakMemo((id: string) => ({
  $$id: id
}));

export const getSyntheticBrowser = (root: SyntheticBrowserRootState, id: string): SyntheticBrowser => dsFind(root.browserStore, getIdQuery(id));
export const getSyntheticWindow = (root: SyntheticBrowserRootState|SyntheticBrowser, id: string): SyntheticWindow => {
  const filter = (window: SyntheticWindow) => window.$$id === id;
  return (root as SyntheticBrowserRootState).browserStore ? eachSyntheticWindow(root as SyntheticBrowserRootState, filter) : (root as SyntheticBrowser).windows.find(filter);
};

export const updateSyntheticBrowser = <TState extends SyntheticBrowserRootState>(root: TState, browserId: string, properties: Partial<SyntheticBrowser>): TState => {
  const browser = getSyntheticBrowser(root, browserId);
  return {
    ...(root as any),
    browserStore: dsUpdate(root.browserStore, { $$id: browser.$$id }, {
      ...browser,
      ...properties
    })
  };
};

export const updateSyntheticWindow = <TState extends SyntheticBrowserRootState>(root: TState, windowId: string, properties: Partial<SyntheticWindow>): TState => {
  const browser = getSyntheticWindowBrowser(root, windowId);
  const window = getSyntheticWindow(browser, windowId);
  return updateSyntheticBrowser(root, browser.$$id, {
    windows: arrayReplaceItem(browser.windows, window, {
      ...window,
      ...properties
    })
  });
}

export const removeSyntheticWindow = <TState extends SyntheticBrowserRootState>(root: TState, windowId: string): TState => {
  const browser = getSyntheticWindowBrowser(root, windowId);
  return updateSyntheticBrowser(root, browser.$$id, {
    windows: arrayRemoveItem(browser.windows, getSyntheticWindow(browser, windowId))
  });
}

export const getSyntheticWindowBrowser = weakMemo((root: SyntheticBrowserRootState, windowId: string): SyntheticBrowser => {
  for (const browser of getSyntheticBrowsers(root)) {
    for (const window of browser.windows) {
      if (window.$$id === windowId) return browser;
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

export const isSyntheticBrowserItemMovable = (root: SyntheticBrowserRootState, item: Struct) => {
  if (item.$$type === SYNTHETIC_WINDOW) return true;
  if (isSyntheticNodeType(item.$$type) && (item as SyntheticNode).nodeType === SEnvNodeTypes.ELEMENT) {
    const element = item as SyntheticElement;
  }
  return false;
}