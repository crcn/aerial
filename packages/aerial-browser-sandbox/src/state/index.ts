import { Struct, createStructFactory, Box, getValuesByType, getValueById, updateStructProperty, updateStruct } from "aerial-common2";

export const SYNTHETIC_BROWSER_STORE = "SYNTHETIC_BROWSER_STORE";
export const SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
export const SYNTHETIC_DOCUMENT = "SYNTHETIC_DOCUMENT";
export const SYNTHETIC_TEXT_NODE = "SYNTHETIC_TEXT_NODE";
export const SYNTHETIC_WINDOW = "SYNTHETIC_WINDOW";
export const SYNTHETIC_ELEMENT = "SYNTHETIC_ELEMENT";

export enum DOMNodeTypes {
  
}

export type SyntheticNode = {
  nodeType: DOMNodeTypes;
  nodeName: string;
}

export type SyntheticDocument = {

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
  context: Window;
  location: string;
  document: SyntheticDocument;
  box: Box;
} & Struct;

export type SyntheticBrowser = {
  windows: SyntheticWindow[];
} & Struct;

export type SyntheticBrowserStore = {
  browsers: SyntheticBrowser[]
} & Struct;

export const createSyntheticWindow = createStructFactory<SyntheticWindow>(SYNTHETIC_WINDOW, {

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

export const getSyntheticBrowserStore = (root: any): SyntheticBrowserStore => getValuesByType(root, SYNTHETIC_BROWSER_STORE)[0];

export const getSyntheticBrowser = (root: any, id: string): SyntheticBrowser => getValueById(root, id);
export const getSyntheticWindow = (root: any, id: string): SyntheticWindow => getValueById(root, id);