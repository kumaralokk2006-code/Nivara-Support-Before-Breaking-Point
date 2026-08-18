const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    index: true
  },
  year: {
    type: Number,
    required: [true, 'Academic year is required'],
    min: 1,
    max: 6,
    index: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    index: true
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  communicationPreference: {
    type: String,
    enum: ['IN_APP', 'EMAIL', 'NONE'],
    default: 'IN_APP'
  },
  demographicGroup: {
    type: String,
    default: 'General',
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
