const {resolve} = require('path');
const webpack   = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const glob = require("glob");

const files = glob.sync(__dirname + "/../playground/src/**/*.tsx");

console.log(files.length);


const entries = {};

files.forEach((fileName, i) => {
  entries[i] = fileName;
});

console.log(entries);

module.exports = {
  entry: entries,
  output: {
    path: resolve(__dirname, 'lib', 'front-end'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Paperclip Dev server",
      template: './src/index.html'
    }),
    new webpack.ProvidePlugin({
      "systemjs": "systemjs"
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      cluster: 'null-loader?cluster',
      net: 'null-loader?net',
      tls: 'null-loader?tls',
      fs: 'null-loader?fs',
      systemjs: require.resolve("systemjs"),
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