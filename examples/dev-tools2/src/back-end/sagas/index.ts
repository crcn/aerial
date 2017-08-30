import { take, fork, takeEvery, call, select } from "redux-saga/effects";
import { merge, extend } from "lodash";
import * as md5 from "md5";
import * as glob from "glob";
import * as path from "path";
import * as webpack from "webpack";
import * as express from "express";
import * as getPort from "get-port";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as WebpackDevServer from "webpack-dev-server";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { ApplicationState, DevConfig } from "../state";
import { APPLICATION_STARTED, expressServerStarted, EXPRESS_SERVER_STARTED } from "../actions";

const DEFAULT_PORT = 8080;


const BASE_WEBPACK_CONFIG: webpack.Configuration = {
  name: "dev tools",
  watch: true,
  cache: true,
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
  yield fork(startExpressServer);
}

function* startExpressServer() {
  const state: ApplicationState = yield select();
  const port = yield call(getPort, { port: DEFAULT_PORT });
  
  const webpackConfig = generateWebpackConfig(state.config);
  
  const compiler = webpack(webpackConfig);

  console.log(`listening on port ${port}`);
  const server = express();

  server.use(webpackDevMiddleware(compiler, {
    publicPath: "/"
  }));

  addEntryIndexRoutes(server, state.config, webpackConfig);
  addMainIndexRoute(server, webpackConfig);

  server.use(express.static(__dirname + "/../../front-end"));

  server.listen(port);

  return server;
}

const addEntryIndexRoutes = (server: express.Express, { getEntryIndexHTML }: DevConfig, webpackConfig: webpack.Configuration)  => {
  for (const hash of Object.keys(webpackConfig.entry)) {
    const filePath = webpackConfig.entry[hash];
    server.use(`/${hash}.html`, (req, res) => {
      res.send(getEntryIndexHTML({ entryName: hash, filePath }));
    });
  }
};

const addMainIndexRoute = (server: express.Express, webpackConfig: webpack.Configuration) => {

  const entryHashes = Object.keys(webpackConfig.entry);

  server.all(/^(\/|\/index.html)$/, (req, res) => {
    res.send(`
      <html>
        <head>
          <script type="text/javascript" src="master.js"></script>
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
      libraryTarget: "var"
    }
  });
  
  componentFilePaths.forEach((filePath) => {
    const hash: string = getFilePathHash(filePath);
    webpackConfig.entry[hash] = filePath;
  });

  console.log(`Added ${componentFilePaths.length} entries`);

  return webpackConfig;
}

const getFilePathHash = filePath => `${md5(filePath)}`;