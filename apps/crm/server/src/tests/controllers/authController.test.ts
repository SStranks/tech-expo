import { describe, jest, test } from '@jest/globals';
import httpMocks from 'node-mocks-http';

jest.unstable_mockModule('#Config/dbPostgres', () => ({
  __esModule: true,
  connectPostgresDB: jest.fn(),
  postgresClient: jest.fn(),
  postgresDB: jest.fn(),
}));
jest.unstable_mockModule('#Config/dbRedis', () => ({
  __esModule: true,
  connectRedisDB: jest.fn(),
  redisClient: jest.fn(),
}));

const { default: ServiceUser } = await import('#Services/User.js');

const MOCK_BADREQUESTERROR = jest.fn((_: any) => _);
const MOCK_QUERYUSERBYID = jest.fn();

jest.unstable_mockModule('#Utils/errors', () => ({
  __esModule: true,
  BadRequestError: MOCK_BADREQUESTERROR,
}));
jest.unstable_mockModule('#Services/User', () => ({
  __esModule: true,
  default: {
    ...ServiceUser,
    isTokenBlacklisted: jest.fn(),
    queryUserById: MOCK_QUERYUSERBYID,
  },
}));

const { default: authController } = await import('#Controllers/authController.js');

const { JWT_COOKIE_AUTH_ID } = process.env;
const IAT = Math.floor(Date.now() / 1000);
const JWT = ServiceUser.signAuthToken('user', 'user', IAT);
const RES = httpMocks.createResponse();
ServiceUser.createAuthCookie(RES, JWT);
const JWT_COOKIE = RES.cookies[`${JWT_COOKIE_AUTH_ID}`].value;

describe('authController.protectedRoute', () => {
  test('No JWT credentials; return 401', async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: '' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ code: 401, message: 'Unauthorized. Please login' });
  });

  test('Valid JWT Header; return next()', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer ${JWT}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('Valid JWT Cookie; return 401', async () => {
    const req = httpMocks.createRequest({ cookies: { [`${JWT_COOKIE_AUTH_ID}`]: JWT_COOKIE } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});

// NOTE:  authController.protectedRoute guarantees presence of JWT header/cookie; see flow in userRoutes.ts
describe('authController.restrictedRoute', () => {
  test('Invalid JWT role credentials; return 403', async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${JWT}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const route = authController.restrictedRoute('ADMIN');
    await route(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ code: 403, message: 'Forbidden' });
  });

  test('Valid JWT role credentials; return next()', async () => {
    const ROLE = 'ADMIN';
    const JWT = ServiceUser.signAuthToken('user', ROLE, IAT);
    MOCK_QUERYUSERBYID.mockReturnValue(ROLE);

    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer ${JWT}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
