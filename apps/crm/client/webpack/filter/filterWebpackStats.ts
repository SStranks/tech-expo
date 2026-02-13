/*
 * NOTE:  Source code modified, from:
 * https://github.com/relative-ci/bundle-stats/blob/master/packages/plugin-webpack-filter/src/index.ts
 */
import type { StatsCompilation } from 'webpack';

const PATH_IGNORE_PATTERN = '.map$';

interface BundleStatsOptions {
  pathIgnorePattern?: string;
}

export interface WebpackStatsFilteredAsset {
  name: string;
  size?: number;
}

export interface WebpackStatsFilteredChunk {
  entry: boolean;
  id: number | string;
  initial: boolean;
  files?: Array<string>;
  names?: Array<string>;
}

export interface WebpackStatsFilteredModule {
  name: string;
  size?: number;
  chunks: Array<string | number>;
}

export interface WebpackStatsFilteredConcatenatedModule {
  name: string;
  size?: number;
}

export interface WebpackStatsFilteredRootModule extends WebpackStatsFilteredModule {
  modules?: Array<WebpackStatsFilteredConcatenatedModule>;
}

export interface WebpackStatsFiltered {
  builtAt?: number;
  hash?: string;
  assets?: Array<WebpackStatsFilteredAsset>;
  chunks?: Array<WebpackStatsFilteredChunk>;
  modules?: Array<WebpackStatsFilteredRootModule>;
}

/**
 * Filter webpack stats data
 */
const filterWebpackStats = (source: StatsCompilation, options: BundleStatsOptions = {}): WebpackStatsFiltered => {
  const pathIgnorePattern = new RegExp(options.pathIgnorePattern || PATH_IGNORE_PATTERN);

  // meta
  const { builtAt, hash } = source;

  // rawData
  const assets =
    source.assets?.reduce((agg, asset) => {
      // Skip assets with empty name or ignore pattern
      if (!asset.name || pathIgnorePattern.test(asset.name)) {
        return agg;
      }

      agg.push({
        name: asset.name,
        size: asset.size,
      });

      /*
       * NOTE:  Modification; extract related assets (compressed assets)
       * NOTE:  Array.isArray method used; found a bug in webpack source code;
       * https://github.com/webpack/webpack/issues/18657
       */
      if (Array.isArray(asset.related)) {
        asset.related.forEach((asset) => {
          if (!asset.name || pathIgnorePattern.test(asset.name)) return;
          agg.push({
            name: asset.name,
            size: asset.size,
          });
        });
      }

      return agg;
    }, [] as Array<WebpackStatsFilteredAsset>) || [];

  const chunks =
    source.chunks?.reduce((agg, chunk) => {
      // Skip chunks with empty ids
      if (chunk.id === undefined) {
        return agg;
      }

      agg.push({
        id: chunk.id,
        entry: chunk.entry,
        files: chunk.files,
        initial: chunk.initial,
        names: chunk.names,
      });

      return agg;
    }, [] as Array<WebpackStatsFilteredChunk>) || [];

  const modules =
    source.modules?.reduce((agg, moduleStats) => {
      // Skip modules without name
      if (!moduleStats.name) {
        return agg;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const moduleChunks = moduleStats.chunks?.filter((chunkId) => chunkId !== null && chunkId !== undefined) || [];

      // Skip modules that do not belong to any chunk
      if (moduleChunks.length === 0) {
        return agg;
      }

      const concatenatedModules = moduleStats.modules?.reduce((aggConcatenatedModules, concatenatedModule) => {
        if (!concatenatedModule.name) {
          return aggConcatenatedModules;
        }

        aggConcatenatedModules.push({
          name: concatenatedModule.name,
          size: concatenatedModule.size,
        });

        return aggConcatenatedModules;
      }, [] as Array<WebpackStatsFilteredConcatenatedModule>);

      agg.push({
        name: moduleStats.name,
        chunks: moduleChunks,
        size: moduleStats.size,
        ...(concatenatedModules && { modules: concatenatedModules }),
      });

      return agg;
    }, [] as Array<WebpackStatsFilteredRootModule>) || [];

  return {
    assets,
    builtAt,
    chunks,
    hash,
    modules,
  };
};
export default filterWebpackStats;
