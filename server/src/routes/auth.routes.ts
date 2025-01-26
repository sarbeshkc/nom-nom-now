import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleAuth);
router.get('/verify-email/:token', AuthController.verifyEmail);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);
// server/src/routes/auth.routes.ts
router.get('/test-email', AuthController.testEmail);

export default router;