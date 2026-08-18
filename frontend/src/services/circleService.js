import ApiClient from './api';

export const circleService = {
  listCircles() {
    return ApiClient.get('/support-circles');
  },
  getCircle(id) {
    return ApiClient.get(`/support-circles/${id}`);
  },
  joinCircle(id) {
    return ApiClient.post(`/support-circles/${id}/join`);
  },
  createPost(id, content) {
    return ApiClient.post(`/support-circles/${id}/posts`, { content });
  }
};
