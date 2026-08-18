import { Router } from 'express';
import { getMenuItems, getMenuItemById } from '../controllers/menuItemController.js';

const router = Router();
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

export default router;
