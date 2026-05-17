const mongoose = require('mongoose');

const planExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'Exercise ID is required.'],
    },
    sets: {
      type: Number,
      required: [true, 'Sets is required.'],
      min: [1, 'Sets must be at least 1.'],
    },
    reps: {
      type: Number,
      required: [true, 'Reps is required.'],
      min: [1, 'Reps must be at least 1.'],
    },
    restSeconds: {
      type: Number,
      required: [true, 'Rest seconds is required.'],
      min: [0, 'Rest seconds cannot be negative.'],
    },
    orderIndex: {
      type: Number,
      required: [true, 'Order index is required.'],
      min: [0, 'Order index cannot be negative.'],
    },
  },
  { _id: false }
);

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
    exercises: {
      type: [planExerciseSchema],
      default: [],
    },
    createdAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = WorkoutPlan;
