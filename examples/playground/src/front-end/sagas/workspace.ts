import { watch, removed, Struct, moved, stoppedMoving, moveBounds, scaleInnerBounds, resized, keepBoundsAspectRatio, request, shiftBounds } from "aerial-common2";
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
  NEXT_WINDOW_SHORTCUT_PRESSED,
  PREV_WINDOW_SHORTCUT_PRESSED,
  TextEditorChanged,
  RESIZER_PATH_MOUSE_MOVED,
  DeleteShortcutPressed, 
  OPEN_NEW_WINDOW_SHORTCUT_PRESSED,
  windowSelectionShifted,
  WINDOW_SELECTION_SHIFTED,
  CLONE_WINDOW_SHORTCUT_PRESSED,
  PROMPTED_NEW_WINDOW_URL,
  PromptedNewWindowUrl,
  DELETE_SHORCUT_PRESSED, 
  StageToolOverlayClicked, 
  workspaceSelectionDeleted,
  STAGE_MOUSE_CLICKED, 
} from "../actions";

import { URI_CACHE_BUSTED, uriCacheBusted } from "aerial-sandbox2";
const WINDOW_PADDING = 10;

import { 
  getUri,
  SEnvNodeTypes, 
  SyntheticWindow, 
  SyntheticElement, 
  SYNTHETIC_WINDOW,
  getSyntheticWindow,
  getSyntheticNodeById, 
  getSyntheticNodeWindow,
  getSyntheticWindowBrowser,
  getSyntheticBrowserBounds,
  openSyntheticWindowRequest, 
} from "aerial-browser-sandbox";

import { 
  Workspace,
  getSyntheticBrowserItemBounds,
  getStageTranslate,
  getWorkspaceById,
  ApplicationState, 
  getWorkspaceWindow,
  getSelectedWorkspace, 
  getWorkspaceSelectionBounds,
  getBoundedWorkspaceSelection,
  getWorkspaceLastSelectionOwnerWindow,
  getSyntheticWindowWorkspace,
  getStageToolMouseNodeTargetReference,
} from "../state";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
  yield fork(handleAltClickElement);
  yield fork(handleDeleteKeyPressed);
  yield fork(handleNextWindowPressed);
  yield fork(handlePrevWindowPressed);
  yield fork(handleSelectionMoved);
  yield fork(handleSelectionStoppedMoving);
  yield fork(handleSelectionKeyDown);
  yield fork(handleTextEditorChange);
  yield fork(handleSelectionResized);
  yield fork(handleNewLocationPrompt);
  yield fork(handleOpenNewWindowShortcut);
  yield fork(handleCloneSelectedWindowShortcut);
}

function* openDefaultWindow() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    
    yield put(openSyntheticWindowRequest(`http://localhost:8082/`, workspace.browserId));
    // yield put(openSyntheticWindowRequest("https://wordpress.com/", workspace.browserId));
    // yield put(openSyntheticWindowRequest("http://localhost:8080/#/", workspace.browserId));
    return true;
  });
}

function* handleAltClickElement() {
  while(true) {
    const event: StageToolOverlayClicked = yield take((action: StageToolOverlayClicked) => action.type === STAGE_MOUSE_CLICKED && action.sourceEvent.altKey);
    const state = yield select();
    const targetRef = getStageToolMouseNodeTargetReference(state, event);
    const workspace = getSelectedWorkspace(state);
    if (!targetRef) continue;
    const node = getSyntheticNodeById(state, targetRef[1]);
    if (node.nodeType === SEnvNodeTypes.ELEMENT) {
      const element = node as SyntheticElement;
      if (element.nodeName === "A") {
        const href = element.attributes.find((a) => a.name === "href");
        if (href) {
          const window = getSyntheticNodeWindow(state, node.$id);
          const browserBounds = getSyntheticBrowserBounds(getSyntheticWindowBrowser(state, window.$id));
          const workspace = getSyntheticWindowWorkspace(state, window.$id);
          yield openNewWindow(state, href.value, window, workspace);
        }
      }
    }
  }
}

function* openNewWindow(state: ApplicationState, href: string, origin: SyntheticWindow, workspace: Workspace) {
  const uri = getUri(href, origin.location);
  const windowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : origin.bounds;
  const browserBounds = getSyntheticBrowserBounds(getSyntheticWindowBrowser(state, origin.$id));
  yield put(openSyntheticWindowRequest(uri, workspace.browserId, {
    left: Math.max(browserBounds.right, windowBounds.right) + WINDOW_PADDING,
    top: 0
  }));
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

    const selectionBounds = getWorkspaceSelectionBounds(state, workspace);
    for (const item of getBoundedWorkspaceSelection(state, workspace)) {
      const itemBounds = getSyntheticBrowserItemBounds(state, item);
      yield put(moved(item.$id, item.$type, scaleInnerBounds(itemBounds, selectionBounds, moveBounds(selectionBounds, newPoint))));
    }
  }
}

function* handleSelectionResized() {
  while(true) {
    let { workspaceId, anchor, originalBounds, newBounds, sourceEvent } = (yield take(RESIZER_PATH_MOUSE_MOVED)) as ResizerPathMoved;

    const state: ApplicationState = yield select();
 
    const workspace = getWorkspaceById(state, workspaceId);

    // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
    const currentBounds = getWorkspaceSelectionBounds(state, workspace);


    const keepAspectRatio = sourceEvent.shiftKey;
    const keepCenter      = sourceEvent.altKey;

    if (keepCenter) {
      // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
    }

    if (keepAspectRatio) {
      newBounds = keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
    }

    for (const item of getBoundedWorkspaceSelection(state, workspace)) {
      const innerBounds = getSyntheticBrowserItemBounds(state, item);
      const scaledBounds = scaleInnerBounds(currentBounds, currentBounds, newBounds);
      yield put(resized(item.$id, item.$type, scaleInnerBounds(innerBounds, currentBounds, newBounds)));
    }
  }
}

function* handleOpenNewWindowShortcut() {
  while(true) {
    yield take(OPEN_NEW_WINDOW_SHORTCUT_PRESSED);
    const uri = prompt("URL");
    if (!uri) continue;
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    yield put(openSyntheticWindowRequest(uri, workspace.browserId));

  }
}

function* handleCloneSelectedWindowShortcut() {
  while(true) {
    yield take(CLONE_WINDOW_SHORTCUT_PRESSED);
    const state: ApplicationState = yield select();
    const workspace = getSelectedWorkspace(state);
    const itemRef = workspace.selectionRefs[0];
    if (!itemRef) continue;
    const window = itemRef[0] === SYNTHETIC_WINDOW ? getSyntheticWindow(state, itemRef[1]) : getSyntheticNodeWindow(state, itemRef[1]);

    const originalWindowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : window.bounds; 

    const clonedWindow = yield yield request(openSyntheticWindowRequest(window.location, getSyntheticWindowBrowser(state, window.$id).$id, moveBounds(originalWindowBounds, {
      left: originalWindowBounds.left,
      top: originalWindowBounds.bottom + WINDOW_PADDING
    })));
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

function* handleNextWindowPressed() {
  while(true) {
    yield take(NEXT_WINDOW_SHORTCUT_PRESSED);
    yield call(shiftSelectedWindow, 1);
  }
}

function* handlePrevWindowPressed() {
  while(true) {
    yield take(PREV_WINDOW_SHORTCUT_PRESSED);
    yield call(shiftSelectedWindow, -1);
  }
}

function* shiftSelectedWindow(indexDelta: number) {
  const state: ApplicationState = yield select();
  const window = getWorkspaceLastSelectionOwnerWindow(state, state.selectedWorkspaceId) || getWorkspaceWindow(state, state.selectedWorkspaceId, 0);
  if (!window) {
    return;
  }
  const browser = getSyntheticWindowBrowser(state, window.$id);

  const index = browser.windows.indexOf(window);
  const change = index + indexDelta

  // TODO - change index based on window location, not index
  const newIndex = change < 0 ? browser.windows.length - 1 : change >= browser.windows.length ? 0 : change;
  yield put(windowSelectionShifted(browser.windows[newIndex].$id))
}