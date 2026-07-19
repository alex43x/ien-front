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

## Componentes de formulario

### CodeInput ([`src/components/CodeInput.tsx`](../src/components/CodeInput.tsx))

Input guiado para códigos de activación con formato XXX-000 (3 letras + 3 dígitos).

```typescript
interface CodeInputProps {
  onChange: (code: string) => void;
}
```

**Comportamiento:**
- 6 inputs separados: 3 para letras, 3 para números
- Auto-advance al completar cada input
- Backspace borra el input anterior
- Soporte para pegar código completo (ej. `ABC-123`)
- Convierte letras a mayúsculas automáticamente
- Emite el código completo via `onChange` (ej. `"ABC-123"`)

**Uso:**
```tsx
import CodeInput from "../components/CodeInput";

<CodeInput onChange={(v) => setForm({ ...form, codigo: v })} />
```

Se usa en:
- `AdminCodes.tsx` — crear nuevo código de activación
- `Activar.tsx` — activación de cuenta por el usuario

## Layouts

### AdminLayout ([`src/components/layout/AdminLayout.tsx`](../src/components/layout/AdminLayout.tsx))

Layout completo del panel admin con sidebar. Ver [admin-panel](06-admin-panel.md) para más detalles.

```typescript
{
  element: <AdminLayout />,
  children: [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
  ],
}
```

### PatientLayout ([`src/components/layout/PatientLayout.tsx`](../src/components/layout/PatientLayout.tsx))

Layout para el dashboard del paciente. Incluye header con bandeja de perfil.

```
┌─────────────────────────────────┐
│  [Logo]     [🔔]  [Perfil ▼]   │  ← header sticky
├─────────────────────────────────┤
│                                 │
│         <Outlet />              │  ← página activa
│                                 │
└─────────────────────────────────┘
```

**Bandeja de perfil:** dropdown al hacer click en el avatar del usuario:
- Nombre y email del usuario (desde AuthContext)
- Botón "Configuración"
- Botón "Cerrar sesión"

```typescript
{
  element: <ProtectedRoute />,
  children: [
    {
      element: <PatientLayout />,
      children: [
        { path: "/dashboard", element: <Dashboard /> },
      ],
    },
  ],
}
```

Actualmente solo envuelve `/dashboard`. Las rutas `/lectura` y `/preguntas` tienen su propia estructura.

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
