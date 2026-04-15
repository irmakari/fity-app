const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      index: true,
    },
    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      required: [true, 'Workout plan is required.'],
    },
    status: {
      type: String,
      enum: {
        values: ['in_progress', 'completed', 'cancelled'],
        message: 'Invalid session status.',
      },
      default: 'in_progress',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    finishedAt: {
      type: Date,
    },
    totalDurationSec: {
      type: Number,
      min: [0, 'Duration cannot be negative.'],
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned cannot be negative.'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

workoutSessionSchema.index({ userId: 1, startedAt: -1 });

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;
