import pool from '../config/database.js';

export async function getMenuItems(req, res) {
  // Returnera: id, category_id, category_name, name, description,
  //            serving, price, is_available, sort_order
  // Tabeller: menu_items + menu_categories
  // Filtrering: endast tillgängliga menyartiklar som standard
  // Sortering: kategori och sort_order
  // Statuskoder: 200, 500
  try {
    const [rows] = await pool.query(`
      SELECT
        mi.id,
        mi.category_id,
        mc.name AS category_name,
        mi.name,
        mi.description,
        mi.serving,
        mi.price,
        mi.is_available,
        mi.sort_order
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_available = TRUE
      ORDER BY mc.name, mi.sort_order
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMenuItemById(req, res) {
  // Input: req.params.id
  // Returnera: id, category_id, category_name, name, description,
  //            serving, price, is_available, sort_order
  // Tabeller: menu_items + menu_categories
  // Filter: specifikt ID
  // Statuskoder: 200, 400, 404, 500

  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid menu item ID',
        });
    }

    const [rows] = await pool.query(`
    SELECT
        mi.id,
        mi.category_id,
        mc.name AS category_name,
        mi.name,
        mi.description,
        mi.serving,
        mi.price,
        mi.is_available,
        mi.sort_order
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/* CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    serving VARCHAR(50) NOT NULL DEFAULT 'Portion',
    price DECIMAL(8, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_menu_items_category
        FOREIGN KEY (category_id)
        REFERENCES menu_categories(id)
); */

