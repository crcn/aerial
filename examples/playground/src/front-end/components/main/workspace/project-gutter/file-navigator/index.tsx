// import "./index.scss";
// import * as React from "react";
// import { compose, pure } from "recompose";
// import { Tree } from "../../../../tree";
// import { Pane } from "../../../../pane";
// import {DIRECTORY } from "../../../../../state";
// import { FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED, FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED } from "front-end/actions";
// import { immutable, TreeNode, Dispatcher, wrapEventToDispatch, wrappedEvent } from "aerial-common2";

// const getFileLabel = (node: File) => `/${node.name}`;
// const collapsible = (node: File) => node.$$type === DIRECTORY;

// const enhanceFileNavigator = compose(
//   pure
// ) as any;

// export type FileNavigatorProps = {
//   directory: Directory,
//   dispatch?: Dispatcher<any>
// }

// type FileNavigatorControlsProps = {
//   dispatch: Dispatcher<any>
// }


// const FileNavigatorControlsBase = ({ dispatch }: FileNavigatorControlsProps) => <span className="hide">
//   <a href="#" onClick={wrapEventToDispatch(dispatch, wrappedEvent.bind(this, FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED))}><i className="icon ion-document-text" /></a> &nbsp;
//   <a href="#" onClick={wrapEventToDispatch(dispatch, wrappedEvent.bind(this, FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED))}><i className="icon ion-ios-folder" /></a>
// </span>;

// const FileNavigatorControls = pure(FileNavigatorControlsBase as any) as typeof FileNavigatorControlsBase;

// export const FileNavigatorBase = ({ directory, dispatch }: FileNavigatorProps) => <div className="file-navigator-component">
//   <Pane title="Files" controls={<FileNavigatorControls dispatch={dispatch} />}>
//     <Tree rootNode={directory} getLabel={getFileLabel} collapsible={collapsible} dispatch={dispatch} />
//   </Pane>
// </div>;

// export const FileNavigator = enhanceFileNavigator(FileNavigatorBase) as typeof FileNavigatorBase;