const path = require('path');

module.exports = {
  mode: 'development',
  entry: './frontend/src/index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'frontend/dist')
  }
};