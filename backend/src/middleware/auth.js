const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * JWT authentication middleware.
 * Extracts Bearer token from Authorization header and verifies it.
 * Attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'You must be logged in to perform this action.');
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Find user (exclude password)
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    // 4) Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired. Please log in again.'));
    }
    next(error);
  }
};

module.exports = { protect };
