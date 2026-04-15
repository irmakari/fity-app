const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token with the given user ID.
 * @param {string} userId - The user's MongoDB _id
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
