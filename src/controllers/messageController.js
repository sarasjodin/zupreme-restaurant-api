import pool from '../config/database.js';

export async function createMessage(req, res) {
  // Input: req.body.name, req.body.email, req.body.subject, req.body.message
  // Returnera: id, name, email, subject, message, status, created_at
  // Tabeller: messages
  // Statuskoder: 201, 400, 500
  // Validering: name, email, subject och message:
  //    - måste finnas
  //    - inte vara tomma
  //    - rätt typ - string
  //    - max antal tecken
  //    - email måste vara giltig
  try {
    // Använder tomt objekt om req.body saknas
    const { name, email, subject, message } = req.body ?? {};
    // Validering: name, email, subject och message måste finnas och inte vara tomma
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res
        .status(400)
        .json({ error: 'Name, email, subject and message are required' });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        error: 'Name must not exceed 100 characters',
      });
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

    if (subject.trim().length > 150) {
      return res.status(400).json({
        error: 'Subject must not exceed 150 characters',
      });
    }

    const [result] = await pool.query(
      `
            INSERT INTO messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `,
      [name.trim(), email.trim(), subject.trim(), message.trim()],
    );

    const [rows] = await pool.query(
      `
    SELECT
      id,
      name,
      email,
      subject,
      message,
      status,
      created_at
    FROM messages
    WHERE id = ?
  `,
      [result.insertId],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Could not create message:', error.message);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function getMessages(req, res) {} // Not yet implemented

export async function getMessageById(req, res) {} // Not yet implemented

export async function updateMessageById(req, res) {} // Not yet implemented

export async function deleteMessageById(req, res) {} // Not yet implemented
