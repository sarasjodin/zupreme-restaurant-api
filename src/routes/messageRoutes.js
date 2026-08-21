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
  validateCreateMessage,
  validateMessageById,
  validateUpdateMessage,
  validateMessageStatus,
} from '../middleware/messageMiddleware.js';

const router = Router();

// Public route
router.post('/', validateCreateMessage, createMessage);

// Authenticated routes
router.get('/', requireAuth, validateMessageStatus, getMessages);

router.get('/:id', requireAuth, validateMessageById, getMessageById);

router.patch(
  '/:id',
  requireAuth,
  validateMessageById,
  validateUpdateMessage,
  updateMessageById,
);

router.delete('/:id', requireAuth, validateMessageById, deleteMessageById);

export default router;
