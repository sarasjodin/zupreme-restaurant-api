import pool from '../config/database.js';

export async function createMessage(req, res) {
  // Input: validerad av validateCreateMessage middleware
  // Returnerar: id, name, email, subject, message, status, created_at
  // Tabell: messages
  // Statuskoder: 201, 400, 500
  try {
    // Hämtar redan validerad data från request body
    const { name, email, subject, message } = req.body;

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

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Could not create message:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function getMessages(req, res) {
  // Input: valfri req.query.status
  // Returnerar: lista med meddelanden
  // Tabeller: messages
  // Filter: valfri status
  // Statuskoder: 200, 400, 401, 500 (GET)
  try {
    const { status } = req.query;

    // Om status finns filtreras meddelandena, annars hämtas alla i nästa SELECT-sats
    if (status) {
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
          WHERE status = ?
          ORDER BY created_at DESC
        `,
        [status],
      );

      return res.status(200).json(rows);
    }

    // Hämtar alla meddelanden
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        email,
        subject,
        message,
        status,
        created_at
      FROM messages
      ORDER BY created_at DESC
    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Could not get messages:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function getMessageById(req, res) {
  const id = req.messageId;

  try {
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
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Could not get message by ID:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// Uppdaterar status för ett meddelande baserat på ID
// Validering av ID och status sker i middleware
// PATCH för messages används endast för att ändra status
// Övriga meddelandefält ska behållas orörda
export async function updateMessageById(req, res) {
  try {
    // Hämtar validerat message ID från middleware
    const id = req.messageId;

    const { status } = req.body;

    // Kontrollerar att meddelandet finns
    const [existingMessages] = await pool.query(
      'SELECT id FROM messages WHERE id = ?',
      [id],
    );

    if (existingMessages.length === 0) {
      return res.status(404).json({
        error: 'Message not found',
      });
    }

    // Uppdaterar meddelandets status
    await pool.query('UPDATE messages SET status = ? WHERE id = ?', [
      status,
      id,
    ]);

    // Hämtar och returnerar det uppdaterade meddelandet
    const [updatedMessages] = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          subject,
          message,
          status,
          created_at,
          updated_at
        FROM messages
        WHERE id = ?
      `,
      [id],
    );

    return res.status(200).json(updatedMessages[0]);
  } catch (error) {
    console.error('Could not update message:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function deleteMessageById(req, res) {
  try {
    // Hämtar validerat message ID från middleware
    const id = req.messageId;

    const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Message not found',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Could not delete message:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
