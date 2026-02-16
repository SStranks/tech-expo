import type { StringValue } from 'ms';

import ms from 'ms';
import z from 'zod';

export const msString = () =>
  z.custom<StringValue>(
    (val) => {
      if (typeof val !== 'string') return false;
      try {
        ms(val as StringValue);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid ms string' }
  );
