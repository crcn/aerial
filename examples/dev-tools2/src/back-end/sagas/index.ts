import { take, fork, spawn, takeEvery, call, put, select } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { merge, extend } from "lodash";
import * as md5 from "md5";
import * as io from "socket.io";
import { logDebugAction, logInfoAction } from "aerial-common2";
import * as chokidar from "chokidar";
import * as glob from "glob";
import * as path from "path";
import * as webpack from "webpack";
import * as express from "express";
import * as getPort from "get-port";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as WebpackDevServer from "webpack-dev-server";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { ApplicationState, DevConfig, BundleEntryInfo } from "../state";
import { bubbleEventChannel, createSocketIOSaga } from "../../common";
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
  fileAdded,
  fileRemoved,
  fileChanged,
} from "../actions";

const DEFAULT_PORT = 8080;

const BASE_WEBPACK_CONFIG: webpack.Configuration = {
  name: "dev tools",
  watch: true,
  cache: true,
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
  yield fork(handleApplicationStarted);
}

function* handleApplicationStarted() {
  yield take(APPLICATION_STARTED);
  yield fork(watchFiles);
  yield fork(startExpressServer);
  yield fork(handleBundled);
}

function* startExpressServer() {
  const state: ApplicationState = yield select();
  const port = yield call(getPort, { port: DEFAULT_PORT });
  
  const webpackConfig = generateWebpackConfig(state.config);

  yield put(logInfoAction(`Added ${Object.keys(webpackConfig.entry).length} entries`));
  
  const compiler = webpack(webpackConfig);
  yield watchCompilation(compiler);

  yield put(logInfoAction(`dev server is now available at *http://localhost:${port}*`));

  const server = express();

  server.use(webpackDevMiddleware(compiler, {
    publicPath: "/",
    stats: webpackConfig.stats
  }));

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

function* addEntryIndexRoutes(server: express.Express, { getEntryIndexHTML }: DevConfig, webpackConfig: webpack.Configuration) {
  for (const hash of Object.keys(webpackConfig.entry)) {
    yield fork(function*() {
      const filePath = webpackConfig.entry[hash];
      const chan = eventChannel((emit) => {
        server.use(`/${hash}.html`, (req, res) => emit([req, res]));
        return () => {};
      });

      while(true) {
        const [req, res] = yield take(chan);
        yield spawn(function*() {
          const state: ApplicationState = yield select();
          const info = state.bundleInfo && state.bundleInfo[hash];
          const html = injectPreviewBundle(hash, info, getEntryIndexHTML({ entryName: hash, filePath }));
          res.send(html);
        });
      }
    });
  }
};

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

const generateWebpackConfig = (config: DevConfig): webpack.Configuration => {

  const componentFilePaths = glob.sync(config.sourceFilePattern);
  const webpackConfig = merge({
    plugins: [],
  }, config.webpackConfigPath ? require(config.webpackConfigPath) : {}, BASE_WEBPACK_CONFIG);

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