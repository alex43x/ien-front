# Servicios API

## Instancia axios ([`src/services/api.ts`](../src/services/api.ts))

Configuración:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});
```

- **Request interceptor**: inyecta `Authorization: Bearer <token>`
- **Response interceptor**: captura 401, refresca token automáticamente con cola de concurrencia

## auth.service.ts ([`src/services/auth.service.ts`](../src/services/auth.service.ts))

Endpoints de `/auth/*`.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `validateCode(data)` | Validar código de activación | POST `/auth/validate-code` |
| `register(data)` | Registrar nuevo usuario | POST `/auth/register` |
| `login(data)` | Iniciar sesión | POST `/auth/login` |
| `refresh()` | Refrescar access token | POST `/auth/refresh` |
| `logout()` | Cerrar sesión | POST `/auth/logout` |
| `getProfile()` | Obtener perfil completo | GET `/auth/profile` |
| `forgotPassword(email)` | Solicitar recuperación de contraseña | POST `/auth/forgot-password` |
| `resetPassword(data)` | Restablecer contraseña con token | POST `/auth/reset-password` |

login/register guardan automáticamente los tokens y usuario en localStorage.

## admin.service.ts ([`src/services/admin.service.ts`](../src/services/admin.service.ts))

Endpoints de `/admin/*`. Todos requieren JWT + rol admin.

### Dashboard y pacientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getMetrics()` | GET `/admin/dashboard/metrics` | Métricas agregadas por sucursal |
| `listarPacientes(page, limit)` | GET `/admin/pacientes?page=&limit=` | Lista paginada de pacientes |
| `perfilPaciente(usuarioId)` | GET `/admin/pacientes/:id/perfil` | Perfil de un paciente |
| `progresoPaciente(usuarioId)` | GET `/admin/pacientes/:id/progreso` | Progreso del plan |

### Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `reportesUsuarios()` | GET `/admin/reportes/usuarios` | Conteos de usuarios |
| `graficaSemanal()` | GET `/admin/reportes/usuarios/grafica-semanal` | Actividad últimos 7 días |

### Sucursales

| Método | Endpoint |
|--------|----------|
| `listarSucursales()` | GET `/admin/sucursales` |
| `crearSucursal(data)` | POST `/admin/sucursales` |
| `actualizarSucursal(id, data)` | PUT `/admin/sucursales/:id` |
| `eliminarSucursal(id)` | DELETE `/admin/sucursales/:id` |

### Productos

| Método | Endpoint |
|--------|----------|
| `listarProductos()` | GET `/admin/productos` |
| `crearProducto(data)` | POST `/admin/productos` |
| `actualizarProducto(id, data)` | PUT `/admin/productos/:id` |
| `eliminarProducto(id)` | DELETE `/admin/productos/:id` |

### Códigos de activación

| Método | Endpoint |
|--------|----------|
| `listarCodigos()` | GET `/admin/codigos` |
| `crearCodigo(data)` | POST `/admin/codigos` |
| `activarCodigo(id)` | PATCH `/admin/codigos/:id/activar` |
| `desactivarCodigo(id)` | PATCH `/admin/codigos/:id/desactivar` |

### Admin de negocio

| Método | Endpoint |
|--------|----------|
| `crearAdminNegocio(data)` | POST `/admin/usuarios/admin-negocio` |
| `listarAdminsNegocio()` | GET `/admin/usuarios/admin-negocio` |
| `getAdminNegocio(id)` | GET `/admin/usuarios/admin-negocio/:id` |
| `actualizarAdminNegocio(id, data)` | PUT `/admin/usuarios/admin-negocio/:id` |
| `eliminarAdminNegocio(id)` | DELETE `/admin/usuarios/admin-negocio/:id` |

### Moderadores de tienda

| Método | Endpoint |
|--------|----------|
| `listarModeradores()` | GET `/admin/usuarios/moderador-tienda` |
| `crearModerador(data)` | POST `/admin/usuarios/moderador-tienda` |
| `getModerador(id)` | GET `/admin/usuarios/moderador-tienda/:id` |
| `actualizarModerador(id, data)` | PUT `/admin/usuarios/moderador-tienda/:id` |
| `eliminarModerador(id)` | DELETE `/admin/usuarios/moderador-tienda/:id` |

## plan.service.ts ([`src/services/plan.service.ts`](../src/services/plan.service.ts))

Endpoints de `/plan/*`. Requieren JWT.

| Método | Descripción |
|--------|-------------|
| `getTestPreguntas()` | Banco de preguntas del test |
| `setupTest(data)` | Crear plan desde respuestas del test |
| `getTodayPlan()` | Lección del día actual |
| `getProfile()` | Progreso del plan (racha, días, estado) |
| `completeDay(respuesta)` | Marcar día como completado |
| `advanceDay()` | (DEV) Saltar al siguiente día |

## jobs.service.ts ([`src/services/jobs.service.ts`](../src/services/jobs.service.ts))

Endpoints internos con API key.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `resetStreaks(apiKey)` | POST `/jobs/reset-streaks` | Resetear rachas de usuarios inactivos |
| `sendReminders(apiKey)` | POST `/jobs/send-reminders` | Enviar correos de recordatorio diario |
| `sendActivationNudge(apiKey)` | POST `/jobs/send-activation-nudge` | Enviar urgencia de activación |
| `sendRecovery(apiKey)` | POST `/jobs/send-recovery` | Enviar recuperación por inactividad |

## Referencias

- Tipos de request/response: [`api.types.ts`](05-tipos.md)
- Autenticación y tokens: [autenticacion.md](03-autenticacion.md)
