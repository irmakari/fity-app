const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Activity type is required.'],
      enum: {
        values: ['walking', 'running', 'cycling', 'swimming', 'other'],
        message: 'Invalid activity type.',
      },
    },
    steps: {
      type: Number,
      min: [0, 'Steps cannot be negative.'],
      default: 0,
    },
    distanceKm: {
      type: Number,
      min: [0, 'Distance cannot be negative.'],
      default: 0,
    },
    durationMin: {
      type: Number,
      min: [0, 'Duration cannot be negative.'],
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned cannot be negative.'],
      default: 0,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ userId: 1, loggedAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
