import { watch, getValueById, removed, Struct, moved, stoppedMoving, moveBox, scaleInnerBox } from "aerial-common2";
import { take, select, call, put, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import { 
  RESIZER_MOVED,
  RESIZER_STOPPED_MOVING,
  ResizerMoved,
  resizerStoppedMoving,
  ResizerPathMoved,
  RESIZER_PATH_MOUSE_MOVED,
  DeleteShortcutPressed, 
  DELETE_SHORCUT_PRESSED, 
  StageToolOverlayClicked, 
  workspaceSelectionDeleted,
  STAGE_TOOL_OVERLAY_MOUSE_CLICKED, 
} from "../actions";

import { 
  getUri,
  SEnvNodeTypes, 
  SyntheticWindow, 
  getSyntheticNodeById, 
  SyntheticElement, 
  getSyntheticNodeWindow,
  createOpenSyntheticWindowRequest, 
} from "aerial-browser-sandbox";

import { 
  Workspace,
  getSyntheticBrowserBox,
  getWorkspaceById,
  ApplicationState, 
  getSelectedWorkspace, 
  getWorkspaceSelectionBox,
  getBoxedWorkspaceSelection,
  getSyntheticWindowWorkspace,
  getStageToolMouseNodeTargetUID,
} from "../state";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
  yield fork(handleAltClickElement);
  yield fork(handleDeleteKeyPressed);
  yield fork(handleSelectionMoved);
  yield fork(handleSelectionStoppedMoving);
}

function* openDefaultWindow() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    
    yield put(createOpenSyntheticWindowRequest(`https://www.w3.org/Style/Examples/011/mypage.html`, workspace.browser.$$id));
    // yield put(createOpenSyntheticWindowRequest(`https://webflow.com/`, workspace.browser.$$id));
    return true;
  });
}

function* handleAltClickElement() {
  while(true) {
    const event: StageToolOverlayClicked = yield take((action: StageToolOverlayClicked) => action.type === STAGE_TOOL_OVERLAY_MOUSE_CLICKED && action.sourceEvent.altKey);
    const state = yield select();
    const targetUID = getStageToolMouseNodeTargetUID(state, event);
    const node = getSyntheticNodeById(state, targetUID);
    if (node.nodeType === SEnvNodeTypes.ELEMENT) {
      const element = node as SyntheticElement;
      if (element.nodeName === "A") {
        const href = element.attributes.find((a) => a.name === "href");
        if (href) {
          const window = getSyntheticNodeWindow(state, node.$$id);
          const workspace = getSyntheticWindowWorkspace(state, window.$$id);
          yield openNewWindow(href.value, window, workspace);
        }
      }
    }
  }
}

function* openNewWindow(href: string, origin: SyntheticWindow, workspace: Workspace) {
  const uri = getUri(href, origin.location);
  yield put(createOpenSyntheticWindowRequest(uri, workspace.browser.$$id));
}

function* handleDeleteKeyPressed() {
  while(true) {
    const action = (yield take(DELETE_SHORCUT_PRESSED)) as DeleteShortcutPressed;
    const state = yield select();
    const { sourceEvent } = event as DeleteShortcutPressed;
    const workspace = getSelectedWorkspace(state);
    const selected  = workspace.selectionIds.map(id => getValueById(state, id)) as Struct[];
    for (const item of selected) {
      yield put(removed(item.$$id, item.$$type));
    }
    yield put(workspaceSelectionDeleted(workspace.$$id));
  }
}

function* handleSelectionMoved() {
  while(true) {
    const { point, workspaceId, point: newPoint } = (yield take(RESIZER_MOVED)) as ResizerMoved;
    const state = yield select();
    const workspace = getWorkspaceById(state, workspaceId);
    const translate = workspace.visualEditorSettings.translate;

    const bounds = getWorkspaceSelectionBox(workspace);
    for (const item of getBoxedWorkspaceSelection(workspace)) {
      const box = getSyntheticBrowserBox(workspace, item);
      yield put(moved(item.$$id, item.$$type, scaleInnerBox(box, bounds, moveBox(bounds, newPoint))));
    }
  }
}

function* handleSelectionStoppedMoving() {
  while(true) {
    const { point, workspaceId } = (yield take(RESIZER_STOPPED_MOVING)) as ResizerMoved;
    const state = yield select();
    const workspace = getWorkspaceById(state, workspaceId);
    for (const item of getBoxedWorkspaceSelection(workspace)) {
      const box = getSyntheticBrowserBox(workspace, item);
      yield put(stoppedMoving(item.$$id, item.$$type));
    }
  }
}