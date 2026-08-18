const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  startTime: {
    type: String, // "09:00"
    required: true
  },
  endTime: {
    type: String, // "17:00"
    required: true
  }
}, { _id: false });

const counsellorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    default: 'Campus Counsellor',
    trim: true
  },
  specializations: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true
  },
  availability: [availabilitySlotSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CounsellorProfile', counsellorProfileSchema);
