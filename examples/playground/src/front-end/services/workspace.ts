import { identity } from "lodash";
import { readUriAction, watchUriAction } from "aerial-sandbox2";
import { parallel, readOne, readAll, pump } from "mesh";
import { initRemoteSyntheticBrowserService } from "aerial-synthetic-browser";
import { BrokerBus, Kernel, PrivateBusProvider, KernelProvider, MainDispatcherProvider } from "aerial-common";
import { Workspace, ApplicationState, getSelectedWorkspace, getWorkspaceMainFile, getWorkspaceMainFilePath } from "front-end/state";
import { SyntheticBrowser, ISyntheticBrowser, createSyntheticHTMLProviders, RemoteSyntheticBrowser, initSyntheticBrowserService,  OPEN_REMOTE_BROWSER, openSyntheticWindowRequested } from "aerial-synthetic-browser";
import { BaseEvent, Dispatcher, whenStoreChanged, StoreChangedEvent, whenWorker, whenMaster, whenType, publicObject } from "aerial-common2";
import { FileCacheProvider, createSandboxProviders, URIProtocolProvider, URIProtocol, IURIProtocolReadResult } from "aerial-sandbox";

const createKernel = (upstream: Dispatcher<any>, sync?: boolean) => {
  const kernel = new Kernel(
    new KernelProvider(),
    new MainDispatcherProvider(upstream),
    new PrivateBusProvider(new BrokerBus()),
    createSandboxProviders(),
    new URIProtocolProvider("local", createURIProtocolClass(upstream)),
    createSyntheticHTMLProviders()
  );
  if (sync) {
    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
  }
  return kernel;
}

/**
 * Service
 */

export const initWorkspaceService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  downstream,
  // initRemoteSyntheticBrowserService(createKernel(upstream, true), upstream)(downstream),
  initSyntheticBrowserService(upstream, createKernel(upstream))(downstream),
  whenMaster(upstream, whenStoreChanged((state: ApplicationState) => state.selectedWorkspaceId, async ({ payload: state }: StoreChangedEvent<ApplicationState>) => {
    
    const workspace = getSelectedWorkspace(state);
    
    // TODO - remove 
    if (!workspace) return;

    await readAll(upstream(openSyntheticWindowRequested(workspace.browser.$$id, "local://" + getWorkspaceMainFilePath(workspace))));
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
  };
};