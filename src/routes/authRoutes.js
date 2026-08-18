const express = require('express');
const router = express.Router();
const { register, login, me, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);

module.exports = router;
