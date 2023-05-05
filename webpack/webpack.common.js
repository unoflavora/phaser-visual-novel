const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseEnvConfig = require('../config/base.config.json');

/**
 * @type {webpack.Configuration}
 */
const baseWebpackConfig = {
  entry: {
    app: path.resolve(__dirname, '../src/index.js'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      Modules: path.resolve(__dirname, '../src/js/module'),
      Assets: path.resolve(__dirname, '../src/js/assetLibrary/'),
      ProjectData: path.resolve(__dirname, '../package.json'),
      Definition: path.resolve(__dirname, '../src/js/def'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
      // {
      // 	test: [/\.vert$/, /\.frag$/],
      // 	use: "raw-loader",
      // },
      // {
      // 	test: /\.(gif|png|jpe?g|svg|xml)$/i,
      // 	use: "file-loader",
      // },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
};

function loadEnvironmentConfig(env) {
  return new Promise((resolve, reject) => {
    if (!env || !env.build) return resolve(baseEnvConfig);

    fs.readFile(path.resolve(__dirname, `../config/${env.build}.config.json`), (err, data) => {
      if (err) return reject(new Error(`File ${env.build} config is error / not found`));
      const envConfig = JSON.parse(data.toString('utf8'));
      const combinedConfig = {
        BUILD_TIME: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        ...baseEnvConfig,
        ...envConfig,
      };
      resolve(combinedConfig);
    });
  });
}

module.exports = (env) =>
  new Promise((resolve, reject) => {
    return loadEnvironmentConfig(env)
      .then((envConfig) => {
        baseWebpackConfig.plugins.push(
          new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
            CONFIG: JSON.stringify(envConfig),
            BUILD_TIME: JSON.stringify(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')),
            PROJECT_NAME: JSON.stringify(require('../package.json').name),
            PROJECT_VERSION: JSON.stringify(require('../package.json').version),
          })
        );
        resolve(baseWebpackConfig);
      })
      .catch((err) => reject(err));
  });
