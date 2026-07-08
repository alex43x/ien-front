import api from './api';
import { 
  ValidateCodeRequest, 
  ValidateCodeResponse, 
  AuthResponse 
} from '../types/api.types';

export const authService = {
  validateCode: async (data: ValidateCodeRequest) => {
    const response = await api.post<ValidateCodeResponse>('/auth/validate-code', data);
    return response.data;
  },

  register: async (data: any) => {
    // El payload incluye nombre, email, password, codigo_activacion
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  },

  login: async (data: any) => {
    // El payload incluye email y password
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
};
