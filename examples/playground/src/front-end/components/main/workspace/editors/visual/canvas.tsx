import "./index.scss";
import * as React from "react";
import { lifecycle, compose, withState, pure } from "recompose";
import { 
  DOMNodeType,
  SyntheticBrowser2, 
  SyntheticDOMNode2, 
  SyntheticDOMRenderer,
  SyntheticDOMElement2,
  SyntheticDOMTextNode2,
  SyntheticBrowserWindow2, 
} from "aerial-synthetic-browser";

export type CanvasComponentOuterProps = {
  browser: SyntheticBrowser2;
};

export type CanvasComponentInnerProps = CanvasComponentOuterProps & {
  browser: SyntheticBrowser2;
  container: HTMLElement;
  setContainer(element: any): any;
};

type WindowComponentProps = {
  window: SyntheticBrowserWindow2
};

const NODE_NAME_MAP = {
  "html": "span",
  "body": "span",
  "head": "span"
};

const mapSyntheticDOMNodeToJSX = (node: SyntheticDOMNode2) => {
  if (node.nodeType === DOMNodeType.TEXT) return (node as SyntheticDOMTextNode2).nodeValue;
  if (node.nodeType === DOMNodeType.ELEMENT) {
    const element = node as SyntheticDOMElement2;
    const nodeName = NODE_NAME_MAP[element.nodeName] || element.nodeName;
    return React.createElement(nodeName, { key: element.$$id, ...element.attributes }, element.childNodes.map(mapSyntheticDOMNodeToJSX));
  }
  return null;
};

const WindowComponentBase = ({ window }: WindowComponentProps) => <div className="visual-editor-canvas-window">
  { window.document && window.document.childNodes.map(mapSyntheticDOMNodeToJSX) }
</div>;

const WindowComponent = pure(WindowComponentBase as any) as typeof WindowComponentBase;

export const CanvasComponentBase = ({ browser = null, setContainer }: CanvasComponentInnerProps) => browser && <div className="visual-editor-canvas">
  {
    browser.windows.map((window) => <WindowComponent key={window.$$id} window={window} />)
  }
</div>;

export const CanvasComponent = compose<CanvasComponentInnerProps, CanvasComponentOuterProps>(
  withState("container", "setContainer", null),
  lifecycle({
    componentWillReceiveProps(nextProps: CanvasComponentInnerProps) {
      if (nextProps.container !== this.props.container || nextProps.browser !== this.props.browser) {
        const { container, browser } = nextProps;
        if (container && browser) {
          // container.appendChild(browser.renderer.element);
        }
      }
    }
  })
)(CanvasComponentBase);