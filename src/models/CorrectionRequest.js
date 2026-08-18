const mongoose = require('mongoose');
const { CORRECTION_STATUS } = require('../config/constants');

const correctionRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fieldCategory: {
    type: String,
    enum: ['PERSONAL', 'ACADEMIC', 'ENROLLMENT'],
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  currentValue: {
    type: String,
    default: ''
  },
  requestedValue: {
    type: String,
    required: true
  },
  justification: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: Object.values(CORRECTION_STATUS),
    default: CORRECTION_STATUS.PENDING,
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('CorrectionRequest', correctionRequestSchema);
