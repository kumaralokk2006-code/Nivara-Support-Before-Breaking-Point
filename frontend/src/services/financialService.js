import ApiClient from './api';

export const financialService = {
  getProfile() {
    return ApiClient.get('/financial-support/profile');
  },
  updateProfile(data) {
    return ApiClient.post('/financial-support/profile', data);
  },
  getPrograms() {
    return ApiClient.get('/financial-support/programs');
  },
  getRecommendations() {
    return ApiClient.get('/financial-support/recommendations');
  }
};
