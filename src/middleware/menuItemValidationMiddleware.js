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
  const body = req.body ?? {};

  const { name, price, category_id } = body;

  if (name === undefined || price === undefined || category_id === undefined) {
    return res.status(400).json({
      error:
        'Missing required fields: name, price, and category_id are required',
    });
  }

  const validationError = validateMenuItemFields(body);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  next();
}

export function validateUpdateMenuItem(req, res, next) {
  const body = req.body ?? {};

  // Fält som får uppdateras via PATCH
  const allowedFields = [
    'name',
    'description',
    'serving',
    'price',
    'is_available',
    'sort_order',
    'category_id',
  ];

  // Kontrollerar att minst ett tillåtet fält har skickats
  const hasUpdate = allowedFields.some((field) => body[field] !== undefined);

  if (!hasUpdate) {
    return res.status(400).json({
      error: 'At least one allowed field is required for update',
    });
  }

  // Validerar endast de fält som skickats i request body
  const validationError = validateMenuItemFields(body);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  next();
}

// Gemensam validering av menyartikelfält för både POST och PATCH
function validateMenuItemFields(body) {
  const {
    name,
    description,
    serving,
    price,
    is_available,
    sort_order,
    category_id,
  } = body;

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return 'Name must be a non-empty string';
    }

    if (name.trim().length > 150) {
      return 'Name must not exceed 150 characters';
    }
  }

  if (description !== undefined) {
    if (description !== null && typeof description !== 'string') {
      return 'Description must be a string';
    }

    if (description !== null && description.trim().length > 1000) {
      return 'Description must not exceed 1000 characters';
    }
  }

  if (serving !== undefined) {
    if (typeof serving !== 'string' || !serving.trim()) {
      return 'Serving must be a non-empty string';
    }

    if (serving.trim().length > 50) {
      return 'Serving must not exceed 50 characters';
    }
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      return 'Price must be a valid number';
    }

    if (price < 0 || price > 9999.99) {
      return 'Price must be between 0 and 9999.99';
    }
  }

  if (is_available !== undefined && typeof is_available !== 'boolean') {
    return 'Is available must be a boolean';
  }

  if (
    sort_order !== undefined &&
    (!Number.isInteger(sort_order) || sort_order < 0)
  ) {
    return 'Sort order must be a non-negative integer';
  }

  if (category_id !== undefined) {
    if (typeof category_id !== 'number' || !Number.isInteger(category_id)) {
      return 'Category ID must be an integer';
    }

    if (category_id <= 0) {
      return 'Category ID must be a positive integer';
    }
  }

  return null;
}
