const path = require('path');

module.exports = {
  entry: {
    webview: './src/webview.tsx',
    temp: './src/temp.tsx',
    // Add more entry points as needed
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
