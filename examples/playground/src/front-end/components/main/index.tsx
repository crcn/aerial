import * as React from "react";
import { ImmutableObject } from "aerial-common2";
import { WorkspaceComponent } from "./workspace";

export type MainComponentProps = {

};

export const MainComponentBase = (props: MainComponentProps) => <div>
  <WorkspaceComponent />
</div>;

export const MainComponent = MainComponentBase;