import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { Component } from "front-end/components/types";

// TODOS
// collapsible
const enhancePaneComponent = pure;

export type PaneComponentProps = {
  title: string | Component<any>,
  controls?: any,
  children: any
}

export const PaneComponentBase = ({ title, controls, children }: PaneComponentProps) => <div className="pane-component">
  <div className="pane-header">
    { title } <span className="pane-header-controls">{ controls }</span>
  </div>
  <div className="pane-body">
    { children }
  </div>
</div>;

export const PaneComponent = enhancePaneComponent(PaneComponentBase);
