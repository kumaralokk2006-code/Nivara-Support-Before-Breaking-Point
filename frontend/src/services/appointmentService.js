import ApiClient from './api';

export const appointmentService = {
  bookAppointment(data) {
    return ApiClient.post('/appointments', data);
  },
  listAppointments() {
    return ApiClient.get('/appointments');
  },
  updateStatus(id, status, followUpDate) {
    return ApiClient.put(`/appointments/${id}/status`, { status, followUpDate });
  }
};
