const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [50, 'Name must be at most 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
    },

    // Physical info
    age: {
      type: Number,
      min: [13, 'Age must be at least 13.'],
      max: [120, 'Please provide a valid age.'],
    },
    heightCm: {
      type: Number,
      min: [50, 'Height must be at least 50 cm.'],
      max: [300, 'Please provide a valid height.'],
    },
    currentWeightKg: {
      type: Number,
      min: [20, 'Weight must be at least 20 kg.'],
      max: [500, 'Please provide a valid weight.'],
    },
    targetWeightKg: {
      type: Number,
      min: [20, 'Target weight must be at least 20 kg.'],
      max: [500, 'Please provide a valid target weight.'],
    },

    // Fitness info
    goalType: {
      type: String,
      enum: {
        values: ['lose_weight', 'gain_weight', 'build_muscle', 'maintain', 'general_health'],
        message: 'Invalid goal type.',
      },
    },
    fitnessLevel: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Invalid fitness level.',
      },
    },
    weeklyWorkoutTarget: {
      type: Number,
      min: [1, 'Weekly workout target must be at least 1.'],
      max: [7, 'Weekly workout target must be at most 7.'],
    },
    activityLevel: {
      type: String,
      enum: {
        values: ['sedentary', 'lightly_active', 'moderately_active', 'active', 'very_active'],
        message: 'Invalid activity level.',
      },
    },
    trainingLocation: {
      type: String,
      enum: {
        values: ['home', 'gym', 'outdoor', 'mixed'],
        message: 'Invalid training location.',
      },
    },
    focusMuscles: {
      type: [String],
      default: [],
    },

    // Notification preferences
    notificationWorkoutReminders: {
      type: Boolean,
      default: true,
    },
    notificationWaterReminders: {
      type: Boolean,
      default: true,
    },
    notificationWeeklyReports: {
      type: Boolean,
      default: true,
    },

    // Onboarding status
    isOnboarded: {
      type: Boolean,
      default: false,
    },

    // Password reset OTP
    passwordResetOTP: {
      type: String,
      select: false,
    },
    passwordResetOTPExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook: Hash password with bcrypt when modified.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

/**
 * Compare a candidate password with the hashed password.
 * @param {string} candidatePassword - Password to check
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Generate OTP, hash it, and save to database.
 * @returns {string} Plain text OTP (to be sent via email)
 */
userSchema.methods.createPasswordResetOTP = function () {
  // Generate 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP for secure storage
  this.passwordResetOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // 10 minutes validity
  this.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;

  return otp;
};

/**
 * Generate a temporary reset token after OTP verification.
 * @returns {string} Plain text reset token
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 15 minutes validity
  this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;

  // Clear OTP fields
  this.passwordResetOTP = undefined;
  this.passwordResetOTPExpires = undefined;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
