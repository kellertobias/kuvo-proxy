const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const plugins = []

plugins.push(new CopyWebpackPlugin({patterns: [
  {
    from: path.resolve(__dirname, 'client'),
    to: path.resolve(__dirname, '.webpack/main/static/client'),
  }
]}))

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  plugins,
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.json']
  },
};