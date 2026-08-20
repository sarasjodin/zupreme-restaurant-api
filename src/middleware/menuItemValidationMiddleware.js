export function validateMenuItemId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid menu item ID',
    });
  }

  req.menuItemId = id;

  next();
}

export function validateCreateMenuItem(req, res, next) {
  const {
    name,
    description = null,
    serving = 'Portion',
    price,
    is_available = true,
    sort_order = 0,
    category_id,
  } = req.body ?? {};

  // Validering av obligatoriska fält
  if (name === undefined || price === undefined || category_id === undefined) {
    return res.status(400).json({
      error:
        'Missing required fields: name, price, and category_id are required',
    });
  }

  // Validering av enstaka fält
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

  // Verifierar att sort_order är ett icke-negativt heltal
  if (!Number.isInteger(sort_order) || sort_order < 0) {
    return res.status(400).json({
      error: 'Sort order must be a non-negative integer',
    });
  }

  next();
}
