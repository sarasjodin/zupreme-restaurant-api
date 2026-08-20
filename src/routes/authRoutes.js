import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController.js';
import { validateLogin, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Publik endpoint
// login() måste skapa och returnera en JWT-token
// som klienten sedan kan använda för att autentisera sig
// Endast om e-postadress och password är giltiga - validation sker i validateLogin() middleware
router.post('/login', validateLogin, login);

// Skyddad endpoint
// requireAuth körs först
// Endast om JWT är giltig körs getCurrentUser()
router.get('/me', requireAuth, getCurrentUser);

export default router;
