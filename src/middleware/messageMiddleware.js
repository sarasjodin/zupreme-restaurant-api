import { isValidEmail } from '../utils/validationUtils.js';

const allowedStatuses = ['unread', 'read', 'handled'];

export function validateMessageById(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid message ID',
    });
  }

  req.messageId = id;

  next();
}

export function validateCreateMessage(req, res, next) {
  const body = req.body ?? {};

  const { name, email, subject, message } = body;

  if (
    name === undefined ||
    email === undefined ||
    subject === undefined ||
    message === undefined
  ) {
    return res.status(400).json({
      error:
        'Missing required fields: name, email, subject, and message are required',
    });
  }

  const validationError = validateMessageFields(body);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  next();
}

export function validateMessageStatus(req, res, next) {
  // Hämtar status från query-parametern
  const { status } = req.query;

  // Tillåtna statusvärden
  // läses från global variabel allowedStatuses

  // Kontrollerar att status är giltig om den skickats med
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid message status',
    });
  }

  // Fortsätter till nästa route-handler
  next();
}

export function validateUpdateMessage(req, res, next) {
  const { status } = req.body ?? {};

  // Tillåtna statusvärden
  // läses från global variabel allowedStatuses

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid message status',
    });
  }

  next();
}

// Validera id, name (100), email (254), subject (150), message (1000), status (unread,read,handled), created_at
function validateMessageFields(body) {
  const { name, email, subject, message } = body;

  // Kontrollerar obligatoriska fält och datatyper
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
    return 'Name, email, subject and message are required';
  }

  if (name.trim().length > 100) {
    return 'Name must not exceed 100 characters';
  }

  if (email.trim().length > 254) {
    return 'Email must not exceed 254 characters';
  }

  if (!isValidEmail(email)) {
    return 'Invalid email address';
  }

  if (subject.trim().length > 150) {
    return 'Subject must not exceed 150 characters';
  }

  if (message.trim().length > 1000) {
    return 'Message must not exceed 1000 characters';
  }

  return null; // Inget valideringsfel
}
