const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  static getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nivara_token');
    }
    return null;
  }

  static async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle unauthorized token expiry
        if (response.status === 401 && typeof window !== 'undefined') {
          if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
            localStorage.removeItem('nivara_token');
            localStorage.removeItem('nivara_user');
          }
        }

        const error = new Error(data.message || 'API request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const netErr = new Error('Cannot connect to Nivara backend server. Please ensure the backend is running on ' + API_BASE_URL);
        netErr.status = 503;
        throw netErr;
      }
      throw err;
    }
  }

  static get(endpoint, params) {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams(params).toString();
      url = `${url}?${query}`;
    }
    return this.request(url, { method: 'GET' });
  }

  static post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  static put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  static delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default ApiClient;
