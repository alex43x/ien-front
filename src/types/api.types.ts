export interface Tienda {
  id: string;
  nombre: string;
  ciudad: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

// Auth
export interface ValidateCodeRequest {
  codigo_activacion: string;
}

export interface ValidateCodeResponse {
  valido: boolean;
  tienda: Tienda;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  usuario?: Usuario;
}

// Plan
export interface RespuestaTest {
  pregunta_id: string;
  texto: string;
  respuesta_elegida: string;
  score: number;
}

export interface SetupTestRequest {
  respuestas: RespuestaTest[];
  emociones_a_mejorar: string[];
}

export interface SetupTestResponse {
  plan_id: string;
  dia_actual: number;
  estado: string;
}

export interface TodayPlanResponse {
  actividad_completada_hoy: boolean;
  dia_actual: number;
  racha_dias: number;
  racha_maxima: number;
  estado: 'activo' | 'completado' | 'abandonado';
  // If not completed today:
  titulo?: string;
  tipo?: string;
  emociones_objetivo?: string[];
  datos_leccion?: any; // You can type this more strictly if needed
  // If completed today:
  mensaje?: string;
}

export interface CompleteDayResponse {
  dia_completado: number;
  dia_actual: number;
  racha_dias: number;
  racha_maxima: number;
  estado: string;
  hito_alcanzado: number | null;
}

// Admin
export interface AdminMetrics {
  tienda_id: string;
  nombre_tienda: string;
  ciudad: string;
  total_activaciones: number;
  usuarios_activos: number;
  completados: number;
  abandonados: number;
  promedio_dia_progreso: number;
  racha_promedio: number;
  racha_maxima_promedio: number;
  usuarios_en_riesgo: number;
}

// Jobs
export interface ResetStreaksResponse {
  modifiedCount: number;
}

export interface SendRemindersRequest {
  momento_alerta: 'mañana' | 'recordatorio_tarde' | 'alerta_noche';
}

export interface SendRemindersResponse {
  enviados: number;
  fallidos: number;
}
