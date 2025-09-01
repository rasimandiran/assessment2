// Input validation utilities

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.status = 400;
  }
}

// Sanitize string input
function sanitizeString(value, maxLength = 255) {
  if (typeof value !== 'string') {
    return String(value || '').trim();
  }
  return value.trim().slice(0, maxLength);
}

// Validate item schema
function validateItem(item) {
  const errors = [];

  // Check if item is an object
  if (!item || typeof item !== 'object') {
    throw new ValidationError('Request body must be a valid JSON object');
  }

  // Validate name (required)
  if (!item.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (typeof item.name !== 'string') {
    errors.push({ field: 'name', message: 'Name must be a string' });
  } else if (item.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  } else if (item.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  // Validate category (optional)
  if (item.category !== undefined) {
    if (typeof item.category !== 'string') {
      errors.push({ field: 'category', message: 'Category must be a string' });
    } else if (item.category.length > 50) {
      errors.push({ field: 'category', message: 'Category must be less than 50 characters' });
    }
  }

  // Validate price (optional)
  if (item.price !== undefined) {
    const price = Number(item.price);
    if (isNaN(price)) {
      errors.push({ field: 'price', message: 'Price must be a valid number' });
    } else if (price < 0) {
      errors.push({ field: 'price', message: 'Price cannot be negative' });
    } else if (price > 1000000) {
      errors.push({ field: 'price', message: 'Price cannot exceed $1,000,000' });
    }
  }

  // Check for invalid fields
  const allowedFields = ['name', 'category', 'price'];
  const providedFields = Object.keys(item);
  const invalidFields = providedFields.filter(field => !allowedFields.includes(field) && field !== 'id');
  
  if (invalidFields.length > 0) {
    errors.push({ 
      field: 'unknown', 
      message: `Unknown fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}` 
    });
  }

  // If there are validation errors, throw them
  if (errors.length > 0) {
    const error = new ValidationError('Validation failed');
    error.details = errors;
    throw error;
  }

  // Return sanitized item
  return {
    name: sanitizeString(item.name, 100),
    category: item.category ? sanitizeString(item.category, 50) : undefined,
    price: item.price !== undefined ? Number(item.price) : undefined
  };
}

// Validation middleware factory
function validateItemMiddleware() {
  return (req, res, next) => {
    try {
      req.validatedItem = validateItem(req.body);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          error: 'Validation Error',
          message: error.message,
          details: error.details || [{ field: error.field, message: error.message }],
          timestamp: new Date().toISOString()
        });
      }
      next(error);
    }
  };
}

// Additional validation functions
function validateUpdateItem(item, existingItem) {
  const errors = [];

  // At least one field must be provided for update
  const updatableFields = ['name', 'category', 'price'];
  const providedFields = Object.keys(item).filter(key => updatableFields.includes(key));
  
  if (providedFields.length === 0) {
    errors.push({ field: 'general', message: 'At least one field must be provided for update' });
  }

  // Validate provided fields using the same rules as create
  try {
    const validatedItem = validateItem({ ...existingItem, ...item });
    if (errors.length === 0) {
      return validatedItem;
    }
  } catch (validationError) {
    if (validationError.details) {
      errors.push(...validationError.details);
    } else {
      errors.push({ field: 'general', message: validationError.message });
    }
  }

  if (errors.length > 0) {
    const error = new ValidationError('Update validation failed');
    error.details = errors;
    throw error;
  }
}

// Rate limiting validation
const rateLimitMap = new Map();

function validateRateLimit(req, maxRequests = 10, windowMs = 60000) {
  const clientId = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean old entries
  if (rateLimitMap.has(clientId)) {
    const requests = rateLimitMap.get(clientId).filter(timestamp => timestamp > windowStart);
    rateLimitMap.set(clientId, requests);
  }

  // Check current request count
  const requests = rateLimitMap.get(clientId) || [];
  if (requests.length >= maxRequests) {
    const error = new ValidationError('Rate limit exceeded. Too many requests.');
    error.status = 429;
    throw error;
  }

  // Add current request
  requests.push(now);
  rateLimitMap.set(clientId, requests);
}

// Content-Type validation
function validateContentType(req) {
  const contentType = req.get('Content-Type');
  if (!contentType || !contentType.includes('application/json')) {
    const error = new ValidationError('Content-Type must be application/json');
    error.status = 415;
    throw error;
  }
}

// Body size validation (middleware should handle this, but adding as backup)
function validateBodySize(req, maxSize = 1024 * 1024) { // 1MB default
  const contentLength = parseInt(req.get('Content-Length') || '0');
  if (contentLength > maxSize) {
    const error = new ValidationError('Request body too large');
    error.status = 413;
    throw error;
  }
}

module.exports = {
  ValidationError,
  validateItem,
  validateItemMiddleware,
  validateUpdateItem,
  validateRateLimit,
  validateContentType,
  validateBodySize,
  sanitizeString
};