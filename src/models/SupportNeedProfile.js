const mongoose = require('mongoose');
const { SUPPORT_LEVELS } = require('../config/constants');

const supportNeedProfileSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  academicNeed: {
    type: String,
    enum: Object.values(SUPPORT_LEVELS),
    default: SUPPORT_LEVELS.LOW
  },
  academicScore: {
    type: Number,
    default: 0
  },
  financialNeed: {
    type: String,
    enum: Object.values(SUPPORT_LEVELS),
    default: SUPPORT_LEVELS.LOW
  },
  wellbeingNeed: {
    type: String,
    enum: Object.values(SUPPORT_LEVELS),
    default: SUPPORT_LEVELS.LOW
  },
  activeSignalsSummary: [{
    category: String,
    indicator: String,
    level: String,
    points: Number
  }],
  evaluatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportNeedProfile', supportNeedProfileSchema);
