import ApiClient from './api';

export const authService = {
  async register(data) {
    const res = await ApiClient.post('/auth/register', data);
    if (res.token && typeof window !== 'undefined') {
      localStorage.setItem('nivara_token', res.token);
      localStorage.setItem('nivara_user', JSON.stringify(res.user));
    }
    return res;
  },

  async login(email, password) {
    const res = await ApiClient.post('/auth/login', { email, password });
    if (res.token && typeof window !== 'undefined') {
      localStorage.setItem('nivara_token', res.token);
      localStorage.setItem('nivara_user', JSON.stringify(res.user));
    }
    return res;
  },

  async getMe() {
    return ApiClient.get('/auth/me');
  },

  async logout() {
    try {
      await ApiClient.post('/auth/logout');
    } catch (e) {
      // Ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nivara_token');
        localStorage.removeItem('nivara_user');
      }
    }
  }
};
