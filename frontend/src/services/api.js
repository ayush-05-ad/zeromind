import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(c => {
  const t = localStorage.getItem('access_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export const authAPI = {
  register: d => api.post('/api/auth/register', d),
  login: d => api.post('/api/auth/login', d),
  getProfile: () => api.get('/api/auth/me'),
};

export const taskAPI = {
  create: d => api.post('/api/tasks', d),
  list: (p = 1) => api.get(`/api/tasks?page=${p}&per_page=20`),
  get: id => api.get(`/api/tasks/${id}`),
  delete: id => api.delete(`/api/tasks/${id}`),
};

export default api;
