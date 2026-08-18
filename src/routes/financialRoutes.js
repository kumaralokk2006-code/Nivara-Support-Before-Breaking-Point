const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getPrograms, getProgramById, getRecommendations } = require('../controllers/financialController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { requireConsent } = require('../middleware/consentCheck');
const { CONSENT_TYPES } = require('../config/constants');

router.use(authenticate);
router.get('/profile', requireRole(['STUDENT']), getProfile);
router.post('/profile', requireRole(['STUDENT']), requireConsent(CONSENT_TYPES.FINANCIAL_MATCHING), updateProfile);
router.get('/programs', getPrograms);
router.get('/programs/:id', getProgramById);
router.get('/recommendations', requireRole(['STUDENT']), getRecommendations);

module.exports = router;
