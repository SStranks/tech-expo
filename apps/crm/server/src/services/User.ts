import type { Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { eq, and } from 'drizzle-orm/expressions';
import argon2 from 'argon2';
import ms from 'ms';
import crypto, { type UUID } from 'node:crypto';

import { postgresDB } from '#Config/dbPostgres';
import { redisClient } from '#Config/dbRedis';
import { AppError, BadRequestError, PostgresError } from '#Utils/errors';
import { TUserRoles, UserRefreshTokensTable, UserTable } from '#Config/schema/index';
import { TSelectUserSchema } from '#Config/schema/User';

const {
  NODE_ENV,
  JWT_AUTH_SECRET,
  JWT_AUTH_EXPIRES,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES,
  JWT_COOKIE_AUTH_EXPIRES,
  JWT_COOKIE_REFRESH_EXPIRES,
  JWT_COOKIE_AUTH_ID,
  JWT_COOKIE_REFRESH_ID,
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

interface IRefreshTokenPayload extends JwtPayload {
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
    return jwt.sign({ client_id: userId, role, iat }, JWT_AUTH_SECRET as string, {
      expiresIn: JWT_AUTH_EXPIRES,
      jwtid: UUIDv4,
    });
  };

  signRefreshTokenPayload = (client_id: UUID, iat: number) => {
    const jti = crypto.randomUUID();
    const exp = Math.floor((Date.now() + ms(JWT_REFRESH_EXPIRES as string)) / 1000);
    const acc = 0; // Incrementer; Parent-Child token chain

    return { client_id, jti, exp, acc, iat };
  };

  signRefreshToken = (client_id: string, iat: number, refreshTokenPayload: IRefreshTokenPayload) => {
    const { jti, exp, acc } = refreshTokenPayload;
    return jwt.sign({ client_id, iat, jti, exp, acc }, JWT_REFRESH_SECRET as string);
  };

  blacklistToken = async (jti: UUID, exp: number) => {
    await redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
  };

  blacklistAllRefreshTokens = async (tokens: { jti: UUID; exp: number }[]) => {
    tokens.forEach(({ jti, exp }) => {
      redisClient.set(`${jti}`, 'Blacklisted', { EXAT: exp });
    });
  };

  verifyAuthToken = (authToken: string): IAuthTokenPayload => {
    try {
      const { client_id, role, jti, iat, exp } = jwt.verify(authToken, JWT_AUTH_SECRET as string) as IAuthTokenPayload;
      return { client_id, role, jti, iat, exp };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError({ message: 'Invalid JWT' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError({ message: 'Expired JWT' });
      }
      throw new AppError({ context: { error }, logging: true });
    }
  };

  verifyRefreshToken = (refreshToken: string): IRefreshTokenPayload => {
    try {
      const { client_id, jti, iat, exp, acc } = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET as string
      ) as IRefreshTokenPayload;
      return { client_id, jti, iat, exp, acc };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError({ message: 'Invalid JWT' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError({ message: 'Expired JWT' });
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
    let { client_id, jti, exp, acc } = payload as IRefreshTokenPayload;

    acc = acc + 1;

    return jwt.sign({ client_id, jti, iat, exp, acc }, JWT_REFRESH_SECRET as string);
  };

  deleteAllRefreshTokens = async (userId: string) => {
    return await postgresDB
      .delete(UserRefreshTokensTable)
      .where(eq(UserRefreshTokensTable.userId, userId))
      .returning({ jti: UserRefreshTokensTable.jti, exp: UserRefreshTokensTable.exp });
  };

  queryRefreshToken = async (client_id: string, jti: UUID) => {
    return await postgresDB.query.UserRefreshTokensTable.findFirst({
      columns: { acc: true, activated: true, iat: true, jti: true, exp: true },
      where: (table, { eq, and }) => and(eq(table.userId, client_id), eq(table.jti, jti)),
    });
  };

  insertRefreshToken = async (refreshTokenPayload: IRefreshTokenPayload) => {
    const { client_id, jti, iat, exp, acc } = refreshTokenPayload;
    await postgresDB.insert(UserRefreshTokensTable).values({ userId: client_id, jti, iat, exp, acc });
  };

  updateRefreshToken = async (client_id: UUID, jti: UUID, acc: number, iat?: number, activated?: boolean) => {
    await postgresDB
      .update(UserRefreshTokensTable)
      .set({ iat, acc, activated })
      .where(and(eq(UserRefreshTokensTable.userId, client_id), eq(UserRefreshTokensTable.jti, jti)));
  };

  createAuthCookie = (res: Response, authToken: string) => {
    res.cookie(JWT_COOKIE_AUTH_ID as string, authToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(JWT_COOKIE_AUTH_EXPIRES as string),
    });
  };

  createRefreshCookie = (res: Response, refreshToken: string) => {
    res.cookie(JWT_COOKIE_REFRESH_ID as string, refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/users/generateAuthToken',
      maxAge: ms(JWT_COOKIE_REFRESH_EXPIRES as string),
    });
  };

  clearCookies = (res: Response) => {
    // Cookie options object structure must be identical to overwrite
    res.cookie(JWT_COOKIE_AUTH_ID as string, 'loggedOut', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms('10000'),
    });
    res.cookie(JWT_COOKIE_REFRESH_ID as string, 'loggedOut', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/users/generateAuthToken',
      maxAge: ms('10000'),
    });
  };

  async updatePassword(userId: UUID, password: string) {
    const passwordHash = await this.getPasswordHash(password);
    const TIMESTAMP = new Date(Date.now());
    const user = await postgresDB
      .update(UserTable)
      .set({
        password: passwordHash,
        passwordResetExpires: null,
        passwordResetToken: null,
        passwordChangedAt: TIMESTAMP,
        accountUpdatedAt: TIMESTAMP,
        accountFrozenAt: null,
        accountFrozen: false,
        accountActive: true,
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
        throw new AppError({ logging: true, context: { error } });
      });

    return hashedPassword;
  }

  async isPasswordValid(hashedPassword: string, password: string) {
    const isValid = await argon2.verify(hashedPassword, password, {
      secret: Buffer.from(process.env.POSTGRES_PEPPER as string),
    });

    if (!isValid) throw new BadRequestError({ message: 'Invalid password', code: 401 });
  }

  async isExistingAccount(email: string): Promise<boolean> {
    const account = await postgresDB.query.UserTable.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.email, email),
    });

    if (account) throw new BadRequestError({ message: 'Account already registered with that email', code: 401 });
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
    if (value) throw new BadRequestError({ message: 'JWT Invalid', logging: true });
  }

  async insertUser(email: string, verificationCode: string, verificationExpiry: Date) {
    await postgresDB
      .insert(UserTable)
      .values({ email, passwordResetToken: verificationCode, passwordResetExpires: verificationExpiry });
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
    if (!user) throw new BadRequestError({ message: 'Invalid account', code: 401 });
    return user;
  }

  async verifyAccount(user: TSelectUserSchema, verificationCode: string) {
    const TIME_NOW = Date.now();

    if (user.accountFrozenAt === null || user.accountFrozenAt.getTime() !== user.accountCreatedAt.getTime())
      throw new BadRequestError({ message: 'Account already active', code: 400 });
    if (user.passwordResetToken !== verificationCode)
      throw new BadRequestError({ message: 'Invalid verification token', code: 401 });
    if (user.passwordResetExpires && TIME_NOW > user.passwordResetExpires.getTime())
      throw new BadRequestError({ message: 'Expired verification token', code: 401 });

    return user;
  }

  async loginAccount(res: Response, email: string, password: string) {
    const user = await postgresDB.query.UserTable.findFirst({
      columns: {
        id: true,
        role: true,
        password: true,
        accountCreatedAt: true,
        accountFrozenAt: true,
        accountFrozen: true,
        accountActive: true,
      },
      where: (table, funcs) => funcs.eq(table.email, email),
      with: {
        refreshTokens: { columns: { jti: true } },
      },
    });

    if (!user || !user.accountActive) throw new BadRequestError({ message: 'Invalid account', code: 401 });
    if (user.accountFrozen && user.accountCreatedAt === user.accountFrozenAt)
      return res.status(401).redirect('/verify-account');
    // TODO:  Maximum login sessions is 5; offer modal to force logout all sessions.
    // if (user.refreshTokens.length >= 5) res.status(400?)

    await this.isPasswordValid(user.password, password);
    const { authToken, refreshToken, refreshTokenPayload } = await this.generateClientTokens(user.id, user.role);
    await this.insertRefreshToken(refreshTokenPayload);
    await this.createAuthCookie(res, authToken);
    await this.createRefreshCookie(res, refreshToken);
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
      .set({ accountUpdatedAt: TIMESTAMP, accountFrozenAt: TIMESTAMP, accountFrozen: true })
      .where(eq(UserTable.id, userId));
  }

  async deleteAccount(userId: UUID, password: string) {
    const user = await postgresDB.query.UserTable.findFirst({ columns: { password: true } });
    if (!user) throw new PostgresError({ message: 'Error deleting account', logging: true });

    await this.isPasswordValid(user.password, password);

    const TIMESTAMP = new Date(Date.now());
    await postgresDB
      .update(UserTable)
      .set({ accountActive: false, accountFrozen: true, accountUpdatedAt: TIMESTAMP, accountFrozenAt: TIMESTAMP })
      .where(eq(UserTable.id, userId));
  }

  async resetPassword(userId: UUID, password: string) {
    const user = await postgresDB.query.UserTable.findFirst({
      columns: { password: true, role: true },
      where: (table, funcs) => funcs.eq(table.id, userId),
    });

    if (!user) throw new BadRequestError({ message: 'User account not found', code: 500, logging: true });

    const passwordHash = await this.getPasswordHash(password);
    const TIMESTAMP = new Date(Date.now());
    await postgresDB
      .update(UserTable)
      .set({
        password: passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: TIMESTAMP,
        accountUpdatedAt: TIMESTAMP,
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
        passwordResetToken: hashedResetToken,
        passwordResetExpires: resetTokenCreatedAt,
        accountUpdatedAt: TIMESTAMP,
      })
      .where(eq(UserTable.email, email))
      .returning({ userId: UserTable.id });

    if (!userId) throw new BadRequestError({ message: 'Invalid account', code: 401 });
    return resetToken;
  }
}

export default new User();
