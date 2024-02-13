import path from 'node:path';
import url from 'node:url';

const DIR = path.dirname(url.fileURLToPath(import.meta.url));

const config = {
  mode: 'development',
  entry: '../src/index.tsx',
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    port: 3005,
    static: [
      {
        directory: '../public',
        publicPath: '/',
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
    modules: ['./node_modules', './src/assets'],
    alias: {
      '#Img': path.resolve(DIR, '../src/assets/img'),
      '#Sass': path.resolve(DIR, '../src/assets/sass'),
      '#Svg': path.resolve(DIR, '../src/assets/svg'),
      '#Components': path.resolve(DIR, '../src/components'),
      '#Context': path.resolve(DIR, '../src/context'),
      '#Data': path.resolve(DIR, '../src/data'),
      '#Features': path.resolve(DIR, '../src/features'),
      '#Hooks': path.resolve(DIR, '../src/hooks'),
      '#Layouts': path.resolve(DIR, '../src/layouts'),
      '#Lib': path.resolve(DIR, '../src/lib'),
      '#Pages': path.resolve(DIR, '../src/pages'),
      '#Services': path.resolve(DIR, '../src/services'),
      '#Types': path.resolve(DIR, '../src/types'),
      '#Utils': path.resolve(DIR, '../src/utils'),
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
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
              modules: { localIdentName: '[local]-[hash:base64:5]' },
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
