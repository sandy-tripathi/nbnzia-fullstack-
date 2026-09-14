/**
 * Standardized application error. Thrown from controllers/services and
 * caught by the central error handler middleware.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // optional array/object of field-level validation errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
