# Componentes reutilizables

## Route guards

### ProtectedRoute ([`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx))

```typescript
// Uso en routes.tsx:
{
  element: <ProtectedRoute />,
  children: [
    { path: "/dashboard", element: <Dashboard /> },
  ],
}
```

**Comportamiento:**
- `isLoading` → spinner centrado
- `!isAuthenticated` → redirect a `/login`
- Autenticado → renderiza `<Outlet />`

### AdminRoute ([`src/components/AdminRoute.tsx`](../src/components/AdminRoute.tsx))

```typescript
{
  element: <AdminRoute />,
  children: [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
  ],
}
```

**Comportamiento:**
- `isLoading` → spinner centrado
- `!isAuthenticated` → redirect a `/login`
- `!isAdmin` → redirect a `/dashboard` (paciente)
- Es admin → renderiza `<Outlet />`

### PublicRoute ([`src/components/PublicRoute.tsx`](../src/components/PublicRoute.tsx))

```typescript
{
  element: <PublicRoute />,
  children: [
    { path: "/login", element: <Login /> },
  ],
}
```

**Comportamiento:**
- `isLoading` → spinner centrado
- `isAuthenticated && isAdmin` → redirect a `/admin/dashboard`
- `isAuthenticated && !isAdmin` → redirect a `/dashboard`
- No autenticado → renderiza `<Outlet />`

## Layouts

### AdminLayout ([`src/components/layout/AdminLayout.tsx`](../src/components/layout/AdminLayout.tsx))

Layout completo del panel admin con sidebar. Ver [admin-panel](06-admin-panel.md) para más detalles.

```typescript
// Uso: envuelve las rutas admin
{
  element: <AdminLayout />,
  children: [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    // ...
  ],
}
```

### PageShell ([`src/components/layout/PageShell.tsx`](../src/components/layout/PageShell.tsx))

Wrapper de página con fondo y fuente:

```typescript
<PageShell className="...">
  {children}
</PageShell>
```

Propiedades:
- `children: ReactNode` — contenido
- `className?: string` — clases adicionales

### PageHeader ([`src/components/layout/PageHeader.tsx`](../src/components/layout/PageHeader.tsx))

Header con logo, botón de retroceso opcional y contenido derecho:

```typescript
<PageHeader
  onBack={() => navigate(-1)}
  rightContent={<button>Acción</button>}
  bottomContent={<p>Subtítulo</p>}
/>
```

Propiedades:
- `onBack?: () => void` — muestra botón de retroceso
- `rightContent?: ReactNode` — contenido en el extremo derecho
- `bottomContent?: ReactNode` — contenido junto al logo

## Referencias

- Guards se usan en [`routes.tsx`](../src/app/routes.tsx) — ver [routing](02-routing.md)
- `AdminLayout` se detalla en [admin-panel](06-admin-panel.md)
- `AuthContext` provee `isLoading`, `isAuthenticated`, `isAdmin` — ver [autenticacion](03-autenticacion.md)
