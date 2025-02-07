import { Logger } from 'drizzle-orm/logger';

import pinoLogger from '#Helpers/pinoLogger';

class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    pinoLogger.info({ params, query }, 'DrizzleLogger');
  }
}

export default DrizzleLogger;
