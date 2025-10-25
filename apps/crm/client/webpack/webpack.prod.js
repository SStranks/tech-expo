/* eslint-disable perfectionist/sort-objects */
/* eslint-disable unicorn/numeric-separators-style */
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { merge } from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import path from 'node:path';
import url from 'node:url';
import zlib from 'node:zlib';

import filterWebpackStats from './filter/filterWebpackStats.js';
import CommonConfig from './webpack.common.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type { import('webpack').Configuration } */
const ProdConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
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
        include: path.resolve(__dirname, '../src'),
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
        include: path.resolve(__dirname, '../src'),
        exclude: [/node_modules/],
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
        include: path.resolve(__dirname, '../src'),
        exclude: [/node_modules/],
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
        include: path.resolve(__dirname, '../src'),
        exclude: [/node_modules/, /\.module.scss$/],
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
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[/\\]node_modules[/\\](react|react-dom)[/\\]/,
          name: 'react',
          chunks: 'all',
          priority: 40,
        },
        graphql: {
          test: /[\\/]node_modules[\\/](graphql|@apollo|apollo-client)[\\/]/,
          name: 'graphql',
          chunks: 'all',
          priority: 30,
        },
        redux: {
          test: /[\\/]node_modules[\\/](redux|@reduxjs|react-redux)[\\/]/,
          name: 'redux',
          chunks: 'all',
          priority: 20,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
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
      template: path.resolve(__dirname, '../src/index-template.html.ejs'),
      favicon: path.resolve(__dirname, '../src/favicon.ico'),
      templateParameters: {
        // eslint-disable-next-line no-undef
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
      exclude: /bundle-stats\.html/,
      threshold: 10240,
      minRatio: 0.7,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      exclude: /bundle-stats\.html/,
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
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist/public'),
          globOptions: { ignore: ['**/img/**'] },
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, '../public/img'),
          to: path.resolve(__dirname, '../dist/img/[path][name].[contenthash][ext]'),
          noErrorOnMissing: true,
        },
        { from: path.resolve(__dirname, '../public/robots.txt'), noErrorOnMissing: true },
        { from: path.resolve(__dirname, '../public/sitemap.xml'), noErrorOnMissing: true },
      ],
    }),
    new Dotenv({ path: path.resolve(__dirname, '../.env.prod.client') }),
    new WebpackManifestPlugin({}),
    new StatsWriterPlugin({
      filename: path.resolve(__dirname, './stats/build-stats.json'),
      stats: {
        assets: true,
        chunks: true,
        modules: true,
      },
      transform: (/** @type {import('webpack').StatsCompilation} */ webpackStats) => {
        const filteredSource = filterWebpackStats(webpackStats);
        return JSON.stringify(filteredSource);
      },
    }),
  ],
};

export default merge(CommonConfig, ProdConfig);
