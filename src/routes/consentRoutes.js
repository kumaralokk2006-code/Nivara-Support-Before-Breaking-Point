const express = require('express');
const router = express.Router();
const { getConsents, updateConsent, revokeConsent } = require('../controllers/consentController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getConsents);
router.post('/', updateConsent);
router.put('/:consentType/revoke', revokeConsent);

module.exports = router;
