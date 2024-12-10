/* eslint-disable perfectionist/sort-objects */
import type { Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import argon2 from 'argon2';
import { and, eq } from 'drizzle-orm/expressions';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import { postgresDB } from '#Config/dbPostgres';
import { redisClient } from '#Config/dbRedis';
import { TUserRoles, UserRefreshTokensTable, UserTable } from '#Config/schema/index';
import { TSelectUserSchema } from '#Config/schema/User';
import { AppError, BadRequestError, PostgresError } from '#Utils/errors';

import crypto, { type UUID } from 'node:crypto';

const {
  JWT_AUTH_EXPIRES,
  JWT_AUTH_SECRET,
  JWT_COOKIE_AUTH_EXPIRES,
  JWT_COOKIE_AUTH_ID,
  JWT_COOKIE_REFRESH_EXPIRES,
  JWT_COOKIE_REFRESH_ID,
  JWT_REFRESH_EXPIRES,
  JWT_REFRESH_SECRET,
  NODE_ENV,
  PASSWORD_RESET_EXPIRES,
} = process.env;

// REFACTOR:  Move type and function to PostGres Service??
// type TQueryAccountVerify = Awaited<ReturnType<typeof queryAccountVerify>>;
// type TQueryAccountRefreshTokens = Pick<Exclude<TQueryAccountVerify, undefined>, 'refreshToken'>['refreshToken'];

interface IAuthTokenPayload extends JwtPayload {
  client_id: UUID;
  role: TUserRoles;
  jti: UUID;
  iat: number;
  exp: number;
}

export interface IRefreshTokenPayload extends JwtPayload {
  client_id: UUID;
  jti: UUID;
  iat: number;
  exp: number;
  acc: number;
}

class User {
  constructor() {}

  signAuthToken = (userId: string, role: string, iat: number) => {
    const UUIDv4 = crypto.randomUUID();
    return jwt.sign({ client_id: userId, iat, role }, JWT_AUTH_SECRET as string, {
      expiresIn: JWT_AUTH_EXPIRES,
      jwtid: UUIDv4,
    });
  };

  signRefreshTokenPayload = (client_id: UUID, iat: number) => {
    const jti = crypto.randomUUID();
    const exp = Math.floor((Date.now() + ms(JWT_REFRESH_EXPIRES as string)) / 1000);
    const acc = 0; // Incrementer; Parent-Child token chain

    return { acc, client_id, exp, iat, jti };
  };

  signRefreshToken = (client_id: string, iat: number, refreshTokenPayload: IRefreshTokenPayload) => {
    const { acc, exp, jti } = refreshTokenPayload;
    return jwt.sign({ acc, client_id, exp, iat, jti }, JWT_REFRESH_SECRET as string);
  };

  blacklistToken = async (jti: UUID, exp: number) => {
    await redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
  };

  blacklistAllRefreshTokens = async (tokens: { jti: UUID; exp: number }[]) => {
    tokens.forEach(({ exp, jti }) => {
      redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
    });
  };

  verifyAuthToken = (authToken: string): IAuthTokenPayload => {
    try {
      const { client_id, exp, iat, jti, role } = jwt.verify(authToken, JWT_AUTH_SECRET as string) as IAuthTokenPayload;
      return { client_id, exp, iat, jti, role };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError({ code: 401, message: 'Invalid JWT' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError({ code: 401, message: 'Expired JWT' });
      }
      throw new AppError({ context: { error }, logging: true });
    }
  };

  verifyRefreshToken = (refreshToken: string): IRefreshTokenPayload => {
    try {
      const { acc, client_id, exp, iat, jti } = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET as string
      ) as IRefreshTokenPayload;
      return { acc, client_id, exp, iat, jti };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError({ code: 401, message: 'Invalid JWT' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError({ code: 401, message: 'Expired JWT' });
      }
      throw new AppError({ context: { error, logging: true } });
    }
  };

  decodeAuthToken = async (token: string) => {
    return jwt.decode(token) as IAuthTokenPayload;
  };

  decodeRefreshToken = async (token: string) => {
    return jwt.decode(token) as IRefreshTokenPayload;
  };

  activateRefreshToken = async (userId: string, iat: number) => {
    const user = await postgresDB
      .update(UserRefreshTokensTable)
      .set({ activated: true })
      .where(
        and(
          eq(UserRefreshTokensTable.userId, userId),
          eq(UserRefreshTokensTable.iat, iat),
          eq(UserRefreshTokensTable.activated, false)
        )
      )
      .returning({ userId: UserRefreshTokensTable.userId });

    if (user.length === 0) throw new BadRequestError({ message: 'Token already activated' });
  };

  advanceRefreshToken = (refreshToken: string, iat: number) => {
    const payload = jwt.decode(refreshToken);
    let { acc, client_id, exp, jti } = payload as IRefreshTokenPayload;

    acc = acc + 1;

    return jwt.sign({ acc, client_id, exp, iat, jti }, JWT_REFRESH_SECRET as string);
  };

  deleteAllRefreshTokens = async (userId: string) => {
    return await postgresDB
      .delete(UserRefreshTokensTable)
      .where(eq(UserRefreshTokensTable.userId, userId))
      .returning({ exp: UserRefreshTokensTable.exp, jti: UserRefreshTokensTable.jti });
  };

  queryRefreshToken = async (client_id: string, jti: UUID) => {
    return await postgresDB.query.UserRefreshTokensTable.findFirst({
      columns: { acc: true, activated: true, exp: true, iat: true, jti: true },
      where: (table, { and, eq }) => and(eq(table.userId, client_id), eq(table.jti, jti)),
    });
  };

  insertRefreshToken = async (refreshTokenPayload: IRefreshTokenPayload) => {
    const { acc, client_id, exp, iat, jti } = refreshTokenPayload;
    await postgresDB.insert(UserRefreshTokensTable).values({ acc, exp, iat, jti, userId: client_id });
  };

  updateRefreshToken = async (client_id: UUID, jti: UUID, acc: number, iat?: number, activated?: boolean) => {
    await postgresDB
      .update(UserRefreshTokensTable)
      .set({ acc, activated, iat })
      .where(and(eq(UserRefreshTokensTable.userId, client_id), eq(UserRefreshTokensTable.jti, jti)));
  };

  createAuthCookie = (res: Response, authToken: string) => {
    res.cookie(JWT_COOKIE_AUTH_ID as string, authToken, {
      httpOnly: true,
      maxAge: ms(JWT_COOKIE_AUTH_EXPIRES as string),
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
  };

  createRefreshCookie = (res: Response, refreshToken: string) => {
    res.cookie(JWT_COOKIE_REFRESH_ID as string, refreshToken, {
      httpOnly: true,
      maxAge: ms(JWT_COOKIE_REFRESH_EXPIRES as string),
      path: '/api/users/generateAuthToken',
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
  };

  clearCookies = (res: Response) => {
    // Cookie options object structure must be identical to overwrite
    res.cookie(JWT_COOKIE_AUTH_ID as string, 'loggedOut', {
      httpOnly: true,
      maxAge: ms('1000'),
      sameSite: 'strict',
      secure: NODE_ENV === 'production',
    });
    res.cookie(JWT_COOKIE_REFRESH_ID as string, 'loggedOut', {
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
    const user = await postgresDB
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
    if (!user) throw new BadRequestError({ code: 500, message: 'Unable to update password' });
  }

  async generateClientTokens(userId: UUID, role: string) {
    const iat = Math.floor(Date.now() / 1000);
    const authToken = this.signAuthToken(userId, role, iat);
    const refreshTokenPayload = this.signRefreshTokenPayload(userId, iat);
    const refreshToken = this.signRefreshToken(userId, iat, refreshTokenPayload);
    return { authToken, refreshToken, refreshTokenPayload };
  }

  async getPasswordHash(password: string) {
    const hashedPassword = await argon2
      .hash(password, { secret: Buffer.from(process.env.POSTGRES_PEPPER as string) })
      .catch((error) => {
        throw new AppError({ context: { error }, logging: true });
      });

    return hashedPassword;
  }

  async isPasswordValid(hashedPassword: string, password: string) {
    const isValid = await argon2.verify(hashedPassword, password, {
      secret: Buffer.from(process.env.POSTGRES_PEPPER as string),
    });

    if (!isValid) throw new BadRequestError({ code: 401, message: 'Invalid password' });
  }

  async isExistingAccount(email: string): Promise<boolean> {
    const account = await postgresDB.query.UserTable.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.email, email),
    });

    if (account) throw new BadRequestError({ code: 401, message: 'Account already registered with that email' });
    return false;
  }

  async isResetTokenValid(token: string) {
    // Find user by token; check if stored token timestamp is greater than now
    const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await postgresDB.query.UserTable.findFirst({
      columns: { id: true, role: true },
      where: (table, { and, eq, gt }) =>
        and(eq(table.passwordResetToken, hashedResetToken), gt(table.passwordResetExpires, new Date(Date.now()))),
    });

    if (!user) throw new BadRequestError({ message: 'Invalid or expired token' });
    return user;
  }

  async isTokenBlacklisted(jti: string) {
    const value = await redisClient.get(jti);
    if (value) throw new BadRequestError({ logging: true, message: 'JWT Invalid' });
  }

  async insertUser(email: string, verificationCode: string, verificationExpiry: Date) {
    await postgresDB
      .insert(UserTable)
      .values({ email, passwordResetExpires: verificationExpiry, passwordResetToken: verificationCode });
  }

  async queryUserById(userId: UUID) {
    const user = await postgresDB.query.UserTable.findFirst({ where: (table, { eq }) => eq(table.id, userId) });
    if (!user) throw new BadRequestError({ message: 'Account not found' });
    return user;
  }

  async queryUserByEmail(email: string) {
    const user = await postgresDB.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) throw new BadRequestError({ code: 401, message: 'Invalid account' });
    return user;
  }

  async verifyAccount(user: TSelectUserSchema, verificationCode: string) {
    const TIME_NOW = Date.now();

    if (user.accountFrozenAt === null || user.accountFrozenAt.getTime() !== user.accountCreatedAt.getTime())
      throw new BadRequestError({ code: 400, message: 'Account already active' });
    if (user.passwordResetToken !== verificationCode)
      throw new BadRequestError({ code: 401, message: 'Invalid verification token' });
    if (user.passwordResetExpires && TIME_NOW > user.passwordResetExpires.getTime())
      throw new BadRequestError({ code: 401, message: 'Expired verification token' });

    return user;
  }

  async loginAccount(email: string, password: string) {
    const user = await postgresDB.query.UserTable.findFirst({
      columns: {
        accountActive: true,
        accountCreatedAt: true,
        accountFrozen: true,
        accountFrozenAt: true,
        id: true,
        password: true,
        role: true,
      },
      where: (table, funcs) => funcs.eq(table.email, email),
      with: {
        refreshTokens: { columns: { jti: true } },
      },
    });

    if (!user || !user.accountActive) throw new BadRequestError({ code: 401, message: 'Invalid account' });
    await this.isPasswordValid(user.password, password);

    // TODO:  Maximum login sessions is 5; offer modal to force logout all sessions.
    // if (user.refreshTokens.length >= 5) res.status(400?)

    return user;
  }

  async logoutAccount(authTokenJWT: string) {
    // A+R tokens are issued at same IAT (login and generateAuthToken routes)
    // Use A token to find R; blacklist R
    const { client_id, iat } = await this.verifyAuthToken(authTokenJWT);
    const [{ exp, jti }] = await postgresDB
      .delete(UserRefreshTokensTable)
      .where(and(eq(UserRefreshTokensTable.userId, client_id), eq(UserRefreshTokensTable.iat, iat)))
      .returning({ exp: UserRefreshTokensTable.exp, jti: UserRefreshTokensTable.jti });
    await redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
    await this.blacklistToken(jti, exp);
  }

  async freezeAccount(userId: UUID) {
    const TIMESTAMP = new Date(Date.now());
    await postgresDB
      .update(UserTable)
      .set({ accountFrozen: true, accountFrozenAt: TIMESTAMP, accountUpdatedAt: TIMESTAMP })
      .where(eq(UserTable.id, userId));
  }

  async deleteAccount(userId: UUID, password: string) {
    const user = await postgresDB.query.UserTable.findFirst({ columns: { password: true } });
    if (!user) throw new PostgresError({ logging: true, message: 'Error deleting account' });

    await this.isPasswordValid(user.password, password);

    const TIMESTAMP = new Date(Date.now());
    await postgresDB
      .update(UserTable)
      .set({ accountActive: false, accountFrozen: true, accountFrozenAt: TIMESTAMP, accountUpdatedAt: TIMESTAMP })
      .where(eq(UserTable.id, userId));
  }

  async resetPassword(userId: UUID, password: string) {
    const user = await postgresDB.query.UserTable.findFirst({
      columns: { password: true, role: true },
      where: (table, funcs) => funcs.eq(table.id, userId),
    });

    if (!user) throw new BadRequestError({ code: 500, logging: true, message: 'User account not found' });

    const passwordHash = await this.getPasswordHash(password);
    const TIMESTAMP = new Date(Date.now());
    await postgresDB
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
    const resetTokenCreatedAt = new Date(Date.now() + ms(PASSWORD_RESET_EXPIRES as string));

    // Update user entry
    const TIMESTAMP = new Date(Date.now());
    const [{ userId }] = await postgresDB
      .update(UserTable)
      .set({
        accountUpdatedAt: TIMESTAMP,
        passwordResetExpires: resetTokenCreatedAt,
        passwordResetToken: hashedResetToken,
      })
      .where(eq(UserTable.email, email))
      .returning({ userId: UserTable.id });

    if (!userId) throw new BadRequestError({ code: 401, message: 'Invalid account' });
    return resetToken;
  }
}

export type TUser = typeof User;
export default new User();
