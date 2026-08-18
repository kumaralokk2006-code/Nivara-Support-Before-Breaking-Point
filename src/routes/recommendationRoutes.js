const express = require('express');
const router = express.Router();
const { getRecommendations, getRecommendationById, getExplanation, markExplored } = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);
router.get('/', requireRole(['STUDENT']), getRecommendations);
router.get('/:id', requireRole(['STUDENT']), getRecommendationById);
router.get('/:id/explanation', requireRole(['STUDENT']), getExplanation);
router.post('/:id/explore', requireRole(['STUDENT']), markExplored);

module.exports = router;
