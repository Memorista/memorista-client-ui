const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin');
const { BannerPlugin } = require('webpack');
const packageInformation = require('./package.json');

const licenseFileUrl = `https://unpkg.com/${packageInformation.name}@${packageInformation.version}/dist/oss-licenses.json`;

module.exports = merge(common, {
  mode: 'production',
  output: { path: path.resolve(__dirname, './dist'), filename: 'index.bundle.js', clean: true },
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
});
