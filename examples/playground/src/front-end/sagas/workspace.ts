import { watch } from "aerial-common2";
import { select, call, put, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import { openSyntheticWindowRequested } from "front-end/actions";
import { createOpenSyntheticWindowRequest } from "aerial-browser-sandbox";
import { ApplicationState, getSelectedWorkspace } from "../state";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
}

function* openDefaultWindow() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    yield put(createOpenSyntheticWindowRequest(`https://webflow.com/`, workspace.browser.$$id));
    return true;
  });
}