// server/src/routes/restaurant.routes.ts

import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { validateRestaurant } from '../validations/restaurant.validation';

const router = Router();

// Public routes
router.get('/search', RestaurantController.searchRestaurants);
router.get('/:id/menu', RestaurantController.getRestaurantMenu);

// Protected routes
router.use(authenticateToken);

// Restaurant registration
router.post(
  '/register',
  validateRestaurant,
  RestaurantController.register
);

// Restaurant management routes
router.get(
  '/dashboard/:id',
  authorizeRoles('RESTAURANT_OWNER', 'ADMIN'),
  RestaurantController.getDashboardData
);

router.put(
  '/:id',
  authorizeRoles('RESTAURANT_OWNER', 'ADMIN'),
  validateRestaurant,
  RestaurantController.updateRestaurant
);

router.put(
  '/:id/menu',
  authorizeRoles('RESTAURANT_OWNER', 'ADMIN'),
  RestaurantController.updateMenu
);

router.put(
  '/:id/availability',
  authorizeRoles('RESTAURANT_OWNER', 'ADMIN'),
  RestaurantController.toggleAvailability
);

// Admin-only routes
router.put(
  '/:id/status',
  authorizeRoles('ADMIN'),
  RestaurantController.updateRestaurantStatus
);

router.get(
  '/pending',
  authorizeRoles('ADMIN'),
  RestaurantController.getPendingRestaurants
);

router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  RestaurantController.deleteRestaurant
);

export default router;