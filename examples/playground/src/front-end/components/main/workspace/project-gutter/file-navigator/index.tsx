import "./index.scss";
import * as React from "react";
import { readAll } from "mesh";
import { compose, pure } from "recompose";
import { TreeComponent } from "../../../../tree";
import { PaneComponent } from "../../../../pane";
import { File, Directory, Types } from "../../../../../state";
import { immutable, TreeNode, Dispatcher, wrapEventToDispatch } from "aerial-common2";

const getFileLabel = (node: File) => `/${node.name}`;
const collapsible = (node: File) => node.$$type === Types.DIRECTORY;

const enhanceFileNavigator = compose(
  pure
) as any;

export type FileNavigatorComponentProps = {
  directory: Directory,
  dispatch?: Dispatcher<any>
}

type FileNavigatorControlsProps = {
  dispatch: Dispatcher<any>
}

export const FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED   = "FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED";
export const FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";

const FileNavigatorControlsBase = ({ dispatch }: FileNavigatorControlsProps) => <span>
  <a href="#" onClick={wrapEventToDispatch(FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED, dispatch)}>+ file</a> &nbsp;
  <a href="#" onClick={wrapEventToDispatch(FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED, dispatch)}>+ folder</a>
</span>;

const FileNavigatorControls = pure(FileNavigatorControlsBase as any) as typeof FileNavigatorControlsBase;

export const FileNavigatorComponentBase = ({ directory, dispatch }: FileNavigatorComponentProps) => <div className="file-navigator-component">
  <PaneComponent title="Files" controls={<FileNavigatorControls dispatch={dispatch} />}>
    <TreeComponent rootNode={directory} getLabel={getFileLabel} collapsible={collapsible} dispatch={dispatch} />
  </PaneComponent>
</div>;

export const FileNavigatorComponent = enhanceFileNavigator(FileNavigatorComponentBase) as typeof FileNavigatorComponentBase;