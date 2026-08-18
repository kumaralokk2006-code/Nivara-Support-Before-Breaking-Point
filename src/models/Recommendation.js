const mongoose = require('mongoose');
const { SUPPORT_CATEGORIES } = require('../config/constants');

const recommendationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportProgram',
    required: true
  },
  category: {
    type: String,
    enum: Object.values(SUPPORT_CATEGORIES),
    required: true
  },
  title: {
    type: String,
    required: true
  },
  reasonCodes: [{
    type: String
  }],
  explanationText: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'EXPLORED', 'DISMISSED'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
