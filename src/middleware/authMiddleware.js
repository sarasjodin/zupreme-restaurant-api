import jwt from 'jsonwebtoken';
import { isValidEmail } from '../utils/validationUtils.js';

// Validerar e-postadress och password vid autentisering
export function validateLogin(req, res, next) {
  // Använder tomt objekt om req.body saknas
  const { email, password } = req.body ?? {};

  // Validering: email, password måste finnas och inte vara tomma
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password // Password kan innehålla whitespace
  ) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email.trim().length > 254) {
    return res.status(400).json({
      error: 'Email must not exceed 254 characters',
    });
  }

  // Validerar e-postadressens format med gemensam hjälpfunktion
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email address',
    });
  }

  next();
}

// Validate JWT token middleware
export function requireAuth(req, res, next) {
  // Klienten måste skicka:
  // Authorization: Bearer <JWT-token>
  const authHeader = req.headers.authorization;

  // Kontrollerar att Authorization-header finns
  // och använder Bearer-format
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  // Tar ut själva JWT-tokenen efter "Bearer"
  const token = authHeader.split(' ')[1];

  try {
    // JWT_SECRET måste finnas i miljövariablerna
    // Samma JWT_SECRET måste användas när token skapas i login().
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Sparar den verifierade token-payloaden på requesten
    // getCurrentUser() kan sedan använda req.user.id
    req.user = decoded;

    // Skickar requesten vidare till nästa funktion
    // exempelvis getCurrentUser()
    next();
  } catch {
    // Ogiltig eller utgången token
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
}

// Middleware för att kräva autentisering endast när
// query-parametern include_unavailable är 'true'
export function requireAuthForUnavailable(req, res, next) {
  if (req.query.include_unavailable === 'true') {
    return requireAuth(req, res, next);
  }

  next();
}
