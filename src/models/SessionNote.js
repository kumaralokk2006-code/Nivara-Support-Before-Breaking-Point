const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  actionItems: [{
    type: String
  }],
  followUpRecommended: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('SessionNote', sessionNoteSchema);
