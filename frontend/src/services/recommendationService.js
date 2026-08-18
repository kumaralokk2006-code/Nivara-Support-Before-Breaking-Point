import ApiClient from './api';

export const recommendationService = {
  getRecommendations() {
    return ApiClient.get('/recommendations');
  },
  getExplanation(id) {
    return ApiClient.get(`/recommendations/${id}/explanation`);
  },
  markExplored(id) {
    return ApiClient.post(`/recommendations/${id}/explore`);
  }
};
