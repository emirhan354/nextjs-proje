// src/models/auth.ts
export type AuthUser = {
  id: number;
  email: string;
  iat?: number; // seconds
  exp?: number; // seconds
};

export type LoginResponse = {
  message: string;
  token: string;
};

export type ProfileResponse = {
  message: string;
  user: AuthUser;
};
