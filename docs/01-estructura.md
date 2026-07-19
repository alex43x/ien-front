# Estructura del proyecto

```
frontend/
├── index.html                  # HTML entry point
├── package.json                # Dependencias y scripts
├── vite.config.ts              # Configuración de Vite + plugins
├── tsconfig.json               # TypeScript (strict, alias @/)
├── postcss.config.mjs          # PostCSS (vacío, Tailwind v4 auto-configura)
├── .env                        # VITE_API_URL=http://localhost:3000/api
│
├── src/
│   ├── main.tsx                # Punto de entrada (renderiza <App />)
│   ├── vite-env.d.ts           # Declaraciones Vite (import.meta.env)
│   │
│   ├── app/                    # Páginas (rutas de la aplicación)
│   │   ├── App.tsx             # Provider root: AuthProvider + RouterProvider
│   │   ├── routes.tsx          # Definición de todas las rutas (createBrowserRouter)
│   │   ├── Login.tsx           # Inicio de sesión
│   │   ├── Register.tsx        # Registro (nombre, email, password) → navega a /activar
│   │   ├── Dashboard.tsx       # Dashboard del paciente (envuelto en PatientLayout)
│   │   ├── Bienvenida.tsx      # Onboarding post-activación
│   │   ├── Activar.tsx         # Activación con código XXX-002 + CodeInput
│   │   ├── Lectura.tsx         # Lectura diaria (acepta returnTo para back-nav)
│   │   ├── Preguntas.tsx       # Test diagnóstico
│   │   ├── AdminDashboard.tsx  # Dashboard admin (métricas reales)
│   │   ├── AdminPatients.tsx   # CRUD pacientes (paginated + search)
│   │   ├── AdminPatientDetail.tsx # Perfil + progreso detallado
│   │   ├── AdminReports.tsx    # Reportes con gráficas
│   │   ├── AdminStores.tsx     # CRUD sucursales
│   │   ├── AdminProducts.tsx   # CRUD productos
│   │   ├── AdminCodes.tsx      # CRUD códigos (card layout + CodeInput + selector producto)
│   │   ├── AdminEmails.tsx     # Previsualización de plantillas de correo
│   │   ├── AdminUsuarios.tsx   # CRUD admins de negocio y moderadores de tienda
│   │   └── BloqueIntro.tsx     # Intro de bloque (especial: día 1, 15, 30)
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── ProtectedRoute.tsx  # Guard: solo autenticados
│   │   ├── AdminRoute.tsx      # Guard: solo admin_general / admin_negocio
│   │   ├── PublicRoute.tsx     # Guard: solo público
│   │   ├── CodeInput.tsx       # Input guiado XXX-000 (3 letras + 3 dígitos)
│   │   └── layout/
│   │       ├── AdminLayout.tsx   # Layout con sidebar para admin
│   │       ├── PatientLayout.tsx # Layout para paciente (bandeja perfil + header)
│   │       ├── PageShell.tsx     # Wrapper de página
│   │       └── PageHeader.tsx    # Header con botón de retroceso
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Estado global de autenticación
│   │
│   ├── services/               # Capa HTTP
│   │   ├── api.ts              # Instancia axios + interceptor JWT
│   │   ├── auth.service.ts     # Endpoints /auth/*
│   │   ├── admin.service.ts    # Endpoints /admin/*
│   │   ├── plan.service.ts     # Endpoints /plan/*
│   │   └── jobs.service.ts     # Endpoints /jobs/*
│   │
│   ├── types/
│   │   ├── api.types.ts        # Interfaces de request/response
│   │   └── index.ts            # Re-export de tipos
│   │
│   ├── constants/
│   │   ├── colors.ts           # Paleta de colores (C.yellow, C.green, C.red)
│   │   └── program.ts          # Definición de los 6 bloques del programa
│   │
│   ├── emails/                 # Plantillas de correo transaccionales
│   │   ├── base.ts             # Helpers compartidos (wrap, header, footer, card, btn, etc.)
│   │   ├── bienvenida.ts       # Email de bienvenida (día 0)
│   │   ├── hito.ts             # Hitos semanales (días 7, 14, 21, 28)
│   │   ├── recordatorioDiario.ts
│   │   ├── rachaRota.ts
│   │   ├── urgenciaActivacion.ts
│   │   ├── recuperacionInactividad.ts
│   │   ├── recuperacionContrasena.ts
│   │   └── index.ts            # Re-export + ALL_TEMPLATES array
│   │
│   ├── content/
│   │   └── readings.ts         # Datos de ejemplo para lecturas
│   │
│   ├── styles/
│   │   ├── index.css           # Agregador: importa todos los CSS
│   │   ├── tailwind.css        # @import "tailwindcss" + tw-animate-css
│   │   ├── theme.css           # @theme inline (custom properties)
│   │   ├── globals.css         # @keyframes (ien-blink)
│   │   └── fonts.css           # Google Fonts
│   │
│   └── imports/                # Assets estáticos
│       └── logo_ien-03.png
│
├── dist/                       # Build de producción
└── docs/                       # Documentación
```

## Convenciones de nombres

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Páginas | PascalCase | `AdminDashboard.tsx` |
| Componentes | PascalCase | `ProtectedRoute.tsx` |
| Servicios | kebab-case + .service | `admin.service.ts` |
| Constantes | camelCase | `colors.ts` |
| Tipos | PascalCase (interface) | `AdminMetrics` |
| Estilos | kebab-case | `tailwind.css` |
| Emails | camelCase | `recordatorioDiario.ts` |
| Carpeta de páginas | `app/` | |
| Carpeta de componentes | `components/` | |
| Carpeta de emails | `emails/` | |

## Referencias cruzadas

- Las páginas en `app/` son renderizadas según la configuración de [`routes.tsx`](02-routing.md)
- Los guards (`ProtectedRoute`, `AdminRoute`) se describen en [routing](02-routing.md)
- `AuthContext` se consume en guards y páginas — ver [autenticación](03-autenticacion.md)
- Los servicios se importan en las páginas — ver [servicios API](04-servicios-api.md)
- Los tipos se usan en servicios y páginas — ver [tipos](05-tipos.md)
- Las plantillas de correo se usan en admin preview y backend — ver [emails/](../src/emails/)
