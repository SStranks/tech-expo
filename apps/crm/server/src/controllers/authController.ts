/* eslint-disable perfectionist/sort-objects */
import type { NextFunction, Request, Response } from 'express';

import validator from 'validator';

import { TUserRoles } from '#Config/schema';
import { NodeMailerService, UserService } from '#Services/index';
import { BadRequestError } from '#Utils/errors';
import { utilMath, utilTime } from '#Utils/index';

// NOTE:  Generate JWT Secret: node -e "crypto.randomBytes(64).toString('hex')"

// README:  AUTH FLOW:
// Signup: Creates account (inactive). Send client email with code; expires in 24h
// SignupVerify: Set account password. Send Auth (A) and Refresh (R) tokens to client as cookies. Add R to DB.
// Login: Send Auth (A) and Refresh (R) tokens to client as cookies. Add R to DB.
// Logout: Client sends A; match R on DB by jwt_iat and remove. Clear client cookies.
// Forgot Password: Generate 64-str; send reset link to client with unhashed 64, store hashed 64 on DB.
// Reset Password: Check reset token. Update password. Delete all R from DB and blacklist. Send new A+R to client.
// Update password: Client sends A. Update password, delete all R from DB and blacklist. Send new A+R to client.
// Freeze: Client sends A. Update DB to frozen. Delete all R from DB and blacklist (A + all R).
// Delete: Client sends A and password. Update user on DB to inactive and frozen. Delete all R from DB, blacklist R's and A. Clear client cookies.
// Generate A: Client sends R - is it blacklisted? Create new A and R; R token is reconstructed with new expiry minus time elapsed and accumulator +1; DB R updated.
// Activate R: Client sends A. Find R on DB using payload of A, and set to active.

const { JWT_COOKIE_AUTH_ID, JWT_COOKIE_REFRESH_ID } = process.env;

// TODO:  Make verification page on client; redirect to this page at end of THIS signup process.
const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new BadRequestError({ message: 'Provide all required fields' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ code: 401, message: 'Invalid email address' }));

  // Check for existing account. Generate 6-digit verification code, expiry time, and send email to client
  await UserService.isExistingAccount(email);
  const verificationCode = utilMath.generateRandomInteger(6).toString();
  const verificationExpiry = new Date(utilTime.hoursFromNowInEpochSeconds(24));
  await NodeMailerService.sendAccountVerificationEmail(email, verificationCode, verificationExpiry);
  await UserService.insertUser(email, verificationCode, verificationExpiry);

  res.status(200).json({
    message: 'Signup email with verification code sent',
    status: 'success',
  });
};

const confirmSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, passwordConfirm, verificationCode } = req.body;
  if (!email || !password || !passwordConfirm || !verificationCode)
    return next(new BadRequestError({ message: 'Provide all required fields' }));

  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== passwordConfirm)
    return next(new BadRequestError({ code: 401, message: 'Password and password confirm do not match' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ code: 401, message: 'Invalid email address' }));

  const user = await UserService.queryUserByEmail(email);
  await UserService.verifyAccount(user, verificationCode);
  await UserService.updatePassword(user.id, password);
  const { authToken, refreshToken, refreshTokenPayload } = await UserService.generateClientTokens(user.id, user.role);
  await UserService.insertRefreshToken(refreshTokenPayload);
  UserService.createAuthCookie(res, authToken);
  UserService.createRefreshCookie(res, refreshToken);

  res.status(201).json({ message: 'Account verified', status: 'success', tokens: true });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new BadRequestError({ message: 'Provide all required fields' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ code: 401, message: 'Invalid email address' }));

  const user = await UserService.loginAccount(email, password);
  if (user.accountFrozen && user.accountCreatedAt === user.accountFrozenAt)
    return res.status(401).redirect('/verify-account');

  const { authToken, refreshToken, refreshTokenPayload } = await UserService.generateClientTokens(user.id, user.role);
  await UserService.insertRefreshToken(refreshTokenPayload);
  await UserService.createAuthCookie(res, authToken);
  await UserService.createRefreshCookie(res, refreshToken);

  // TODO:  Send client to dashboard on success
  // TODO: . Amend DATA to send back actual details here.
  res
    .status(200)
    .json({ message: 'Logged in to CRM', status: 'success', tokens: true, data: { user: 'A', roles: ['B'] } });
};

const logout = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  }
  const { exp, jti } = await UserService.decodeAuthToken(JWT);
  await UserService.blacklistToken(jti, exp);
  UserService.clearCookies(res);
  // TODO:  Redirect client to home
  await UserService.logoutAccount(JWT)
    .catch((error) => {
      throw new BadRequestError({
        code: 500,
        context: { error },
        logging: true,
        message: 'Error occured during logout',
      });
    })
    .finally(() => res.status(200).json({ message: 'Logged out', status: 'success' }));
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new BadRequestError({ message: 'Provide all required fields' }));

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) return next(new BadRequestError({ code: 401, message: 'Invalid email address' }));

  const unhashedResetToken = await UserService.forgotPassword(email);
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${unhashedResetToken}`;
  await NodeMailerService.sendPasswordResetEmail(email, resetURL);

  res.status(200).json({ message: 'Reset token sent to email', status: 'success' });
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;
  if (!password || !passwordConfirm) return next(new BadRequestError({ message: 'Provide all required fields' }));
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== passwordConfirm)
    return next(new BadRequestError({ code: 401, message: 'Password and password confirm do not match' }));
  if (!token) return next(new BadRequestError({ message: 'Provide valid token' }));

  const user = await UserService.isResetTokenValid(token);
  await UserService.resetPassword(user.id, password);
  const tokens = await UserService.deleteAllRefreshTokens(user.id);
  await UserService.blacklistAllRefreshTokens(tokens);

  const { authToken, refreshToken, refreshTokenPayload } = await UserService.generateClientTokens(user.id, user.role);
  await UserService.insertRefreshToken(refreshTokenPayload);
  UserService.createAuthCookie(res, authToken);
  UserService.createRefreshCookie(res, refreshToken);

  res.status(200).json({
    message: 'Password Reset Successful',
    status: 'success',
    tokens: true,
  });
};

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, newPasswordConfirm, oldPassword } = req.body;
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

  if (!newPassword || !newPasswordConfirm || !oldPassword)
    return next(new BadRequestError({ message: 'Provide all required fields' }));
  if (newPassword !== newPasswordConfirm)
    return next(new BadRequestError({ code: 401, message: 'Password and password confirm do not match' }));

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  }

  const { client_id, exp, jti } = await UserService.decodeAuthToken(JWT);
  const user = await UserService.queryUserById(client_id);
  await UserService.isPasswordValid(user.password, oldPassword);
  await UserService.updatePassword(user.id, newPassword);
  const tokens = await UserService.deleteAllRefreshTokens(client_id);
  await UserService.blacklistAllRefreshTokens(tokens);
  await UserService.blacklistToken(jti, exp);

  const { authToken, refreshToken, refreshTokenPayload } = await UserService.generateClientTokens(user.id, user.role);
  await UserService.insertRefreshToken(refreshTokenPayload);
  UserService.createAuthCookie(res, authToken);
  UserService.createRefreshCookie(res, refreshToken);

  res.status(200).json({ message: 'Password updated', status: 'success', tokens: true });
};

const freezeAccount = async (req: Request, res: Response, _next: NextFunction) => {
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  }

  const { client_id, exp, jti } = await UserService.decodeAuthToken(JWT);
  await UserService.freezeAccount(client_id);
  const tokens = await UserService.deleteAllRefreshTokens(client_id);
  await UserService.blacklistAllRefreshTokens(tokens);
  await UserService.blacklistToken(jti, exp);
  UserService.clearCookies(res);

  // TODO:  Redirect client to homepage (logged out).
  res.status(204).send();
};

const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;
  if (!password) return next(new BadRequestError({ message: 'Provide all required fields' }));

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  }

  const { client_id, exp, jti } = await UserService.decodeAuthToken(JWT);
  await UserService.deleteAccount(client_id, password);
  const tokens = await UserService.deleteAllRefreshTokens(client_id);
  await UserService.blacklistAllRefreshTokens(tokens);
  await UserService.blacklistToken(jti, exp);
  UserService.clearCookies(res);

  // TODO:  Redirect client to homepage (logged out).
  res.status(204).send();
};

const generateAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie, [`${JWT_COOKIE_REFRESH_ID}`]: refreshCookie } = req.cookies;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (refreshCookie) {
    JWT = refreshCookie;
  }
  if (!JWT) return next(new BadRequestError({ code: 400, message: 'Unauthorized. Please login' }));

  const { acc, client_id, iat: oldIat, jti } = await UserService.verifyRefreshToken(JWT);
  await UserService.isTokenBlacklisted(JWT);

  let role;
  if (authCookie) {
    const { role: userRole } = await UserService.decodeAuthToken(authCookie);
    role = userRole;
  } else {
    // When Auth token expired and/or not provided
    const { role: userRole } = await UserService.queryUserById(client_id);
    role = userRole;
  }
  const refreshToken = await UserService.queryRefreshToken(client_id, jti);
  if (!refreshToken) throw new BadRequestError({ code: 500, message: 'Internal Error. Please login again' });

  const iat = Math.floor(Date.now() / 1000);

  // Legitimate Request; push forward R token accumulator value
  if (refreshToken.acc === acc && refreshToken.activated) {
    await UserService.updateRefreshToken(client_id, jti, acc + 1, iat, false);
    const authToken = await UserService.signAuthToken(client_id, role, iat);
    const refreshToken = await UserService.advanceRefreshToken(JWT, iat);

    await UserService.createAuthCookie(res, authToken);
    await UserService.createRefreshCookie(res, refreshToken);
    res.status(201).json({ message: 'Auth token generated', status: 'success', tokens: true }); // TODO:  Return Expiry time
    return;
  }

  // Legitimate request; previous tokens not received by client; rollback optimistic DB update - allows client to resubmit their valid old refresh token again
  if (refreshToken.acc === acc + 1 && !refreshToken.activated) {
    await UserService.updateRefreshToken(client_id, jti, oldIat, acc, true);
    res.status(401).json({ message: 'Resubmit refresh token', status: 'success' }).send();
    return;
  }

  // Legitimate request; Client has not validated the R token yet.
  if (!refreshToken.activated) throw new BadRequestError({ code: 401, message: 'Please verify Refresh Token' });

  // Fraudulent request; R accumulator out-of-sync; freeze account
  if (refreshToken.acc !== acc && refreshToken.activated) {
    await UserService.freezeAccount(client_id);
    const tokens = await UserService.deleteAllRefreshTokens(client_id);
    await UserService.blacklistAllRefreshTokens(tokens);
    UserService.clearCookies(res);
    throw new BadRequestError({
      code: 403,
      context: { 'Fraudulent Refresh Token Access': { client_id: client_id } },
      logging: true,
      message: 'Account frozen',
    });
  }
};

const activateRefreshToken = async (req: Request, res: Response, _next: NextFunction) => {
  // On receipt of AR tokens, send back A to /verifyToken - have setInterval on client to keep resending until 200 received.
  // Update R token active flag on DB
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  } else {
    res.status(401).json({ message: 'Unauthorized', status: 'failure' });
    return;
  }

  await UserService.verifyAuthToken(JWT);
  const { client_id, iat } = await UserService.decodeAuthToken(JWT);
  await UserService.activateRefreshToken(client_id, iat);

  res.status(204).send();
};

const identify = async (_req: Request, res: Response, _next: NextFunction) => {
  // TODO:  Query profile table for user information.
  const user = await UserService.queryUserById(res.locals.user.client_id);
  // TEMP: . Need to add in user name, role title, minor details - information to hydrate FE on initial load.
  res.status(200).json({ status: 'success', message: 'Account identified', user: { role: user.role } });
};

const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  }

  if (!JWT) return next(new BadRequestError({ code: 401, message: 'Unauthorized. Please login' }));

  const { client_id, jti, role } = await UserService.verifyAuthToken(JWT);
  await UserService.isTokenBlacklisted(jti);
  res.locals.user = { client_id, role };
  next();
};

const restrictedRoute = (...roles: TUserRoles[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

    let JWT;
    if (authorization && authorization.startsWith('Bearer')) {
      JWT = authorization.split(' ')[1];
    } else if (authCookie) {
      JWT = authCookie;
    }

    const { client_id, role } = UserService.verifyAuthToken(JWT);

    if (!roles.includes(role)) {
      return next(new BadRequestError({ code: 403, message: 'Forbidden' }));
    }
    // High-security routes; manadatory DB check for role
    if (roles.some((el) => el === 'ROOT' || el === 'ADMIN')) {
      const { role } = await UserService.queryUserById(client_id);
      if (role !== 'ROOT' && role !== 'ADMIN') return next(new BadRequestError({ code: 403, message: 'Forbidden' }));
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
