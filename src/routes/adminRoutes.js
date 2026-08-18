const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getDemandAnalytics,
  getFairnessAudit,
  triggerFairnessAudit,
  createSupportProgram,
  updateSupportProgram,
  getAuditLogs
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate, requireRole(['ADMIN']));
router.get('/dashboard', getDashboardMetrics);
router.get('/analytics/demand', getDemandAnalytics);
router.get('/fairness/audit', getFairnessAudit);
router.post('/fairness/evaluate', triggerFairnessAudit);
router.post('/support-programs', createSupportProgram);
router.put('/support-programs/:id', updateSupportProgram);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
