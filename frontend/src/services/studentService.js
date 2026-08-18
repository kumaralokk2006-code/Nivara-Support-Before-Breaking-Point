import ApiClient from './api';

export const studentService = {
  getToday() {
    return ApiClient.get('/student/today');
  },
  getProfile() {
    return ApiClient.get('/student/profile');
  },
  updateProfile(data) {
    return ApiClient.put('/student/profile', data);
  },
  getTransparencyReport() {
    return ApiClient.get('/student/transparency');
  },
  getInsights() {
    return ApiClient.get('/student/insights');
  }
};
