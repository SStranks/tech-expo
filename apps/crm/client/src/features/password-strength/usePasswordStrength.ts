import type { Score } from '@zxcvbn-ts/core';

import { useEffect, useState } from 'react';

import useDebounce from '@Hooks/useDebounce';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let zxcvbnPromise: Promise<typeof import('@Lib/zxcvbn')> | null;

async function getZxcvbn() {
  if (!zxcvbnPromise) zxcvbnPromise = import(/* webpackChunkName: "zxcvbn" */ '@Lib/zxcvbn');
  return zxcvbnPromise;
}

function usePasswordStrength(password: string) {
  const [result, setResult] = useState<Score | null>(null);
  const debouncedPassword = useDebounce(password, 750);

  useEffect(() => {
    let cancelled = false;

    async function calculateScore() {
      if (!debouncedPassword) {
        if (!cancelled) setResult(null);
        return;
      }

      const { getStrength } = await getZxcvbn();
      const score = await getStrength(debouncedPassword);
      if (!cancelled) setResult(score);
    }

    void calculateScore();

    return () => {
      cancelled = true;
    };
  }, [debouncedPassword]);

  return result;
}

export default usePasswordStrength;
