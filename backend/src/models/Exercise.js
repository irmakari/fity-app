const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required.'],
      trim: true,
      maxlength: [100, 'Exercise name must be at most 100 characters.'],
    },
    muscleGroup: {
      type: String,
      required: [true, 'Muscle group is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be at most 1000 characters.'],
    },
    videoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

exerciseSchema.index({ muscleGroup: 1 });
exerciseSchema.index({ name: 'text' });

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
