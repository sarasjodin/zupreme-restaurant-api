import { Router } from 'express';
import { getMenuCategories } from '../controllers/menuCategoryController.js';

const router = Router();
router.get('/', getMenuCategories);

export default router;
