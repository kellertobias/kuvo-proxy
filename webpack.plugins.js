const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const plugins = [
  new ForkTsCheckerWebpackPlugin()
]

module.exports = plugins;
