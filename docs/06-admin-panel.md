# Panel de administración

## Layout ([`src/components/layout/AdminLayout.tsx`](../src/components/layout/AdminLayout.tsx))

El layout envuelve todas las rutas admin con:

```
┌─────────────────────────────────────────────┐
│  Sidebar (64) │  Header                     │
│               │  "Panel de administración"   │
│  Dashboard    ├─────────────────────────────┤
│  Pacientes    │                             │
│  Reportes     │       <Outlet />            │
│  Sucursales   │       (página activa)       │
│  Productos    │                             │
│  Códigos      │                             │
│  Plantillas   │                             │
│  Usuarios     │                             │
│               │                             │
│  [Usuario]    │                             │
│  Cerrar sesión│                             │
└─────────────────────────────────────────────┘
```

- Sidebar colapsable en mobile con overlay
- Header con indicador "Admin activo" y botón de cerrar sesión
- El `Outlet` renderiza la página según la ruta activa
- Cada item tiene `roles: string[]` para visibilidad por rol
- `/admin` redirige según rol: `admin_general` → `/admin/dashboard`, `moderador_tienda` → `/admin/productos`

## Páginas

### AdminDashboard ([`src/app/AdminDashboard.tsx`](../src/app/AdminDashboard.tsx))

**Ruta:** `/admin/dashboard`

Carga 4 llamadas en paralelo al montar:
- `getMetrics()` → cards de métricas
- `graficaSemanal()` → gráfica de área (Recharts)
- `reportesUsuarios()` → resumen rápido
- `listarPacientes(1, 5)` → tabla de pacientes recientes

### AdminPatients ([`src/app/AdminPatients.tsx`](../src/app/AdminPatients.tsx))

**Ruta:** `/admin/pacientes`

- Lista paginada con `listarPacientes(page, limit)`
- Buscador local por nombre/email
- Cada fila es clickeable → navega a `/admin/pacientes/:id`
- Paginación con botones numéricos

### AdminPatientDetail ([`src/app/AdminPatientDetail.tsx`](../src/app/AdminPatientDetail.tsx))

**Ruta:** `/admin/pacientes/:id`

Carga en paralelo:
- `perfilPaciente(id)` → datos del paciente
- `progresoPaciente(id)` → progreso del plan

Muestra:
- Tarjeta de perfil (nombre, email, sucursal, fecha registro)
- Grid de 4 indicadores (día actual, racha actual, racha máxima, días completados)
- Grid de 30 días con colores (verde=completado, amarillo=actual, gris=pendiente)
- Detalles del plan (fecha inicio, última actividad, hitos)

### AdminReports ([`src/app/AdminReports.tsx`](../src/app/AdminReports.tsx))

**Ruta:** `/admin/reportes`

- Cards con totales de registrados y activos
- Gráfica de área con actividad diaria (7 días)
- Gráfica de barras comparativa
- Cards de detalle: registrados, activos, resumen

### AdminStores ([`src/app/AdminStores.tsx`](../src/app/AdminStores.tsx))

**Ruta:** `/admin/sucursales`

- Grid de tarjetas con nombre y ciudad
- Modal para crear/editar sucursal
- Botones de editar/eliminar (solo admin_general)
- Admin_negocio solo puede ver sus sucursales (scope del backend)

### AdminProducts ([`src/app/AdminProducts.tsx`](../src/app/AdminProducts.tsx))

**Ruta:** `/admin/productos`

- Grid de tarjetas con nombre, descripción y sucursales asociadas
- Modal para crear/editar con selector de sucursales (checkboxes)
- Admin_negocio solo ve productos de sus sucursales

### AdminCodes ([`src/app/AdminCodes.tsx`](../src/app/AdminCodes.tsx))

**Ruta:** `/admin/codigos`

- Layout de tarjetas (card grid) con código, sucursal, producto, fecha, estado
- Botón Activar/Desactivar por tarjeta
- Modal para crear nuevo código con `CodeInput` (formato XXX-000) y selector de sucursal + producto
- Indicador visual: verde = activo, rojo = inactivo
- Los códigos son reutilizables (múltiples usuarios pueden activarse con el mismo)

### AdminEmails ([`src/app/AdminEmails.tsx`](../src/app/AdminEmails.tsx))

**Ruta:** `/admin/plantillas`

- Solo accesible para `admin_general`
- Sidebar con 10 plantillas de correo transaccionales
- Preview en iframe con diseño responsive
- Input para modificar nombre de prueba (default: "María García")
- Navegación entre plantillas con flechas

Plantillas disponibles:
- Bienvenida (día 0)
- Hitos semanales (semanas 1-4: días 7, 14, 21, 28)
- Recordatorio diario
- Racha rota
- Urgencia de activación
- Recuperación por inactividad
- Recuperación de contraseña

### AdminUsuarios ([`src/app/AdminUsuarios.tsx`](../src/app/AdminUsuarios.tsx))

**Ruta:** `/admin/usuarios`

- CRUD de admins de negocio y moderadores de tienda
- Tabs para alternar entre ambos roles
- Modal para crear/editar con selector de sucursales
- Solo accesible para `admin_general`

### AdminCreateBusinessAdmin ([`src/app/AdminCreateBusinessAdmin.tsx`](../src/app/AdminCreateBusinessAdmin.tsx))

**Ruta:** `/admin/crear-admin`

- Formulario con nombre, email, contraseña, selector de sucursales
- Validación: todos los campos requeridos, password ≥ 6 caracteres, al menos 1 sucursal
- Solo accesible para admin_general (el backend valida el rol)

## Flujo de datos

```
Página admin se monta
  └── useState → loading = true
       └── useEffect → llama a adminService.método()
            └── api.get/post/put/patch/delete()
                 └── interceptor inyecta token JWT
                      └── backend responde
                           └── setState con datos
                                └── loading = false → render
```

## Referencias

- Servicios: [`admin.service.ts`](04-servicios-api.md)
- Tipos: [`api.types.ts`](05-tipos.md)
- Layout: [`AdminLayout.tsx`](../src/components/layout/AdminLayout.tsx)
- Guard: [`AdminRoute.tsx`](../src/components/AdminRoute.tsx)
