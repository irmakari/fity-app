const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required.'],
      trim: true,
      maxlength: [100, 'Plan name must be at most 100 characters.'],
    },
    dayLabel: {
      type: String,
      required: [true, 'Day label is required.'],
      trim: true,
    },
    targetMuscles: {
      type: [String],
      default: [],
    },
    estimatedDurationMin: {
      type: Number,
      min: [1, 'Estimated duration must be at least 1 minute.'],
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = WorkoutPlan;
