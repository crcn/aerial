import { identity } from "lodash";
import { getFileUrls } from "./local-protocol";
import { readUriAction, watchUriAction } from "aerial-sandbox2";
import { parallel, readOne, readAll, pump } from "mesh";
import { BrokerBus, Kernel, PrivateBusProvider, KernelProvider } from "aerial-common";
import { Workspace, ApplicationState, getSelectedWorkspace, getWorkspaceMainFile } from "front-end/state";
import { SyntheticBrowser, ISyntheticBrowser, createSyntheticHTMLProviders, RemoteSyntheticBrowser, createSyntheticBrowserWorkerProviders, OPEN_REMOTE_BROWSER } from "aerial-synthetic-browser";
import { BaseEvent, Dispatcher, whenStoreChanged, StoreChangedEvent, whenWorker, whenMaster, whenType, publicObject } from "aerial-common2";
import { FileCacheProvider, createSandboxProviders, URIProtocolProvider, URIProtocol, IURIProtocolReadResult } from "aerial-sandbox";

/**
 * Event types
 */

export const SYNTHETIC_BROWSER_STARTED = "SYNTHETIC_BROWSER_STARTED";

/**
 * Event state
 */

export type SyntheticBrowserStartedEvent = {
  browser: SyntheticBrowser,
  workspace: Workspace
} & BaseEvent;

/**
 * Event factories
 */

export const syntheticBrowserStarted = (workspace: Workspace, browser: ISyntheticBrowser) => ({
  type: SYNTHETIC_BROWSER_STARTED,
  browser,
  workspace
});

/**
 * Service
 */

export const initWorkspaceService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  downstream,
  whenWorker(upstream, whenType("PING_WORKER", async function*() {
    for (const value of [1, 2, 3, 4, 5]) {
      yield value;
    }
  })),
  whenMaster(upstream, whenStoreChanged((state: ApplicationState) => state.selectedWorkspaceId, async ({ payload: state }: StoreChangedEvent<ApplicationState>) => {
    
    const workspace = getSelectedWorkspace(state);

    // TODO - remove 
    if (!workspace) return;

    const bus = new BrokerBus();
    bus.register({
      dispatch(message) {
        console.log(message);
      }
    })

    const kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(bus),
      createSandboxProviders(),
      new URIProtocolProvider("local", createURIProtocolClass(upstream)),
      createSyntheticHTMLProviders()
    );

    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();

    // const browser = new SyntheticBrowser(kernel);
    const browser = new RemoteSyntheticBrowser(kernel);
    browser.renderer.start();

    const urls = getFileUrls(state);
    const mainFile = getWorkspaceMainFile(workspace);
    let mainUrl;
    for (mainUrl in urls) {
      if (urls[mainUrl] === mainFile) {
        break;
      }
    }
    await browser.open({
      uri: mainUrl
    });

    // for testing
    pump(upstream(publicObject(identity)({ type: "PING_WORKER" })), (value) => new Promise((resolve) => {
      console.log("PUMP", value);
      setTimeout(resolve, 500);
    }));

    readAll(upstream(syntheticBrowserStarted(workspace, browser)));
  }))
);


const createURIProtocolClass = (upstream: Dispatcher<any>) => {
  return class extends URIProtocol {
    read(uri: string): Promise<IURIProtocolReadResult> {
      return readOne(upstream(readUriAction(uri))) as any;
    }
    write(uri: string, content: any, options?: any): Promise<any> {
      return Promise.resolve();
    }
    fileExists(uri: string): Promise<boolean> {
      return Promise.resolve(true);
    }
    watch2(uri: string, onChange: () => any) {
      const watcher = upstream(watchUriAction(uri));
      pump(watcher, onChange);
      return {
        dispose() {
          watcher.return();
        }
      };
    }
  }
}