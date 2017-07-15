const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    audiotest: './src/audiotest.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
