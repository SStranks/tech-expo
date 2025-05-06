interface User {}

interface UserRoles {
  roles: string[];
}

interface Tokens {
  tokens: boolean;
}

export type Response = LoginResponse | ConfirmSignup | UpdatePassword | ResetPassword | GenerateAuthToken;
export interface LoginResponse extends Tokens, User, UserRoles {}
export interface ConfirmSignup extends Tokens {}
export interface UpdatePassword extends Tokens {}
export interface ResetPassword extends Tokens {}
export interface GenerateAuthToken extends Tokens {}
