const mongoose = require('mongoose');

const workoutExerciseStatusSchema = new mongoose.Schema(
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
      required: [true, 'Workout plan ID is required.'],
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'Exercise ID is required.'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required.'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    hasDiscomfort: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note must be at most 500 characters.'],
    },
  },
  {
    timestamps: true,
  }
);

workoutExerciseStatusSchema.index({ userId: 1, date: -1 });
workoutExerciseStatusSchema.index({ userId: 1, workoutPlanId: 1, exerciseId: 1, date: 1 });

const WorkoutExerciseStatus = mongoose.model('WorkoutExerciseStatus', workoutExerciseStatusSchema);

module.exports = WorkoutExerciseStatus;
