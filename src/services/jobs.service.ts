import api from './api';
import { 
  ResetStreaksResponse, 
  SendRemindersRequest, 
  SendRemindersResponse 
} from '../types/api.types';

export const jobsService = {
  resetStreaks: async (apiKey: string) => {
    // Aquí el API Key se envía generalmente por headers (ej: x-api-key)
    // Asumiendo que el middleware lo busca ahí, o según tu implementación.
    // Lo configuro en el header de la petición específica.
    const response = await api.post<ResetStreaksResponse>('/jobs/reset-streaks', {}, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  },

  sendReminders: async (apiKey: string, data: SendRemindersRequest) => {
    const response = await api.post<SendRemindersResponse>('/jobs/send-reminders', data, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  }
};
