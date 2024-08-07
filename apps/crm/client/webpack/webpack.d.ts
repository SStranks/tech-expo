declare module 'brotli-webpack-plugin' {
  declare class BrotliWebpackPlugin {
    constructor(options?: BrotliWebpackPlugin.Options);
    apply(compiler: Compiler): void;
  }

  declare namespace BrotliWebpackPlugin {
    interface Options {
      /**
       * The target asset name. Defaults to `'[path].br[query]'`.
       *
       * - `[file]` is replaced with the original asset file name.
       * - `[fileWithoutExt]` is replaced with the file name minus its extension, e.g. the `style` of `style.css`.
       * - `[ext]` is replaced with the file name extension, e.g. the `css` of `style.css`.
       * - `[path]` is replaced with the path of the original asset.
       * - `[query]` is replaced with the query.
       */
      asset?: string | undefined;
      /**
       * All assets matching this RegExp are processed. Defaults to every asset.
       */
      test?: RegExp | undefined;
      /**
       * Only assets bigger than this size (in bytes) are processed. Defaults to `0`.
       */
      threshold?: number | undefined;
      /**
       * Only assets that compress better that this ratio are processed. Defaults to `0.8`.
       */
      minRatio?: number | undefined;
      /**
       * Remove original files that were compressed with brotli. Default: `false`.
       */
      deleteOriginalAssets?: boolean | undefined;
    }
  }

  export = BrotliWebpackPlugin;
}

declare module 'webpack-stats-plugin' {
  declare class StatsWriterPlugin {
    constructor(options?: StatsWriterPlugin.Options);
    apply(compiler: Compiler): void;
  }

  declare namespace StatsWriterPlugin {
    /**
     * transform function
     */
    interface TransformFunc {
      (
        data: {
          [key: string]: any;
        },
        options?: TransformOptions
      ): string | Promise<string>;
    }

    interface TransformOptions {
      /** Current compiler instance */
      compiler: webpack.compilation.Compilation;
    }

    interface Options {
      /**
       * output file name
       * @default 'stats.json'
       */
      filename?: string | undefined;
      /**
       * fields of stats obj to keep
       * @default ['assetsByChunkName']
       */
      fields?: null | string[] | undefined;
      /**
       * stats config object or string preset
       * @default {}
       */
      stats?: { [key: string]: any } | string | undefined;
      /**
       * transform stats obj
       * @default JSON.stringify()
       */
      transform?: TransformFunc | undefined;
    }
  }

  export { StatsWriterPlugin };
}

declare module '@bundle-stats/plugin-webpack-filter' {
  declare const _default: { default: import('@bundle-stats/plugin-webpack-filter') };
  export default _default;
}
