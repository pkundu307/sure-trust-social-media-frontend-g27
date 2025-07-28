import axios from 'axios';
console.log(import.meta.env.VITE_BASE_URL,'lllll');

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
