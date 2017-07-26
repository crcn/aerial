import { expect } from "chai";
import { mainReducer } from "../reducers";
import { flowRight, noop } from "lodash";
import { circular, readAll, readOne } from "mesh";
import { createSyntheticBrowser2, SyntheticBrowser2 } from "../state";
import { initSyntheticBrowserService } from "./synthetic-browser";
import { initStoreService, getStoreStateAction } from "aerial-common2";
import { openSyntheticWindowRequested, closeSyntheticWindowRequested } from "../messages";

describe(__filename + "#", () => {
  const initTestService = (state = createSyntheticBrowser2()) => circular((upstream) => flowRight(
    initStoreService(state, mainReducer, upstream),
    initSyntheticBrowserService(upstream)
  ));

  const getStoreState = async (dispatch) => {
    return await readOne(dispatch(getStoreStateAction())) as SyntheticBrowser2;
  };

  it("can open a new synthetic window", async () => {
    const dispatch = initTestService()(noop);
    await readAll(dispatch(openSyntheticWindowRequested("about:blank")));
    const state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(1);
    expect(state.windows[0].location).to.to.eql("about:blank");
  });

  it("can close a new synthetic window", async () => {
    const dispatch = initTestService()(noop);
    await readAll(dispatch(openSyntheticWindowRequested("about:blank")));
    let state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(1);
    expect(state.windows[0].location).to.to.eql("about:blank");
    await readAll(dispatch(closeSyntheticWindowRequested(state.windows[0].$$id)));
    state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(0);
  });
});