import { delay } from "redux-saga";
import { Point, shiftPoint } from "aerial-common2";
import { take, fork, select, put, call } from "redux-saga/effects";
import { 
  getSyntheticNodeWindow, 
  syntheticWindowScrolled,
  createSyntheticNodeTextContentChanged, 
  createSyntheticNodeValueStoppedEditing,
} from "aerial-browser-sandbox";
import { 
  ApplicationState,
  getWorkspaceById,
  getSyntheticWindow,
  getSelectedWorkspace, 
  getSyntheticNodeWorkspace, 
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
}

function* handleTextEditChanges() {
  while(true) {
    const { sourceEvent, nodeId } = (yield take(STAGE_TOOL_EDIT_TEXT_CHANGED)) as StageToolEditTextChanged;
    const state = yield select();
    const window = getSyntheticNodeWindow(state, nodeId);
    const text = String(sourceEvent.target.value || "").trim();
    const workspace = getSyntheticNodeWorkspace(state, nodeId);
    yield put(createSyntheticNodeTextContentChanged(window.$$id, nodeId, text));
  }
}

function* handleTextEditBlur() {
  while(true) {
    const { sourceEvent, nodeId } = (yield take(STAGE_TOOL_EDIT_TEXT_BLUR)) as StageToolEditTextBlur;
    const state = yield select();
    const window = getSyntheticNodeWindow(state, nodeId);
    yield put(createSyntheticNodeValueStoppedEditing(window.$$id, nodeId));
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

      const zoom = getSelectedWorkspace(yield select()).stage.translate.zoom;

      yield scrollDelta(windowId, deltaY / zoom);
    }
  });
  
  yield fork(function*() {
    while(true) {
      yield take(STAGE_TOOL_OVERLAY_MOUSE_PAN_END);
      const { windowId, deltaY, velocityY } = lastPaneEvent;

      const zoom = getSelectedWorkspace(yield select()).stage.translate.zoom;
      
      yield spring(deltaY, -velocityY * VELOCITY_MULTIPLIER, function*(deltaY) {
        yield scrollDelta(windowId, deltaY / zoom);
      });
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
