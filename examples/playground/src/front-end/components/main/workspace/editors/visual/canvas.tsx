import "./index.scss";
import * as React from "react";
import { lifecycle, compose, withState } from "recompose";
import { SyntheticBrowser, SyntheticDOMRenderer } from "aerial-synthetic-browser";

export type CanvasComponentOuterProps = {
  browser: SyntheticBrowser;
};

export type CanvasComponentInnerProps = CanvasComponentOuterProps & {
  browser: SyntheticBrowser;
  container: HTMLElement;
  setContainer(element: any): any;
};

export const CanvasComponentBase = ({ browser = null, setContainer }: CanvasComponentInnerProps) => browser && <div className="visual-editor-component">
  <div ref={setContainer} />
</div>;

export const CanvasComponent = compose<CanvasComponentInnerProps, CanvasComponentOuterProps>(
  withState("container", "setContainer", null),
  lifecycle({
    componentWillReceiveProps(nextProps: CanvasComponentInnerProps) {
      if (nextProps.container !== this.props.container || nextProps.browser !== this.props.browser) {
        const { container, browser } = nextProps;
        if (container && browser) {
          container.appendChild(browser.renderer.element);
        }
      }
    }
  })
)(CanvasComponentBase);