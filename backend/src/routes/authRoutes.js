const express = require('express');
const {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOTPValidation,
  resetPasswordValidation,
  resendOTPValidation,
} = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authLimiter, registerValidation, validate, register);

// POST /api/auth/login
router.post('/login', authLimiter, loginValidation, validate, login);

// POST /api/auth/forgot-password
router.post('/forgot-password', otpLimiter, forgotPasswordValidation, validate, forgotPassword);

// POST /api/auth/verify-otp
router.post('/verify-otp', otpLimiter, verifyOTPValidation, validate, verifyOTP);

// POST /api/auth/resend-otp
router.post('/resend-otp', otpLimiter, resendOTPValidation, validate, resendOTP);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, resetPasswordValidation, validate, resetPassword);

module.exports = router;
