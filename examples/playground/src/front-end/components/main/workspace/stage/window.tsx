import "./canvas.scss";
const VOID_ELEMENTS = require("void-elements");
import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Box, BaseEvent, calculateAbsoluteBounds, shiftBox} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys, withHandlers } from "recompose";
import { canvasElementsComputedPropsChanged } from "front-end/actions";
import { 
  SEnvNodeTypes,
  SyntheticNode,
  SyntheticTextNode,
  SyntheticWindow,
  SyntheticBrowser,
} from "aerial-browser-sandbox";
import { IsolateComponent } from "front-end/components/isolated";

export type CanvasComponentOuterProps = {
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>
};

export type CanvasComponentInnerProps = CanvasComponentOuterProps;

type WindowComponentProps = {
  window: SyntheticWindow,
  dispatch: Dispatcher<any>
};

const NODE_NAME_MAP = {
  "html": "span",
  "body": "span",
  "head": "span",
  "link": "span",
  "script": "span"
};

type WindowMountOuterProps = {
  mount: HTMLElement;
}

type WindowMountInnerProps = {
  setContainer(element: HTMLElement);
  mount: HTMLElement;
  container: HTMLElement;
} & WindowMountOuterProps;

const WindowMountBase = ({ setContainer }: WindowMountInnerProps) => {
  return <div ref={setContainer} />;
}

const enhanceWindowMount = compose<WindowMountInnerProps, WindowMountOuterProps>(
  // pure,
  withState("container", "setContainer", null),
  lifecycle({
    componentDidUpdate() {
      const { container, mount } = this.props as WindowMountInnerProps;
      if (container && mount) {
        if (container.firstChild) {
          container.removeChild(container.firstChild);
        }
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
    <IsolateComponent>
      <WindowMount mount={window.mount} />
    </IsolateComponent>
  </div>;
}

export const WindowComponent = pure(WindowComponentBase as any) as typeof WindowComponentBase;
