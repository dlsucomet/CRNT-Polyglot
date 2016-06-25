var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: './test/test-runner',
  target: 'node',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ['ts-loader']
    }]
  }
};
