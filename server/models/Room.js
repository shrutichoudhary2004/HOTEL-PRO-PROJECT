const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please specify the room number'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a room title/name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please select room type'],
      enum: ['Standard', 'Deluxe', 'Executive Suite', 'Presidential Suite', 'Family Villa'],
      default: 'Deluxe',
    },
    floor: {
      type: Number,
      default: 1,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: [0, 'Price must be positive'],
    },
    capacity: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    bedType: {
      type: String,
      default: 'King Bed',
    },
    sizeSqFt: {
      type: Number,
      default: 350,
    },
    description: {
      type: String,
      required: [true, 'Please add a room description'],
    },
    amenities: {
      type: [String],
      default: ['High-Speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Luxury Toiletries'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'cleaning', 'maintenance'],
      default: 'available',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 12,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', RoomSchema);
