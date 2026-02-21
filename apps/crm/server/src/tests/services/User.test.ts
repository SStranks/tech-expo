import type { RefreshTokenPayload } from '@apps/crm-shared';
import type { JwtPayload } from 'jsonwebtoken';

import jwt from 'jsonwebtoken';
import { describe, expect, expectTypeOf, test, vi } from 'vitest';

import { postgresDB } from '#Config/dbPostgres.js';
import { redisClient } from '#Config/dbRedis.js';
import { secrets } from '#Config/secrets.js';
import { PostgresUserRepository } from '#Models/domain/user/user.repository.postgres.js';

const { JWT_AUTH_SECRET, JWT_REFRESH_SECRET } = secrets;

vi.stubEnv('JWT_AUTH_EXPIRES', '1m');

const { MOCK_JWT_JTI } = vi.hoisted(() => ({
  MOCK_JWT_JTI: vi.fn(),
}));

vi.mock('node:crypto', async () => {
  const actual = await vi.importActual('node:crypto');

  return {
    __esModule: true,
    default: {
      ...actual,
      randomUUID: MOCK_JWT_JTI,
    },
  };
});

vi.mock('#Config/secrets', () => ({
  secrets: {
    JWT_AUTH_SECRET: 'secret',
    JWT_REFRESH_SECRET: 'secret',
  },
}));

const userRepository = new PostgresUserRepository();
const { UserService } = await import('#Services/user.service.js');
const userService = new UserService(userRepository, redisClient, postgresDB);

describe('Signing Tokens: Auth Token', () => {
  const userId = 'user';
  const userRole = 'default';
  const iat = Math.floor(Date.now() / 1000);
  const jti = '123';
  MOCK_JWT_JTI.mockReturnValue(jti);

  test('Sign Auth Token - is payload valid', () => {
    const jwt_encoded = userService.signAuthToken(userId, userRole, iat);
    const jwt_decoded = userService.decodeAuthToken(jwt_encoded);

    expect(jwt_decoded.client_id).toEqual(userId);
    expect(jwt_decoded.role).toEqual(userRole);
    expect(jwt_decoded.iat).toEqual(iat);
    expect(jwt_decoded.jti).toEqual(jti);
    expectTypeOf(jwt_decoded.exp).toEqualTypeOf<number>();
  });

  test('Sign Auth Token - is signature valid', () => {
    const jwt_encoded = userService.signAuthToken(userId, userRole, iat);

    try {
      const jwt_decoded = jwt.verify(jwt_encoded, JWT_AUTH_SECRET) as JwtPayload;
      expect(jwt_decoded.jti).toEqual(jti);
    } catch {
      fail('JWT Signature Failure');
    }
  });
});

describe('Signing Tokens: Refresh Token', () => {
  const userId = 'user';
  const acc = 0;
  const exp = Date.now() + 1_000_000;
  const iat = Math.floor(Date.now() / 1000);
  const jti = '123';
  MOCK_JWT_JTI.mockReturnValue(jti);
  const token_payload = {
    acc,
    client_id: userId,
    exp,
    iat,
    jti,
  } as RefreshTokenPayload;

  test('Sign Refresh Token - is payload valid', () => {
    const jwt_encoded = userService.signRefreshToken(userId, iat, token_payload);

    const refreshTokenPayload = jwt.decode(jwt_encoded) as RefreshTokenPayload | null;
    if (!refreshTokenPayload) fail('JWT Encoding failed');

    expect(refreshTokenPayload['client_id']).toEqual(userId);
    expect(refreshTokenPayload.acc).toEqual(acc);
    expect(refreshTokenPayload.iat).toEqual(iat);
    expect(refreshTokenPayload.jti).toEqual(jti);
    expectTypeOf(refreshTokenPayload.exp).toEqualTypeOf<number>();
  });

  test('Sign Refresh Token - is signature valid', () => {
    const jwt_encoded = userService.signRefreshToken(userId, iat, token_payload);
    const refreshTokenPayload = jwt.verify(jwt_encoded, JWT_REFRESH_SECRET) as RefreshTokenPayload | null;
    if (!refreshTokenPayload) fail('JWT Encoding failed');

    expect(refreshTokenPayload.jti).toEqual(jti);
  });
});
