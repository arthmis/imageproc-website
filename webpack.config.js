const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    bundle_worker: './frontend/js/worker.js',
    index: './frontend/js/main.js',
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'frontend/js/dist')
  }
};