const ApiError = require('../utils/ApiError');

/**
 * Global error handling middleware.
 * Catches all errors and returns consistent JSON responses.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    error = new ApiError(400, 'Invalid record ID.');
  }

  // Mongoose duplicate key (email etc.)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const fieldNames = { email: 'Email address' };
    const fieldName = fieldNames[field] || field;
    error = new ApiError(400, `${fieldName} is already in use.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join('. '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired.');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error.';

  // Log stack trace server-side only (never expose to client)
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${statusCode}] ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
