const {resolve} = require('path');
const webpack   = require('webpack');

module.exports = {
  entry: './src/front-end/entry.ts',
  output: {
    path: resolve(__dirname, 'lib', 'front-end'),
    filename: 'entry.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      cluster: 'null-loader?cluster',
      ansi_up: 'null-loader?ansi_up'
    },
    modules: [
      resolve(__dirname, 'src'),
      resolve(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [
      { test: /.tsx?$/, use: 'ts-loader' },
      { 
        test: /.scss$/, 
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader'   },
          { loader: 'sass-loader'  }
        ]
      },
    ]
  }
};