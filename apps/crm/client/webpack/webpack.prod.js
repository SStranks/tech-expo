/* eslint-disable perfectionist/sort-objects */
// @ts-check
/* eslint-disable unicorn/numeric-separators-style */
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
// import filterWebpackStats from '@bundle-stats/plugin-webpack-filter';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { merge } from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import path from 'node:path';
import zlib from 'node:zlib';

import filterWebpackStats2 from './filterWebpackStats.cjs';
// import url from 'node:url';
import CommonConfig from './webpack.common.js';

const CUR = './';
// const CUR = path.dirname(url.fileURLToPath(import.meta.url));

/** @type { import('webpack').Configuration } */
const ProdConfig = {
  mode: 'production',
  output: {
    path: path.resolve(CUR, 'dist'),
    filename: '[name].bundle.[contenthash].js',
    chunkFilename: '[name].[chunkhash].js',
    assetModuleFilename: 'assets/[ext]/[name].[hash][ext]',
    clean: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (/** @type {string} */ assetUrl) => {
                  if (assetUrl.startsWith('/public')) return false;
                  return true;
                },
              },
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
              importLoaders: 2, // => post-css and sass
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
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
        exclude: /\.module.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: 'sass-embedded',
              api: 'modern-compiler',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[/\\]node_modules[/\\](react|react-dom)[/\\]/,
          name: 'react',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      '...',
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: ['log', 'info'],
          },
        },
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        test: /\.(jpeg|jpg|webp|avif|png|gif)$/i,
        exclude: /(favicon)/i,
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: { quality: 100 },
              webp: { lossless: true },
              avif: { lossless: true },
              png: { compressionLevel: 8 },
              gif: { progressive: true },
            },
          },
        },
      }),
      new ImageMinimizerPlugin({
        test: /\.(svg)$/i,
        minimizer: {
          implementation: ImageMinimizerPlugin.svgoMinify,
          options: {
            encodeOptions: {
              multiplass: true,
              plugins: ['preset-default'],
            },
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(CUR, './src/index-template.html.ejs'),
      favicon: path.resolve(CUR, './src/favicon.ico'),
      templateParameters: {
        PUBLIC_URL: process.env.PUBLIC_URL,
      },
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.7,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
      threshold: 10240,
      minRatio: 0.7,
      deleteOriginalAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(CUR, 'public'),
          to: path.resolve(CUR, 'dist/public'),
          globOptions: { ignore: ['**/img/**'] },
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(CUR, 'public/img'),
          to: path.resolve(CUR, 'dist/img/[path][name].[contenthash][ext]'),
          noErrorOnMissing: true,
        },
        { from: path.resolve(CUR, 'public/robots.txt'), noErrorOnMissing: true },
        { from: path.resolve(CUR, 'public/sitemap.xml'), noErrorOnMissing: true },
      ],
    }),
    new Dotenv({ path: path.resolve(CUR, './.env.prod') }),
    new WebpackManifestPlugin({}),
    new StatsWriterPlugin({
      filename: '../webpack/build-stats.json',
      stats: {
        assets: true,
        chunks: true,
        modules: true,
      },
      transform: (/** @type {import('webpack').StatsCompilation} */ webpackStats) => {
        // const filteredSource = filterWebpackStats.default(webpackStats, {});

        // @ts-expect-error No type file
        const filteredSource = filterWebpackStats2.default(webpackStats, {});
        return JSON.stringify(filteredSource);
      },
    }),
  ],
};

export default merge(CommonConfig, ProdConfig);
