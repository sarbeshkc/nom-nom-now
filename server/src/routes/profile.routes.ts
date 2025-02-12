import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// Profile Management
router.get('/profile', ProfileController.getProfile);
router.put('/profile', ProfileController.updateProfile);

// Email Management
router.post('/email/add', ProfileController.addEmail);
router.put('/email/verify/:token', ProfileController.verifyEmail);
router.put('/email/set-primary/:id', ProfileController.setPrimaryEmail);
router.delete('/email/:id', ProfileController.deleteEmail);

// Phone Management
router.post('/phone/add', ProfileController.addPhone);
router.put('/phone/verify/:token', ProfileController.verifyPhone);
router.put('/phone/set-primary/:id', ProfileController.setPrimaryPhone);
router.delete('/phone/:id', ProfileController.deletePhone);

// Connected Accounts
router.get('/connected-accounts', ProfileController.getConnectedAccounts);
router.post('/connected-accounts/:provider', ProfileController.connectAccount);
router.delete('/connected-accounts/:provider', ProfileController.disconnectAccount);

export default router;
