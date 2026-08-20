import pool from '../config/database.js';

export async function getMenuItems(req, res) {
  // Returnera: id, category_id, category_name, name, description,
  //            serving, price, is_available, sort_order
  // Tabeller: menu_items + menu_categories
  // Filtrering: endast tillgängliga menyartiklar som standard
  // Om include_unavailable=true returneras även otillgängliga artiklar
  // Sortering: kategori och sort_order
  // Statuskoder: 200, 500
  try {
    // Kontrollera om query-parametern include_unavailable är 'true'
    const includeUnavailable = req.query.include_unavailable === 'true';

    // Om includeUnavailable === true makes WHERE disappear otherwise filter by is_available = TRUE
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
      ${includeUnavailable ? '' : 'WHERE mi.is_available = TRUE'}
      ORDER BY mc.sort_order, mi.sort_order
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
    const id = req.menuItemId; // Validerad ID från validateMenuItemId

    const [rows] = await pool.query(
      `
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
      WHERE mi.id = ? AND mi.is_available = TRUE
    `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createMenuItem(req, res) {
  // Input: Validerad från validateCreateMenuItem
  // Obligatoriska: name, price, category_id
  // Valfria:
  //   description = null
  //   serving = 'Portion'
  //   is_available = true
  //   sort_order = 0
  //
  // Controller ansvarar för:
  //   - kontroll att category_id finns i menu_categories
  //   - kontroll att name inte redan finns i menu_items
  //   - skapa menyartikeln
  //   - hämta och returnera den skapade menyartikeln
  //
  // Statuskoder: 201, 400, 409, 500

  try {
    // Använder tomt objekt om req.body saknas
    const {
      name,
      description = null,
      serving = 'Portion',
      price,
      is_available = true,
      sort_order = 0,
      category_id,
    } = req.body ?? {};

    // Kontrollerar om category_id finns i menu_categories innan en menyartikel försöker skapas
    const [categories] = await pool.query(
      `
    SELECT id
    FROM menu_categories
    WHERE id = ?
  `,
      [category_id],
    );

    if (categories.length === 0) {
      return res.status(400).json({
        error: 'Invalid category ID',
      });
    }

    // Kontrollera om en menyartikel med samma namn redan finns
    const [existingItems] = await pool.query(
      'SELECT id FROM menu_items WHERE name = ?',
      [name.trim()],
    );

    if (existingItems.length > 0) {
      return res.status(409).json({
        error: 'A menu item with this name already exists',
      });
    }

    // Skapar menyartikeln i databasen
    // Där result.insertId innehåller det nya menu item id:t
    // som MySQL skapar via AUTO_INCREMENT
    const [result] = await pool.query(
      `
      INSERT INTO menu_items (
        category_id,
        name,
        description,
        serving,
        price,
        is_available,
        sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        category_id,
        name.trim(),
        description === null ? null : description.trim(),
        serving.trim(),
        price,
        is_available,
        sort_order,
      ],
    );

    // Hämtar den skapade menyartikeln inklusive databasgenererade värden
    // och returnera den som bekräftelse på vad som faktiskt sparades
    const [createdItems] = await pool.query(
      `
    SELECT
      mi.id,
      mi.category_id,
      mc.name AS category_name,
      mi.name,
      mi.description,
      mi.serving,
      mi.price,
      mi.is_available,
      mi.sort_order,
      mi.created_at
    FROM menu_items mi
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.id = ?
      `,
      [result.insertId],
    );

    return res.status(201).json(createdItems[0]);
  } catch (error) {
    console.error('Could not create menu item:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function updateMenuItemById(req, res) {
  // Implementation here
}

export async function deleteMenuItemById(req, res) {
  // Implementation here
}
