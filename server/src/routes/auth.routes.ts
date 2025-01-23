// src/routes/auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, requireTwoFactor } from '../middleware/auth.middleware';
import { rateLimiters } from '../middleware/rate-limit.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  signupSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  emailVerificationSchema,
  changePasswordSchema
} from '../validations/auth.validation';

const router = Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  rateLimiters.signup,
  validateRequest(signupSchema),
  AuthController.signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  rateLimiters.login,
  validateRequest(loginSchema),
  AuthController.login
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user's email address
 * @access  Public
 */
router.post(
  '/verify-email',
  validateRequest(emailVerificationSchema),
  AuthController.verifyEmail
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification link
 * @access  Public
 */
router.post(
  '/resend-verification',
  rateLimiters.api,
  AuthController.resendVerification
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  rateLimiters.passwordReset,
  validateRequest(passwordResetRequestSchema),
  AuthController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post(
  '/reset-password',
  rateLimiters.passwordReset,
  validateRequest(passwordResetSchema),
  AuthController.resetPassword
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password for logged in user
 * @access  Private
 */
router.post(
  '/change-password',
  authenticateToken,
  validateRequest(changePasswordSchema),
  AuthController.changePassword
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate token
 * @access  Private
 */
router.post(
  '/logout',
  authenticateToken,
  AuthController.logout
);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post(
  '/logout-all',
  authenticateToken,
  AuthController.logoutAll
);

/**
 * Two-Factor Authentication Routes
 */

/**
 * @route   POST /api/auth/2fa/setup
 * @desc    Setup 2FA for user
 * @access  Private
 */
router.post(
  '/2fa/setup',
  authenticateToken,
  AuthController.setupTwoFactor
);

/**
 * @route   POST /api/auth/2fa/verify-setup
 * @desc    Verify 2FA setup with initial code
 * @access  Private
 */
router.post(
  '/2fa/verify-setup',
  authenticateToken,
  AuthController.verifyTwoFactorSetup
);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA for user
 * @access  Private
 */
router.post(
  '/2fa/disable',
  authenticateToken,
  requireTwoFactor,
  AuthController.disableTwoFactor
);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify 2FA code during login
 * @access  Public
 */
router.post(
  '/2fa/verify',
  rateLimiters.api,
  AuthController.verifyTwoFactor
);

/**
 * Token Management Routes
 */

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Get new access token using refresh token
 * @access  Public
 */
router.post(
  '/refresh-token',
  rateLimiters.api,
  AuthController.refreshToken
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticateToken,
  AuthController.getCurrentUser
);

/**
 * Security and Session Management Routes
 */

/**
 * @route   GET /api/auth/sessions
 * @desc    Get all active sessions
 * @access  Private
 */
router.get(
  '/sessions',
  authenticateToken,
  AuthController.getSessions
);

/**
 * @route   DELETE /api/auth/sessions/:id
 * @desc    Revoke a specific session
 * @access  Private
 */
router.delete(
  '/sessions/:id',
  authenticateToken,
  AuthController.revokeSession
);

/**
 * @route   GET /api/auth/security-log
 * @desc    Get security event log
 * @access  Private
 */
router.get(
  '/security-log',
  authenticateToken,
  AuthController.getSecurityLog
);

/**
 * OAuth Routes
 */

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate with Google
 * @access  Public
 */
router.post(
  '/google',
  rateLimiters.api,
  AuthController.googleAuth
);

/**
 * Health Check Route
 */

/**
 * @route   GET /api/auth/health
 * @desc    Check authentication service health
 * @access  Public
 */
router.get(
  '/health',
  AuthController.healthCheck
);

export default router;