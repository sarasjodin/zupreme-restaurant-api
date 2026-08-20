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
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid menu item ID',
      });
    }

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
  // Input: req.body.name, req.body.description, req.body.serving, req.body.price,
  //  req.body.is_available, req.body.sort_order, req.body.category_id
  // Obligatoriska: name, price, category_id
  // Valfria:
  //   description = null
  //   serving = 'Portion'
  //   is_available = true
  //   sort_order = 0
  // Returnera: id, category_id, category_name, name, description,
  //  serving, price, is_available, sort_order, created_at
  // Tabeller: menu_items och menu_categories
  // Statuskoder: 201, 400, 409, 500 (POST)
  // Validering: name (150), description VARCHAR(1000), serving (50),
  //  price DECIMAL(6, 2), is_available BOOLEAN, sort_order, category_id
  //   - obligatoriska fält som måste finnas
  //   - inte vara tomma
  //   - rätt typ
  //   - max antal tecken
  //   - prisintervall 0-9999.99
  //   - mm
  //  - category_id måste finnas i menu_categories
  //  - NB! name i menu_items UNIQUE

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

    if (
      name === undefined ||
      price === undefined ||
      category_id === undefined
    ) {
      return res.status(400).json({
        error:
          'Missing required fields: name, price, and category_id are required',
      });
    }

    // Validering av obligatoriska fält
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'Name is required and must be a non-empty string',
      });
    }

    if (name.trim().length > 150) {
      return res.status(400).json({
        error: 'Name must not exceed 150 characters',
      });
    }

    // Verifierar om price verkligen är av typen number
    // samt att det är ett giltigt tal (inte NaN eller Infinity)
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      return res.status(400).json({
        error: 'Price is required and must be a valid number',
      });
    }

    // Verifierar prisintervallet
    if (price < 0 || price > 9999.99) {
      return res.status(400).json({
        error: 'Price must be between 0 and 9999.99',
      });
    }

    if (typeof category_id !== 'number' || !Number.isInteger(category_id)) {
      return res.status(400).json({
        error: 'Category ID is required and must be an integer',
      });
    }

    if (category_id <= 0) {
      return res.status(400).json({
        error: 'Category ID must be a positive integer',
      });
    }

    // Description är valfri men null som defaultvärde
    if (description !== null && typeof description !== 'string') {
      return res.status(400).json({
        error: 'Description must be a string',
      });
    }

    if (description !== null && description.trim().length > 1000) {
      return res.status(400).json({
        error: 'Description must not exceed 1000 characters',
      });
    }

    // Serving har defaultvärdet "Portion"
    if (typeof serving !== 'string' || !serving.trim()) {
      return res.status(400).json({
        error: 'Serving must be a non-empty string',
      });
    }

    if (serving.trim().length > 50) {
      return res.status(400).json({
        error: 'Serving must not exceed 50 characters',
      });
    }

    if (typeof is_available !== 'boolean') {
      return res.status(400).json({
        error: 'Is available must be a boolean',
      });
    }

    // Verifierar att sort_order INTE är ett heltal eller är negativt
    if (!Number.isInteger(sort_order) || sort_order < 0) {
      return res.status(400).json({
        error: 'Sort order must be a non-negative integer',
      });
    }

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
