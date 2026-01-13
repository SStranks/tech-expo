import watcher from '@parcel/watcher';
import logSymbols from 'log-symbols';

import { outputFile, typeDefsDir } from '../graphql/paths.ts';
import { tailPath } from './paths.ts';
import { writeSchema } from './writeSchema.ts';

type LogCases = 'initialize' | 'success' | 'error' | 'watching' | 'shutdown';
const log = (key: LogCases, { error, signal }: { signal?: string; error?: Error } = {}) => {
  switch (key) {
    case 'initialize': {
      return console.log(`  ${logSymbols.info} [@apps/crm-shared: watcher.ts] initializaing watcher...`);
    }
    case 'watching': {
      return console.log(`  ${logSymbols.info} [@apps/crm-shared: watcher.ts] watching: ${tailPath(typeDefsDir)}`);
    }
    case 'error': {
      return console.error(`  ${logSymbols.error} [@apps/crm-shared: watcher.ts]`, error);
    }
    case 'success': {
      return console.log(`  ${logSymbols.success} [@apps/crm-shared: watcher.ts] output: ${tailPath(outputFile)}`);
    }
    case 'shutdown': {
      return console.log(`${logSymbols.success} [@apps/crm-shared: watcher.ts] shutting down (${signal})`);
    }
  }
};

let timer: NodeJS.Timeout | undefined;

log('initialize');
writeSchema({ outputFile, typeDefsDir });
log('success');
log('watching');

const watcherCallback = (error: Error | null, events: watcher.Event[]) => {
  if (error) {
    log('error', { error });
    return;
  }

  if (events.length === 0) return;

  clearTimeout(timer);
  timer = setTimeout(() => {
    writeSchema({ outputFile, typeDefsDir });
    log('success');
    log('watching');
  }, 150);
};

const subscription = await watcher.subscribe(typeDefsDir, (error, events) => watcherCallback(error, events), {
  ignore: [outputFile],
});

const shutdown = async (signal: string) => {
  log('shutdown', { signal });
  await subscription.unsubscribe();
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
};

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
