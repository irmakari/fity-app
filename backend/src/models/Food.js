const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required.'],
      trim: true,
      maxlength: [150, 'Food name must be at most 150 characters.'],
    },
    caloriesPerServing: {
      type: Number,
      required: [true, 'Calories per serving is required.'],
      min: [0, 'Calories cannot be negative.'],
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
    servingUnit: {
      type: String,
      trim: true,
      default: 'serving',
    },
    servingSize: {
      type: Number,
      min: [0, 'Serving size cannot be negative.'],
      default: 1,
    },
    source: {
      type: String,
      enum: ['manual', 'open_food_facts', 'ai'],
      default: 'manual',
    },
  },
  {
    timestamps: true,
  }
);

foodSchema.index({ name: 'text' });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
