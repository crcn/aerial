const {resolve} = require('path');
const {merge} = require('lodash');
const webpack   = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = merge({
  plugins: [
    new HtmlWebpackPlugin({
      title: "Aerial Playground",
      template: __dirname + '/src/index.html'
    }),
  ]
});