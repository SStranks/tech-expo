import httpMocks from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

import mockUser from '#Tests/mocks/mockUser.js';

const MOCK_BADREQUESTERROR = vi.fn(
  class MOCK_BADREQUESTERROR {
    code: number;
    message: string;
    constructor({ code, message }: { code: number; message: string }) {
      this.code = code;
      this.message = message;
    }
  }
);
const MOCK_QUERYUSERBYID = vi.fn(() => ({}));
const MOCK_VERIFYAUTHTOKEN = vi.fn(() => ({}));

vi.stubEnv('JWT_COOKIE_AUTH_ID', 'auth_token');

vi.mock('#Utils/errors', () => ({
  BadRequestError: MOCK_BADREQUESTERROR,
}));

vi.mock('#Services/User', () => ({
  default: {
    isTokenBlacklisted: vi.fn(),
    queryUserById: MOCK_QUERYUSERBYID,
    verifyAuthToken: MOCK_VERIFYAUTHTOKEN,
  },
}));

const { default: authController } = await import('#Controllers/authController.js');
const { JWT_COOKIE_AUTH_ID } = process.env;

describe('authController.protectedRoute', () => {
  test('No JWT credentials; return 401', async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: '' },
    });
    const res = httpMocks.createResponse();
    const next = vi.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ code: 401, message: 'Unauthorized. Please login' });
  });

  test('Valid JWT Header; return next()', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer JWT-TOKEN` },
    });
    const res = httpMocks.createResponse();
    const next = vi.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('Valid JWT Cookie; return next()', async () => {
    const req = httpMocks.createRequest({ cookies: { [`${JWT_COOKIE_AUTH_ID}`]: 'JWT_COOKIE' } });
    const res = httpMocks.createResponse();
    const next = vi.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});

// NOTE:  authController.protectedRoute guarantees presence of JWT header/cookie; see flow in userRoutes.ts
describe('authController.restrictedRoute', () => {
  test('Invalid JWT role credentials; return 403', async () => {
    MOCK_VERIFYAUTHTOKEN.mockReturnValue({ role: 'USER' });

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = vi.fn();

    const route = authController.restrictedRoute('ADMIN');
    await route(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ code: 403, message: 'Forbidden' });
  });

  test('Valid JWT role credentials; return next()', async () => {
    MOCK_QUERYUSERBYID.mockReturnValue(mockUser({ role: 'ADMIN' }));
    MOCK_VERIFYAUTHTOKEN.mockReturnValue({ role: 'ADMIN' });

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = vi.fn();

    const route = authController.restrictedRoute('ADMIN');
    await route(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
