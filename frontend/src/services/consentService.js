import ApiClient from './api';

export const consentService = {
  getConsents() {
    return ApiClient.get('/consent');
  },
  updateConsent(consentType, granted, allowedFields = [], category = 'GENERAL') {
    return ApiClient.post('/consent', { consentType, granted, allowedFields, category });
  },
  revokeConsent(consentType) {
    return ApiClient.put(`/consent/${consentType}/revoke`);
  }
};
