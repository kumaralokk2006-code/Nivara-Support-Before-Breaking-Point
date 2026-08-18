const express = require('express');
const router = express.Router();
const { chat, getCampusResources, getConversations } = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);
router.post('/chat', aiLimiter, chat);
router.get('/config/resources', getCampusResources);
router.get('/conversations', getConversations);

module.exports = router;
