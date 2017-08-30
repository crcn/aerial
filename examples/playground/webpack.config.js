const {resolve} = require('path');
const {merge} = require('lodash');
const webpack   = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = merge({}, require("./webpack-base.config.js"), {
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    new HtmlWebpackPlugin({
      title: "Aerial Playground",
      template: __dirname + '/src/index.html'
    }),
  ]
});