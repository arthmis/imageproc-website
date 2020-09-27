const path = require('path');

module.exports = {
  entry: {
    bundle_worker: path.resolve(__dirname, 'js/worker.js'),
    index: path.resolve(__dirname, 'js/main.js'),
  },
  // devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'js/dist')
  }
};