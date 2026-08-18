const express = require('express');
const router = express.Router();
const { getStudentSupportNeed, reevaluateSupportNeed } = require('../controllers/supportNeedController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);
router.get('/', requireRole(['STUDENT']), getStudentSupportNeed);
router.post('/evaluate', requireRole(['STUDENT']), reevaluateSupportNeed);

module.exports = router;
