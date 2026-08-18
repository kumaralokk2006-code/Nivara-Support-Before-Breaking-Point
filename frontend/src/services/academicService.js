import ApiClient from './api';

export const academicService = {
  getSignals() {
    return ApiClient.get('/academic-support/signals');
  },
  updateSignals(data) {
    return ApiClient.post('/academic-support/signals', data);
  },
  getPrograms() {
    return ApiClient.get('/academic-support/programs');
  },
  getRecommendations() {
    return ApiClient.get('/academic-support/recommendations');
  }
};
