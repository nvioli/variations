const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    audiotest: './src/audiotest/index.js',
    drawnotes: './src/drawnotes/index.js',
    repeat: './src/repeat/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
