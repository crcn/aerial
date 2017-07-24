import "./index.scss";
import * as React from "react";
import { lifecycle, compose, withState } from "recompose";
import { SyntheticBrowser, SyntheticDOMRenderer } from "aerial-synthetic-browser";

export type VisualEditorComponentOuterProps = {
  browser: SyntheticBrowser;
};

export type VisualEditorComponentInnerProps = VisualEditorComponentOuterProps & {
  browser: SyntheticBrowser;
  container: HTMLElement;
  setContainer(element: any): any;
};

export const VisualEditorComponentBase = ({ browser = null, setContainer }: VisualEditorComponentInnerProps) => browser && <div className="visual-editor-component">
  <div ref={setContainer} />
</div>;

export const VisualEditorComponent = compose<VisualEditorComponentInnerProps, VisualEditorComponentOuterProps>(
  withState("container", "setContainer", null),
  lifecycle({
    componentWillReceiveProps(nextProps: VisualEditorComponentInnerProps) {
      if (nextProps.container !== this.props.container || nextProps.browser !== this.props.browser) {
        const { container, browser } = nextProps;
        if (container && browser) {
          container.appendChild(browser.renderer.element);
        }
      }
    }
  })
)(VisualEditorComponentBase);