import ApiClient from './api';

export const correctionService = {
  submitRequest(data) {
    return ApiClient.post('/profile/correction-request', data);
  },
  getStudentRequests() {
    return ApiClient.get('/profile/correction-requests');
  },
  getAllAdminRequests() {
    return ApiClient.get('/profile/admin/correction-requests');
  },
  reviewRequest(id, status, reviewNotes) {
    return ApiClient.put(`/profile/admin/correction-requests/${id}`, { status, reviewNotes });
  }
};
