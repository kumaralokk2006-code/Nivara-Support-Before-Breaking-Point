const Notification = require('../models/Notification');

const createNotification = async ({ userId, title, message, type = 'SUPPORT_RECOMMENDATION' }) => {
  try {
    return await Notification.create({
      userId,
      title,
      message,
      type
    });
  } catch (error) {
    console.error('Notification Creation Error:', error.message);
  }
};

module.exports = { createNotification };
