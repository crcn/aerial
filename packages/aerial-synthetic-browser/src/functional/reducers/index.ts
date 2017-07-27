import { Mutation } from "aerial-common";

import { 
  update, 
  updateIn, 
  BaseEvent, 
  updateStructProperty, 
  getValueById, 
  deleteValueById 
} from "aerial-common2";

import { 
  DOM_DOCUMENT,
  DOM_ELEMENT,
  DOM_TEXT_NODE,
  DOM_COMMENT,
  getSyntheticBrowser,
  SyntheticBrowser2, 
  SyntheticDOMElement2,
  SyntheticDOMDocument2,
  SyntheticDOMTextNode2,
  SyntheticDOMValueNode2,
  getSyntheticBrowserWindow,
  createSyntheticBrowserWindow2,
} from "../state";

import { 
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMElement,
  SyntheticDOMValueNode,
} from "../../dom";

import { 
  OPEN_SYNTHETIC_WINDOW_REQUESTED, 
  OpenSyntheticWindowRequested, 
  CLOSE_SYNTHETIC_WINDOW_REQUESTED,
  CloseSyntheticWindowRequested,
  LEGACY_SYNTHETIC_DOM_CHANGED,
  LegacySyntheticDOMChanged
} from "../messages";

export const syntheticBrowserReducer = (root: any, event: BaseEvent) => {

  switch(event.type) {
    case OPEN_SYNTHETIC_WINDOW_REQUESTED: {
      const { location, syntheticBrowserId } = event as OpenSyntheticWindowRequested;
      const browser = getSyntheticBrowser(root, syntheticBrowserId);
      return updateStructProperty(root, browser, "windows", browser.windows.concat(createSyntheticBrowserWindow2({
        location
      })));
    }

    case CLOSE_SYNTHETIC_WINDOW_REQUESTED: {
      const { syntheticWindowId } = event as CloseSyntheticWindowRequested;
      return deleteValueById(root, syntheticWindowId);
    }

    case LEGACY_SYNTHETIC_DOM_CHANGED: {
      return updateDOMFromLegacyMutation(root, event as LegacySyntheticDOMChanged);
    }
  }

  return root;
};

const updateDOMFromLegacyMutation = (root: any, { mutation, syntheticWindowId, legacyDocument }: LegacySyntheticDOMChanged) => {

  if (!mutation) {
    const window = getSyntheticBrowserWindow(root, syntheticWindowId);
    if (!window) return root;
    return updateStructProperty(root, getSyntheticBrowserWindow(root, syntheticWindowId), "document", mapLegacyDOMNodeToPOJO(legacyDocument));
  }

  return root;
}

const mapLegacyDOMNodeToPOJO = (node: SyntheticDOMNode) => {

  const base = {
    $$id: node.$uid,
    nodeName: node.nodeName,
    nodeType: node.nodeType,
    childNodes: node.childNodes.map(mapLegacyDOMNodeToPOJO)
  };

  if (node.nodeType === DOMNodeType.DOCUMENT) {
    return {
      ...base,
      $$type: DOM_DOCUMENT,
    } as SyntheticDOMDocument2;
  } else if (node.nodeType === DOMNodeType.ELEMENT) {
    const element = node as SyntheticDOMElement;
    const attrs = {};
    element.attributes.forEach((attr) => attrs[attr.name] = attr.value);
    return {
      ...base,
      attributes: attrs,
      $$type: DOM_ELEMENT,
    } as SyntheticDOMElement2;
  } else if (node.nodeType === DOMNodeType.TEXT || node.nodeType === DOMNodeType.COMMENT) {
    return {
      ...base,
      nodeValue: (node as SyntheticDOMValueNode).nodeValue,
      $$type: node.nodeType === DOMNodeType.TEXT ? DOM_TEXT_NODE : DOM_COMMENT,
    } as SyntheticDOMValueNode2;
  }

  return base;
};