import { watch } from "aerial-common2";
import { select, call, put, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import { openSyntheticWindowRequested, STAGE_TOOL_NODE_OVERLAY_CLICKED } from "front-end/actions";
import { createOpenSyntheticWindowRequest } from "aerial-browser-sandbox";
import { ApplicationState, getSelectedWorkspace, getWorkspaceMainFilePath } from "../state";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
}

function* openDefaultWindow() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    yield put(createOpenSyntheticWindowRequest(`http://www.jisiguo.com/about`, workspace.browser.$$id));
    return true;
  });
}