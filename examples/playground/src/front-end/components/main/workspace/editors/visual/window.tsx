import "./canvas.scss";
const VOID_ELEMENTS = require("void-elements");
import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Box, BaseEvent, calculateAbsoluteBounds, shiftBox} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys, withHandlers } from "recompose";
import { canvasElementsComputedPropsChanged } from "front-end/actions";
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
  "head": "span",
  "link": "span",
  "script": "span"
};

const mapStyleSheets = weakMemo(((node: SyntheticDOMNode2) => {
  if (node.nodeType === DOMNodeType.TEXT) return (node as SyntheticDOMTextNode2).nodeValue;
  if (node.nodeType === DOMNodeType.ELEMENT) {
    const element = node as SyntheticDOMElement2;
    const nodeName = NODE_NAME_MAP[element.nodeName] || element.nodeName;
    return React.createElement(nodeName, { key: element.$$id, "data-sourceId": element.$$id, ...element.attributes }, VOID_ELEMENTS[nodeName] ? null : element.childNodes.map(mapSyntheticDOMNodeToJSX));
  }
  return null;
}));

const mapSyntheticDOMNodeToJSX = weakMemo(((node: SyntheticDOMNode2) => {
  if (node.nodeType === DOMNodeType.TEXT) return (node as SyntheticDOMTextNode2).nodeValue;
  if (node.nodeType === DOMNodeType.ELEMENT) {
    const element = node as SyntheticDOMElement2;
    if (element.nodeName === "script") return null;
    const nodeName = NODE_NAME_MAP[element.nodeName] || element.nodeName;
    return React.createElement(nodeName, { key: element.$$id, "data-sourceId": element.$$id, ...element.attributes }, VOID_ELEMENTS[nodeName] ? null : element.childNodes.map(mapSyntheticDOMNodeToJSX));
  }
  return null;
}));

const MeasurererComponent = compose<any, any>(
  onlyUpdateForKeys(["dispatch", "document", "windowBox"]),
  lifecycle({
    componentDidUpdate() {
      const element = findDOMNode(this as any);
      const elements = Array.prototype.slice.call(element.querySelectorAll("*[data-sourceId]")) as HTMLElement[];
      const computedStyles = {};
      const boxes          = {};
      for (const element of elements) {
        computedStyles[element.dataset.sourceid] = window.getComputedStyle(element);

        // bounding rect is based on the embedded iframe, so we need to add the window location as well 
        boxes[element.dataset.sourceid] = shiftBox(element.getBoundingClientRect(), (this.props as any).windowBox);
      }
      (this.props as any).dispatch(canvasElementsComputedPropsChanged((this.props as any).window.$$id, boxes, computedStyles));
    }
  })
)((({ children }) => {
  return <span>
    {children}
  </span>
}) as any) as any;

type WindowMountOuterProps = {
  mount: HTMLElement;
}

type WindowMountInnerProps = {
  setContainer(element: HTMLElement);
  mount: HTMLElement;
  container: HTMLElement;
}

const WindowMountBase = ({ setContainer }: WindowMountInnerProps) => {
  return <div ref={setContainer} />;
}

const enhanceWindowMount = compose<WindowMountInnerProps, WindowMountOuterProps>(
  // pure,
  withState("container", "setContainer", null),
  lifecycle({
    componentDidUpdate({ container, mount }: WindowMountInnerProps) {
      if (container && mount) {
        container.appendChild(mount);
        // TODO - dispatch mounted here
      }
    }
  })
);

const WindowMount = enhanceWindowMount(WindowMountBase);

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
      <WindowMount mount={window.mount} />
    </IsolateComponent>
  </div>;
}

export const WindowComponent = pure(WindowComponentBase as any) as typeof WindowComponentBase;
