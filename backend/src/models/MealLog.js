const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required.'],
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required.'],
      enum: {
        values: ['breakfast', 'lunch', 'dinner', 'snack'],
        message: 'Invalid meal type.',
      },
    },
  },
  {
    timestamps: true,
  }
);

mealLogSchema.index({ userId: 1, date: -1 });
mealLogSchema.index({ userId: 1, date: 1, mealType: 1 });

const MealLog = mongoose.model('MealLog', mealLogSchema);

module.exports = MealLog;
