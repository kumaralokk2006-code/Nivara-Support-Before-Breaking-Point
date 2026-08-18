import ApiClient from './api';

export const counsellorService = {
  listCounsellors(specialization) {
    return ApiClient.get('/counsellors', specialization ? { specialization } : undefined);
  },
  getCounsellorById(id) {
    return ApiClient.get(`/counsellors/${id}`);
  },
  getDashboard() {
    return ApiClient.get('/counsellor/dashboard');
  },
  saveSessionNote(data) {
    return ApiClient.post('/counsellor/session-notes', data);
  },
  getSessionNote(appointmentId) {
    return ApiClient.get(`/counsellor/session-notes/${appointmentId}`);
  }
};
