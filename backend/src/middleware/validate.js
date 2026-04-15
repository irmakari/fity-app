const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Checks express-validator validation results.
 * If there are errors, throws a 400 ApiError with the first error message.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    throw new ApiError(400, firstError);
  }
  next();
};

module.exports = validate;
