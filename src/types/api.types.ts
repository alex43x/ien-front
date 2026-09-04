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

export interface GrupoDocument {
  _id: string;
  nombre: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol?: 'usuario' | 'admin_negocio' | 'admin_general' | 'moderador_tienda';
  grupo_id?: string | null;
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

export interface PuntuacionCompetencia {
  competencia: string;
  competencia_label: string;
  puntuacion: number;
}

export interface SetupTestResponse {
  plan_id: string;
  dia_actual: number;
  estado: string;
  puntuaciones_por_competencia: PuntuacionCompetencia[];
  competencias_a_mejorar: string[];
}

export interface PasoEjercicio {
  id?: string;
  texto?: string;
  respuesta_tipo?: string;
  min?: number;
  max?: number;
}

export interface SeccionLeccion {
  titulo?: string;
  parrafos?: string[];
  lista?: string[];
}

export interface TablaInfoDatos {
  titulo?: string;
  columnas: { id: string; etiqueta: string }[];
  filas: string[][];
}

export interface EjercicioDatos {
  nombre: string;
  instruccion: string;
  instruccion_colapsable?: boolean;
  pasos?: PasoEjercicio[];
  tipo?: string;
  respuesta_tipo?: string;
  registro?: Record<string, any>;
}

export interface SuplementoDatos {
  nombre: string;
  dosis: string;
  horario: string;
  beneficio: string;
}

export interface DatosLeccion {
  titulo?: string;
  bloque?: string;
  concepto?: string;
  contenido?: string;
  secciones?: SeccionLeccion[];
  principio?: string;
  principio_secciones?: SeccionLeccion[];
  tablas_info?: TablaInfoDatos[];
  ejercicio?: EjercicioDatos;
  suplementacion?: SuplementoDatos[];
  recursos?: any[];
}

export interface ColumnaTabla {
  id: string;
  etiqueta: string;
  tipo?: 'texto' | 'numero' | 'escala';
  min?: number;
  max?: number;
}

export interface CampoRespuesta {
  id: string;
  etiqueta: string;
  tipo: 'texto' | 'numero' | 'escala' | 'reflexion' | 'accion' | 'tabla';
  min?: number;
  max?: number;
  opciones?: { valor: any; etiqueta: string }[];
  columnas?: ColumnaTabla[];
  filas?: number;
  requerido?: 'todas' | 'ninguna';
  layout?: 'grid';
}

export type ValorTabla = Record<string, any>[];

export interface Leccion {
  dia_actual: number;
  titulo: string;
  tipo: string;
  emociones_objetivo: string[];
  respuesta_tipo: string;
  campos_respuesta: CampoRespuesta[];
  datos_leccion: DatosLeccion;
  conclusion?: string;
}

export interface ResponderDiaRequest {
  dia_numero: number;
  respuestas: { id: string; valor: any; tipo: string }[];
}

export interface ResponderDiaResponse {
  usuario: string;
  dia_numero: number;
  respuestas: { id: string; valor: any; tipo: string }[];
  completado: boolean;
  fecha: string;
}

export interface TodayPlanResponse {
  dia_actual: number;
  completado?: boolean;
  cabecera: string | null;
  conclusion: string | null;
  contenido_especial: { tipo: string; titulo: string; contenido: any } | null;
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
  promedio_dia_progreso: number;
  racha_promedio: number;
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
  activo: boolean;
  grupo_id?: string | GrupoDocument;
}

export interface ProductoAdmin {
  _id: string;
  nombre: string;
  descripcion?: string;
  grupo_id?: string | GrupoDocument;
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
  grupo_id: string;
}

export interface CreateAdminNegocioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  grupo_id: string;
  grupo_nombre?: string;
  tiendas_del_grupo?: { nombre_tienda: string; ciudad: string }[];
}

export interface AdminNegocioItem {
  _id: string;
  nombre: string;
  email: string;
  grupo_id: GrupoDocument | string;
  fecha_registro: string;
}

export interface UpdateAdminNegocioRequest {
  nombre?: string;
  email?: string;
  grupo_id?: string;
}

export interface CreateModeradorRequest {
  nombre: string;
  email: string;
  password: string;
  tienda_id: string;
}

export interface CreateModeradorResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  tienda_moderada: string;
}

export interface ModeradorTiendaItem {
  _id: string;
  nombre: string;
  email: string;
  tienda_moderada: TiendaDocument;
  fecha_registro: string;
}

export interface UpdateModeradorRequest {
  nombre?: string;
  email?: string;
  tienda_id?: string;
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

// Test Inicial completado
export interface RespuestaTestIndividual {
  pregunta_numero: number;
  competencia: string;
  competencia_label: string;
  score: number;
  texto: string;
}

export interface TestInicialResponse {
  fecha_completado: string;
  puntuaciones_por_competencia: PuntuacionCompetencia[];
  competencias_a_mejorar: string[];
  respuestas: RespuestaTestIndividual[];
}

// Actividades diarias
export interface DiaPlan {
  dia_numero: number;
  completado: boolean;
  fecha_completado: string | null;
  respuesta_usuario: { id: string; valor: any; tipo: string }[] | null;
  cabecera: string | null;
  conclusion: string | null;
  contenido_especial: { tipo: string; titulo: string; contenido: any } | null;
  leccion: Leccion | null;
}

export interface DiasPlanResponse {
  dias: DiaPlan[];
}

export interface BienvenidaResponse {
  tipo: string;
  titulo: string;
  contenido: {
    programa: {
      nombre: string;
      subtitulo: string;
    };
    introduccion: string;
    viaje_transformacion: {
      titulo: string;
      intro: string;
      puntos: string[];
    };
    competencias_maestras: {
      titulo: string;
      descripcion: string;
      cita: string;
      nota: string;
    };
    momento_es_ahora: {
      titulo: string;
      descripcion: string;
      frases_impacto: string[];
      pregunta: string;
    };
    cierre: string;
    cita_final: string;
  };
}
