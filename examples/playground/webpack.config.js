const {resolve} = require('path');
const webpack   = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: './src/front-end/entry.ts',
  output: {
    path: resolve(__dirname, 'lib', 'front-end'),
    filename: 'entry.bundle.js'
  },
  plugins: [
    new ExtractTextPlugin('entry.bundle.css')
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      cluster: 'null-loader?cluster',
      net: 'null-loader?net',
      tls: 'null-loader?tls',
      fs: 'null-loader?fs'
    },
    modules: [
      resolve(__dirname, 'src'),
      resolve(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
      { 
        test: /\.scss$/, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader'   },
            { 
              loader: 'sass-loader',
              options: {
                includePaths: [__dirname + "/src/front-end/scss"]
              }
            }
          ]
        })
      },
      { 
        test: /\.css$/, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader'   }
          ]
        })
      },
    ]
  }
};