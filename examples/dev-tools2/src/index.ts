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

export type DevServerConfig = {

  /**
   * Entry template if applicable
   */

  entryTemplate?: string; 

  /**
   * base webpack configuration
   */
  
  webpackConfigPath?: string;

  /**
   * where the source files live
   */

  sourceFilesPattern: string; // ./src/**/*.pc
};

export const start = async (config: DevServerConfig) => {
  const server = await startServer(config);
};

const startServer = async (config: DevServerConfig) => {
  const port = await (getPort as any)({ port: DEFAULT_PORT });

  const webpackConfig = generateWebpackConfig(config);
  
  const compiler = webpack(webpackConfig);

  console.log(`listening on port ${port}`);
  const server = express();
  server.use(webpackDevMiddleware(compiler, {
    publicPath: "/"
  }));

  addEntryIndexRoutes(server, webpackConfig);

  server.listen(port);

  return server;
};

const addEntryIndexRoutes = (server: express.Express, config: webpack.Configuration)  => {
  for (const hash of Object.keys(config.entry)) {
    server.use(`/${hash}.html`, (req, res) => {
      res.send(`
        <html>
          <head>
          </head>
          <body>
            <script type="text/javascript" src="${hash}.js"></script>
          </body>
        </html>
      `);
    });
  }
}

const generateWebpackConfig = (config: DevServerConfig): webpack.Configuration => {

  const componentFilePaths = glob.sync(config.sourceFilesPattern);
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