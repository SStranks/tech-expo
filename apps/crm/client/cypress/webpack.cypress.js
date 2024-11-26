/* eslint-disable perfectionist/sort-objects */
import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));

const config = {
  mode: 'development',
  entry: path.resolve(CUR, '../src/index.tsx'),
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    port: 3005,
    static: [
      {
        directory: path.resolve(CUR, '../public'),
        staticOptions: {
          extensions: ['jpeg', 'png'],
        },
      },
    ],
    historyApiFallback: true,
    open: false,
    hot: true,
    liveReload: true,
  },
  stats: {
    loggingDebug: ['sass-loader'],
    errorDetails: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    // For use in CSS url() imports e.g url(~svg/desktop/a.svg)
    // Prefix with ~ to initiate module resolver
    modules: ['node_modules', path.resolve(CUR, '../src/assets')],
    alias: {
      '@Shared': path.resolve(CUR, '../../shared'),
      '@Img': path.resolve(CUR, '../src/assets/img'),
      '@Sass': path.resolve(CUR, '../src/assets/sass'),
      '@Svg': path.resolve(CUR, '../src/assets/svg'),
      '@Components': path.resolve(CUR, '../src/components'),
      '@Context': path.resolve(CUR, '../src/context'),
      '@Data': path.resolve(CUR, '../src/data'),
      '@Features': path.resolve(CUR, '../src/features'),
      '@Hooks': path.resolve(CUR, '../src/hooks'),
      '@Layouts': path.resolve(CUR, '../src/layouts'),
      '@Lib': path.resolve(CUR, '../src/lib'),
      '@Modules': path.resolve(CUR, '../src/modules'),
      '@Pages': path.resolve(CUR, '../src/pages'),
      '@Redux': path.resolve(CUR, '../src/redux'),
      '@Routes': path.resolve(CUR, '../src/routes'),
      '@Services': path.resolve(CUR, '../src/services'),
      '@Stories': path.resolve(CUR, '../src/stories'),
      '@Types': path.resolve(CUR, '../src/types'),
      '@Utils': path.resolve(CUR, '../src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
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
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|avif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.module\.scss$/,
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
        exclude: /\.module.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

export default config;
