import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', RestaurantController.getRestaurants);
router.get('/:id', RestaurantController.getRestaurantById);

// Protected routes
router.use(authenticateToken);
router.post('/', authorizeRoles('ADMIN', 'RESTAURANT_OWNER'), RestaurantController.createRestaurant);
router.put('/:id', authorizeRoles('ADMIN', 'RESTAURANT_OWNER'), RestaurantController.updateRestaurant);
router.delete('/:id', authorizeRoles('ADMIN', 'RESTAURANT_OWNER'), RestaurantController.deleteRestaurant);

export default router;