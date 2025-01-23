// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { TokenService } from '../utils/token';
import { AuthError, ERROR_CODES } from '../utils/error';
import { emailService } from '../services/email.service';
import { successResponse, errorResponse } from '../utils/response';
import { LoggingMiddleware } from '../middleware/logging.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthController {
    /**
     * Handle user registration
     * POST /api/auth/signup
     */
    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            // The request has already been validated by middleware
            const signupData = {
                ...req.body,
                deviceInfo: {
                    userAgent: req.headers['user-agent'],
                    ip: req.ip
                }
            };

            const result = await authService.signup(
                signupData,
                { ip: req.ip, userAgent: req.headers['user-agent'] }
            );

            return res.status(201).json(successResponse(
                result,
                'Registration successful. Please check your email for verification instructions.'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Handle user login
     * POST /api/auth/login
     */
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, rememberMe = false } = req.body;

            const result = await authService.login(
                {
                    email,
                    password,
                    rememberMe,
                    deviceInfo: {
                        userAgent: req.headers['user-agent'],
                        ip: req.ip
                    }
                },
                { ip: req.ip, userAgent: req.headers['user-agent'] }
            );

            // If 2FA is required, return early with temp token
            if (result.requiresTwoFactor) {
                return res.json(successResponse({
                    requiresTwoFactor: true,
                    tempToken: result.tempToken
                }, 'Two-factor authentication required'));
            }

            // Set refresh token as HTTP-only cookie
            if (result.tokens.refreshToken) {
                res.cookie('refreshToken', result.tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
            }

            return res.json(successResponse(result, 'Login successful'));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify email address
     * POST /api/auth/verify-email
     */
    static async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;

            await authService.verifyEmail(token);

            return res.json(successResponse(
                null,
                'Email verified successfully. You can now log in.'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Resend verification email
     * POST /api/auth/resend-verification
     */
    static async resendVerification(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            await authService.resendVerification(email);

            return res.json(successResponse(
                null,
                'If an account exists with that email, a new verification link has been sent.'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Request password reset
     * POST /api/auth/forgot-password
     */
    static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            await authService.requestPasswordReset(email, { ip: req.ip });

            return res.json(successResponse(
                null,
                'If an account exists with that email, password reset instructions have been sent.'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Reset password using token
     * POST /api/auth/reset-password
     */
    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;

            await authService.resetPassword(
                { token, newPassword },
                { ip: req.ip }
            );

            return res.json(successResponse(
                null,
                'Password has been reset successfully. You can now log in with your new password.'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Change password (authenticated)
     * POST /api/auth/change-password
     */
    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { currentPassword, newPassword } = req.body;

            await authService.changePassword(
                req.user.id,
                currentPassword,
                newPassword,
                { ip: req.ip }
            );

            return res.json(successResponse(
                null,
                'Password changed successfully.'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Log out (invalidate current token)
     * POST /api/auth/logout
     */
    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            await authService.logout(req.user.id, token);

            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            return res.json(successResponse(
                null,
                'Logged out successfully'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Log out from all devices
     * POST /api/auth/logout-all
     */
    static async logoutAll(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.logoutAll(req.user.id);

            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            return res.json(successResponse(
                null,
                'Logged out from all devices successfully'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Set up two-factor authentication
     * POST /api/auth/2fa/setup
     */
    static async setupTwoFactor(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.setupTwoFactor(req.user.id);

            return res.json(successResponse(
                result,
                'Two-factor authentication setup initiated'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify two-factor authentication setup
     * POST /api/auth/2fa/verify-setup
     */
    static async verifyTwoFactorSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.body;

            await authService.verifyTwoFactorSetup(
                req.user.id,
                code,
                { ip: req.ip }
            );

            return res.json(successResponse(
                null,
                'Two-factor authentication enabled successfully'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Disable two-factor authentication
     * POST /api/auth/2fa/disable
     */
    static async disableTwoFactor(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.disableTwoFactor(
                req.user.id,
                { ip: req.ip }
            );

            return res.json(successResponse(
                null,
                'Two-factor authentication disabled successfully'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify two-factor authentication code
     * POST /api/auth/2fa/verify
     */
    static async verifyTwoFactor(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, tempToken, trustDevice } = req.body;

            const result = await authService.verifyTwoFactor(
                code,
                tempToken,
                trustDevice,
                { ip: req.ip, userAgent: req.headers['user-agent'] }
            );

            // Set refresh token as HTTP-only cookie if provided
            if (result.tokens.refreshToken) {
                res.cookie('refreshToken', result.tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
            }

            return res.json(successResponse(
                result,
                'Two-factor authentication verified successfully'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh-token
     */
    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                throw new AuthError(
                    'Refresh token required',
                    ERROR_CODES.NO_TOKEN,
                    401
                );
            }

            const result = await authService.refreshToken(refreshToken);

            return res.json(successResponse(result));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await authService.getCurrentUser(req.user.id);

            return res.json(successResponse(user));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get active sessions
     * GET /api/auth/sessions
     */
    static async getSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const sessions = await authService.getSessions(req.user.id);

            return res.json(successResponse(sessions));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Revoke specific session
     * DELETE /api/auth/sessions/:id
     */
    static async revokeSession(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await authService.revokeSession(req.user.id, id);

            return res.json(successResponse(
                null,
                'Session revoked successfully'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get security event log
     * GET /api/auth/security-log
     */
    static async getSecurityLog(req: Request, res: Response, next: NextFunction) {
        try {
            const log = await authService.getSecurityLog(req.user.id);

            return res.json(successResponse(log));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Authenticate with Google
     * POST /api/auth/google
     */
    static async googleAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, role = 'CUSTOMER' } = req.body;

            const result = await authService.handleGoogleAuth(
                token,
                role,
                {
                    ip: req.ip,
                    userAgent: req.headers['user-agent']
                }
            );

            // Set refresh token as HTTP-only cookie if provided
            if (result.tokens.refreshToken) {
                res.cookie('refreshToken', result.tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
            }

            return res.json(successResponse(
                result,
                'Google authentication successful'
            ));

        } catch (error) {
            next(error);
        }
    }

    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    static async healthCheck(req: Request, res: Response) {
        try {
            // Check database connection
            await prisma.$queryRaw`SELECT 1`;

            return res.json(successResponse({
                status: 'healthy',
                timestamp: new Date().toISOString()
            }));

        } catch (error) {
            console.error('Health check failed:', error);
            return res.status(500).json(errorResponse(
                'Authentication service is not healthy'
            ));
        }
    }
}