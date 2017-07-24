import { getFileUrls } from "./local-protocol";
import { readUriAction, watchUriAction } from "aerial-sandbox2";
import { parallel, readOne, readAll, pump } from "mesh";
import { SyntheticBrowser, createSyntheticHTMLProviders } from "aerial-synthetic-browser";
import { Workspace, ApplicationState, getSelectedWorkspace, getWorkspaceMainFile } from "front-end/state";
import { BrokerBus, Kernel, PrivateBusProvider, KernelProvider } from "aerial-common";
import { BaseEvent, Dispatcher, whenStoreChanged, StoreChangedEvent } from "aerial-common2";
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

export const syntheticBrowserStarted = (workspace: Workspace, browser: SyntheticBrowser) => ({
  type: SYNTHETIC_BROWSER_STARTED,
  browser,
  workspace
});

/**
 * Service
 */

export const initWorkspaceService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  downstream,
  whenStoreChanged((state: ApplicationState) => state.selectedWorkspaceId, async ({ payload: state }: StoreChangedEvent<ApplicationState>) => {
    
    const workspace = getSelectedWorkspace(state);

    // TODO - remove 
    if (!workspace) return;

    const kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(new BrokerBus()),
      createSandboxProviders(),
      new URIProtocolProvider("local", createURIProtocolClass(upstream)),
      createSyntheticHTMLProviders()
    );

    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();

    const browser = new SyntheticBrowser(kernel);
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


    readAll(upstream(syntheticBrowserStarted(workspace, browser)));
  })
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