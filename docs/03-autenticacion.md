# Autenticación

## AuthContext ([`src/context/AuthContext.tsx`](../src/context/AuthContext.tsx))

Es el **único estado global** de la aplicación. No usa Redux ni Zustand.

### Estado expuesto

```typescript
interface AuthContextType {
  user: Usuario | null;           // { id, nombre, email, rol, tiendas_administradas }
  isAuthenticated: boolean;
  isLoading: boolean;              // true mientras se verifica la sesión al iniciar
  isAdmin: boolean;                // true si rol === admin_general | admin_negocio
  login: (data: Credenciales) => Promise<void>;
  register: (data: Registro) => Promise<void>;
  logout: () => void;
}
```

### Flujo de inicialización (`checkAuth`)

```
App inicia
  └── isLoading = true
       ├── ¿Hay access_token en localStorage?
       │    ├── Sí → GET /auth/profile → obtiene datos frescos (incluye rol)
       │    └── No → ¿Hay refresh_token?
       │         ├── Sí → POST /auth/refresh → nuevos tokens → GET /auth/profile
       │         └── No → isLoading = false (no autenticado)
       │
       ├── ¿getProfile falla?
       │    └── Sí → usa datos de localStorage como respaldo
       │    └── Ambos fallan → limpia storage, no autenticado
       │
       └── isLoading = false
```

### login()

1. Llama `authService.login(credenciales)` → POST `/auth/login`
2. El servicio guarda tokens y usuario en localStorage
3. Actualiza estado `user` con el response (incluye `rol`)
4. PublicRoute redirige al dashboard correspondiente

### register()

Se llama desde la página `Activar.tsx` (no desde `Register.tsx`).

1. `Register.tsx` recoge nombre/email/password y navega a `/activar` con los datos en `location.state`
2. `Activar.tsx` recibe los datos + usuario ingresa `codigo_activacion` (formato XXX-000: 3 letras + guión + 3 dígitos, ej. `ABC-123`)
3. Los códigos son **reutilizables**: múltiples usuarios pueden activarse con el mismo código
4. Al presionar "Comenzar el programa" → llama `register({ nombre, email, password, codigo_activacion })`
5. El servicio guarda tokens y usuario en localStorage y actualiza el estado
6. Navega a `/bienvenida`

### logout()

1. Llama `authService.logout()` → POST `/auth/logout`
2. Elimina tokens y usuario de localStorage
3. Limpia estado → isAuthenticated = false
4. Los guards redirigen a `/login`

## Manejo de tokens ([`src/services/api.ts`](../src/services/api.ts))

### Request interceptor

```typescript
// Inyecta Authorization: Bearer <token> en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Response interceptor (manejo de 401)

```
Request → 401
  ├── ¿Es /auth/login o /auth/refresh? → rechazar (no reintentar)
  ├── ¿Ya se reintentó (_retry)? → rechazar
  ├── ¿Ya hay un refresh en curso?
  │    └── Sí → encolar request, esperar nuevo token
  │    └── No → marcar _retry = true
  │         ├── POST /auth/refresh con refresh_token
  │         ├── Guardar nuevos tokens en localStorage
  │         ├── Reintentar request original
  │         └── Si falla → limpiar storage, redirect a /login
```

## Roles

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `usuario` | Paciente del programa | `/dashboard`, `/lectura`, `/preguntas` |
| `admin_negocio` | Admin de sucursal(es) | Admin routes (limitado a sus tiendas) |
| `admin_general` | Admin con acceso total | Admin routes (crea sucursales, admins) |

El `rol` se recibe en el login/register y se actualiza vía `GET /auth/profile` en cada inicialización.

## Referencias

- Guard que usa `isAdmin`: [`AdminRoute`](02-routing.md)
- Servicio auth: [`auth.service.ts`](04-servicios-api.md)
- Tipos: [`api.types.ts`](../src/types/api.types.md)
