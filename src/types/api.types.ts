export interface Tienda {
  id: string;
  nombre: string;
  ciudad: string;
}

export interface TiendaDocument {
  _id: string;
  nombre_tienda: string;
  ciudad: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol?: 'usuario' | 'admin_negocio' | 'admin_general';
  tiendas_administradas?: string[];
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
  numero: number;
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

export interface DatosLeccion {
  cita?: string;
  autor?: string;
  cuerpo?: string;
  pregunta?: string;
  [key: string]: any;
}

export interface Leccion {
  dia_actual: number;
  titulo: string;
  tipo: string;
  emociones_objetivo: string[];
  respuesta_tipo: string;
  datos_leccion: DatosLeccion;
}

export interface TodayPlanResponse {
  leccion: Leccion | null;
}

export interface PlanProfileResponse {
  dia_actual: number;
  racha_dias: number;
  racha_maxima: number;
  estado: 'activo' | 'completado' | 'abandonado';
  actividad_completada_hoy: boolean;
  fecha_inicio: string;
  dias_completados: number;
  dias_totales: number;
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

export interface Paciente {
  id: string;
  nombre: string;
  email: string;
  fecha_registro: string;
  tienda: { id: string; nombre: string } | null;
  plan: { estado: string; dia_actual: number; racha_dias: number } | null;
}

export interface PaginacionPacientes {
  pacientes: Paciente[];
  total: number;
  pagina: number;
}

export interface PerfilPaciente {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fecha_registro: string;
  tienda: TiendaDocument | null;
  producto: { _id: string; nombre: string; descripcion?: string } | null;
}

export interface ProgresoPaciente {
  estado: 'activo' | 'completado' | 'abandonado';
  dia_actual: number;
  racha_dias: number;
  racha_maxima: number;
  hitos_alcanzados: number[];
  fecha_inicio: string;
  ultima_fecha_actividad: string;
  test_inicial: any;
  progreso_diario: any[];
}

export interface ReportesUsuarios {
  registrados: { total: number; hoy: number; semanal: number };
  activos: { total: number; hoy: number; semanal: number };
}

export interface GraficaSemanal {
  fecha: string;
  cantidad: number;
}

export interface Sucursal {
  _id: string;
  nombre_tienda: string;
  ciudad: string;
}

export interface ProductoAdmin {
  _id: string;
  nombre: string;
  descripcion?: string;
  tiendas?: string[] | TiendaDocument[];
}

export interface CodigoActivacion {
  _id: string;
  codigo: string;
  producto_id: { _id: string; nombre: string } | string;
  tienda_id: { _id: string; nombre_tienda: string; ciudad: string } | string;
  activo: boolean;
  fecha_creacion: string;
  fecha_activacion?: string;
}

export interface CreateAdminNegocioRequest {
  nombre: string;
  email: string;
  password: string;
  tiendas_administradas: string[];
}

export interface CreateAdminNegocioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  tiendas_administradas: string[];
}

export interface CodigoResponse {
  mensaje: string;
  codigo?: CodigoActivacion;
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
