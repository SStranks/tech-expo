import { defineWorkspace } from '@packages/vitest-config/vitest';

export default defineWorkspace([
  {
    test: {
      include: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
      name: 'CRM-Client',
      environment: 'jsdom',
    },
  },
  {
    test: {
      include: ['apps/crm/server/src/**/?(*.)+(spec|test).[jt]s'],
      name: 'CRM-Server',
      environment: 'node',
    },
  },
]);
