const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins.push(new CopyWebpackPlugin({patterns:[
  {
    from: path.resolve(__dirname, 'src/static'),
    to: path.resolve(__dirname, '.webpack/renderer/static'),
  }
]}))

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
