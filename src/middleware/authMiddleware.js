import jwt from 'jsonwebtoken';

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
