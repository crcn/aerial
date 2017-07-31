import { watch, diffArray, getValuesByType, eachArrayValueMutation } from "aerial-common2";
import { Kernel, KernelProvider, PrivateBusProvider, BrokerBus, Status, watchProperty, Mutation, MutationEvent } from "aerial-common";
import { createSandboxProviders, FileCacheProvider, URIProtocolProvider } from "aerial-sandbox";
import { createSyntheticHTMLProviders } from "../../providers";
import { fork, take, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { SyntheticBrowser } from "../../browser";
import {  SyntheticBrowserWindow2, SYTNTHETIC_BROWSER_WINDOW } from "../state";
import { 
  legacySyntheticDOMChanged, 
  syntheticWindowTitleChanged, 
  syntheticWindowMountChanged,
  OPEN_SYNTHETIC_WINDOW_REQUESTED, 
} from "../actions";

export function mainSyntheticBrowserSaga(kernel: Kernel) {
  return function*() {
    yield fork(syntheticWindowSaga(kernel));
  }
}

function syntheticWindowSaga(kernel: Kernel) {
  return function*() {

    const openSyntheticBrowsers = new Map<SyntheticBrowserWindow2, SyntheticBrowser>();

    kernel = new Kernel(
      kernel,
      new KernelProvider(),
      new PrivateBusProvider(new BrokerBus()),
      createSandboxProviders(),
      createSyntheticHTMLProviders(),
    );

    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
    
    yield watch((root) => root, function*(root) {
      const diffs = diffArray(Array.from(openSyntheticBrowsers.keys()), getValuesByType(root, SYTNTHETIC_BROWSER_WINDOW), (a, b) => a.$$id === b.$$id ? 1 : -1);
      const forks = [];

      eachArrayValueMutation(diffs, {
        insert({ value, index }) {
          const browser = new SyntheticBrowser(kernel);
          openSyntheticBrowsers.set(value, browser);

          forks.push(spawn(observeSyntheticBrowserState, browser, value));

          browser.open({
            uri: value.location
          });

        },
        delete({ value, index }) {

          // TODO: need to properly dispose of the synthetic browser -- observers
          // are attached to other objects defined in the kernel, so this is a memory
          // leak (CC)
          openSyntheticBrowsers.delete(value);
        },
        update({ index, newValue }) {
        }
      });

      yield* forks;

      return true;
    });
    
  }
}

function* observeSyntheticBrowserState(browser: SyntheticBrowser, window: SyntheticBrowserWindow2) {
  yield fork(observeSyntheticBrowserDOMState, browser, window);
}

function* observeSyntheticBrowserDOMState(browser: SyntheticBrowser, state: SyntheticBrowserWindow2) {
  const chan = eventChannel((emit) => {
    
    const dispatchLegacySyntheticDOMChanged = (mutation?: Mutation<any>) => {
      emit(legacySyntheticDOMChanged(state.$$id, browser.document, mutation));
    };

    const dispatchSyntheticDOMMount = (window: SyntheticBrowserWindow2, mount: HTMLElement) => {
      emit(syntheticWindowMountChanged(window.$$id, mount));
    };

    const onDocumentEvent = (event) => {
      if (event.type === MutationEvent.MUTATION) {
        dispatchLegacySyntheticDOMChanged((event as MutationEvent<any>).mutation);
      };
    }

    const dispatchTitleChanged = () => {
      const titleEl = browser.document.querySelector("title");
      emit(syntheticWindowTitleChanged(state.$$id, titleEl && titleEl.textContent));
    };
    
    const onStatusChange = (status: Status) => {
      if (status) {
        if (status.type === Status.COMPLETED) {
          browser.document.observe({ dispatch: onDocumentEvent });
          dispatchTitleChanged();
          dispatchSyntheticDOMMount(state, browser.renderer.element);
          dispatchLegacySyntheticDOMChanged();
          // TODO - need to start this after mounted dispatched
          browser.renderer.start();
        } else if (status.type === Status.ERROR) {
          // TODO
        }
      }
    }
    

    watchProperty(browser, "status", onStatusChange);

    return () => {

    };
  });

  while(true) {
    yield put(yield take(chan));
  }
}