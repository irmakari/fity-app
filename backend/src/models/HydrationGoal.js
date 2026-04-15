const mongoose = require('mongoose');

const hydrationGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      unique: true,
    },
    dailyGoalMl: {
      type: Number,
      required: [true, 'Daily water goal is required.'],
      min: [500, 'Daily water goal must be at least 500 ml.'],
      max: [10000, 'Daily water goal must be at most 10000 ml.'],
      default: 2500,
    },
  },
  {
    timestamps: true,
  }
);

const HydrationGoal = mongoose.model('HydrationGoal', hydrationGoalSchema);

module.exports = HydrationGoal;
