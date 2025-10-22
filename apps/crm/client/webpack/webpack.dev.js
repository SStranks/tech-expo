// @ts-check
/* eslint-disable perfectionist/sort-objects */
import 'webpack-dev-server';
import CopyPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { merge } from 'webpack-merge';

import path from 'node:path';
import url from 'node:url';

import CommonConfig from './webpack.common.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type { import('webpack').Configuration } */
const DevConfig = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    pathinfo: false,
    filename: 'main.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]',
  },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    static: [
      {
        directory: path.resolve(__dirname, 'public'),
        staticOptions: {
          extensions: ['jpeg', 'png'],
        },
      },
    ],
    historyApiFallback: true,

    /*
     * NOTE:
     * Can't use 'false' - dev-sever uses windows powershell to open browser
     * Usage: manually open browser at localhost:port
     */
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
        include: path.resolve(__dirname, 'src'),
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
                exportLocalsConvention: 'as-is',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: 'sass-embedded',
              api: 'modern-compiler',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, /\.module.scss$/],
        use: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: { implementation: 'sass-embedded', api: 'modern-compiler' } },
        ],
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
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, './src/index-template.html.ejs'),
      favicon: path.resolve(__dirname, './src/favicon.ico'),
      templateParameters: {
        // eslint-disable-next-line no-undef
        PUBLIC_URL: process.env.PUBLIC_URL,
      },
    }),
    new CopyPlugin({ patterns: [{ from: path.resolve(__dirname, './public'), noErrorOnMissing: true }] }),
    new Dotenv({ path: path.resolve(__dirname, './.env.dev.client') }),
  ],
};

export default merge(CommonConfig, DevConfig);
