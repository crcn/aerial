import "./canvas.scss";
const VOID_ELEMENTS = require("void-elements");
import { readAll } from "mesh";
import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Box, BaseEvent} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys } from "recompose";
import { 
  DOMNodeType,
  SyntheticBrowser2, 
  SyntheticDOMNode2, 
  SyntheticDOMRenderer,
  SyntheticDOMElement2,
  SyntheticDOMTextNode2,
  SyntheticBrowserWindow2, 
} from "aerial-synthetic-browser";
import { IsolateComponent } from "front-end/components/isolated";

export const CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED = "CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED";

export type CanvasElementsComputedPropsChanged = {
  syntheticWindowId: string,
  computedBoxes: {
    [identifier: string]: Box
  },
  computedStyles: {
    [identifier: string]: CSSStyleDeclaration
  }
} & BaseEvent;

export const canvasElementsComputedPropsChanged = (syntheticWindowId: string, computedBoxes: { [identififer: string]: Box }, computedStyles: { [identifier: string]: CSSStyleDeclaration }): CanvasElementsComputedPropsChanged => ({
  syntheticWindowId,
  type: CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  computedBoxes,
  computedStyles
});


export type CanvasComponentOuterProps = {
  browser: SyntheticBrowser2;
  dispatch: Dispatcher<any>
};

export type CanvasComponentInnerProps = CanvasComponentOuterProps;

type WindowComponentProps = {
  window: SyntheticBrowserWindow2,
  dispatch: Dispatcher<any>
};

const NODE_NAME_MAP = {
  "html": "span",
  "body": "span",
  "head": "span"
};

const mapSyntheticDOMNodeToJSX = weakMemo(((node: SyntheticDOMNode2) => {
  if (node.nodeType === DOMNodeType.TEXT) return (node as SyntheticDOMTextNode2).nodeValue;
  if (node.nodeType === DOMNodeType.ELEMENT) {
    const element = node as SyntheticDOMElement2;
    const nodeName = NODE_NAME_MAP[element.nodeName] || element.nodeName;
    return React.createElement(nodeName, { key: element.$$id, "data-sourceId": element.$$id, ...element.attributes }, VOID_ELEMENTS[nodeName] ? null : element.childNodes.map(mapSyntheticDOMNodeToJSX));
  }
  return null;
}));

const MeasurererComponent = compose<any, any>(
  onlyUpdateForKeys(["dispatch", "document"]),
  lifecycle({
    componentDidUpdate() {
      const element = findDOMNode(this as any);
      const elements = Array.prototype.slice.call(element.querySelectorAll("*[data-sourceId]")) as HTMLElement[];
      const computedStyles = {};
      const boxes          = {};
      for (const element of elements) {
        computedStyles[element.dataset.sourceid] = window.getComputedStyle(element);
        boxes[element.dataset.sourceid] = element.getBoundingClientRect();
      }
      readAll((this.props as any).dispatch(canvasElementsComputedPropsChanged((this.props as any).window.$$id, boxes, computedStyles)));
    }
  })
)((({ children }) => {
  return <span>
    {children}
  </span>
}) as any) as any;

const WindowComponentBase = ({ window, dispatch }: WindowComponentProps) => {
  const { box, document } = window;
  
  const style = {
    left: box.left,
    top: box.top,
    width: box.right - box.left,
    height: box.bottom - box.top
  };

  return <div className="visual-canvas-window-component" style={style}>
    <IsolateComponent inheritCSS>
      <MeasurererComponent document={document} dispatch={dispatch} window={window}>
        { document && document.childNodes.map(mapSyntheticDOMNodeToJSX) }
      </MeasurererComponent>
    </IsolateComponent>
  </div>;
}

export const WindowComponent = pure(WindowComponentBase as any) as typeof WindowComponentBase;
