import ApiClient from './api';

export const checkinService = {
  submitCheckIn(data) {
    return ApiClient.post('/checkins', data);
  },
  getTodayStatus() {
    return ApiClient.get('/checkins/today');
  },
  getHistory(limit = 30) {
    return ApiClient.get('/checkins/history', { limit });
  }
};
