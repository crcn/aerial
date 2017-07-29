import { 
  Kernel, 
  Status,
  Mutation,
  BrokerBus, 
  MutationEvent, 
  watchProperty,
  KernelProvider, 
  PrivateBusProvider, 
} from "aerial-common";

import { 
  URIProtocol, 
  FileCacheProvider, 
  URIProtocolProvider,
  createSandboxProviders, 
} from "aerial-sandbox";

import { parallel, readAll } from "mesh";
import { SyntheticBrowser } from "../../browser";
import { createSyntheticHTMLProviders } from "../../providers";
import { 
  SyntheticBrowser2, 
  SyntheticBrowserWindow2, 
  SYTNTHETIC_BROWSER_WINDOW
} from "../state";

import { 
  diffArray,
  Dispatcher, 
  routeTypes,
  getPathByType,
  getValuesByType,
  whenStoreChanged,
  StoreChangedEvent,
  eachArrayValueMutation,
} from "aerial-common2";

import {
  legacySyntheticDOMChanged,
  syntheticWindowTitleChanged
} from "../messages";

export const initSyntheticBrowserService = (upstream: Dispatcher<any>, kernel: Kernel) => (downstream: Dispatcher<any>) => parallel(
  (() => {

    const openSyntheticBrowsers = new Map<SyntheticBrowserWindow2, SyntheticBrowser>();

    kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(new BrokerBus()),
      createSandboxProviders(),
      createSyntheticHTMLProviders(),
      kernel
    );


    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();

    return whenStoreChanged((root) => root, async ({ payload: state }: StoreChangedEvent<SyntheticBrowser2>) => {
      const diffs = diffArray(await readAll(openSyntheticBrowsers.keys()), getValuesByType(state, SYTNTHETIC_BROWSER_WINDOW), (a, b) => a.$$id === b.$$id ? 1 : -1);
      eachArrayValueMutation(diffs, {
        insert({ value, index }) {
          const browser = new SyntheticBrowser(kernel);
          openSyntheticBrowsers.set(value, browser);

          observeSyntheticBrowserState(browser, value, upstream);

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
      })
    })
  })()
);

const observeSyntheticBrowserState = (browser: SyntheticBrowser, window: SyntheticBrowserWindow2, upstream: Dispatcher<any>) => {
  observeSyntheticBrowserDOMState(browser, window, upstream);
};

const observeSyntheticBrowserDOMState = (browser: SyntheticBrowser, state: SyntheticBrowserWindow2, upstream: Dispatcher<any>) => {

  const dispatchLegacySyntheticDOMChanged = (mutation?: Mutation<any>) => {
    readAll(upstream(legacySyntheticDOMChanged(state.$$id, browser.document, mutation)));
  };

  const onDocumentEvent = (event) => {
    if (event.type === MutationEvent.MUTATION) {
      dispatchLegacySyntheticDOMChanged((event as MutationEvent<any>).mutation);
    }
  }

  const dispatchTitleChanged = () => {
    const titleEl = browser.document.querySelector("title");
    if (titleEl) {
      console.log(titleEl);
      readAll(upstream(syntheticWindowTitleChanged(state.$$id, titleEl.textContent)));
    }
  };
  
  const onStatusChange = (status: Status) => {
    if (status) {
      if (status.type === Status.COMPLETED) {
        browser.document.observe({ dispatch: onDocumentEvent });
        dispatchTitleChanged();
        dispatchLegacySyntheticDOMChanged();
      } else if (status.type === Status.ERROR) {
        // TODO
      }
    }
  }

  watchProperty(browser, "status", onStatusChange);
};