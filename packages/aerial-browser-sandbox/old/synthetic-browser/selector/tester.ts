import nwmatcher =  require("nwmatcher");
import { SyntheticWindow } from "../window";
import { SyntheticDocument } from "../document";
import { SyntheticElement } from "../html";
import { getTreeAncestors, getPreviousTreeSiblings } from "aerial-common";
import { SyntheticDOMNode, SyntheticDOMElement, DOMNodeType } from "../markup";

const _testers = {};

export interface ISelectorTester {
  source: string;
  test(node: SyntheticDOMNode);
}

export function getSelectorTester(selectorSource: string, start: SyntheticDOMNode): ISelectorTester {
  if (_testers[selectorSource]) return _testers[selectorSource];

  const syntheticWindow = start.nodeType === DOMNodeType.DOCUMENT ? (start as SyntheticDocument).defaultView : start.ownerDocument.defaultView;

  const selector = selectorSource = selectorSource.replace(/:?:(before|after)/g,"");
  const nw = syntheticWindow.selector;

  return _testers[selectorSource] = {
    source: selectorSource,
    test: (element) => element.nodeType == DOMNodeType.ELEMENT && nw.match(element, selector)
  };
}