import { delay } from "redux-saga";
import { take, fork, select, put, call } from "redux-saga/effects";
import { 
  getSyntheticNodeWindow, 
  syntheticWindowScrolling,
  createSyntheticNodeTextContentChanged, 
  createSyntheticNodeValueStoppedEditing,
} from "aerial-browser-sandbox";
import { 
  ApplicationState,
  getWorkspaceById,
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
  STAGE_TOOL_EDIT_TEXT_CHANGED, 
  STAGE_TOOL_OVERLAY_MOUSE_PANNING,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
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

function* handleWindowMousePanned() {

  let deltaTop  = 0;
  let deltaLeft = 0;
  let currentWindowId: string;

  yield fork(function*() {
    while(true) {
      const { windowId } = (yield take(STAGE_TOOL_OVERLAY_MOUSE_PAN_END)) as StageToolOverlayMousePanEnd;
      yield spring(deltaTop, 0, function*(deltaTop) {
        console.log(deltaTop);
        yield put(syntheticWindowScrolling(windowId, { left: 0, top: deltaTop }));
      });
    }
  });

  yield fork(function*() {
    while(true) {
      const { windowId, delta } = (yield take(STAGE_TOOL_OVERLAY_MOUSE_PANNING)) as StageToolOverlayMousePanning;
      deltaTop = delta.top;
      yield put(syntheticWindowScrolling(windowId, delta));
    }
  });
  
}

function* spring(start: number, end: number, iterate: Function, damp: number = 0.1, complete: Function = () => {}) {
  const change = end - start;
  let i = 0;
  function* tick() {
    i += damp;
    const currentValue = start + change * (i / 1);
    if (i >= 1) {
      return complete();
    }
    yield iterate(currentValue);
    yield call(delay, 50);
    yield tick();
  }
  yield tick();
}
