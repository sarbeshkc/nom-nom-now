import { Router, Request, Response } from 'express';
import PaymentController from '../controllers/payment.controller';

import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.use(authenticateToken as any);

// Payment routes
router.post('/initialize-esewa', (req: Request, res: Response) =>
  PaymentController.initializeEsewa(req, res)
);
router.post('/verify-esewa', (req: Request, res: Response) =>
  PaymentController.verifyEsewa(req, res)
);
router.get('/status/:orderId', (req: Request, res: Response) =>
  PaymentController.getPaymentStatus(req, res)
);

// Routes with role authorization
router.post(
  '/admin/payments',
  authorizeRoles('ADMIN'),
  (req: Request, res: Response) => PaymentController.adminPaymentHandler(req, res)
);

export default router;
