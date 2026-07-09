# Sistema de rutas

## Configuración

Archivo: [`src/app/routes.tsx`](../src/app/routes.tsx)

Usa `createBrowserRouter` de react-router v7 con tres niveles de protección:

```
AuthProvider (contexto)
  └── RouterProvider
        ├── Ruta raíz / → redirect a /login
        ├── PublicRoute
        │     ├── /login
        │     └── /register
        ├── ProtectedRoute (cualquier autenticado)
        │     ├── /dashboard
        │     ├── /bienvenida
        │     ├── /activar
        │     ├── /lectura
        │     └── /preguntas
        └── AdminRoute (admin_general | admin_negocio)
              └── AdminLayout (sidebar)
                    ├── /admin → /admin/dashboard
                    ├── /admin/dashboard
                    ├── /admin/pacientes
                    ├── /admin/pacientes/:id
                    ├── /admin/reportes
                    ├── /admin/sucursales
                    ├── /admin/productos
                    ├── /admin/codigos
                    └── /admin/crear-admin
```

## Guards

### PublicRoute ([`src/components/PublicRoute.tsx`](../src/components/PublicRoute.tsx))

- Si `isLoading` → spinner
- Si `isAuthenticated` → redirect a `/admin/dashboard` (admin) o `/dashboard` (paciente)
- Si no → renderiza `<Outlet />` con Login o Register

### ProtectedRoute ([`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx))

- Si `isLoading` → spinner
- Si no autenticado → redirect a `/login`
- Si autenticado → renderiza `<Outlet />`

### AdminRoute ([`src/components/AdminRoute.tsx`](../src/components/AdminRoute.tsx))

- Si `isLoading` → spinner
- Si no autenticado → redirect a `/login`
- Si no es admin (`isAdmin === false`) → redirect a `/dashboard`
- Si es admin → renderiza `<Outlet />`

## Layouts

El layout `AdminLayout` ([`src/components/layout/AdminLayout.tsx`](../src/components/layout/AdminLayout.tsx)) envuelve todas las rutas admin. Ver [admin-panel](06-admin-panel.md) para detalles.

Las rutas de paciente (`/dashboard`, `/lectura`, etc.) no tienen un layout compartido — cada página maneja su propia estructura.

## Flujo de navegación post-login

1. Login exitoso → `AuthContext.login()` actualiza estado
2. React re-renderiza → `PublicRoute` detecta `isAuthenticated`
3. `PublicRoute` redirige según `isAdmin`:
   - Admin → `/admin/dashboard`
   - Paciente → `/dashboard`

Ver [autenticación](03-autenticacion.md) para el flujo completo.
