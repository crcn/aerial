import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { ImmutableObject } from "aerial-common2";
import { WorkspaceComponent } from "./workspace";
import { Workspace, ApplicationState } from "../../state";

export type MainComponentProps = {
  state: ApplicationState
};

export const MainComponentBase = ({ state }: MainComponentProps) => <div className="main-component">
  <WorkspaceComponent worksapce={state.currentWorkspace} />
</div>;

export const MainComponent = pure(MainComponentBase as any) as typeof MainComponentBase;