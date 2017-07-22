import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { TreeComponent } from "../../../tree";
import { PaneComponent } from "../../../pane";
import { immutable, TreeNode } from "aerial-common2";
import { File, Directory, Types } from "../../../../state";

const getFileLabel = (node: File) => `/${node.name}`;
const collapsible = (node: File) => node.$$type === Types.DIRECTORY;

const enhanceFileNavigator = compose(
  pure
) as any;

export type FileNavigatorComponentProps = {
  directory: Directory
}

export const FileNavigatorComponentBase = ({ directory }: FileNavigatorComponentProps) => <div className="file-navigator-component">
  <PaneComponent title="Files">
    <TreeComponent rootNode={directory} getLabel={getFileLabel} collapsible={collapsible} />
  </PaneComponent>
</div>;

export const FileNavigatorComponent = enhanceFileNavigator(FileNavigatorComponentBase) as typeof FileNavigatorComponentBase;