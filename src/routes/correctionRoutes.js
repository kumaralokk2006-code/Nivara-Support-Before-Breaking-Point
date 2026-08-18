const express = require('express');
const router = express.Router();
const { submitRequest, getStudentRequests, getAllAdminRequests, reviewRequest } = require('../controllers/correctionController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);
router.post('/correction-request', requireRole(['STUDENT']), submitRequest);
router.get('/correction-requests', requireRole(['STUDENT']), getStudentRequests);
router.get('/admin/correction-requests', requireRole(['ADMIN']), getAllAdminRequests);
router.put('/admin/correction-requests/:id', requireRole(['ADMIN']), reviewRequest);

module.exports = router;
