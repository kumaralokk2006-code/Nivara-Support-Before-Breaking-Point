const { generateSupportiveResponse } = require('../services/aiService');
const { DEFAULT_CONFIG } = require('../config/constants');

const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const response = await generateSupportiveResponse(message, history);
    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    next(error);
  }
};

const getCampusResources = async (req, res) => {
  res.json({
    success: true,
    campusSupport: DEFAULT_CONFIG
  });
};

const getConversations = async (req, res) => {
  res.json({
    success: true,
    conversations: [
      { id: 'conv_sample', title: 'Supportive Conversation', lastActive: new Date() }
    ]
  });
};

module.exports = { chat, getCampusResources, getConversations };
