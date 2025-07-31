// @types/webpack-stats-plugin currently stuck at @types/webpack@4
declare module 'webpack-stats-plugin' {
  import type { Compilation, Compiler } from 'webpack';
  class StatsWriterPlugin {
    constructor(options?: StatsWriterPlugin.Options);
    apply(compiler: Compiler): void;
  }

  namespace StatsWriterPlugin {
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
      compiler: Compilation;
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
  const _default: { default: typeof import('@bundle-stats/plugin-webpack-filter') };
  export default _default;
}
