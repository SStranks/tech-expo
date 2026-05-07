import type { MockedFunction } from 'vitest';

import { vi } from 'vitest';

type EndFn = () => Promise<void>;

const redisClient: {
  end: () => Promise<void>;
} = {
  end: vi.fn(),
};
const connectRedisDB: MockedFunction<EndFn> = vi.fn();

export { connectRedisDB, redisClient };
