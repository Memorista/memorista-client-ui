const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin');
const { BannerPlugin } = require('webpack');
const packageInformation = require('./package.json');

const licenseFileUrl = `https://unpkg.com/${packageInformation.name}@${packageInformation.version}/dist/oss-licenses.json`;

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new LicensePlugin({
      licenseOverrides: {
        'identicon.js@2.3.3': 'BSD-2-Clause',
      },
    }),
    new BannerPlugin({
      banner: `For license information please see: ${licenseFileUrl}`,
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
