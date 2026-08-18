const express = require('express');
const router = express.Router();
const { listCounsellors, getCounsellorById, getDashboard, saveSessionNote, getSessionNote } = require('../controllers/counsellorController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);
router.get('/', listCounsellors);
router.get('/dashboard', requireRole(['COUNSELLOR']), getDashboard);
router.post('/session-notes', requireRole(['COUNSELLOR']), saveSessionNote);
router.get('/session-notes/:appointmentId', requireRole(['COUNSELLOR']), getSessionNote);
router.get('/:id', getCounsellorById);

module.exports = router;
