const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { supabase } = require('../config/db');
const { mapUser } = require('../utils/mapUser');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// ============================================================
// VALIDATION RULES
// ============================================================

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

const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

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

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new ApiError(400, 'This email address is already registered.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: passwordHash,
          is_onboarded: false,
        },
      ])
      .select()
      .single();

    if (error || !newUser) {
      throw new ApiError(500, `Failed to register user: ${error?.message || 'Database error'}`);
    }

    const user = mapUser(newUser);

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome!',
      data: {
        user: {
          id: user.id,
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!userRow) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, userRow.password_hash);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const user = mapUser(userRow);

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
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

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!userRow) {
      return res.status(200).json({
        success: true,
        message: 'If this email address is registered, a password reset code has been sent.',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Save OTP to DB
    await supabase
      .from('users')
      .update({
        password_reset_otp: hashedOTP,
        password_reset_otp_expires: otpExpires,
      })
      .eq('id', userRow.id);

    // Send email
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 8px;">🔐 Fitty Password Reset</h1>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello <strong>${userRow.name}</strong>,
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
        to: userRow.email,
        subject: 'Fitty - Password Reset Code',
        html: htmlContent,
      });
    } catch (emailError) {
      console.error('📧 Email sending error:', emailError.message);
      await supabase
        .from('users')
        .update({
          password_reset_otp: null,
          password_reset_otp_expires: null,
        })
        .eq('id', userRow.id);

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

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_reset_otp', hashedOTP)
      .gt('password_reset_otp_expires', new Date().toISOString())
      .maybeSingle();

    if (!userRow) {
      throw new ApiError(400, 'Invalid or expired OTP code.');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await supabase
      .from('users')
      .update({
        password_reset_token: hashedToken,
        password_reset_token_expires: tokenExpires,
        password_reset_otp: null,
        password_reset_otp_expires: null,
      })
      .eq('id', userRow.id);

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

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_reset_token', hashedToken)
      .gt('password_reset_token_expires', new Date().toISOString())
      .maybeSingle();

    if (!userRow) {
      throw new ApiError(400, 'Invalid or expired reset token.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_token_expires: null,
      })
      .eq('id', userRow.id);

    const token = generateToken(userRow.id);

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

const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!userRow) {
      return res.status(200).json({
        success: true,
        message: 'If this email address is registered, a new code has been sent.',
      });
    }

    if (userRow.password_reset_otp_expires) {
      const otpCreatedAt = new Date(userRow.password_reset_otp_expires).getTime() - 10 * 60 * 1000;
      const secondsSinceLastOTP = (Date.now() - otpCreatedAt) / 1000;
      if (secondsSinceLastOTP < 30) {
        const remainingSeconds = Math.ceil(30 - secondsSinceLastOTP);
        throw new ApiError(429, `Please wait ${remainingSeconds} seconds before requesting a new code.`);
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase
      .from('users')
      .update({
        password_reset_otp: hashedOTP,
        password_reset_otp_expires: otpExpires,
      })
      .eq('id', userRow.id);

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 8px;">🔐 Fitty Password Reset</h1>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello <strong>${userRow.name}</strong>,
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
        to: userRow.email,
        subject: 'Fitty - New Verification Code',
        html: htmlContent,
      });
    } catch (emailError) {
      console.error('📧 Email sending error:', emailError.message);
      await supabase
        .from('users')
        .update({
          password_reset_otp: null,
          password_reset_otp_expires: null,
        })
        .eq('id', userRow.id);

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
