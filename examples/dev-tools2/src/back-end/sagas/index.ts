import { take, fork, spawn, takeEvery, call, put, select } from "redux-saga/effects";
import { FileCacheUpdaterPlugin } from "../webpack";
import { eventChannel } from "redux-saga";
import { merge, extend } from "lodash";
import * as md5 from "md5";
import * as io from "socket.io";
import * as cors from "cors";
import * as fs from "fs";
import { logDebugAction, logInfoAction } from "aerial-common2";
import * as chokidar from "chokidar";
import * as glob from "glob";
import * as path from "path";
import * as webpack from "webpack";
import * as multipart from "connect-multiparty";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as WebpackDevServer from "webpack-dev-server";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { ApplicationState, DevConfig, BundleEntryInfo } from "../state";
import { bubbleEventChannel, createSocketIOSaga } from "../../common";
import { fileEditorSaga } from "./file-editor";
import { 
  FILE_CHANGED,
  FILE_ADDED,
  FILE_REMOVED,
  BUNDLED,
  APPLICATION_STARTED, 
  bundleInfoChanged,
  bundled,
  expressServerStarted, 
  EXPRESS_SERVER_STARTED,
  fileAction,
  fileAdded,
  fileRemoved,
  fileChanged,
} from "../actions";

const DEFAULT_PORT = 8080;

const BASE_WEBPACK_CONFIG: webpack.Configuration = {
  name: "dev tools",
  watch: true,
  cache: true,
  devtool: "inline-source-map",
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: false,
    warnings: true,
    publicPath: false
  },
	output: {
		path: "/"
		// no real path is required, just pass "/"
		// but it will work with other paths too.
  }
};  

export function* mainSaga() {

  // TODO - move all this stuff to new saga
  yield fork(handleApplicationStarted);
  yield fork(fileEditorSaga);
}

function* handleApplicationStarted() {
  yield take(APPLICATION_STARTED);
  yield fork(watchFiles);
  yield fork(startExpressServer);
  yield fork(handleBundled);
}

function* startExpressServer() {
  const state: ApplicationState = yield select();
  const port = state.config.port;
  
  const webpackConfig = yield call(generateWebpackConfig, state.config);

  yield put(logInfoAction(`Added ${Object.keys(webpackConfig.entry).length} entries`));
  
  const compiler = webpack(webpackConfig);
  yield watchCompilation(compiler);

  yield put(logInfoAction(`dev server is now available at *http://localhost:${port}*`));

  const server = express();

  // server.use(multipart());
  server.use(bodyParser.json());
  server.use(cors());
  server.use(webpackDevMiddleware(compiler, {
    publicPath: "/",
    stats: webpackConfig.stats
  }));

  yield fork(handleFileCache, server, state.config, webpackConfig);

  yield fork(addEntryIndexRoutes, server, state.config, webpackConfig);
  addMainIndexRoute(server, webpackConfig);

  server.use(express.static(__dirname + "/../../front-end"));

  const httpServer = server.listen(port);

  yield fork(createSocketIOSaga(io(httpServer)));

  return server;
}

function* watchCompilation(compiler: webpack.Compiler) {
  yield bubbleEventChannel((emit) => {
    compiler.plugin("done", (stats: any) => {
      emit(bundled(stats));
    });
    return () => { };
  });
}

const takeAllRequests = (route: Function, handler: (req: express.Request, res: express.Response) => any) => fork(function*() {
  const chan = eventChannel((emit) => {
    route((req, res) => emit([req, res]));
    return () => {};
  });

  while(true) {
    const [req, res] = yield take(chan);
    yield spawn(handler, req, res);
  }
});

function* addEntryIndexRoutes(server: express.Express, { getEntryIndexHTML }: DevConfig, webpackConfig: webpack.Configuration) {
  for (const hash of Object.keys(webpackConfig.entry)) {
    const filePath = webpackConfig.entry[hash];
    yield takeAllRequests(server.use.bind(server, `/${hash}.html`), function*(req, res) {
      const state: ApplicationState = yield select();
      const info = state.bundleInfo && state.bundleInfo[hash];
      const html = injectPreviewBundle(hash, info, getEntryIndexHTML({ entryName: hash, filePath }));
      res.send(html);
    });
  }
};

function* handleFileCache(server: express.Express, { getEntryIndexHTML }: DevConfig, webpackConfig: webpack.Configuration) {
  yield takeAllRequests(server.get.bind(server, `/file/:uri`), contrainToCWD(function*(req, res) {
    const { uri } = req.params;
    res.sendFile(getUriFilePath(uri));
  }));

  yield takeAllRequests(server.post.bind(server, `/file/:uri`), contrainToCWD(function*(req, res) {
    const { uri } = req.params;    
    const json = req.body;
    const action = json;
    yield put(fileAction(getUriFilePath(uri), action));
  }));
}

const getUriFilePath = (uri: string) => require.resolve(uri.replace(/file:\/\//, ""));

const contrainToCWD = (handler: (req: express.Request, res: express.Response) => any) => function*(req: express.Request, res: express.Response) {
  const { uri } = req.params;
  if (!uriIsInCWD(uri)) {
    res.statusCode = 401;
    return res.send("Not authorized");
  }

  yield call(handler, req, res);
};

const uriIsInCWD = (uri: string) => {
  try {
    const cwd      = process.cwd();
    const filePath = getUriFilePath(uri);
    return filePath.indexOf(cwd) === 0;
  } catch(e) {
    return false;
  }
}

const injectPreviewBundle = (hash: string, info: BundleEntryInfo, html) => {
  return html.replace('<head>', `<head>
    <script type="text/javascript" src="preview.bundle.js"></script>
    <script>
      startPreview("${hash}", ${JSON.stringify(info)});
    </script>
  `);
};

const addMainIndexRoute = (server: express.Express, webpackConfig: webpack.Configuration) => {
  const entryHashes = Object.keys(webpackConfig.entry);
  server.all(/^(\/|\/index.html)$/, (req, res) => {
    res.send(`
      <html>
        <head>
          <script type="text/javascript" src="master.bundle.js"></script>
          <script>
            startMaster(${JSON.stringify(entryHashes)});
          </script>
        </head>
        <body>
        </body>
      </html>
    `);
  });
};

function* generateWebpackConfig(config: DevConfig) {

  const componentFilePaths = glob.sync(config.sourceFilePattern);

  const externWebpackConfig = config.webpackConfigPath ? require(config.webpackConfigPath) : {};

  const webpackConfig = merge({
    plugins: [],
  }, externWebpackConfig, {
    plugins: [
      ...(externWebpackConfig.plugins || []),
      yield call(createFileCacheUpdaterPlugin)
    ]
  }, BASE_WEBPACK_CONFIG);

  extend(webpackConfig, {
    entry: {},
    output: {
      path: "/",
      library: "entry",
      libraryTarget: "this"
    }
  });
  
  componentFilePaths.forEach((filePath) => {
    const hash: string = getFilePathHash(filePath);
    webpackConfig.entry[hash] = filePath;
  });

  return webpackConfig;
}

const getFilePathHash = filePath => `${md5(filePath)}`;

function* createFileCacheUpdaterPlugin() {
  const fileCacheUpdater = new FileCacheUpdaterPlugin();
  yield spawn(function*() {
    while(true) {
      fileCacheUpdater.dispatch(yield take());
    }
  });

  return fileCacheUpdater;
}


function* watchFiles() {

  const state: ApplicationState = yield select();
  yield bubbleEventChannel((emit) => {
    const watcher = chokidar.watch(state.config.sourceFilePattern);
    watcher.on("add", (path) => {
      emit(logDebugAction(`added: ${path}`));
      emit(fileAdded(path));
    });
    watcher.on("change", (path) => {
      emit(logDebugAction(`changed: ${path}`));
      emit(fileChanged(path));
    });
    watcher.on("removed", (path) => {
      emit(logDebugAction(`removed: ${path}`));
      emit(fileRemoved(path));
    });
    return () => {};
  });
}

function* handleBundled() {
  while(true) {
    yield take(BUNDLED);
    const state: ApplicationState = yield select();
    yield put(bundleInfoChanged(state.bundleInfo));
  }
}