const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comments'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', ReviewSchema);
