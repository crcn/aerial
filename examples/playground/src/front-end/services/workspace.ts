import { identity } from "lodash";
import { readUriAction, watchUriAction } from "aerial-sandbox2";
import { parallel, readOne, readAll, pump } from "mesh";
import { initRemoteSyntheticBrowserService } from "aerial-synthetic-browser";
import { BrokerBus, Kernel, PrivateBusProvider, KernelProvider, MainDispatcherProvider } from "aerial-common";
import { Workspace, ApplicationState, getSelectedWorkspace, getWorkspaceMainFile, getWorkspaceMainFilePath, getWorkspaceById, getBoxedWorkspaceSelection } from "front-end/state";
import { SyntheticBrowser, ISyntheticBrowser, createSyntheticHTMLProviders, RemoteSyntheticBrowser, initSyntheticBrowserService,  OPEN_REMOTE_BROWSER, openSyntheticWindowRequested } from "aerial-synthetic-browser";
import { RESIZER_PATH_MOUSE_MOVED, ResizerPathMoved } from "front-end/components";
import { BaseEvent, Dispatcher, whenStoreChanged, StoreChangedEvent, whenWorker, whenMaster, whenType, publicObject, routeTypes, withStoreState, Box, scaleInnerBox, mergeBoxes, resized } from "aerial-common2";
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

/*


    
    case RESIZER_MOVED: {
      const { point, delta, workspaceId } = event as ResizerMoved;
      const workspace = getWorkspaceById(state, workspaceId);
      const translate = workspace.visualEditorSettings.translate;

      const ntop = (point.left + delta.left / translate.zoom);
      const nleft = (point.top + delta.top / translate.zoom);
    }*/



const workspaceComponentService = (upstream: Dispatcher<any>) => withStoreState((state: any) => routeTypes({
  [RESIZER_PATH_MOUSE_MOVED]: ({ workspaceId, box: newBounds }: ResizerPathMoved) => {
      const workspace = getWorkspaceById(state, workspaceId);

      // TODO - possibly use BoxStruct instead of Box since there are cases where box prop doesn't exist
      const items = getBoxedWorkspaceSelection(workspace);
      const bounds = mergeBoxes(...items.map(item => item.box));
      for (const item of items) {
        const scaledBox = scaleInnerBox(item.box, bounds, newBounds);
        readAll(upstream(resized(item.$$id, item.$$type, scaleInnerBox(item.box, bounds, newBounds))));
      }
    }
  })
, upstream);