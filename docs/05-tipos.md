# Tipos TypeScript

Archivo: [`src/types/api.types.ts`](../src/types/api.types.ts)

Todos los tipos de request/response de la API se definen aquí.

## Usuario y tienda

```typescript
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol?: 'usuario' | 'admin_negocio' | 'admin_general';
  tiendas_administradas?: string[];
}

interface Tienda {
  id: string;
  nombre: string;
  ciudad: string;
}

interface TiendaDocument {
  _id: string;
  nombre_tienda: string;
  ciudad: string;
}
```

## Auth

```typescript
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  usuario?: Usuario;
}

interface ValidateCodeRequest { codigo_activacion: string; }
interface ValidateCodeResponse {
  valido: boolean;
  tienda: Tienda;
  producto: { id: string; nombre: string; };
}
```

## Plan

```typescript
interface Leccion {
  dia_actual: number;
  titulo: string;
  tipo: string;
  emociones_objetivo: string[];
  respuesta_tipo: string;
  datos_leccion: DatosLeccion;
}

interface PlanProfileResponse {
  dia_actual: number;
  racha_dias: number;
  racha_maxima: number;
  estado: 'activo' | 'completado' | 'abandonado';
  actividad_completada_hoy: boolean;
  fecha_inicio: string;
  dias_completados: number;
  dias_totales: number;
}
```

## Admin

### Dashboard

```typescript
interface AdminMetrics {
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
```

### Pacientes

```typescript
interface Paciente {
  id: string;
  nombre: string;
  email: string;
  fecha_registro: string;
  tienda: { id: string; nombre: string } | null;
  plan: { estado: string; dia_actual: number; racha_dias: number } | null;
}

interface PaginacionPacientes {
  pacientes: Paciente[];
  total: number;
  pagina: number;
}

interface PerfilPaciente {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fecha_registro: string;
  tienda: TiendaDocument | null;
  producto: { _id: string; nombre: string; descripcion?: string } | null;
}

interface ProgresoPaciente {
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
```

### Reportes

```typescript
interface ReportesUsuarios {
  registrados: { total: number; hoy: number; semanal: number };
  activos: { total: number; hoy: number; semanal: number };
}

interface GraficaSemanal {
  fecha: string;       // "YYYY-MM-DD"
  cantidad: number;
}
```

### CRUD

```typescript
interface Sucursal {
  _id: string;
  nombre_tienda: string;
  ciudad: string;
}

interface ProductoAdmin {
  _id: string;
  nombre: string;
  descripcion?: string;
  tiendas?: string[] | TiendaDocument[];
}

interface CodigoActivacion {
  _id: string;
  codigo: string;
  producto_id: { _id: string; nombre: string } | string;
  tienda_id: { _id: string; nombre_tienda: string; ciudad: string } | string;
  activo: boolean;
  fecha_creacion: string;
  fecha_activacion?: string;
}

interface CodigoResponse {
  mensaje: string;
}
```

### PasoEjercicio

```typescript
interface PasoEjercicio {
  id?: string;
  texto?: string;
  respuesta_tipo?: string;
  min?: number;
  max?: number;
}
```

Usado en `EjercicioDatos.pasos` para definir los pasos de un ejercicio dentro de una lección.

### Admin de negocio

```typescript
interface CreateAdminNegocioRequest {
  nombre: string;
  email: string;
  password: string;
  tiendas_administradas: string[];
}

interface CreateAdminNegocioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  tiendas_administradas: string[];
}
```

## Constantes de colores

Archivo: [`src/constants/colors.ts`](../src/constants/colors.ts)

```typescript
export const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828" },
};

export type Tone = keyof typeof C;
export const GRAY = { base: "#3E3A38", mid: "#7A7270", light: "#E8E4E2", faint: "#F7F5F4" };
```

## Bloques del programa

Archivo: [`src/constants/program.ts`](../src/constants/program.ts)

```typescript
interface Block {
  id: number;
  start: number;      // día de inicio
  end: number;        // día de fin
  title: string;
  icon: React.ComponentType;
  tone: Tone;
  desc: string;
}
```

## Referencias

- Los tipos se usan en [servicios API](04-servicios-api.md) y [páginas admin](06-admin-panel.md)
- `Tone` se re-exporta desde [`types/index.ts`](../src/types/index.ts)
