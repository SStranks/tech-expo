import type { AuthTokenPayload, RefreshTokenPayload, UUID } from '@apps/crm-shared';
import type { Response } from 'express';

import type { PostgresClient } from '#Config/dbPostgres.js';
import type { RedisClient } from '#Config/dbRedis.js';
import type { SelectUserSchema } from '#Config/schema/user/User.ts';
import type { UserRepository } from '#Models/domain/user/user.repository.js';

import argon2 from 'argon2';
import { and, eq } from 'drizzle-orm/pg-core/expressions';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import { env } from '#Config/env.js';
import { UserTable } from '#Config/schema/user/User.js';
import UserRefreshTokensTable from '#Config/schema/user/UserRefreshTokens.js';
import { secrets } from '#Config/secrets.js';
import { toDbUUID } from '#Helpers/helpers.js';
import AppError from '#Utils/errors/AppError.js';
import BadRequestError from '#Utils/errors/BadRequestError.js';
import PostgresError from '#Utils/errors/PostgresError.js';
import UnauthorizedError from '#Utils/errors/UnauthorizedError.js';

import crypto from 'node:crypto';

const { JWT_AUTH_SECRET, JWT_REFRESH_SECRET, POSTGRES_PEPPER } = secrets;

const {
  JWT_AUTH_EXPIRES,
  JWT_COOKIE_AUTH_EXPIRES,
  JWT_COOKIE_AUTH_ID,
  JWT_COOKIE_REFRESH_EXPIRES,
  JWT_COOKIE_REFRESH_ID,
  JWT_REFRESH_EXPIRES,
  NODE_ENV,
  PASSWORD_RESET_EXPIRES,
} = env;

// TODO: Wire up userRepo to the existing methods here
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisClient: RedisClient,
    private readonly postgresClient: PostgresClient
  ) {}

  signAuthToken = (userId: string, role: string, iat: number) => {
    const UUIDv4 = crypto.randomUUID();
    return jwt.sign({ client_id: userId, iat, role }, JWT_AUTH_SECRET, {
      expiresIn: JWT_AUTH_EXPIRES as ms.StringValue, // TODO: Valiator function? Env-zod schema checker?,
      jwtid: UUIDv4,
    });
  };

  signRefreshTokenPayload = (client_id: UUID, iat: number) => {
    const jti = crypto.randomUUID();
    const exp = Math.floor((Date.now() + ms(JWT_REFRESH_EXPIRES as ms.StringValue)) / 1000);
    const acc = 0; // Incrementer; Parent-Child token chain

    return { acc, client_id, exp, iat, jti };
  };

  signRefreshToken = (client_id: string, iat: number, refreshTokenPayload: RefreshTokenPayload) => {
    const { acc, exp, jti } = refreshTokenPayload;
    return jwt.sign({ acc, client_id, exp, iat, jti }, JWT_REFRESH_SECRET);
  };

  blacklistToken = async (jti: UUID, exp: number) => {
    await this.redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
  };

  blacklistAllRefreshTokens = async (tokens: { jti: UUID; exp: number }[]) => {
    for (const { exp, jti } of tokens) {
      await this.redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
    }
  };

  verifyAuthToken = (authToken: string): AuthTokenPayload => {
    try {
      const { client_id, exp, iat, jti, role } = jwt.verify(authToken, JWT_AUTH_SECRET) as AuthTokenPayload;
      return { client_id, exp, iat, jti, role };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError({ message: 'Invalid JWT' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError({ message: 'Expired JWT' });
      }
      throw new AppError({ code: 'INTERNAL_ERROR', context: { error }, httpStatus: 500, logging: true });
    }
  };

  verifyRefreshToken = (refreshToken: string): RefreshTokenPayload => {
    try {
      const { acc, client_id, exp, iat, jti } = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as RefreshTokenPayload;
      return { acc, client_id, exp, iat, jti };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError({ message: 'Invalid JWT' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError({ message: 'Expired JWT' });
      }
      throw new AppError({ code: 'INTERNAL_ERROR', context: { error, logging: true }, httpStatus: 500 });
    }
  };

  decodeAuthToken = (token: string): AuthTokenPayload => {
    const payload = jwt.decode(token) as AuthTokenPayload | null;
    if (!payload) throw new UnauthorizedError({ message: 'Invalid JWT' });
    return payload;
  };

  decodeRefreshToken = (token: string): RefreshTokenPayload | null => {
    return jwt.decode(token) as RefreshTokenPayload | null;
  };

  activateRefreshToken = async (client_id: UUID, iat: number) => {
    const user = await this.postgresClient
      .update(UserRefreshTokensTable)
      .set({ activated: true })
      .where(
        and(
          eq(UserRefreshTokensTable.userId, toDbUUID(client_id)),
          eq(UserRefreshTokensTable.iat, iat),
          eq(UserRefreshTokensTable.activated, false)
        )
      )
      .returning({ userId: UserRefreshTokensTable.userId });

    if (user.length === 0) throw new BadRequestError({ message: 'Token already activated' });
  };

  advanceRefreshToken = (refreshToken: string, iat: number) => {
    const payload = jwt.decode(refreshToken);
    let { acc } = payload as RefreshTokenPayload;
    const { client_id, exp, jti } = payload as RefreshTokenPayload;

    acc = acc + 1;

    return jwt.sign({ acc, client_id, exp, iat, jti }, JWT_REFRESH_SECRET);
  };

  deleteAllRefreshTokens = async (client_id: UUID) => {
    return this.postgresClient
      .delete(UserRefreshTokensTable)
      .where(eq(UserRefreshTokensTable.userId, toDbUUID(client_id)))
      .returning({ exp: UserRefreshTokensTable.exp, jti: UserRefreshTokensTable.jti });
  };

  queryRefreshToken = async (client_id: UUID, jti: UUID) => {
    return this.postgresClient.query.UserRefreshTokensTable.findFirst({
      columns: { acc: true, activated: true, exp: true, iat: true, jti: true },
      where: (table, { and, eq }) => and(eq(table.userId, toDbUUID(client_id)), eq(table.jti, toDbUUID(jti))),
    });
  };

  insertRefreshToken = async (refreshTokenPayload: RefreshTokenPayload) => {
    let { client_id, jti } = refreshTokenPayload;
    const { acc, exp, iat } = refreshTokenPayload;
    jti = toDbUUID(jti);
    client_id = toDbUUID(client_id);

    await this.postgresClient.insert(UserRefreshTokensTable).values({ acc, exp, iat, jti, userId: client_id });
  };

  updateRefreshToken = async (client_id: UUID, jti: UUID, acc: number, iat?: number, activated?: boolean) => {
    await this.postgresClient
      .update(UserRefreshTokensTable)
      .set({ acc, activated, iat })
      .where(
        and(eq(UserRefreshTokensTable.userId, toDbUUID(client_id)), eq(UserRefreshTokensTable.jti, toDbUUID(jti)))
      );
  };

  createAuthCookie = (res: Response, authToken: string) => {
    res.cookie(JWT_COOKIE_AUTH_ID, authToken, {
      httpOnly: true,
      maxAge: ms(JWT_COOKIE_AUTH_EXPIRES as ms.StringValue),
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
  };

  createRefreshCookie = (res: Response, refreshToken: string) => {
    res.cookie(JWT_COOKIE_REFRESH_ID, refreshToken, {
      httpOnly: true,
      maxAge: ms(JWT_COOKIE_REFRESH_EXPIRES as ms.StringValue),
      path: '/api/users/generateAuthToken',
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
  };

  clearCookies = (res: Response) => {
    // Cookie options object structure must be identical to overwrite
    res.cookie(JWT_COOKIE_AUTH_ID, 'loggedOut', {
      httpOnly: true,
      maxAge: ms('1000'),
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
    res.cookie(JWT_COOKIE_REFRESH_ID, 'loggedOut', {
      httpOnly: true,
      maxAge: ms('1000'),
      path: '/api/users/generateAuthToken',
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
  };

  async updatePassword(userId: UUID, password: string) {
    const passwordHash = await this.getPasswordHash(password);
    const TIMESTAMP = new Date(Date.now());
    const user = await this.postgresClient
      .update(UserTable)
      .set({
        accountActive: true,
        accountFrozen: false,
        accountFrozenAt: null,
        accountUpdatedAt: TIMESTAMP,
        password: passwordHash,
        passwordChangedAt: TIMESTAMP,
        passwordResetExpires: null,
        passwordResetToken: null,
      })
      .where(eq(UserTable.id, userId))
      .returning({ id: UserTable.id });
    if (user.length === 0) throw new BadRequestError({ message: 'Unable to update password' });
  }

  generateClientTokens(userId: UUID, role: string) {
    const iat = Math.floor(Date.now() / 1000);
    const authToken = this.signAuthToken(userId, role, iat);
    const refreshTokenPayload = this.signRefreshTokenPayload(userId, iat);
    const refreshToken = this.signRefreshToken(userId, iat, refreshTokenPayload);
    return { authToken, refreshToken, refreshTokenPayload };
  }

  async getPasswordHash(password: string) {
    const hashedPassword = await argon2.hash(password, { secret: Buffer.from(POSTGRES_PEPPER) }).catch((error) => {
      throw new AppError({ code: 'INTERNAL_ERROR', context: { error }, httpStatus: 500, logging: true });
    });

    return hashedPassword;
  }

  async isPasswordValid(hashedPassword: string, password: string) {
    const isValid = await argon2.verify(hashedPassword, password, {
      secret: Buffer.from(POSTGRES_PEPPER),
    });

    if (!isValid) throw new UnauthorizedError({ message: 'Invalid password' });
  }

  async isExistingAccount(email: string): Promise<boolean> {
    const account = await this.postgresClient.query.UserTable.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.email, email),
    });

    if (account) throw new BadRequestError({ message: 'Account already registered with that email' });
    return false;
  }

  async isResetTokenValid(token: string) {
    // Find user by token; check if stored token timestamp is greater than now
    const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.postgresClient.query.UserTable.findFirst({
      columns: { id: true, role: true },
      where: (table, { and, eq, gt }) =>
        and(eq(table.passwordResetToken, hashedResetToken), gt(table.passwordResetExpires, new Date(Date.now()))),
    });

    if (!user) throw new BadRequestError({ message: 'Invalid or expired token' });
    return user;
  }

  async isTokenBlacklisted(jti: string) {
    const value = await this.redisClient.get(jti);
    if (value) throw new BadRequestError({ logging: true, message: 'JWT Invalid' });
  }

  async insertUser(email: string, verificationCode: string, verificationExpiry: Date) {
    await this.postgresClient
      .insert(UserTable)
      .values({ email, passwordResetExpires: verificationExpiry, passwordResetToken: verificationCode });
  }

  async queryUserById(userId: UUID) {
    const user = await this.postgresClient.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.id, userId),
    });
    if (!user) throw new BadRequestError({ message: 'Account not found' });
    return user;
  }

  async queryUserByEmail(email: string) {
    const user = await this.postgresClient.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) throw new UnauthorizedError({ message: 'Invalid account' });
    return user;
  }

  verifyAccount(user: SelectUserSchema, verificationCode: string) {
    const TIME_NOW = Date.now();

    if (user.accountFrozenAt === null || user.accountFrozenAt.getTime() !== user.accountCreatedAt.getTime())
      throw new BadRequestError({ message: 'Account already active' });
    if (user.passwordResetToken !== verificationCode)
      throw new UnauthorizedError({ message: 'Invalid verification token' });
    if (user.passwordResetExpires && TIME_NOW > user.passwordResetExpires.getTime())
      throw new UnauthorizedError({ message: 'Expired verification token' });

    return user;
  }

  async loginAccount(email: string, password: string) {
    const user = await this.postgresClient.query.UserTable.findFirst({
      columns: {
        id: true,
        accountActive: true,
        accountCreatedAt: true,
        accountFrozen: true,
        accountFrozenAt: true,
        password: true,
        role: true,
      },
      where: (table, funcs) => funcs.eq(table.email, email),
      with: {
        refreshTokens: { columns: { jti: true } },
      },
    });

    if (!user || !user.accountActive) throw new UnauthorizedError({ message: 'Invalid account' });
    await this.isPasswordValid(user.password, password);

    // TODO:  Maximum login sessions is 5; offer modal to force logout all sessions.
    // if (user.refreshTokens.length >= 5) res.status(400?)

    return user;
  }

  async logoutAccount(authTokenJWT: string) {
    // A+R tokens are issued at same IAT (login and generateAuthToken routes)
    // Use A token to find R; blacklist R
    const { client_id, iat } = this.verifyAuthToken(authTokenJWT);
    const [{ exp, jti }] = await this.postgresClient
      .delete(UserRefreshTokensTable)
      .where(and(eq(UserRefreshTokensTable.userId, toDbUUID(client_id)), eq(UserRefreshTokensTable.iat, iat)))
      .returning({ exp: UserRefreshTokensTable.exp, jti: UserRefreshTokensTable.jti });
    await this.redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
    await this.blacklistToken(jti, exp);
  }

  async freezeAccount(userId: UUID) {
    const TIMESTAMP = new Date(Date.now());
    await this.postgresClient
      .update(UserTable)
      .set({ accountFrozen: true, accountFrozenAt: TIMESTAMP, accountUpdatedAt: TIMESTAMP })
      .where(eq(UserTable.id, userId));
  }

  async deleteAccount(userId: UUID, password: string) {
    const user = await this.postgresClient.query.UserTable.findFirst({ columns: { password: true } });
    if (!user) throw new PostgresError({ logging: true, message: 'Error deleting account' });

    await this.isPasswordValid(user.password, password);

    const TIMESTAMP = new Date(Date.now());
    await this.postgresClient
      .update(UserTable)
      .set({ accountActive: false, accountFrozen: true, accountFrozenAt: TIMESTAMP, accountUpdatedAt: TIMESTAMP })
      .where(eq(UserTable.id, userId));
  }

  async resetPassword(userId: UUID, password: string) {
    const user = await this.postgresClient.query.UserTable.findFirst({
      columns: { password: true, role: true },
      where: (table, funcs) => funcs.eq(table.id, userId),
    });

    if (!user) throw new BadRequestError({ logging: true, message: 'User account not found' });

    const passwordHash = await this.getPasswordHash(password);
    const TIMESTAMP = new Date(Date.now());
    await this.postgresClient
      .update(UserTable)
      .set({
        accountUpdatedAt: TIMESTAMP,
        password: passwordHash,
        passwordChangedAt: TIMESTAMP,
        passwordResetExpires: null,
        passwordResetToken: null,
      })
      .where(eq(UserTable.id, userId));
  }

  async forgotPassword(email: string): Promise<string> {
    // Generate reset token
    const resetToken = crypto.randomBytes(64).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenCreatedAt = new Date(Date.now() + ms(PASSWORD_RESET_EXPIRES as ms.StringValue));

    // Update user entry
    const TIMESTAMP = new Date(Date.now());
    const [{ userId }] = await this.postgresClient
      .update(UserTable)
      .set({
        accountUpdatedAt: TIMESTAMP,
        passwordResetExpires: resetTokenCreatedAt,
        passwordResetToken: hashedResetToken,
      })
      .where(eq(UserTable.email, email))
      .returning({ userId: UserTable.id });

    if (!userId) throw new BadRequestError({ message: 'Invalid account' });
    return resetToken;
  }
}
