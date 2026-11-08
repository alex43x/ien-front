import api from './api';
import type { Leccion, PlanEstado, TestInicialResponse } from '../types/api.types';

export interface AttemptSummary {
  _id: string;
  numero_intento?: number;
  estado: PlanEstado;
  fecha_inicio: string;
  fecha_cierre?: string;
  motivo_cierre?: string;
  dia_actual: number;
  racha_dias: number;
  racha_maxima: number;
}
export interface AttemptDetail extends AttemptSummary {
  test_inicial?: TestInicialResponse;
  test_inicial_origen_id?: string;
  progreso_diario: {
    dia_numero: number;
    completado: boolean;
    fecha_completado?: string | null;
    respuesta_usuario: unknown;
    contenido_snapshot?: Leccion | null;
  }[];
  eventos?: { tipo: string; fecha: string; motivo?: string; envio?: string }[];
}
export interface SimulationState { dia_actual: number; version: number; leccion: Leccion | null; simulacion: true }
export type SimulationAction = 'avanzar' | 'retroceder' | 'reiniciar';

export const attemptsService = {
  list: async (userId: string, page: number) => (await api.get<{ intentos: AttemptSummary[]; total: number; page: number }>(`/admin/pacientes/${userId}/intentos`, { params: { page } })).data,
  detail: async (userId: string, planId: string) => (await api.get<AttemptDetail>(`/admin/pacientes/${userId}/intentos/${planId}`)).data,
  simulation: async () => (await api.get<SimulationState>('/admin/simulacion')).data,
  moveSimulation: async (accion: SimulationAction, version: number) => (await api.post<SimulationState>('/admin/simulacion', { accion, version })).data,
};
