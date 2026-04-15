const mongoose = require('mongoose');

const workoutSessionSetSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutSession',
      required: [true, 'Session ID is required.'],
      index: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'Exercise ID is required.'],
    },
    setNumber: {
      type: Number,
      required: [true, 'Set number is required.'],
      min: [1, 'Set number must be at least 1.'],
    },
    repsCompleted: {
      type: Number,
      min: [0, 'Reps completed cannot be negative.'],
      default: 0,
    },
    restSkipped: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

workoutSessionSetSchema.index({ sessionId: 1, exerciseId: 1 });

const WorkoutSessionSet = mongoose.model('WorkoutSessionSet', workoutSessionSetSchema);

module.exports = WorkoutSessionSet;
