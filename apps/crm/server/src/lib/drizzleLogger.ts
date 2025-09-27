import { Logger } from 'drizzle-orm/logger';

import { pinoLogger } from '#Lib/index.js';

class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    pinoLogger.server.info({ params, query }, 'DrizzleLogger');
  }
}

export default DrizzleLogger;
