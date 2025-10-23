import { defineConfig } from '@packages/vitest-config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'CRM-Client',
          environment: 'jsdom',
          include: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
        },
      },
      {
        test: {
          name: 'CRM-Server',
          environment: 'node',
          include: ['apps/crm/server/src/**/?(*.)+(spec|test).[jt]s'],
        },
      },
    ],
  },
});
