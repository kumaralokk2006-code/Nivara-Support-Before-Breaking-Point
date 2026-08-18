const express = require('express');
const router = express.Router();
const { submitCheckIn, getTodayStatus, getHistory } = require('../controllers/checkinController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { requireConsent } = require('../middleware/consentCheck');
const { CONSENT_TYPES } = require('../config/constants');

router.use(authenticate);
router.post('/', requireRole(['STUDENT']), requireConsent(CONSENT_TYPES.WELLBEING_CHECKIN), submitCheckIn);
router.get('/today', requireRole(['STUDENT']), getTodayStatus);
router.get('/history', requireRole(['STUDENT']), getHistory);

module.exports = router;
