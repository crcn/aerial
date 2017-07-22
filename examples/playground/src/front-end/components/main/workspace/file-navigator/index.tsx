import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { TreeComponent } from "../../../tree";
import { PaneComponent } from "../../../pane";
import { File, Directory, Types } from "../../../../state";
import { immutable, TreeNode, Dispatcher } from "aerial-common2";

const getFileLabel = (node: File) => `/${node.name}`;
const collapsible = (node: File) => node.$$type === Types.DIRECTORY;

const enhanceFileNavigator = compose(
  pure
) as any;

export type FileNavigatorComponentProps = {
  directory: Directory,
  dispatch?: Dispatcher<any>
}

export const FileNavigatorComponentBase = ({ directory, dispatch }: FileNavigatorComponentProps) => <div className="file-navigator-component">
  <PaneComponent title="Files">
    <TreeComponent rootNode={directory} getLabel={getFileLabel} collapsible={collapsible} dispatch={dispatch} />
  </PaneComponent>
</div>;

export const FileNavigatorComponent = enhanceFileNavigator(FileNavigatorComponentBase) as typeof FileNavigatorComponentBase;