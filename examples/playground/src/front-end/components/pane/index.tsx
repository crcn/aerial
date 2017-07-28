import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { Component } from "front-end/components/types";
const cx = require("classnames");

// TODOS
// collapsible
const enhancePaneComponent = pure;

export type PaneComponentProps = {
  title: string | Component<any>;
  controls?: any;
  children: any;
  className?: string;
}

export const PaneComponentBase = ({ title, controls, children, className }: PaneComponentProps) => <div className={cx("pane-component", className)}>
  <div className="pane-header">
    { title } <span className="pane-header-controls">{ controls }</span>
  </div>
  <div className="pane-body">
    { children }
  </div>
</div>;

export const PaneComponent = enhancePaneComponent(PaneComponentBase);
