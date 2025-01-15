// server/src/utils/errors.ts

export class AuthError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, code: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const ERROR_CODES = {
  // Authentication errors
  NO_TOKEN: 'AUTH_NO_TOKEN',
  INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',
  ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Generic errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  
  // Business logic errors
  EMAIL_IN_USE: 'EMAIL_IN_USE',
  INVALID_RESET_TOKEN: 'INVALID_RESET_TOKEN',
  INVALID_VERIFICATION_TOKEN: 'INVALID_VERIFICATION_TOKEN'
} as const;