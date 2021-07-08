const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: { path: path.resolve(__dirname, './build'), filename: 'index.bundle.js', clean: true },
  devtool: 'inline-source-map',
  devServer: { contentBase: path.resolve(__dirname, './dist') },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
  ],
});
