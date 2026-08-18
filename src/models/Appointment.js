const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../config/constants');

const appointmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  modality: {
    type: String,
    enum: ['ONLINE', 'IN_PERSON'],
    default: 'ONLINE'
  },
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.REQUESTED,
    index: true
  },
  reasonCategory: {
    type: String,
    enum: ['ACADEMIC', 'WELLBEING', 'CAREER', 'OTHER'],
    default: 'WELLBEING'
  },
  studentNotes: {
    type: String,
    trim: true,
    maxlength: 300
  },
  followUpDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
