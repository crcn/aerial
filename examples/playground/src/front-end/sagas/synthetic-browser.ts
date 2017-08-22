import { delay } from "redux-saga";
import { createDeferredPromise } from "mesh";
import { take, fork, select, put, call } from "redux-saga/effects";
import { Point, shiftPoint, watch, resized, Bounds } from "aerial-common2";
import { 
  SYNTHETIC_WINDOW,
  getSyntheticNodeWindow, 
  syntheticWindowScrolled,
  syntheticNodeTextContentChanged, 
  syntheticNodeValueStoppedEditing,
} from "aerial-browser-sandbox";
import { 
  ApplicationState,
  getWorkspaceById,
  getStageTranslate,
  getSyntheticWindow,
  getSelectedWorkspace, 
  getSyntheticNodeWorkspace, 
  getSyntheticWindowWorkspace,
} from "front-end/state";
import { 
  StageToolEditTextBlur,
  DELETE_SHORCUT_PRESSED, 
  StageToolEditTextChanged, 
  STAGE_TOOL_EDIT_TEXT_BLUR, 
  StageToolOverlayMousePanEnd,
  StageToolOverlayMousePanning,
  StageToolOverlayMousePanStart,
  STAGE_TOOL_EDIT_TEXT_CHANGED, 
  STAGE_TOOL_OVERLAY_MOUSE_PANNING,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_START
} from "front-end/actions";

export function* frontEndSyntheticBrowserSaga() {
  yield fork(handleTextEditChanges);
  yield fork(handleTextEditBlur);
  yield fork(handleWindowMousePanned);
  yield fork(handleFullScreenWindow);
}

function* handleTextEditChanges() {
  while(true) {
    const { sourceEvent, nodeId } = (yield take(STAGE_TOOL_EDIT_TEXT_CHANGED)) as StageToolEditTextChanged;
    const state = yield select();
    const window = getSyntheticNodeWindow(state, nodeId);
    const text = String(sourceEvent.target.value || "").trim();
    const workspace = getSyntheticNodeWorkspace(state, nodeId);
    yield put(syntheticNodeTextContentChanged(window.$id, nodeId, text));
  }
}

function* handleTextEditBlur() {
  while(true) {
    const { sourceEvent, nodeId } = (yield take(STAGE_TOOL_EDIT_TEXT_BLUR)) as StageToolEditTextBlur;
    const state = yield select();
    const window = getSyntheticNodeWindow(state, nodeId);
    yield put(syntheticNodeValueStoppedEditing(window.$id, nodeId));
  }
}

const MOMENTUM_THRESHOLD = 100;
const DEFAULT_MOMENTUM_DAMP = 0.1;
const MOMENTUM_DELAY = 50;
const VELOCITY_MULTIPLIER = 100;

// fugly quick momentum scrolling implementation
function* handleWindowMousePanned() {

  let deltaTop  = 0;
  let deltaLeft = 0;
  let currentWindowId: string;
  let panStartScrollPosition: Point;
  let lastPaneEvent: StageToolOverlayMousePanning

  yield fork(function*() {
    while(true) {
      const { windowId } = (yield take(STAGE_TOOL_OVERLAY_MOUSE_PAN_START)) as StageToolOverlayMousePanStart;
      panStartScrollPosition = getSyntheticWindow(yield select(), windowId).scrollPosition || { left: 0, top: 0 };
    }
  });

  function* scrollDelta(windowId, deltaY) {
    yield put(syntheticWindowScrolled(windowId, shiftPoint(panStartScrollPosition, {
      left: 0,
      top: -deltaY
    })));
  }

  yield fork(function*() {
    while(true) {
      const event = lastPaneEvent = (yield take(STAGE_TOOL_OVERLAY_MOUSE_PANNING)) as StageToolOverlayMousePanning;
      const { windowId, deltaY, center, velocityY: newVelocityY } = event;

      const zoom = getStageTranslate(getSelectedWorkspace(yield select()).stage).zoom;

      yield scrollDelta(windowId, deltaY / zoom);
    }
  });
  
  yield fork(function*() {
    while(true) {
      yield take(STAGE_TOOL_OVERLAY_MOUSE_PAN_END);
      const { windowId, deltaY, velocityY } = lastPaneEvent;

      const zoom = getStageTranslate(getSelectedWorkspace(yield select()).stage).zoom;
      
      yield spring(deltaY, -velocityY * VELOCITY_MULTIPLIER, function*(deltaY) {
        yield scrollDelta(windowId, deltaY / zoom);
      });
    }
  });
}

const WINDOW_SYNC_MS = 1000 / 30;

function* handleFullScreenWindow() {

  let currentFullScreenWindowId: string;
  let previousWindowBounds: Bounds;
  let waitForFullScreenMode = createDeferredPromise();

  yield fork(function*() {
    yield watch((root: ApplicationState) => getSelectedWorkspace(root).stage.fullScreenWindowId, function*(windowId, root) {
      if (windowId) {
        const window = getSyntheticWindow(root, windowId);
        previousWindowBounds = window.bounds;
        waitForFullScreenMode.resolve(true);
      } else if (currentFullScreenWindowId) {
        yield put(resized(currentFullScreenWindowId, SYNTHETIC_WINDOW, previousWindowBounds));
        previousWindowBounds = undefined;
        currentFullScreenWindowId = undefined;
        // TODO - revert window size
        waitForFullScreenMode = createDeferredPromise();
      }
      currentFullScreenWindowId = windowId;
      return true;
    }); 
  });

  yield fork(function* syncFullScreenWindowSize() {
    while(true) {
      yield call(() => waitForFullScreenMode.promise);
      const state: ApplicationState = yield select();
      const { container } = getSyntheticWindowWorkspace(state, currentFullScreenWindowId).stage;
      const rect = container.getBoundingClientRect();
      yield put(resized(currentFullScreenWindowId, SYNTHETIC_WINDOW, rect));
      yield call(() => new Promise(resolve => setTimeout(resolve, WINDOW_SYNC_MS)));
    }
  });
}



function* spring(start: number, velocityY: number, iterate: Function, damp: number = DEFAULT_MOMENTUM_DAMP, complete: Function = () => {}) {
  let i = 0;
  let v = velocityY;
  let currentValue = start;
  function* tick() {
    i += damp;
    currentValue += velocityY / (i / 1);
    if (i >= 1) {
      return complete();
    }
    yield iterate(currentValue);
    yield call(delay, MOMENTUM_DELAY);
    yield tick();
  }
  yield tick();
}
