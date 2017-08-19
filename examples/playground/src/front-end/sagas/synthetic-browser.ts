import { take, fork, select, put } from "redux-saga/effects";
import { getSyntheticNodeWorkspace, getSelectedWorkspace } from "front-end/state";
import { createSyntheticNodeTextContentChanged, getSyntheticNodeWindow, createSyntheticNodeValueStoppedEditing } from "aerial-browser-sandbox";
import { STAGE_TOOL_EDIT_TEXT_CHANGED, DELETE_SHORCUT_PRESSED, STAGE_TOOL_EDIT_TEXT_BLUR, StageToolEditTextChanged, StageToolEditTextBlur } from "front-end/actions";

export function* frontEndSyntheticBrowserSaga() {
  yield fork(handleTextEditChanges);
  yield fork(handleTextEditBlur);
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
