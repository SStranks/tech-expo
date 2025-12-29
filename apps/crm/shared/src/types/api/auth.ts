import type { JwtPayload } from 'jsonwebtoken';

import type { UUID } from './base.ts';
export type UserRoles = (typeof USER_ROLES)[number];
export const USER_ROLES = ['ROOT', 'ADMIN', 'MODERATOR', 'USER'] as const;

export interface AuthTokenPayload extends JwtPayload {
  client_id: UUID;
  role: UserRoles;
  jti: UUID;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload extends JwtPayload {
  client_id: UUID;
  jti: UUID;
  iat: number;
  exp: number;
  acc: number;
}

export interface UserRoleDTO {
  client_id: UUID;
  role: UserRoles;
}

interface TokensDTO {
  tokens: boolean;
}

// -------------------------------- //
// ------------ REQUEST ----------- //
// -------------------------------- //

export interface SignupRequestDTO {
  email: string;
}

export interface ConfirmSignupRequestDTO {
  email: string;
  password: string;
  passwordConfirm: string;
  verificationCode: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  password: string;
  passwordConfirm: string;
}

export interface UpdatePasswordRequestDTO {
  newPassword: string;
  newPasswordConfirm: string;
  oldPassword: string;
}

export interface DeleteAccountRequestDTO {
  password: string;
}

// -------------------------------- //
// ------------ RESPONSE ---------- //
// -------------------------------- //

export interface ConfirmSignupResponse {
  tokens: TokensDTO;
}

export interface LoginResponse {
  tokens: TokensDTO;
  user: UserRoleDTO;
}

export interface ResetPasswordResponse {
  tokens: TokensDTO;
}

export interface UpdatePasswordResponse {
  tokens: TokensDTO;
}

export interface GenerateAuthTokenResponse {
  tokens: TokensDTO;
}

export interface IdentifyResponse {
  user: UserRoleDTO;
}
