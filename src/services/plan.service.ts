import api from './api';
import { 
  SetupTestRequest, 
  SetupTestResponse, 
  TodayPlanResponse,
  PlanProfileResponse,
  CompleteDayResponse,
  BienvenidaResponse,
  TestInicialResponse,
  DiasPlanResponse,
  ActivityContext,
  PlanEstado,
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

  completeDay: async (context: ActivityContext, respuesta_usuario?: { id: string; valor: any; tipo: string }[]) => {
    const response = await api.post<CompleteDayResponse>('/plan/complete-day', { ...context, respuesta_usuario });
    return response.data;
  },

  activateAttempt: async (planId: string) => {
    const response = await api.post<{ plan_id: string; estado: PlanEstado }>(`/plan/intentos/${planId}/activar`);
    return response.data;
  },

  continueAttempt: async () => {
    const response = await api.post<{ plan_id: string; estado: PlanEstado }>('/plan/intentos/continuar');
    return response.data;
  },

  autocompleteTest: async (debiles?: string[]) => {
    const params = debiles?.length ? { debiles: debiles.join(',') } : {};
    const response = await api.post<SetupTestResponse>('/plan/testing/autocomplete-test', {}, { params });
    return response.data;
  },

  getBienvenida: async () => {
    const response = await api.get<BienvenidaResponse>('/plan/bienvenida');
    return response.data;
  },

  getTestInicial: async () => {
    const response = await api.get<TestInicialResponse>('/plan/test-inicial');
    return response.data;
  },

  getDays: async (completados?: boolean) => {
    const params = completados ? { completados: 'true' } : {};
    const response = await api.get<DiasPlanResponse>('/plan/days', { params });
    return response.data;
  },
};
