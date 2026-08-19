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

const router = Router();

// Public routes
router.get('/', requireAuthForUnavailable, getMenuItems); // * Public by default...but authenticated when ?include_unavailable=true is used
router.get('/:id', getMenuItemById);

// Authenticated routes
router.post('/', requireAuth, createMenuItem);
router.patch('/:id', requireAuth, updateMenuItemById);
router.delete('/:id', requireAuth, deleteMenuItemById);

export default router;
