import { Router } from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItemById,
  deleteMenuItemById,
} from '../controllers/menuItemController.js';
import {
  requireAuth,
  requireAuthForUnavailable,
} from '../middleware/authMiddleware.js';
import {
  validateMenuItemId,
  validateCreateMenuItem,
  validateUpdateMenuItem,
} from '../middleware/menuItemValidationMiddleware.js';

const router = Router();

// Public routes
router.get('/', requireAuthForUnavailable, getMenuItems); // * Public by default...but authenticated when ?include_unavailable=true is used
router.get('/:id', validateMenuItemId, getMenuItemById);

// Authenticated routes
router.post('/', requireAuth, validateCreateMenuItem, createMenuItem);
router.patch(
  '/:id',
  requireAuth,
  validateMenuItemId,
  validateUpdateMenuItem,
  updateMenuItemById,
);
router.delete('/:id', requireAuth, validateMenuItemId, deleteMenuItemById);

export default router;
