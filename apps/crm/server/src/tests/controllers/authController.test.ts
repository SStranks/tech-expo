import httpMocks from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

import { env } from '#Config/env.js';
import { createMockResponse } from '#Tests/mocks/mockResponse.js';
import mockUser from '#Tests/mocks/mockUser.js';
import ForbiddenError from '#Utils/errors/ForbiddenError.js';
import UnauthorizedError from '#Utils/errors/UnauthorizedError.js';

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

vi.mock('#Services/user.service', () => {
  class MockUserService {
    constructor() {}

    isTokenBlacklisted = vi.fn();
    queryUserById = MOCK_QUERYUSERBYID;
    verifyAuthToken = MOCK_VERIFYAUTHTOKEN;
  }

  return {
    UserService: MockUserService,
  };
});

const { default: authController } = await import('#Controllers/authController.js');
const { JWT_COOKIE_AUTH_ID } = env();

describe('authController.protectedRoute', () => {
  test('No JWT credentials; return 401', async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: '' },
    });
    const res = createMockResponse();
    const next = vi.fn();

    await authController.protectedRoute(req, res, next);

    const errorArg = next.mock.calls[0][0] as UnauthorizedError;
    expect(next).toHaveBeenCalledTimes(1);
    expect(errorArg).toBeInstanceOf(UnauthorizedError);
    expect(errorArg.message).toBe('Unauthorized. Please login');
    expect(errorArg.code).toBe('UNAUTHENTICATED');
    expect(errorArg.httpStatus).toBe(401);
  });

  test('Valid JWT Header; return next()', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer JWT-TOKEN` },
    });
    const res = createMockResponse();
    const next = vi.fn();

    await authController.protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('Valid JWT Cookie; return next()', async () => {
    const req = httpMocks.createRequest({ authJWT: { [`${JWT_COOKIE_AUTH_ID}`]: 'JWT_COOKIE' } });
    const res = createMockResponse();
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

    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer JWT-TOKEN` },
    });
    const res = createMockResponse();
    const next = vi.fn();

    const route = authController.restrictedRoute('ADMIN');
    await route(req, res, next);

    const errorArg = next.mock.calls[0][0] as ForbiddenError;
    expect(next).toHaveBeenCalledTimes(1);
    expect(errorArg).toBeInstanceOf(ForbiddenError);
    expect(errorArg.message).toBe('Forbidden');
    expect(errorArg.code).toBe('FORBIDDEN');
    expect(errorArg.httpStatus).toBe(403);
  });

  test('Valid JWT role credentials; return next()', async () => {
    MOCK_QUERYUSERBYID.mockReturnValue(mockUser({ role: 'ADMIN' }));
    MOCK_VERIFYAUTHTOKEN.mockReturnValue({ role: 'ADMIN' });

    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer JWT-TOKEN` },
    });
    const res = createMockResponse();
    const next = vi.fn();

    const route = authController.restrictedRoute('ADMIN');
    await route(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
