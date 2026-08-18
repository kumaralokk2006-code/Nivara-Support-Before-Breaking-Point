const mongoose = require('mongoose');
const { CONSENT_TYPES } = require('../config/constants');

const consentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  consentType: {
    type: String,
    enum: Object.values(CONSENT_TYPES),
    required: true
  },
  granted: {
    type: Boolean,
    required: true,
    default: false
  },
  allowedFields: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['ACADEMIC_DATA', 'FINANCIAL_MATCHING', 'WELLBEING_CHECKIN', 'AI_SUPPORT', 'GENERAL'],
    default: 'GENERAL'
  },
  grantedAt: {
    type: Date
  },
  revokedAt: {
    type: Date
  },
  version: {
    type: String,
    default: '2.0'
  },
  ipAddress: {
    type: String
  }
}, { timestamps: true });

consentSchema.index({ userId: 1, consentType: 1 }, { unique: true });

module.exports = mongoose.model('Consent', consentSchema);
