import type { OptionsGraph, Score } from '@zxcvbn-ts/core';

import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs as OptionsGraph,
  translations: zxcvbnEnPackage.translations,
  useLevenshteinDistance: true,
};

const zxcvbn = new ZxcvbnFactory(options);

const strengthCache: Record<string, Score | undefined> = {};

export const getStrength = async (value: string) => {
  if (strengthCache[value] !== undefined) {
    return strengthCache[value];
  }

  const { score } = await zxcvbn.checkAsync(value);
  strengthCache[value] = score;

  return score;
};
