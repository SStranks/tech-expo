import type { Score } from '@zxcvbn-ts/core';

import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react

const options = {
  // recommended
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // optional
  translations: zxcvbnEnPackage.translations,
  // recommended
  useLevenshteinDistance: true,
  // recommended
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

const strengthCache: Record<string, Score | undefined> = {};

export const getStrength = async (value: string) => {
  if (strengthCache[value] !== undefined) {
    return strengthCache[value];
  }

  const { score } = await zxcvbnAsync(value);
  strengthCache[value] = score;

  return score;
};
