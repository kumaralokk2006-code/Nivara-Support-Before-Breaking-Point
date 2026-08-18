const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['CHECKIN_REMINDER', 'APPOINTMENT_UPDATE', 'SUPPORT_RECOMMENDATION', 'CORRECTION_STATUS', 'CIRCLE_UPDATE'],
    default: 'SUPPORT_RECOMMENDATION'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
