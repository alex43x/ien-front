import api from './api';
import { 
  ValidateCodeRequest, 
  ValidateCodeResponse, 
  AuthResponse,
  Usuario,
} from '../types/api.types';

export const authService = {
  validateCode: async (data: ValidateCodeRequest) => {
    const response = await api.post<ValidateCodeResponse>('/auth/validate-code', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<Usuario>('/auth/profile');
    return response.data;
  },

  register: async (data: any) => {
    // El payload incluye nombre, email, password, codigo_activacion
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      if (response.data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }
    }
    return response.data;
  },

  login: async (data: any) => {
    // El payload incluye email y password
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      if (response.data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }
    }
    return response.data;
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
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
      localStorage.removeItem('usuario');
    }
  },

  forgotPassword: async (email: string) => {
    const response = await api.post<{ mensaje: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetToken: async (token: string) => {
    const response = await api.get<{ valido: boolean; email?: string }>('/auth/verify-reset-token', { params: { token } });
    return response.data;
  },

  resetPassword: async (token: string, nueva_password: string) => {
    const response = await api.post<{ mensaje: string }>('/auth/reset-password', { token, nueva_password });
    return response.data;
  },

  changePassword: async (current_password: string, nueva_password: string) => {
    const response = await api.post<{ mensaje: string }>('/auth/change-password', { current_password, nueva_password });
    return response.data;
  },
};
