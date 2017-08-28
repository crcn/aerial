import * as WebpackDevServer from "webpack-dev-server";
import * as Webpack from "webpack";

export type DevServerConfig = {

  /**
   * Entry template if applicable
   */

  entryTemplate?: string; 

  /**
   * base webpack configuration
   */
  
  webpackConfig?: Webpack.Configuration;

  /**
   * where the source files live
   */

  sourceFilesPattern: string; // ./src/**/*.pc
};

export const start = (config: DevServerConfig) => {

};