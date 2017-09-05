const {resolve} = require('path');
const {merge} = require('lodash');

const base = require('./webpack-base.config.js');

module.exports = merge({}, base, {
  module: merge({}, base.module, {
    rules: [
      ...base.module.rules,
      { test: /\.vue$/, use: 'vue-loader' },
    ]
  })
});