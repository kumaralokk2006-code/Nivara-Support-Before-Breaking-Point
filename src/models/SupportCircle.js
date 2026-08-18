const mongoose = require('mongoose');

const supportCircleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['FIRST_YEAR', 'EXAM_STRESS', 'PLACEMENT_ANXIETY', 'HOSTEL_LIFE', 'BURNOUT', 'GENERAL'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxMembers: {
    type: Number,
    default: 30
  },
  activeFrom: {
    type: Date,
    default: Date.now
  },
  activeUntil: {
    type: Date,
    required: true
  },
  isModerated: {
    type: Boolean,
    default: true
  },
  memberCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportCircle', supportCircleSchema);
