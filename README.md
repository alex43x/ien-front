# IEN — Frontend

Panel de administración y programa de 30 días de inteligencia emocional aplicada a la nutrición.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 18.3 + TypeScript 6 (strict) |
| Build | Vite 6.3 |
| Routing | react-router 7.13 (createBrowserRouter) |
| UI | Tailwind CSS 4.1 |
| Charts | Recharts 2.15 |
| Animaciones | motion 12.23 (Framer Motion) |
| Iconos | lucide-react 0.487 |
| HTTP | axios 1.18 |
| Fonts | Inter, Lora, DM Mono |

## Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build producción
npm run typecheck # Verificación de tipos
```

## Entorno

Variable en `.env`:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | URL base del backend |

## Estructura del proyecto

```
src/
├── main.tsx                      # Entry point
├── app/
│   ├── App.tsx                   # Provider root (AuthProvider + RouterProvider)
│   ├── routes.tsx                # Definición de todas las rutas
│   ├── Login.tsx                 # Inicio de sesión
│   ├── Register.tsx              # Registro con código de activación
│   ├── Dashboard.tsx             # Dashboard del paciente
│   ├── Bienvenida.tsx            # Página de bienvenida post-registro
│   ├── Activar.tsx               # Activación de producto
│   ├── Lectura.tsx               # Lectura diaria del plan
│   ├── Preguntas.tsx             # Test diagnóstico
│   ├── AdminDashboard.tsx        # Dashboard admin (métricas, gráficas)
│   ├── AdminPatients.tsx         # Lista de pacientes paginada
│   ├── AdminPatientDetail.tsx    # Perfil + progreso del paciente
│   ├── AdminReports.tsx          # Reportes y gráficas de actividad
│   ├── AdminStores.tsx           # CRUD sucursales
│   ├── AdminProducts.tsx         # CRUD productos
│   ├── AdminCodes.tsx            # CRUD códigos de activación
│   └── AdminCreateBusinessAdmin.tsx  # Crear admin de negocio
├── components/
│   ├── ProtectedRoute.tsx        # Guard: requiere autenticación
│   ├── AdminRoute.tsx            # Guard: requiere rol admin
│   ├── PublicRoute.tsx           # Guard: solo público (redirige si autenticado)
│   └── layout/
│       ├── AdminLayout.tsx       # Layout con sidebar para el panel admin
│       ├── PageShell.tsx         # Wrapper de página genérico
│       └── PageHeader.tsx        # Header con botón de retroceso
├── context/
│   └── AuthContext.tsx           # Estado global de autenticación
├── services/
│   ├── api.ts                    # Instancia axios + interceptor de tokens
│   ├── auth.service.ts           # API de autenticación (/auth/*)
│   ├── admin.service.ts          # API de administración (/admin/*)
│   ├── plan.service.ts           # API del plan (/plan/*)
│   └── jobs.service.ts           # API de cron jobs (/jobs/*)
├── types/
│   └── api.types.ts              # Interfaces de todas las API
├── constants/
│   ├── colors.ts                 # Paleta de colores (yellow, green, red)
│   └── program.ts                # Definición de los 6 bloques del programa
├── content/
│   └── readings.ts               # Datos de muestra para lecturas
├── styles/
│   ├── index.css                 # Agregador de estilos
│   ├── tailwind.css              # Import de Tailwind v4 + tw-animate-css
│   ├── theme.css                 # CSS custom properties (@theme)
│   ├── globals.css               # Keyframes globales
│   └── fonts.css                 # Google Fonts
└── imports/                      # Assets estáticos (logo, imágenes)
    └── logo_ien-03.png
```

## Routing

### Rutas públicas (PublicRoute)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Redirect → `/login` | |
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro con código |

Redirige automáticamente al dashboard correspondiente según el rol si el usuario ya está autenticado.

### Rutas protegidas (ProtectedRoute — cualquier usuario autenticado)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/bienvenida` | Bienvenida | Onboarding post-registro |
| `/activar` | Activar | Activación de producto |
| `/dashboard` | Dashboard | Panel del paciente |
| `/lectura` | Lectura | Lectura diaria |
| `/preguntas` | Preguntas | Test diagnóstico |

### Rutas admin (AdminRoute — solo admin_general / admin_negocio)

Bajo `AdminLayout` con sidebar lateral:

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin` | Redirect → `/admin/dashboard` | |
| `/admin/dashboard` | AdminDashboard | Métricas, gráfica semanal, pacientes recientes |
| `/admin/pacientes` | AdminPatients | Lista paginada con búsqueda |
| `/admin/pacientes/:id` | AdminPatientDetail | Perfil + progreso del paciente |
| `/admin/reportes` | AdminReports | Reportes de usuarios y gráficas |
| `/admin/sucursales` | AdminStores | CRUD sucursales |
| `/admin/productos` | AdminProducts | CRUD productos |
| `/admin/codigos` | AdminCodes | CRUD códigos de activación |
| `/admin/crear-admin` | AdminCreateBusinessAdmin | Crear admin de negocio |

## Autenticación

### AuthContext

`AuthContext` es el único estado global de la app. Expone:

```typescript
{
  user: Usuario | null;         // { id, nombre, email, rol, tiendas_administradas }
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;              // true si rol === admin_general | admin_negocio
  login, register, logout
}
```

### Flujo de inicio

1. Al montar la app, `checkAuth` ejecuta:
   - Si hay `access_token` en localStorage → llama a `GET /auth/profile` para obtener datos frescos (incluye `rol`)
   - Si no hay access_token pero sí `refresh_token` → refresca tokens, luego obtiene el perfil
   - Si falla la API → usa datos de localStorage como respaldo
   - Sin tokens → `isAuthenticated = false`

### Manejo del token JWT

- **Access token**: JWT de 15 minutos en localStorage (`access_token`)
- **Refresh token**: opaque token de 30 días en localStorage (`refresh_token`)
- El interceptor de axios (`api.ts`) inyecta `Authorization: Bearer <token>` en cada request
- En caso de 401, el interceptor intenta refrescar automáticamente con cola de requests concurrentes
- Si el refresh falla, limpia localStorage y redirige a `/login`

### Roles

| Rol | Acceso |
|-----|--------|
| `usuario` | Rutas de paciente (`/dashboard`, `/lectura`, etc.) |
| `admin_negocio` | Admin routes (limitado a sus sucursales) |
| `admin_general` | Admin routes (acceso total + crear sucursales/admins) |

## Servicios API

Cada servicio exporta un objeto con métodos que usan la instancia `api` de axios.

### auth.service.ts (`/auth/*`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `validateCode(data)` | POST `/auth/validate-code` | Validar código de activación |
| `register(data)` | POST `/auth/register` | Registrar nuevo usuario |
| `login(data)` | POST `/auth/login` | Iniciar sesión |
| `refresh()` | POST `/auth/refresh` | Refrescar access token |
| `logout()` | POST `/auth/logout` | Cerrar sesión |
| `getProfile()` | GET `/auth/profile` | Obtener perfil completo del usuario |

### admin.service.ts (`/admin/*`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getMetrics()` | GET `/admin/dashboard/metrics` | Métricas agregadas por sucursal |
| `listarPacientes(page, limit)` | GET `/admin/pacientes` | Lista paginada de pacientes |
| `perfilPaciente(id)` | GET `/admin/pacientes/:id/perfil` | Perfil del paciente |
| `progresoPaciente(id)` | GET `/admin/pacientes/:id/progreso` | Progreso del plan |
| `reportesUsuarios()` | GET `/admin/reportes/usuarios` | Conteos de usuarios |
| `graficaSemanal()` | GET `/admin/reportes/usuarios/grafica-semanal` | Actividad últimos 7 días |
| `crearAdminNegocio(data)` | POST `/admin/usuarios/admin-negocio` | Crear admin de negocio |
| `listarSucursales()` | GET `/admin/sucursales` | Listar sucursales |
| `crearSucursal(data)` | POST `/admin/sucursales` | Crear sucursal |
| `actualizarSucursal(id, data)` | PUT `/admin/sucursales/:id` | Actualizar sucursal |
| `eliminarSucursal(id)` | DELETE `/admin/sucursales/:id` | Eliminar sucursal |
| `listarProductos()` | GET `/admin/productos` | Listar productos |
| `crearProducto(data)` | POST `/admin/productos` | Crear producto |
| `actualizarProducto(id, data)` | PUT `/admin/productos/:id` | Actualizar producto |
| `eliminarProducto(id)` | DELETE `/admin/productos/:id` | Eliminar producto |
| `listarCodigos()` | GET `/admin/codigos` | Listar códigos de activación |
| `crearCodigo(data)` | POST `/admin/codigos` | Crear código |
| `activarCodigo(id)` | PATCH `/admin/codigos/:id/activar` | Activar código |
| `desactivarCodigo(id)` | PATCH `/admin/codigos/:id/desactivar` | Desactivar código |

### plan.service.ts (`/plan/*`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getTestPreguntas()` | GET `/plan/test-preguntas` | Banco de preguntas del test |
| `setupTest(data)` | POST `/plan/setup-test` | Crear plan desde test |
| `getTodayPlan()` | GET `/plan/today` | Lección del día |
| `getProfile()` | GET `/plan/profile` | Progreso del plan |
| `completeDay(respuesta)` | POST `/plan/complete-day` | Completar día actual |
| `advanceDay()` | POST `/plan/testing/advance` | (DEV) Avanzar día |

## Tipos principales (`types/api.types.ts`)

- **Auth**: `AuthResponse`, `ValidateCodeRequest/Response`
- **Usuario**: `id`, `nombre`, `email`, `rol`, `tiendas_administradas`
- **Plan**: `Leccion`, `TodayPlanResponse`, `PlanProfileResponse`, `CompleteDayResponse`
- **Admin**: `AdminMetrics`, `PaginacionPacientes`, `PerfilPaciente`, `ProgresoPaciente`, `ReportesUsuarios`, `GraficaSemanal`
- **CRUD**: `Sucursal`, `ProductoAdmin`, `CodigoActivacion`
- **Jobs**: `ResetStreaksResponse`, `SendRemindersRequest/Response`

## Admin Layout

`AdminLayout` provee:

- **Sidebar** lateral con navegación a todas las secciones admin
- **Header** con indicador "Admin activo" y botón de salir
- **Outlet** para renderizar la página activa
- Responsive: sidebar colapsable en mobile con overlay

## Estilos

- **Tailwind CSS v4** con `@tailwindcss/vite`
- Sistema de colores definido en `constants/colors.ts`:
  - `C.yellow` → acentos, alertas
  - `C.green` → positivo, activo, éxito
  - `C.red` → riesgo, error, atención
- Tipografía: Inter (ui), Lora (títulos), DM Mono (datos)
- Tema CSS custom properties en `styles/theme.css`

## Convenciones

- Nombres de archivos en PascalCase para componentes (`AdminDashboard.tsx`)
- Servicios en camelCase (`admin.service.ts`)
- Types en PascalCase exportados como interfaces
- Idioma: español en toda la UI
- Sin librerías de estado externas — solo React Context + useState
- Sin tests configurados
