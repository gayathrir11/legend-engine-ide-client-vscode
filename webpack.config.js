const path = require('path');

module.exports = {
  entry: {
    ParametersEditorRenderer: './src/components/ParametersEditorRenderer.tsx',
    // Add more entry points as needed
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib', 'components'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Allow importing CSS modules:
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
  },
};
