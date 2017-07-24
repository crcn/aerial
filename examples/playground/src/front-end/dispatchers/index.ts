import { 
  parallel, 
  pump, 
  readOne, 
  when,
  readAll,
  createQueue
} from "mesh";
import { 
  SyntheticBrowser,
  createSyntheticHTMLProviders,
} from "aerial-synthetic-browser";
import { 
  URIProtocol,
  IFileResolver,
  FileCacheProvider,
  FileURIProtocol, 
  FileCacheProtocol, 
  URIProtocolProvider, 
  IURIProtocolReadResult,
  createSandboxProviders,
} from "aerial-sandbox";

import { 
  readUriAction, 
  BaseUriAction, 
  READ_URI, 
  WRITE_URI,
  ReadUriAction,
  watchUriAction,
  WriteUriAction,
  WATCH_URI,
  WatchUriAction
} from "aerial-sandbox2";

import { Types, Workspace, ApplicationState, getSelectedWorkspace, Directory, File } from "../state";
import { 
  Kernel, 
  BrokerBus, 
  KernelProvider,
  PrivateBusProvider, 
} from "aerial-common";

import { 
  BaseEvent, 
  Dispatcher, 
  routeTypes, 
  WrappedEvent,
  withStoreState,
  whenStoreChanged,
  getPathById,
  StoreChangedEvent,
} from "aerial-common2";

import {
  TREE_NODE_LABEL_CLICKED, 
  TreeNodeLabelClickedEvent,
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
} from "../components";

export const SYNTHETIC_BROWSER_STARTED = "SYNTHETIC_BROWSER_STARTED";

export type SyntheticBrowserStartedEvent = {
  browser: SyntheticBrowser,
  workspace: Workspace
} & BaseEvent;

export const syntheticBrowserStarted = (workspace: Workspace, browser: SyntheticBrowser) => ({
  type: SYNTHETIC_BROWSER_STARTED,
  browser,
  workspace
});

export const initMainDispatcher = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  workspaceDispatcher(upstream),
  filesDispatcher(upstream),
  downstream
);

const actionIsLocalProtocol = (action: BaseUriAction) => action.uri && /^local\:\/\//.test(action.uri);


const getFileUrls = (state: ApplicationState) => {
  let urls = {};
  const getFileUrls = (dir: Directory, prefix = '') => {
    for (const doc of dir.childNodes) {
      const newPrefix = `${prefix}/${doc.name}`;
      if (doc.$$type === Types.DIRECTORY) {
        urls = {...urls, ...getFileUrls(doc, newPrefix)};
      } else {
        urls[newPrefix] = doc;
      }
    }
    return urls;
  };

  for (const workspace of state.workspaces) {
    urls = {
      ...urls,
      ...getFileUrls(workspace.sourceFilesDirectory, `local://${workspace.$$id}`)
    };
  }

  return urls;
};

const filesDispatcher = (upstream: Dispatcher<any>) => parallel(
  (() => {
    const watchers = {};

    return withStoreState((state: ApplicationState) => { 

      for (const uri in watchers) {
        watchers[uri].unshift(true);
      }
      
      const urls = getFileUrls(state);
      console.log(urls);

      return when(actionIsLocalProtocol, routeTypes({
        [READ_URI]({ uri }: ReadUriAction) {
          return urls[uri];
        },
        [WATCH_URI](action: WatchUriAction) {
          const q = createQueue();
          watchers[action.uri] = q;
          
          return {
            [Symbol.asyncIterator]: () => this,
            next() {
              return q.next();
            },
            return() {
              delete watchers[action.uri];
              q.return();
            }
          }
        }
      }));
    }, upstream);
  })(),
  routeTypes({
    [TREE_NODE_LABEL_CLICKED]: (event: TreeNodeLabelClickedEvent) => {

    },
    [FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED]: (event: WrappedEvent) => {
      const name = prompt("File name");
    },
    [FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED]: (event: WrappedEvent) => {
      const name = prompt("Folder name");
    }
  })
);

const workspaceDispatcher = (upstream: Dispatcher<any>) => parallel(
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

    await browser.open({
      uri: `local://${state.selectedWorkspaceId}/index.html`
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