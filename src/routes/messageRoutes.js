import { Router } from 'express';
import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
} from '../controllers/messageController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

import {
  validateMessageById,
  validateUpdateMessage,
} from '../middleware/messageMiddleware.js';

const router = Router();

// Public route
router.post('/', createMessage);

// Authenticated routes
router.get('/', requireAuth, getMessages); // Not yet implemented

router.get('/:id', requireAuth, validateMessageById, getMessageById); // Not yet implemented

router.patch(
  '/:id',
  requireAuth,
  validateMessageById,
  validateUpdateMessage,
  updateMessageById,
); // Not yet implemented

router.delete('/:id', requireAuth, validateMessageById, deleteMessageById); // Not yet implemented

export default router;
