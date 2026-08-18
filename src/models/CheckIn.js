const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dateString: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  stress: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  sleep: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  energy: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  academicPressure: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 300
  }
}, { timestamps: true });

checkInSchema.index({ studentId: 1, dateString: 1 }, { unique: true });

module.exports = mongoose.model('CheckIn', checkInSchema);
