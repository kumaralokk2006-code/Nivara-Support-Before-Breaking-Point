const mongoose = require('mongoose');
const { MODERATION_STATUS } = require('../config/constants');

const circlePostSchema = new mongoose.Schema({
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportCircle',
    required: true,
    index: true
  },
  authorStudentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anonymousAlias: {
    type: String,
    default: 'Peer Member'
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  moderationStatus: {
    type: String,
    enum: Object.values(MODERATION_STATUS),
    default: MODERATION_STATUS.APPROVED,
    index: true
  },
  moderationFlags: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('CirclePost', circlePostSchema);
