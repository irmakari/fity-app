const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema(
  {
    mealLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealLog',
      required: [true, 'Meal log ID is required.'],
      index: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food ID is required.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [0.1, 'Quantity must be at least 0.1.'],
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative.'],
      default: 0,
    },
    proteinG: {
      type: Number,
      min: [0, 'Protein cannot be negative.'],
      default: 0,
    },
    carbsG: {
      type: Number,
      min: [0, 'Carbs cannot be negative.'],
      default: 0,
    },
    fatG: {
      type: Number,
      min: [0, 'Fat cannot be negative.'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MealItem = mongoose.model('MealItem', mealItemSchema);

module.exports = MealItem;
