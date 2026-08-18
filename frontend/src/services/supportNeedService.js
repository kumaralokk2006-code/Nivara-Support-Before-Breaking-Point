import ApiClient from './api';

export const supportNeedService = {
  getStudentSupportNeed() {
    return ApiClient.get('/support-needs');
  },
  reevaluateSupportNeed() {
    return ApiClient.post('/support-needs/evaluate');
  }
};
