const {resolve} = require('path');
const webpack   = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/front-end/entry.ts',
  output: {
    path: resolve(__dirname, 'lib', 'front-end'),
    filename: 'entry.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Paperclip Dev server",
      template: './src/index.html'
    }),
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
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
        loader: 'url-loader?limit=1000'
      },
      { 
        test: /\.scss$/, 
        use: [{
            loader: "style-loader" 
        }, {
            loader: "css-loader" 
        }, {
            loader: "sass-loader",
            options: {
              includePaths: [__dirname + '/src']
            }
        }]
      },
      { 
        test: /\.css$/, 
        use: [{
            loader: "style-loader" 
        }, {
            loader: "css-loader" 
        }]
      },
    ]
  }
};