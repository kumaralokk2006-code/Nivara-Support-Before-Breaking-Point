import ApiClient from './api';

export const adminService = {
  getDashboard() {
    return ApiClient.get('/admin/dashboard');
  },
  getDemandAnalytics() {
    return ApiClient.get('/admin/analytics/demand');
  },
  getFairnessAudit() {
    return ApiClient.get('/admin/fairness/audit');
  },
  triggerFairnessAudit(attribute = 'department') {
    return ApiClient.post('/admin/fairness/evaluate', { attribute });
  },
  getAuditLogs() {
    return ApiClient.get('/admin/audit-logs');
  }
};
