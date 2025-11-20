import { Score, zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { useDeferredValue, useEffect, useState } from 'react';

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

const strengthCache: Record<string, Score> = {};

export const getStrength = async (value: string) => {
  if (!value) return null;

  if (strengthCache[value] !== undefined) {
    return strengthCache[value];
  }

  const { score } = await zxcvbnAsync(value);
  strengthCache[value] = score;

  return score;
};

export const usePasswordStrength = (password: string) => {
  const [result, setResult] = useState<Score | null>(null);
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    let cancelled = false;

    getStrength(deferredPassword).then((score) => {
      if (!cancelled) setResult(score === null ? null : score);
    });

    return () => {
      cancelled = true;
    };
  }, [deferredPassword]);

  return result;
};
