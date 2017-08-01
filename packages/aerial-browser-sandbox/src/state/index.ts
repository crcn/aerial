import { Struct } from "aerial-common2";
import { SyntheticEnvWindow } from "../environment";

export enum DOMNodeTypes = {
  
}

export type SyntheticNode = {
  nodeType: DOMNodeTypes;
  nodeName: string;
}

export type SyntheticDocument = {

} & SyntheticDOMNode;

export type SyntheticHTMLElement = {

} & SyntheticDOMNode;

export type SyntheticValueNode = {
  nodeValue: string;
} & SyntheticDOMNode;

export type SyntheticComment = {

} & SyntheticValueNode;

export type SyntheticTextNode = {

} & SyntheticValueNode;

export type SyntheticWindow = {
  context: SyntheticEnvWindow;
  document: SyntheticDocument;
} & Struct;

export type SyntheticBrowser = {
  windows: SyntheticWindow[];
} & Struct;

export type SyntheticBrowserStore = {
  syntheticBrowsers: SyntheticBrowser[]
} & Struct;

