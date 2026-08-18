const express = require('express');
const router = express.Router();
const { listCircles, createCircle, getCircleById, joinCircle, leaveCircle, createPost } = require('../controllers/supportCircleController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);
router.get('/', listCircles);
router.post('/', requireRole(['STUDENT', 'ADMIN']), createCircle);
router.get('/:id', getCircleById);
router.post('/:id/join', requireRole(['STUDENT']), joinCircle);
router.post('/:id/leave', requireRole(['STUDENT']), leaveCircle);
router.post('/:id/posts', requireRole(['STUDENT']), createPost);

module.exports = router;
