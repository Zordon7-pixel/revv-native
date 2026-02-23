import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'https://revv-production-ffa9.up.railway.app/api',
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
