import { watch } from "aerial-common2";
import { select, call, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { openSyntheticWindowRequested } from "front-end/actions";
import { ApplicationState, getSelectedWorkspace, getWorkspaceMainFilePath } from "../state";

export function* mainWorkspaceSaga() {
  yield watch((state: ApplicationState) => state.selectedWorkspaceId, function*(selectedWorkspaceId, state) {
    if (!selectedWorkspaceId) return true;
    const workspace = getSelectedWorkspace(state);
    yield put(openSyntheticWindowRequested(workspace.browser.$$id, "local://" + getWorkspaceMainFilePath(workspace)));
    return true;
  });
}