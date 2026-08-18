const express = require('express');
const router = express.Router();
const { getTodayDashboard, getProfile, updateProfile, getTransparencyReport, getInsights } = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);
router.get('/today', requireRole(['STUDENT']), getTodayDashboard);
router.get('/profile', getProfile);
router.put('/profile', requireRole(['STUDENT']), updateProfile);
router.get('/transparency', requireRole(['STUDENT']), getTransparencyReport);
router.get('/insights', requireRole(['STUDENT']), getInsights);

module.exports = router;
