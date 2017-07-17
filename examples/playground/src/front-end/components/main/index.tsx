import "./index.scss";
import * as React from "react";
import { ImmutableObject } from "aerial-common2";
import { WorkspaceComponent } from "./workspace";
import { FileNavigatorComponent } from "./file-navigator";

export type MainComponentProps = {

};

export const MainComponentBase = (props: MainComponentProps) => <div className="main-component">
  <FileNavigatorComponent />
  <WorkspaceComponent />
</div>;

export const MainComponent = MainComponentBase;