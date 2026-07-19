# Sistema de rutas

## Configuración

Archivo: [`src/app/routes.tsx`](../src/app/routes.tsx)

Usa `createBrowserRouter` de react-router v7:

```
AuthProvider (contexto)
  └── RouterProvider
        ├── Ruta raíz / → redirect a /login
        ├── PublicRoute (solo público)
        │     ├── /login
        │     └── /register
        ├── Sin guard (acceso libre)
        │     └── /activar
        ├── ProtectedRoute (cualquier autenticado)
        │     ├── /bienvenida
        │     ├── /lectura
        │     ├── /preguntas
        │     └── PatientLayout
        │           └── /dashboard
        └── AdminRoute (admin_general | admin_negocio)
              └── AdminLayout (sidebar)
                    ├── /admin → redirige según rol (admin_general → /admin/dashboard, moderador → /admin/productos)
                    ├── /admin/dashboard
                    ├── /admin/pacientes
                    ├── /admin/pacientes/:id
                    ├── /admin/reportes
                    ├── /admin/sucursales
                    ├── /admin/productos
                    ├── /admin/codigos
                    ├── /admin/plantillas
                    └── /admin/usuarios
```

## Flujo de navegación

### Registro (sin autenticación)
1. Register → valida nombre/email/password → navega a `/activar` con datos en `location.state`
2. Activar → ingresa código IEN-002 + productos → llama `register()` de AuthContext → `/bienvenida`
3. Bienvenida → CTA "Ir al programa" → `/dashboard`

### Login (sin autenticación → autenticado)
1. Login exitoso → `AuthContext.login()` actualiza estado
2. React re-renderiza → `PublicRoute` detecta `isAuthenticated`
3. `PublicRoute` redirige según `isAdmin`:
   - Admin → `/admin/dashboard`
   - Paciente → `/dashboard`

## Guards

### PublicRoute ([`src/components/PublicRoute.tsx`](../src/components/PublicRoute.tsx))
- `isLoading` → spinner
- `isAuthenticated` → redirect a `/admin/dashboard` (admin) o `/dashboard` (paciente)
- No autenticado → renderiza `<Outlet />` con Login o Register

### ProtectedRoute ([`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx))
- `isLoading` → spinner
- No autenticado → redirect a `/login`
- Autenticado → renderiza `<Outlet />`

### AdminRoute ([`src/components/AdminRoute.tsx`](../src/components/AdminRoute.tsx))
- `isLoading` → spinner
- No autenticado → redirect a `/login`
- No es admin → redirect a `/dashboard`
- Es admin → renderiza `<Outlet />`

## Layouts

### AdminLayout ([`src/components/layout/AdminLayout.tsx`](../src/components/layout/AdminLayout.tsx))
Envuelve todas las rutas admin con sidebar + header. Ver [admin-panel](06-admin-panel.md).

### PatientLayout ([`src/components/layout/PatientLayout.tsx`](../src/components/layout/PatientLayout.tsx))
Envuelve `/dashboard` con:
- Header sticky con logo IEN
- Bandeja de perfil desplegable (nombre, email, configuración, cerrar sesión)
- Campana de notificaciones

Actualmente solo envuelve `/dashboard`. Las demás rutas de paciente (`/lectura`, `/preguntas`) manejan su propia estructura.

## Rutas sin guard

`/activar` no tiene guard porque:
- Se accede desde Register (sin autenticación)
- Al completar la activación llama a `register()`, que autentica al usuario
- Si ya está autenticado, `PublicRoute` redirigiría antes de completar el flujo

Ver [autenticación](03-autenticacion.md) para el flujo completo.
