import { watch, removed, Struct, moved, stoppedMoving, moveBounds, scaleInnerBounds, resized, keepBoundsAspectRatio } from "aerial-common2";
import { take, select, call, put, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import { 
  RESIZER_MOVED,
  RESIZER_STOPPED_MOVING,
  ResizerMoved,
  resizerStoppedMoving,
  STAGE_TOOL_SELECTION_KEY_DOWN,
  StageToolSelectionKeyDown,
  ResizerPathMoved,
  resizerMoved,
  TEXT_EDITOR_CHANGED,
  TextEditorChanged,
  RESIZER_PATH_MOUSE_MOVED,
  DeleteShortcutPressed, 
  PROMPTED_NEW_WINDOW_URL,
  PromptedNewWindowUrl,
  DELETE_SHORCUT_PRESSED, 
  StageToolOverlayClicked, 
  workspaceSelectionDeleted,
  STAGE_TOOL_OVERLAY_MOUSE_CLICKED, 
} from "../actions";

import { URI_CACHE_BUSTED, uriCacheBusted } from "aerial-sandbox2";

import { 
  getUri,
  SEnvNodeTypes, 
  SyntheticWindow, 
  SyntheticElement, 
  getSyntheticNodeById, 
  getSyntheticNodeWindow,
  openSyntheticWindowRequest, 
} from "aerial-browser-sandbox";

import { 
  Workspace,
  getSyntheticBrowserItemBounds,
  getStageTranslate,
  getWorkspaceById,
  ApplicationState, 
  getSelectedWorkspace, 
  getWorkspaceSelectionBounds,
  getBoundedWorkspaceSelection,
  getSyntheticWindowWorkspace,
  getStageToolMouseNodeTargetReference,
} from "../state";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
  yield fork(handleAltClickElement);
  yield fork(handleDeleteKeyPressed);
  yield fork(handleSelectionMoved);
  yield fork(handleSelectionStoppedMoving);
  yield fork(handleSelectionKeyDown);
  yield fork(handleTextEditorChange);
  yield fork(handleSelectionResized);
  yield fork(handleNewLocationPrompt);
}

function* openDefaultWindow() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    
    // yield put(openSyntheticWindowRequest(`http://localhost:8082/`, workspace.browserId));
    yield put(openSyntheticWindowRequest("https://wordpress.com/", workspace.browserId));
    return true;
  });
}

function* handleAltClickElement() {
  while(true) {
    const event: StageToolOverlayClicked = yield take((action: StageToolOverlayClicked) => action.type === STAGE_TOOL_OVERLAY_MOUSE_CLICKED && action.sourceEvent.altKey);
    const state = yield select();
    const targetRef = getStageToolMouseNodeTargetReference(state, event);
    if (!targetRef) continue;
    const node = getSyntheticNodeById(state, targetRef[1]);
    if (node.nodeType === SEnvNodeTypes.ELEMENT) {
      const element = node as SyntheticElement;
      if (element.nodeName === "A") {
        const href = element.attributes.find((a) => a.name === "href");
        if (href) {
          const window = getSyntheticNodeWindow(state, node.$id);
          const workspace = getSyntheticWindowWorkspace(state, window.$id);
          yield openNewWindow(href.value, window, workspace);
        }
      }
    }
  }
}

function* openNewWindow(href: string, origin: SyntheticWindow, workspace: Workspace) {
  const uri = getUri(href, origin.location);
  yield put(openSyntheticWindowRequest(uri, workspace.browserId));
}

function* handleDeleteKeyPressed() {
  while(true) {
    const action = (yield take(DELETE_SHORCUT_PRESSED)) as DeleteShortcutPressed;
    const state = yield select();
    const { sourceEvent } = event as DeleteShortcutPressed;
    const workspace = getSelectedWorkspace(state);
    for (const [type, id] of workspace.selectionRefs) {
      yield put(removed(id, type));
    }
    yield put(workspaceSelectionDeleted(workspace.$id));
  }
}

function* handleSelectionMoved() {
  while(true) {
    const { point, workspaceId, point: newPoint } = (yield take(RESIZER_MOVED)) as ResizerMoved;
    const state = (yield select()) as ApplicationState;
    const workspace = getWorkspaceById(state, workspaceId);
    const translate = getStageTranslate(workspace.stage);

    const bounds = getWorkspaceSelectionBounds(state, workspace);
    for (const item of getBoundedWorkspaceSelection(state, workspace)) {
      const bounds = getSyntheticBrowserItemBounds(state, item);
      yield put(moved(item.$id, item.$type, scaleInnerBounds(bounds, bounds, moveBounds(bounds, newPoint))));
    }
  }
}

function* handleSelectionResized() {
  while(true) {
    let { workspaceId, anchor, bounds: newBounds, sourceEvent } = (yield take(RESIZER_PATH_MOUSE_MOVED)) as ResizerPathMoved;

    const state: ApplicationState = yield select();

    const workspace = getWorkspaceById(state, workspaceId);

    // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
    const bounds = getWorkspaceSelectionBounds(state, workspace);


    const keepAspectRatio = sourceEvent.shiftKey;
    const keepCenter      = sourceEvent.altKey;

    if (keepCenter) {
      // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
    }

    if (keepAspectRatio) {
      newBounds = keepBoundsAspectRatio(newBounds, bounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
    }

    for (const item of getBoundedWorkspaceSelection(state, workspace)) {
      const bounds = getSyntheticBrowserItemBounds(state, item);
      const scaledBounds = scaleInnerBounds(bounds, bounds, newBounds);
      yield put(resized(item.$id, item.$type, scaleInnerBounds(bounds, bounds, newBounds)));
    }
  }
}

function* handleNewLocationPrompt() {
  while(true) {
    const { workspaceId, location } = (yield take(PROMPTED_NEW_WINDOW_URL)) as PromptedNewWindowUrl;
    yield put(openSyntheticWindowRequest(location, getWorkspaceById(yield select(), workspaceId).browserId))
  }
}

function* handleSelectionKeyDown() {
  while(true) {
    const { workspaceId, sourceEvent } = (yield take(STAGE_TOOL_SELECTION_KEY_DOWN)) as StageToolSelectionKeyDown;
    const state = yield select();

    const workspace = getWorkspaceById(state, workspaceId);
    const bounds = getWorkspaceSelectionBounds(state, workspace);
    switch(sourceEvent.key) {
      case "ArrowDown": {
        yield put(resizerMoved(workspaceId, { left: bounds.left, top: bounds.top + 1 }));
        break;
      }
      case "ArrowUp": {
        yield put(resizerMoved(workspaceId, { left: bounds.left, top: bounds.top - 1 }));
        break;
      }
      case "ArrowLeft": {
        yield put(resizerMoved(workspaceId, { left: bounds.left - 1, top: bounds.top }));
        break;
      }
      case "ArrowRight": {
        yield put(resizerMoved(workspaceId, { left: bounds.left + 1, top: bounds.top }));
        break;
      }
    }
  }
}

function* handleSelectionStoppedMoving() {
  while(true) {
    const { point, workspaceId } = (yield take(RESIZER_STOPPED_MOVING)) as ResizerMoved;
    const state = (yield select()) as ApplicationState;
    const workspace = getWorkspaceById(state, workspaceId);
    for (const item of getBoundedWorkspaceSelection(state, workspace)) {
      const bounds = getSyntheticBrowserItemBounds(state, item);
      yield put(stoppedMoving(item.$id, item.$type));
    }
  }
}

function* handleTextEditorChange() {
  while(true) {
    const { value, file } = (yield take(TEXT_EDITOR_CHANGED)) as TextEditorChanged;
    yield put(uriCacheBusted(file.sourceUri, value, file.contentType));
  }
}