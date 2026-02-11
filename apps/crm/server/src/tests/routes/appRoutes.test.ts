import type { ApiResponse } from '@apps/crm-shared';
import type { Response } from 'supertest';

import request from 'supertest';
import { describe, test, vi } from 'vitest';

vi.mock('@as-integrations/express5', () => ({
  expressMiddleware: (a: unknown) => {
    return a;
  },
}));

vi.mock('#Graphql/apolloServer.ts', () => ({
  apolloServer: vi.fn(),
}));

vi.mock('#Routes/index', () => ({
  userRouter: () => {},
}));

const { default: app } = await import('#App/app.js');

describe('PUBLIC Routes', () => {
  test('favicon.ico; should return 204', async () => {
    await request(app).get('/favicon.ico').expect(204);
  });

  test('Catchall route; should return 404', async () => {
    const URL = '/unallocatedroute';
    await request(app)
      .get(`${URL}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect(
        (res: Response) => (res.body as ApiResponse<unknown>).message === `Can't find route ${URL} on this server!`
      );
  });
});
