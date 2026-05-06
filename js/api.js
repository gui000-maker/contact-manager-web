import config from './config.js';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const url = `${config.BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (response.status === 401) {
    if (!endpoint.startsWith('/api/auth/')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await fetch(
          `${config.BASE_URL}/api/auth/refresh`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('token', refreshData.token);
          return request(endpoint, options);
        }
      }

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/pages/login.html';
      return;
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.message || 'An error occurred');
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

export { request };
