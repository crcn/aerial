import { watch } from "aerial-common2";
import { take, select, call, put, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import { STAGE_TOOL_OVERLAY_MOUSE_CLICKED, StageToolOverlayClicked } from "../actions";
import { 
  getUri,
  SEnvNodeTypes, 
  SyntheticWindow, 
  getSyntheticNodeById, 
  SyntheticHTMLElement, 
  getSyntheticNodeWindow,
  createOpenSyntheticWindowRequest, 
} from "aerial-browser-sandbox";
import { 
  Workspace,
  ApplicationState, 
  getSelectedWorkspace, 
  getSyntheticWindowWorkspace,
  getStageToolMouseNodeTargetUID,
} from "../state";

export function* mainWorkspaceSaga() {
  yield fork(openDefaultWindow);
  yield fork(handleAltClickElement);
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
      const element = node as SyntheticHTMLElement;
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