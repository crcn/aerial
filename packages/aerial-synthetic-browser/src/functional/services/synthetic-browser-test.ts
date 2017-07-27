import { expect } from "chai";
import {syntheticBrowserReducer } from "../reducers";
import { flowRight, noop } from "lodash";
import { circular, readAll, readOne } from "mesh";
import { createSyntheticBrowser2, SyntheticBrowser2 } from "../state";
import { initSyntheticBrowserService } from "./synthetic-browser";
import { initStoreService, getStoreStateAction } from "aerial-common2";
import { createTestKernel, timeout, omit$$idDeep } from "../../test";
import { openSyntheticWindowRequested, closeSyntheticWindowRequested } from "../messages";

describe(__filename + "#", () => {
  const initTestService = (state = createSyntheticBrowser2(), mockFiles?: any) => circular((upstream) => flowRight(
    initStoreService(state, syntheticBrowserReducer, upstream),
    initSyntheticBrowserService(upstream, createTestKernel({
      sandboxOptions: {
        mockFiles: mockFiles
      }
    }))
  ));

  const getStoreState = async (dispatch) => {
    return await readOne(dispatch(getStoreStateAction())) as SyntheticBrowser2;
  };

  it("can open a new synthetic window", async () => {
    const initialState = createSyntheticBrowser2();
    const dispatch = initTestService(initialState, {
      "test.html": `hello`
    })(noop);
    await readAll(dispatch(openSyntheticWindowRequested(initialState.$$id, "file://test.html")));
    const state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(1);
    expect(state.windows[0].location).to.to.eql("file://test.html");
  });

  it("can close a new synthetic window", async () => {
    const initialState = createSyntheticBrowser2();
    const dispatch = initTestService(initialState, {
      "test.html": `hello`
    })(noop);
    await readAll(dispatch(openSyntheticWindowRequested(initialState.$$id, "file://test.html")));
    let state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(1);
    expect(state.windows[0].location).to.to.eql("file://test.html");
    await readAll(dispatch(closeSyntheticWindowRequested(state.windows[0].$$id)));
    state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(0);
  });

  it("synchronizes the DOM nodes of the synthetic browser to the state", async () => {
    const initialState = createSyntheticBrowser2();
    const dispatch = initTestService(initialState, {
      "test.html": `hello`
    })(noop);
    await readAll(dispatch(openSyntheticWindowRequested(initialState.$$id, "file://test.html")));
    let state = await getStoreState(dispatch);
    expect(state.windows.length).to.to.eql(1);

    await timeout(100);

    state = await getStoreState(dispatch);
    expect(omit$$idDeep(state)).to.eql({
      "windows": [
        {
          "computedStyles": [],
          "location": "file://test.html",
          "$$type": "SYNTHETIC_BROWSER_WINDOW",
          "document": {
            "$$type": "DOM_DOCUMENT",
            "nodeName": "#document",
            "nodeType": 9,
            "childNodes": [
              {
                "$$type": "DOM_ELEMENT",
                "nodeName": "html",
                "nodeType": 1,
                "childNodes": [
                  {
                    "$$type": "DOM_ELEMENT",
                    "nodeName": "head",
                    "nodeType": 1,
                    "childNodes": [],
                    "attributes": {}
                  },
                  {
                    "$$type": "DOM_ELEMENT",
                    "nodeName": "body",
                    "nodeType": 1,
                    "childNodes": [
                      {

                        "$$type": "DOM_TEXT_NODE",
                        "nodeName": "#text",
                        "nodeType": 3,
                        "childNodes": [],
                        "nodeValue": "hello"
                      }
                    ],
                    "attributes": {}
                  }
                ],
                "attributes": {}
              }
            ]
          }
        }
      ],
      "$$type": "SYNTHETIC_BROWSER"
    });
  });
});