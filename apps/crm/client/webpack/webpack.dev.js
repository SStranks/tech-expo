// @ts-check
import 'webpack-dev-server';
import CopyPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { merge } from 'webpack-merge';

import CommonConfig from './webpack.common.js';
import path from 'node:path';
// import url from 'node:url';

const CUR = './';
// const CUR = path.dirname(url.fileURLToPath(import.meta.url));

/** @type { import('webpack').Configuration } */
const DevConfig = {
  mode: 'development',
  output: {
    path: path.resolve(CUR, 'dist'),
    pathinfo: false,
    filename: 'main.js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    static: [
      {
        directory: path.resolve(CUR, 'public'),
        staticOptions: {
          extensions: ['jpeg', 'png'],
        },
      },
    ],
    historyApiFallback: true,
    // NOTE:  Can't set 'open' to true; like Create-React-App, there is a bug with accessing the browser/ports from WSL2
    open: false,
    hot: true,
    liveReload: true,
  },
  stats: {
    loggingDebug: ['sass-loader'],
    errorDetails: true,
    errorStack: true,
    warnings: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: path.resolve(CUR, 'src'),
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              onlyCompileBundledFiles: true,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.scss$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, /\.module.scss$/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /favicon/i,
        generator: [
          {
            type: 'asset',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ['imagemin-webp'],
            },
          },
        ],
      }),
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(CUR, './src/index-template.html.ejs'),
      favicon: path.resolve(CUR, './src/favicon.ico'),
      templateParameters: {
        PUBLIC_URL: process.env.PUBLIC_URL,
      },
    }),
    new CopyPlugin({ patterns: [{ from: path.resolve(CUR, './public'), noErrorOnMissing: true }] }),
    new Dotenv({ path: path.resolve(CUR, './.env.dev') }),
  ],
};

export default merge(CommonConfig, DevConfig);
