import { defineConfig } from '@packages/vitest-config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          environment: 'jsdom',
          include: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
          name: 'CRM-Client',
        },
      },
      {
        test: {
          environment: 'node',
          include: ['apps/crm/server/src/**/?(*.)+(spec|test).[jt]s'],
          name: 'CRM-Server',
        },
      },
    ],
  },
});
