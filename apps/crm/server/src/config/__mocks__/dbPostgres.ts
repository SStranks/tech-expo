import type { MockedFunction } from 'vitest';

import { vi } from 'vitest';

type EndFn = () => Promise<void>;

const connectPostgresDB: MockedFunction<EndFn> = vi.fn();
const postgresClient: {
  end: () => Promise<void>;
} = {
  end: vi.fn(),
};
const postgresDB: {
  end: () => Promise<void>;
} = {
  end: vi.fn(),
};

export { connectPostgresDB, postgresClient, postgresDB };
