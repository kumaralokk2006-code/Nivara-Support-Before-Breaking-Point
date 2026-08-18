const express = require('express');
const router = express.Router();
const { getSignals, updateSignals, getPrograms, getRecommendations } = require('../controllers/academicController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { requireConsent } = require('../middleware/consentCheck');
const { CONSENT_TYPES } = require('../config/constants');

router.use(authenticate);
router.get('/signals', requireRole(['STUDENT']), getSignals);
router.post('/signals', requireRole(['STUDENT']), requireConsent(CONSENT_TYPES.ACADEMIC_INTEGRATION), updateSignals);
router.get('/programs', getPrograms);
router.get('/recommendations', requireRole(['STUDENT']), getRecommendations);

module.exports = router;
