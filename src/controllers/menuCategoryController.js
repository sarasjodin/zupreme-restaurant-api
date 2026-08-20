import pool from '../config/database.js';

export async function getMenuCategories(req, res) {
  // Endpointen ska returnera? id, name, sort_order
  // Aktuell tabell? menu_categories
  // Resultatordning? sort_order
  // Statuskoder? 200, 500 (GET)
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        sort_order
      FROM menu_categories
      ORDER BY sort_order ASC
    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Could not fetch menu categories:', error.message);

    return res.status(500).json({ error: 'Internal server error' });
  }
}
