import type { UUID } from 'node:crypto';

import type { IRefreshTokenPayload } from '#Services/User.ts';

import { describe, jest, test } from '@jest/globals';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { secrets } from '#Config/secrets.js';

const MOCK_JWT_JTI = jest.fn();

jest.unstable_mockModule('node:crypto', () => ({
  __esModule: true,
  default: {
    randomUUID: MOCK_JWT_JTI,
  },
}));

const { JWT_AUTH_SECRET, JWT_REFRESH_SECRET } = secrets;
const { UserService } = await import('#Services/index.js');

describe('Signing Tokens: Auth Token', () => {
  const userId = 'user';
  const userRole = 'default';
  const iat = Math.floor(Date.now() / 1000);
  const jti = '123';
  MOCK_JWT_JTI.mockReturnValue(jti);

  test('Sign Auth Token - is payload valid', () => {
    interface IJWTPayload extends JwtPayload {
      client_id: UUID;
      role: string;
      jti: UUID;
      iat: number;
      exp: number;
    }

    const jwt_encoded = UserService.signAuthToken(userId, userRole, iat);

    const jwt_decoded = jwt.decode(jwt_encoded, { complete: true });
    if (!jwt_decoded) fail('JWT Encoding failed');

    expect((jwt_decoded?.payload as IJWTPayload)['client_id']).toEqual(userId);
    expect((jwt_decoded?.payload as IJWTPayload).role).toEqual(userRole);
    expect((jwt_decoded?.payload as IJWTPayload).iat).toEqual(iat);
    expect((jwt_decoded?.payload as IJWTPayload).jti).toEqual(jti);
    expect(typeof (jwt_decoded?.payload as IJWTPayload).exp).toBe('number');
  });

  test('Sign Auth Token - is signature valid', async () => {
    const jwt_encoded = UserService.signAuthToken(userId, userRole, iat);

    try {
      const jwt_decoded = jwt.verify(jwt_encoded, JWT_AUTH_SECRET, { complete: true });
      expect((jwt_decoded?.payload as JwtPayload).jti).toEqual(jti);
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
  } as unknown as IRefreshTokenPayload;

  test('Sign Refresh Token - is payload valid', () => {
    const jwt_encoded = UserService.signRefreshToken(userId, iat, token_payload);

    const jwt_decoded = jwt.decode(jwt_encoded, { complete: true });
    if (!jwt_decoded) fail('JWT Encoding failed');

    expect((jwt_decoded?.payload as IRefreshTokenPayload)['client_id']).toEqual(userId);
    expect((jwt_decoded?.payload as IRefreshTokenPayload).acc).toEqual(acc);
    expect((jwt_decoded?.payload as IRefreshTokenPayload).iat).toEqual(iat);
    expect((jwt_decoded?.payload as IRefreshTokenPayload).jti).toEqual(jti);
    expect(typeof (jwt_decoded?.payload as IRefreshTokenPayload).exp).toBe('number');
  });

  test('Sign Refresh Token - is signature valid', async () => {
    const jwt_encoded = UserService.signRefreshToken(userId, iat, token_payload);

    try {
      const jwt_decoded = jwt.verify(jwt_encoded, JWT_REFRESH_SECRET, { complete: true });
      expect((jwt_decoded?.payload as IRefreshTokenPayload).jti).toEqual(jti);
    } catch {
      throw new Error('JWT Signature Failure');
    }
  });
});
