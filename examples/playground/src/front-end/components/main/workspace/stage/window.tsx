import "./window.scss";
const VOID_ELEMENTS = require("void-elements");
import * as React from "react";
import { findDOMNode } from "react-dom";
import { Motion, spring } from "react-motion";
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

const stiffSpring = (amount: number) => spring(amount, { stiffness: 330, damping: 30 });

export type WindowsOuterProps = {
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export type WindowsInnerProps = WindowsOuterProps;

type WindowProps = {
  fullScreenWindowId: string;
  window: SyntheticWindow;
  dispatch: Dispatcher<any>;
  smooth: boolean;
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

const WindowBase = ({ window, fullScreenWindowId, dispatch, smooth }: WindowProps) => {
  const { bounds, document } = window;
  
  const style = {
    left: bounds.left,
    top: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
  };

  const defaultStyle = {
    // default to white since window background colors
    // are white too (CC)
    background: "white",
    display: fullScreenWindowId && window.$id !== fullScreenWindowId ? "none" : undefined
  };

  const smoothStyle = smooth ? {
    left: stiffSpring(style.left),
    top: stiffSpring(style.top),
    width: stiffSpring(style.width),
    height: stiffSpring(style.height)
  } : style;

  return <Motion defaultStyle={style} style={smoothStyle}>
    {
      style => {
        return <div className="preview-window-component" style={{...style, ...defaultStyle}}>
          <Isolate scrollPosition={window.scrollPosition}>
            <WindowMount mount={window.mount} />
          </Isolate>
        </div>;
      }
    }
  </Motion>;
};

export const Window = pure(WindowBase as any) as typeof WindowBase;
