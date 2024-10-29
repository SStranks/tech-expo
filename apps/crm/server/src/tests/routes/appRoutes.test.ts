import { describe, jest, test } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('@apollo/server/express4', () => {
  return {
    __esModule: true,
    expressMiddleware: (a: any) => {
      return a;
    },
  };
});

jest.unstable_mockModule('../../graphql/apolloServer.ts', () => {
  return {
    __esModule: true,
    apolloServer: jest.fn(),
  };
});

jest.unstable_mockModule('#Routes/index', () => {
  return {
    __esModule: true,
    userRouter: () => {},
  };
});

const { default: app } = await import('#App/app');

describe('PUBLIC Routes', () => {
  test('favicon.ico; should return 204', () => {
    return request(app).get('/favicon.ico').expect(204);
  });

  test('Catchall route; should return 404', () => {
    const URL = '/unallocatedroute';
    return request(app)
      .get(`${URL}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => res.body.message === `Can't find route ${URL} on this server!`);
  });
});
