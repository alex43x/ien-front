import api from './api';
import { AdminMetrics } from '../types/api.types';

export const adminService = {
  getMetrics: async () => {
    const response = await api.get<AdminMetrics[]>('/admin/dashboard/metrics');
    return response.data;
  }
};
