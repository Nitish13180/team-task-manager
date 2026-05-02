const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

export const get = (endpoint) => api(endpoint);
export const post = (endpoint, body) => api(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const put = (endpoint, body) => api(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const del = (endpoint) => api(endpoint, { method: 'DELETE' });
