import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { TreeComponent } from "../../../../tree";
import { PaneComponent } from "../../../../pane";
import { File, Directory, DIRECTORY } from "../../../../../state";
import { FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED, FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED } from "front-end/actions";
import { immutable, TreeNode, Dispatcher, wrapEventToDispatch, wrappedEvent } from "aerial-common2";

const getFileLabel = (node: File) => `/${node.name}`;
const collapsible = (node: File) => node.$$type === DIRECTORY;

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


const FileNavigatorControlsBase = ({ dispatch }: FileNavigatorControlsProps) => <span className="hide">
  <a href="#" onClick={wrapEventToDispatch(dispatch, wrappedEvent.bind(this, FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED))}><i className="icon ion-document-text" /></a> &nbsp;
  <a href="#" onClick={wrapEventToDispatch(dispatch, wrappedEvent.bind(this, FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED))}><i className="icon ion-ios-folder" /></a>
</span>;

const FileNavigatorControls = pure(FileNavigatorControlsBase as any) as typeof FileNavigatorControlsBase;

export const FileNavigatorComponentBase = ({ directory, dispatch }: FileNavigatorComponentProps) => <div className="file-navigator-component">
  <PaneComponent title="Files" controls={<FileNavigatorControls dispatch={dispatch} />}>
    <TreeComponent rootNode={directory} getLabel={getFileLabel} collapsible={collapsible} dispatch={dispatch} />
  </PaneComponent>
</div>;

export const FileNavigatorComponent = enhanceFileNavigator(FileNavigatorComponentBase) as typeof FileNavigatorComponentBase;