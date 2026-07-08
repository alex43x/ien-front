import api from './api';
import { 
  SetupTestRequest, 
  SetupTestResponse, 
  TodayPlanResponse, 
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

  completeDay: async () => {
    const response = await api.post<CompleteDayResponse>('/plan/complete-day');
    return response.data;
  }
};
