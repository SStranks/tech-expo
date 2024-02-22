import { useState, useEffect, useDeferredValue } from 'react';
import { zxcvbnOptions, ZxcvbnResult, zxcvbnAsync } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react

const options = {
  // recommended
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  // recommended
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // recommended
  useLevenshteinDistance: true,
  // optional
  translations: zxcvbnEnPackage.translations,
};
zxcvbnOptions.setOptions(options);

export const usePasswordStrength = (password: string) => {
  // eslint-disable-next-line unicorn/no-null
  const [result, setResult] = useState<ZxcvbnResult | null>(null);
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    zxcvbnAsync(deferredPassword).then((response) => setResult(response));
  }, [deferredPassword]);

  return result;
};
