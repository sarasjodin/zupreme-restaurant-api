import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export async function login(req, res) {
  // Input: req.body.email, req.body.password
  // Returnera: JWT-token och id, name, email, role, is_active
  // Aktuell tabell? users
  // Filter: matchande användare med unik e-postadress
  // Kontroll: lösenord matchar password_hash och användaren är aktiv
  // Statuskoder: 200, 400, 401, 500 (POST + JWT)
  // Roll: admin, editor

  try {
    // Använder tomt objekt om req.body saknas
    const { email, password } = req.body ?? {};
    // Validering: email, password måste finnas och inte vara tomma
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password // Password might include spaces
    ) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email.trim().length > 254) {
      return res.status(400).json({
        error: 'Email must not exceed 254 characters',
      });
    }

    // Validering av e-postadressens format
    const emailParts = email.trim().split('@');

    if (
      emailParts.length !== 2 ||
      !emailParts[0] ||
      !emailParts[1].includes('.') ||
      emailParts[1].startsWith('.') ||
      emailParts[1].endsWith('.')
    ) {
      return res.status(400).json({
        error: 'Invalid email address',
      });
    }

    const [rows] = await pool.query(
      `
    SELECT
      id,
      name,
      email,
      password_hash,
      role,
      is_active
    FROM users
    WHERE email = ?
  `,
      [email.trim()],
    );

    // Tidig check för att se om användaren finns annars returneras 401
    if (rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Användaren finns - hämta den första...och enda raden
    const user = rows[0];

    // Kontrollera lösenordet med bcrypt
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    // Om lösenordet inte matchar eller användaren inte är aktiv returneras 401
    // Samma meddelande som för att inte avslöja om e-postadressen är korrekt eller inte
    if (!passwordMatches || !user.is_active) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Skapa JWT-token - endast med användarens id och roll
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    // Returnera token och användarens information utan password_hash
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: Boolean(user.is_active),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCurrentUser(req, res) {
  // Input: autentiserad användare från giltig JWT
  // Returnera: id, name, email, role, is_active
  // Aktuell tabell? users
  // Filter: aktuell autentiserad användares ID
  // Statuskoder? 200, 401, 500 (GET)
}
