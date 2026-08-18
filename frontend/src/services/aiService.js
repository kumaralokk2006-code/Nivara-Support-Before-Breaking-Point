import ApiClient from './api';

export const aiService = {
  chat(message, history = []) {
    return ApiClient.post('/ai/chat', { message, history });
  },
  getCampusResources() {
    return ApiClient.get('/ai/config/resources');
  }
};
