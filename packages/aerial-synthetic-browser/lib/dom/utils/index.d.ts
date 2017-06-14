import { Observable } from "aerial-common";
import { IDOMEventEmitter } from "../events";
import { SyntheticDOMElement, SyntheticDOMContainer } from "../markup";
export declare const bindDOMEventMethods: (eventTypes: string[], target: Observable & IDOMEventEmitter) => void;
export declare const bindDOMNodeEventMethods: (target: Observable & IDOMEventEmitter, ...additional: string[]) => void;
export declare const getNodePath: (element: SyntheticDOMElement) => number[];
export declare const getNodeByPath: (root: SyntheticDOMContainer, path: number[]) => SyntheticDOMContainer;
