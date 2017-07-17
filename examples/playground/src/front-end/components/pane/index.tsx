import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { Component } from "../types";

// TODOS
// collapsible
const enhancePaneComponent = pure;

export type PaneComponentProps = {
  title: string | Component<any>,
  children: any
}

export const PaneComponentBase = ({ title, children }: PaneComponentProps) => <div className="pane-component">
  <div className="pane-header">
    { title }
  </div>
  <div className="pane-body">
    { children }
  </div>
</div>;

export const PaneComponent = enhancePaneComponent(PaneComponentBase);
