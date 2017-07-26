import { Kernel, BrokerBus, PrivateBusProvider, KernelProvider } from "aerial-common";
import { createSandboxProviders, FileCacheProvider } from "aerial-sandbox";
import { parallel, readAll } from "mesh";
import { SyntheticBrowser } from "../../browser";
import { createSyntheticHTMLProviders } from "../../providers";
import { SyntheticBrowser2, SyntheticBrowserWindow2 } from "../state";
import { Dispatcher, routeTypes, whenStoreChanged, StoreChangedEvent, diffArray, eachArrayValueMutation } from "aerial-common2";
import { 
  // OPEN_SYNTHETIC_WINDOW,
  // OpenSyntheticWindowRequest
} from "../messages";

export const initSyntheticBrowserService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  (() => {

    const openSyntheticBrowsers = new Map<SyntheticBrowserWindow2, SyntheticBrowser>();

    const kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(new BrokerBus()),
      createSandboxProviders(),
      createSyntheticHTMLProviders()
    );

    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();

    return whenStoreChanged((state: SyntheticBrowser2) => state.windows, async ({ payload: state }: StoreChangedEvent<SyntheticBrowser2>) => {
      const diffs = diffArray(await readAll(openSyntheticBrowsers.keys()), state.windows, (a, b) => a.$$id === b.$$id ? 1 : -1);
      eachArrayValueMutation(diffs, {
        insert({ value, index }) {
          const browser = new SyntheticBrowser(kernel);
          browser.open({
            uri: value.location
          });

          openSyntheticBrowsers.set(value, browser);
        },
        delete({ value, index }) {

          // TODO: need to properly dispose of the synthetic browser -- observers
          // are attached to other objects defined in the kernel, so this is a memory
          // leak (CC)
          openSyntheticBrowsers.delete(value);
        },
        update({ index, newValue }) {
          console.log("UPDATE");
        }
      })
    })
  })()
);