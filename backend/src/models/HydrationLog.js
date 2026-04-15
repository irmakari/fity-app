const mongoose = require('mongoose');

const hydrationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      index: true,
    },
    amountMl: {
      type: Number,
      required: [true, 'Water amount is required.'],
      min: [1, 'Water amount must be at least 1 ml.'],
      max: [5000, 'Water amount must be at most 5000 ml.'],
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note must be at most 200 characters.'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient daily queries
hydrationLogSchema.index({ userId: 1, loggedAt: -1 });

const HydrationLog = mongoose.model('HydrationLog', hydrationLogSchema);

module.exports = HydrationLog;
