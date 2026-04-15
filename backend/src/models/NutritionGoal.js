const mongoose = require('mongoose');

const nutritionGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      unique: true,
    },
    calorieGoal: {
      type: Number,
      required: [true, 'Calorie goal is required.'],
      min: [500, 'Calorie goal must be at least 500.'],
      max: [10000, 'Calorie goal must be at most 10000.'],
    },
    proteinGoalG: {
      type: Number,
      min: [0, 'Protein goal cannot be negative.'],
      default: 0,
    },
    carbsGoalG: {
      type: Number,
      min: [0, 'Carbs goal cannot be negative.'],
      default: 0,
    },
    fatGoalG: {
      type: Number,
      min: [0, 'Fat goal cannot be negative.'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const NutritionGoal = mongoose.model('NutritionGoal', nutritionGoalSchema);

module.exports = NutritionGoal;
