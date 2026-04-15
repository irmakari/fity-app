const crypto = require('crypto');
const { body } = require('express-validator');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// ============================================================
// VALIDATION RULES
// ============================================================

/**
 * Register validation rules.
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one digit.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character.'),
];

/**
 * Login validation rules.
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

/**
 * Forgot password validation rules.
 */
const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

/**
 * OTP verification validation rules.
 */
const verifyOTPValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP code is required.')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP code must be 6 digits.')
    .isNumeric()
    .withMessage('OTP code must contain only digits.'),
];

/**
 * Reset password validation rules.
 */
const resetPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('resetToken')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required.'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one digit.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

/**
 * Resend OTP validation rules.
 */
const resendOTPValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'This email address is already registered.');
    }

    // Create user (passwordHash will be hashed via pre-save hook)
    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    User login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user (include passwordHash)
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      // Security: non-specific error message (email enumeration protection)
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send password reset OTP via email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Security: email enumeration protection — always return the same message
      return res.status(200).json({
        success: true,
        message: 'If this email address is registered, a password reset code has been sent.',
      });
    }

    // Generate and save OTP
    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // Send email
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 8px;">🔐 Fitty Password Reset</h1>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello <strong>${user.name}</strong>,
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          We received a password reset request. Use the code below to reset your password:
        </p>
        <div style="background: #1e293b; color: #fff; text-align: center; padding: 20px; border-radius: 8px; margin: 24px 0; letter-spacing: 8px; font-size: 32px; font-weight: bold;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
          ⏱ This code is valid for <strong>10 minutes</strong>.<br>
          If you did not request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Fitty. All rights reserved.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Fitty - Password Reset Code',
        html: htmlContent,
      });
    } catch (emailError) {
      console.error('📧 Email sending error:', emailError.message);
      // If email sending fails, clear OTP
      user.passwordResetOTP = undefined;
      user.passwordResetOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new ApiError(500, 'Failed to send email. Please try again later.');
    }

    res.status(200).json({
      success: true,
      message: 'If this email address is registered, a password reset code has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP code
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Hash OTP and compare
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const user = await User.findOne({
      email,
      passwordResetOTP: hashedOTP,
      passwordResetOTPExpires: { $gt: Date.now() },
    }).select('+passwordResetOTP +passwordResetOTPExpires');

    if (!user) {
      throw new ApiError(400, 'Invalid or expired OTP code.');
    }

    // Generate temporary reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'OTP verified. You can now set your new password.',
      data: {
        resetToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    // Hash reset token and compare
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetTokenExpires');

    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token.');
    }

    // Set new password (will be hashed via pre-save hook)
    user.passwordHash = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    // Generate new token (auto-login)
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Your password has been updated successfully.',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend OTP code (with 30-second cooldown)
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select(
      '+passwordResetOTP +passwordResetOTPExpires'
    );

    if (!user) {
      // Security: email enumeration protection
      return res.status(200).json({
        success: true,
        message: 'If this email address is registered, a new code has been sent.',
      });
    }

    // Cooldown check: prevent resend within 30 seconds
    if (user.passwordResetOTPExpires) {
      const otpCreatedAt = new Date(user.passwordResetOTPExpires).getTime() - 10 * 60 * 1000;
      const secondsSinceLastOTP = (Date.now() - otpCreatedAt) / 1000;
      if (secondsSinceLastOTP < 30) {
        const remainingSeconds = Math.ceil(30 - secondsSinceLastOTP);
        throw new ApiError(429, `Please wait ${remainingSeconds} seconds before requesting a new code.`);
      }
    }

    // Generate new OTP
    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // Send email
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 8px;">🔐 Fitty Password Reset</h1>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello <strong>${user.name}</strong>,
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Here is your new verification code:
        </p>
        <div style="background: #1e293b; color: #fff; text-align: center; padding: 20px; border-radius: 8px; margin: 24px 0; letter-spacing: 8px; font-size: 32px; font-weight: bold;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
          ⏱ This code is valid for <strong>10 minutes</strong>.<br>
          If you did not request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Fitty. All rights reserved.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Fitty - New Verification Code',
        html: htmlContent,
      });
    } catch (emailError) {
      console.error('📧 Email sending error:', emailError.message);
      user.passwordResetOTP = undefined;
      user.passwordResetOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new ApiError(500, 'Failed to send email. Please try again later.');
    }

    res.status(200).json({
      success: true,
      message: 'If this email address is registered, a new code has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
