import api from './api';
import { 
  SetupTestRequest, 
  SetupTestResponse, 
  TodayPlanResponse,
  PlanProfileResponse,
  CompleteDayResponse 
} from '../types/api.types';

export const planService = {
  setupTest: async (data: SetupTestRequest) => {
    const response = await api.post<SetupTestResponse>('/plan/setup-test', data);
    return response.data;
  },

  getTodayPlan: async () => {
    const response = await api.get<TodayPlanResponse>('/plan/today');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<PlanProfileResponse>('/plan/profile');
    return response.data;
  },

  getTestPreguntas: async () => {
    const response = await api.get<any[]>('/plan/test-preguntas');
    return response.data;
  },

  completeDay: async (respuesta_usuario?: string) => {
    const response = await api.post<CompleteDayResponse>('/plan/complete-day', { respuesta_usuario });
    return response.data;
  },

  advanceDay: async () => {
    const response = await api.post<CompleteDayResponse>('/plan/testing/advance');
    return response.data;
  }
};
