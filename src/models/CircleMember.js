const mongoose = require('mongoose');

const circleMemberSchema = new mongoose.Schema({
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportCircle',
    required: true,
    index: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

circleMemberSchema.index({ circleId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('CircleMember', circleMemberSchema);
