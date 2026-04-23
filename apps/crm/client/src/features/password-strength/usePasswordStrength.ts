import type { Score } from '@zxcvbn-ts/core';

import { useDeferredValue, useEffect, useState } from 'react';

function usePasswordStrength(password: string) {
  const [result, setResult] = useState<Score | null>(null);
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    let cancelled = false;

    async function calculateScore() {
      if (!deferredPassword) {
        if (!cancelled) setResult(null);
        return;
      }

      const { getStrength } = await import(/* webpackChunkName: "zxcvbn" */ '@Lib/zxcvbn');
      const score = await getStrength(deferredPassword);
      if (!cancelled) setResult(score);
    }

    void calculateScore();

    return () => {
      cancelled = true;
    };
  }, [deferredPassword]);

  return result;
}

export default usePasswordStrength;
