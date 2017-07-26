import { DOMNodeType } from "../../dom";
import { Struct, Box, Point, createStructFactory } from "aerial-common2";

/**
 * Types
 */

export const DOM_TEXT_NODE              = "TEXT_NODE";
export const DOM_ELEMENT                = "DOM_ELEMENT";
export const DOM_DOCUMENT               = "DOM_DOCUMENT";
export const SYTNTHETIC_BROWSER_WINDOW  = "SYNTHETIC_BROWSER_WINDOW";
export const SYNTHETIC_BROWSER          = "SYNTHETIC_BROWSER";

/**
 * Shapes
 */

export type SyntheticDOMNode2 = {
  type: DOMNodeType;
  nodeName: string;
  childNodes: SyntheticDOMNode2[];
} & Struct;

export type SyntheticDOMTextNode2 = {
  nodeValue: string;
  nodeName: "#text";
} & SyntheticDOMNode2;

export type SyntheticCSSStyle2 = {

} & Struct;

export type SyntheticDOMElement2 = {
  nodeName: string;
  boundingRect: Box;
  computedStyle: SyntheticCSSStyle2;
} & SyntheticDOMNode2;

export type SyntheticDOMDocument2 = {
  nodeName: "#document";
} & SyntheticDOMNode2;

export type SyntheticBrowserWindow2 = {
  document: SyntheticDOMDocument2;
  location: string;
  title: string;
  computedStyles: SyntheticCSSStyle2[];
} & Struct;

export type SyntheticBrowser2 = {
  windows: SyntheticBrowserWindow2[]
} & Struct;

/**
 * Utilities
 */

export const createSyntheticBrowser2 = createStructFactory<SyntheticBrowser2>(SYNTHETIC_BROWSER, {
  windows: []
});

export const createSyntheticBrowserWindow2 = createStructFactory<SyntheticBrowserWindow2>(SYTNTHETIC_BROWSER_WINDOW, {
  computedStyles: []
});

createSyntheticBrowserWindow2()