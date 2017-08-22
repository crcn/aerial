import "./window.scss";
const VOID_ELEMENTS = require("void-elements");
import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Bounds, BaseEvent, calculateAbsoluteBounds, shiftBounds} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys, withHandlers } from "recompose";
import { canvasElementsComputedPropsChanged } from "front-end/actions";
import { 
  SEnvNodeTypes,
  SyntheticNode,
  SyntheticTextNode,
  SyntheticWindow,
  SyntheticBrowser,
} from "aerial-browser-sandbox";
import { Isolate } from "front-end/components/isolated";

export type WindowsOuterProps = {
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>
};

export type WindowsInnerProps = WindowsOuterProps;

type WindowProps = {
  fullScreenWindowId: string,
  window: SyntheticWindow,
  dispatch: Dispatcher<any>
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

const WindowBase = ({ window, fullScreenWindowId, dispatch }: WindowProps) => {
  const { bounds, document } = window;
  
  const style = fullScreenWindowId && fullScreenWindowId !== window.$id ? { display: "none" } : {
    left: bounds.left,
    top: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top
  };

  return <div className="preview-window-component" style={style}>
    <Isolate scrollPosition={window.scrollPosition}>
      <WindowMount mount={window.mount} />
    </Isolate>
  </div>;
}

export const Window = pure(WindowBase as any) as typeof WindowBase;
