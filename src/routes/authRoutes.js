import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Publik endpoint
// login() måste skapa och returnera en JWT-token
router.post('/login', login);

// Skyddad endpoint
// requireAuth körs först
// Endast om JWT är giltig körs getCurrentUser()
router.get('/me', requireAuth, getCurrentUser);

export default router;
