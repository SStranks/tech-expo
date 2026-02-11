import type {
  ApiResponseSuccess,
  ApiResponseSuccessData,
  ConfirmSignupRequestDTO,
  ConfirmSignupResponse,
  DeleteAccountRequestDTO,
  ForgotPasswordRequestDTO,
  GenerateAuthTokenResponse,
  IdentifyResponse,
  LoginRequestDTO,
  LoginResponse,
  ResetPasswordRequestDTO,
  ResetPasswordResponse,
  SignupRequestDTO,
  UpdatePasswordRequestDTO,
  UpdatePasswordResponse,
  UserRoles,
} from '@apps/crm-shared';
import type { NextFunction, Request, Response } from 'express';

import type { AuthenticatedLocals } from '#Types/express.js';

import validator from 'validator';

import { postgresDB } from '#Config/dbPostgres.js';
import { redisClient } from '#Config/dbRedis.js';
import NodeMailer from '#Lib/nodemailer/NodeMailer.js';
import { toUserRoleDTO } from '#Mappers/userMapper.js';
import { PostgresUserRepository } from '#Models/domain/user/user.repository.postgres.js';
import { UserService } from '#Services/user.service.js';
import AppError from '#Utils/errors/AppError.js';
import BadRequestError from '#Utils/errors/BadRequestError.js';
import ForbiddenError from '#Utils/errors/ForbiddenError.js';
import UnauthorizedError from '#Utils/errors/UnauthorizedError.js';
import { generateRandomInteger } from '#Utils/math.js';
import { hoursFromNowInEpochSeconds } from '#Utils/time.js';

// NOTE:  Generate JWT Secret: node -e "crypto.randomBytes(64).toString('hex')"

/*
 * README: AUTH FLOW:
 * Signup: Creates account (inactive). Send client email with code; expires in 24h
 * SignupVerify: Set account password. Send Auth (A) and Refresh (R) tokens to client as cookies. Add R to DB.
 * Login: Send Auth (A) and Refresh (R) tokens to client as cookies. Add R to DB.
 * Logout: Client sends A; match R on DB by jwt_iat and remove. Clear client cookies.
 * Forgot Password: Generate 64-str; send reset link to client with unhashed 64, store hashed 64 on DB.
 * Reset Password: Check reset token. Update password. Delete all R from DB and blacklist. Send new A+R to client.
 * Update password: Client sends A. Update password, delete all R from DB and blacklist. Send new A+R to client.
 * Freeze: Client sends A. Update DB to frozen. Delete all R from DB and blacklist (A + all R).
 * Delete: Client sends A and password. Update user on DB to inactive and frozen;
 *   delete all R from DB, blacklist R's and A. Clear client cookies.
 * Generate A: Client sends R - is it blacklisted? Create new A and R;
 *   R token is reconstructed with new expiry minus time elapsed and accumulator +1; DB R updated.
 * Activate R: Client sends A. Find R on DB using payload of A, and set to active.
 */

const userRepository = new PostgresUserRepository();
const userService = new UserService(userRepository, redisClient, postgresDB);

// TODO:  Make verification page on client; redirect to this page at end of THIS signup process.
const signup = async (
  req: Request<object, object, SignupRequestDTO>,
  res: Response<ApiResponseSuccess>,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) return next(new BadRequestError({ message: 'Provide all required fields' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ message: 'Invalid email address' }));

  // Check for existing account. Generate 6-digit verification code, expiry time, and send email to client
  await userService.isExistingAccount(email);
  const verificationCode = generateRandomInteger(6).toString();
  const verificationExpiry = new Date(hoursFromNowInEpochSeconds(24));
  await NodeMailer.sendAccountVerificationEmail(email, verificationCode, verificationExpiry);
  await userService.insertUser(email, verificationCode, verificationExpiry);

  res.status(200).json({
    status: 'success',
    message: 'Signup email with verification code sent',
  });
};

const confirmSignup = async (
  req: Request<object, object, ConfirmSignupRequestDTO>,
  res: Response<ApiResponseSuccessData<ConfirmSignupResponse>>,
  next: NextFunction
) => {
  const { email, password, passwordConfirm, verificationCode } = req.body;
  if (!email || !password || !passwordConfirm || !verificationCode)
    return next(new BadRequestError({ message: 'Provide all required fields' }));

  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== passwordConfirm)
    return next(new BadRequestError({ message: 'Password and password confirm do not match' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ message: 'Invalid email address' }));

  const user = await userService.queryUserByEmail(email);
  userService.verifyAccount(user, verificationCode);
  await userService.updatePassword(user.id, password);
  const { authToken, refreshToken, refreshTokenPayload } = userService.generateClientTokens(user.id, user.role);
  await userService.insertRefreshToken(refreshTokenPayload);
  userService.createAuthCookie(res, authToken);
  userService.createRefreshCookie(res, refreshToken);

  res.status(201).json({ status: 'success', message: 'Account verified', data: { tokens: { tokens: true } } });
};

const login = async (
  req: Request<object, object, LoginRequestDTO>,
  res: Response<ApiResponseSuccessData<LoginResponse>>,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new BadRequestError({ message: 'Provide all required fields' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ message: 'Invalid email address' }));

  const userRow = await userService.loginAccount(email, password);
  if (userRow.accountFrozen && userRow.accountCreatedAt === userRow.accountFrozenAt)
    return res.status(401).redirect('/verify-account'); // TODO: Move this out to the frontend to handle instead

  const user = toUserRoleDTO(userRow);

  const { authToken, refreshToken, refreshTokenPayload } = userService.generateClientTokens(user.client_id, user.role);
  await userService.insertRefreshToken(refreshTokenPayload);
  userService.createAuthCookie(res, authToken);
  userService.createRefreshCookie(res, refreshToken);

  // TODO:  Send client to dashboard on success
  // TODO: . Amend DATA to send back actual details here.
  res.status(200).json({ status: 'success', message: 'Logged in to CRM', data: { tokens: { tokens: true }, user } });
};

const logout = async (req: Request<object, object, never>, res: Response<ApiResponseSuccess>, next: NextFunction) => {
  const { authorization } = req.headers;

  let JWT: string | undefined;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  }

  if (!JWT)
    return next(
      new AppError({
        code: 'OPERATIONAL_ERROR',
        httpStatus: 401,
        message: 'Unauthorized: JWT missing depsite route guard',
      })
    );

  const { exp, jti } = userService.decodeAuthToken(JWT);
  await userService.blacklistToken(jti, exp);
  userService.clearCookies(res);
  // TODO:  Redirect client to home
  await userService.logoutAccount(JWT).catch((error) =>
    next(
      new AppError({
        code: 'INTERNAL_ERROR',
        context: { error },
        httpStatus: 500,
        logging: true,
        message: 'Error occured during logout',
      })
    )
  );

  res.status(200).json({ status: 'success', message: 'Logged out' });
};

const forgotPassword = async (
  req: Request<object, object, ForgotPasswordRequestDTO>,
  res: Response<ApiResponseSuccess>,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) return next(new BadRequestError({ message: 'Provide all required fields' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ message: 'Invalid email address' }));

  const unhashedResetToken = await userService.forgotPassword(email);
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${unhashedResetToken}`;
  await NodeMailer.sendPasswordResetEmail(email, resetURL);

  res.status(200).json({ status: 'success', message: 'Reset token sent to email' });
};

const resetPassword = async (
  req: Request<{ token: string }, object, ResetPasswordRequestDTO>,
  res: Response<ApiResponseSuccessData<ResetPasswordResponse>>,
  next: NextFunction
) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;
  if (!password || !passwordConfirm) return next(new BadRequestError({ message: 'Provide all required fields' }));
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== passwordConfirm)
    return next(new BadRequestError({ message: 'Password and password confirm do not match' }));
  if (!token) return next(new BadRequestError({ message: 'Provide valid token' }));

  const user = await userService.isResetTokenValid(token);
  await userService.resetPassword(user.id, password);
  const tokens = await userService.deleteAllRefreshTokens(user.id);
  await userService.blacklistAllRefreshTokens(tokens);

  const { authToken, refreshToken, refreshTokenPayload } = userService.generateClientTokens(user.id, user.role);
  await userService.insertRefreshToken(refreshTokenPayload);
  userService.createAuthCookie(res, authToken);
  userService.createRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Password Reset Successful',
    data: { tokens: { tokens: true } },
  });
};

const updatePassword = async (
  req: Request<object, object, UpdatePasswordRequestDTO>,
  res: Response<ApiResponseSuccessData<UpdatePasswordResponse>>,
  next: NextFunction
) => {
  const { newPassword, newPasswordConfirm, oldPassword } = req.body;
  const { authorization } = req.headers;

  if (!newPassword || !newPasswordConfirm || !oldPassword)
    return next(new BadRequestError({ message: 'Provide all required fields' }));
  if (newPassword !== newPasswordConfirm)
    return next(new BadRequestError({ message: 'Password and password confirm do not match' }));

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  }

  if (!JWT)
    return next(
      new AppError({
        code: 'OPERATIONAL_ERROR',
        httpStatus: 401,
        message: 'Unauthorized: JWT missing depsite route guard',
      })
    );

  const { client_id, exp, jti } = userService.decodeAuthToken(JWT);
  const user = await userService.queryUserById(client_id);
  await userService.isPasswordValid(user.password, oldPassword);
  await userService.updatePassword(user.id, newPassword);
  const tokens = await userService.deleteAllRefreshTokens(client_id);
  await userService.blacklistAllRefreshTokens(tokens);
  await userService.blacklistToken(jti, exp);

  const { authToken, refreshToken, refreshTokenPayload } = userService.generateClientTokens(user.id, user.role);
  await userService.insertRefreshToken(refreshTokenPayload);
  userService.createAuthCookie(res, authToken);
  userService.createRefreshCookie(res, refreshToken);

  res.status(200).json({ status: 'success', message: 'Password updated', data: { tokens: { tokens: true } } });
};

const freezeAccount = async (
  req: Request<object, object, never>,
  res: Response<ApiResponseSuccess>,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  }

  if (!JWT)
    return next(
      new AppError({
        code: 'OPERATIONAL_ERROR',
        httpStatus: 401,
        message: 'Unauthorized: JWT missing depsite route guard',
      })
    );

  const { client_id, exp, jti } = userService.decodeAuthToken(JWT);
  await userService.freezeAccount(client_id);
  const tokens = await userService.deleteAllRefreshTokens(client_id);
  await userService.blacklistAllRefreshTokens(tokens);
  await userService.blacklistToken(jti, exp);
  userService.clearCookies(res);

  // TODO:  Redirect client to homepage (logged out).
  res.status(204).send();
};

const deleteAccount = async (
  req: Request<object, object, DeleteAccountRequestDTO>,
  res: Response<ApiResponseSuccess>,
  next: NextFunction
) => {
  const { password } = req.body;
  const { authorization } = req.headers;
  if (!password) return next(new BadRequestError({ message: 'Provide all required fields' }));

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  }

  if (!JWT)
    return next(
      new AppError({
        code: 'OPERATIONAL_ERROR',
        httpStatus: 401,
        message: 'Unauthorized: JWT missing depsite route guard',
      })
    );

  const { client_id, exp, jti } = userService.decodeAuthToken(JWT);
  await userService.deleteAccount(client_id, password);
  const tokens = await userService.deleteAllRefreshTokens(client_id);
  await userService.blacklistAllRefreshTokens(tokens);
  await userService.blacklistToken(jti, exp);
  userService.clearCookies(res);

  // TODO:  Redirect client to homepage (logged out).
  res.status(204).send();
};

const generateAuthToken = async (
  req: Request<object, object, never>,
  res: Response<ApiResponseSuccessData<GenerateAuthTokenResponse>>,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.refreshJWT) {
    JWT = req.refreshJWT;
  }
  if (!JWT) return next(new UnauthorizedError({ message: 'Unauthorized. Please login' }));

  const { acc, client_id, iat: oldIat, jti } = userService.verifyRefreshToken(JWT);
  await userService.isTokenBlacklisted(JWT);

  let role;
  if (req.authJWT) {
    const { role: userRole } = userService.decodeAuthToken(req.authJWT);
    role = userRole;
  } else {
    // When Auth token expired and/or not provided
    const { role: userRole } = await userService.queryUserById(client_id);
    role = userRole;
  }
  const refreshToken = await userService.queryRefreshToken(client_id, jti);
  if (!refreshToken)
    return next(
      new AppError({ code: 'INTERNAL_ERROR', httpStatus: 500, message: 'Internal Error. Please login again' })
    );

  const iat = Math.floor(Date.now() / 1000);

  // Legitimate Request; push forward R token accumulator value
  if (refreshToken.acc === acc && refreshToken.activated) {
    await userService.updateRefreshToken(client_id, jti, acc + 1, iat, false);
    const authToken = userService.signAuthToken(client_id, role, iat);
    const refreshToken = userService.advanceRefreshToken(JWT, iat);

    userService.createAuthCookie(res, authToken);
    userService.createRefreshCookie(res, refreshToken);
    // TODO:  Return Expiry time
    res.status(201).json({ status: 'success', message: 'Auth token generated', data: { tokens: { tokens: true } } });
    return;
  }

  /*
   * Legitimate request; previous tokens not received by client;
   * rollback optimistic DB update - allows client to resubmit their valid old refresh token again
   */
  if (refreshToken.acc === acc + 1 && !refreshToken.activated) {
    await userService.updateRefreshToken(client_id, jti, oldIat, acc, true);
    return next(new BadRequestError({ message: 'Resubmit refresh token' }));
  }

  // Legitimate request; Client has not validated the R token yet.
  if (!refreshToken.activated) return next(new BadRequestError({ message: 'Please verify Refresh Token' }));

  // Fraudulent request; R accumulator out-of-sync; freeze account
  if (refreshToken.acc !== acc) {
    await userService.freezeAccount(client_id);
    const tokens = await userService.deleteAllRefreshTokens(client_id);
    await userService.blacklistAllRefreshTokens(tokens);
    userService.clearCookies(res);
    return next(
      new ForbiddenError({
        context: { 'Fraudulent Refresh Token Access': { client_id: client_id } },
        logging: true,
        message: 'Account frozen',
      })
    );
  }
};

const activateRefreshToken = async (
  req: Request<object, object, never> & {
    cookies: Record<string, string | undefined>;
  },
  res: Response<ApiResponseSuccess>,
  next: NextFunction
) => {
  // On receipt of AR tokens, send back A to /verifyToken - have setInterval on client to keep resending until 200 received.
  // Update R token active flag on DB
  const { authorization } = req.headers;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  } else {
    return next(new UnauthorizedError({ message: 'Unauthorized. Please login' }));
  }

  userService.verifyAuthToken(JWT);
  const { client_id, iat } = userService.decodeAuthToken(JWT);
  await userService.activateRefreshToken(client_id, iat);

  res.status(204).send();
};

const identify = async (
  _req: Request<object, object, never>,
  res: Response<ApiResponseSuccessData<IdentifyResponse>, AuthenticatedLocals>,
  _next: NextFunction
) => {
  // TODO:  Query profile table for user information.
  const userRow = await userService.queryUserById(res.locals.user.client_id);
  // TEMP: . Need to add in user name, role title, minor details - information to hydrate FE on initial load.
  const user = toUserRoleDTO(userRow);
  res.status(200).json({ status: 'success', message: 'Account identified', data: { user } });
};

const protectedRoute = async (req: Request, res: Response<object, AuthenticatedLocals>, next: NextFunction) => {
  const { authorization } = req.headers;
  let JWT: string | undefined;

  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  }

  if (!JWT) return next(new UnauthorizedError({ message: 'Unauthorized. Please login' }));

  const { client_id, jti, role } = userService.verifyAuthToken(JWT);
  await userService.isTokenBlacklisted(jti);
  res.locals.user = { client_id, role };
  next();
};

const restrictedRoute = (...roles: UserRoles[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    let JWT;
    if (authorization && authorization.startsWith('Bearer')) {
      JWT = authorization.split(' ')[1];
    } else if (req.authJWT) {
      JWT = req.authJWT;
    }

    if (!JWT)
      return next(
        new AppError({
          code: 'OPERATIONAL_ERROR',
          httpStatus: 401,
          message: 'Unauthorized: JWT missing depsite route guard',
        })
      );

    const { client_id, role } = userService.verifyAuthToken(JWT);

    if (!roles.includes(role)) {
      return next(new ForbiddenError({ message: 'Forbidden' }));
    }

    // High-security routes; manadatory DB check for role
    if (roles.some((el) => el === 'ROOT' || el === 'ADMIN')) {
      const { role } = await userService.queryUserById(client_id);
      if (role !== 'ROOT' && role !== 'ADMIN') return next(new ForbiddenError({ message: 'Forbidden' }));
    }

    next();
  };
};

const controller = {
  activateRefreshToken,
  confirmSignup,
  deleteAccount,
  forgotPassword,
  freezeAccount,
  generateAuthToken,
  identify,
  login,
  logout,
  protectedRoute,
  resetPassword,
  restrictedRoute,
  signup,
  updatePassword,
};
export default controller;
