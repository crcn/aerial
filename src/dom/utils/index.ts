import { PropertyWatcher, Observable } from "@tandem/common";
import { IDOMEventEmitter, DOMEventListenerFunction } from "../events";
import { SyntheticDOMElement, SyntheticDOMContainer } from "../markup";

export const bindDOMEventMethods = (eventTypes: string[], target: Observable & IDOMEventEmitter) => {
  function handleDOMEventMethod(type: string, newListener: DOMEventListenerFunction, oldListener: DOMEventListenerFunction) {

    if (oldListener) {
      target.removeEventListener(type, newListener);
    }

    if (newListener) {
      target.addEventListener(type, newListener);
    }
  }

  eventTypes.forEach((eventType: string) => {
    new PropertyWatcher(target, `on${eventType.toLowerCase()}`).connect(handleDOMEventMethod.bind(target, eventType));
  });
}


export const bindDOMNodeEventMethods = (target: Observable & IDOMEventEmitter, ...additional: string[]) => {
  bindDOMEventMethods(["load", ...additional], target);
}

export const getNodePath = (element: SyntheticDOMElement) => {
  const path: number[] = [];
  let current: SyntheticDOMContainer = element;
  while(current.parentNode) {
    path.unshift(current.parentNode.childNodes.indexOf(current));
    current = current.parentNode;
  }
  return path;
}

export const getNodeByPath = (root: SyntheticDOMContainer, path: number[]) => {
  let current = root;
  for (let i = 0, n = path.length; i < n; i++) {
    current = current.childNodes[path[i]] as SyntheticDOMContainer;
    if (!current) break;
  }

  return current;
}