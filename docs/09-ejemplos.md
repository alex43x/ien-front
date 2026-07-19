# Ejemplos prácticos

## Cómo agregar una nueva ruta

### 1. Crear la página

```typescript
// src/app/MiPagina.tsx
import { useState, useEffect } from "react";
import { adminService } from "../services/admin.service";

export default function MiPagina() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.listarSucursales()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38]">Mi Página</h1>
      {/* contenido */}
    </div>
  );
}
```

### 2. Agregar la ruta

```typescript
// src/app/routes.tsx
import MiPagina from "./MiPagina";

// Si va dentro del admin:
{
  element: <AdminRoute />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: "/admin/mi-ruta", element: <MiPagina /> },
        // ...
      ],
    },
  ],
}

// Si va como ruta protegida normal (sin layout):
{
  element: <ProtectedRoute />,
  children: [
    { path: "/mi-ruta", element: <MiPagina /> },
  ],
}

// Si va dentro del PatientLayout (con header + bandeja perfil):
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

### 3. Agregar al sidebar (si es admin)

```typescript
// src/components/layout/AdminLayout.tsx
import { MiIcono } from "lucide-react";

const NAV_ITEMS = [
  // ... items existentes
  { label: "Mi Página", path: "/admin/mi-ruta", icon: MiIcono },
];
```

### 4. Agregar el tipo

```typescript
// src/types/api.types.ts
export interface MiTipo {
  id: string;
  nombre: string;
  // ...
}
```

## Cómo agregar un nuevo servicio API

### 1. Agregar el método al service existente

```typescript
// src/services/admin.service.ts
export const adminService = {
  // ... métodos existentes

  miEndpoint: async (param: string) => {
    const response = await api.get<MiTipo>(`/admin/mi-endpoint/${param}`);
    return response.data;
  },
};
```

### 2. Definir el tipo

```typescript
// src/types/api.types.ts
export interface MiTipo {
  // ...
}
```

## Cómo crear un nuevo componente reutilizable

```typescript
// src/components/MiComponente.tsx
import type { ReactNode } from "react";

interface MiComponenteProps {
  titulo: string;
  children: ReactNode;
  className?: string;
}

export default function MiComponente({ titulo, children, className = "" }: MiComponenteProps) {
  return (
    <div className={`bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5 ${className}`}>
      <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-2">{titulo}</p>
      {children}
    </div>
  );
}
```

Uso:

```typescript
<MiComponente titulo="Sección">
  <p className="text-[#3E3A38]">Contenido aquí</p>
</MiComponente>
```

## Patrón común: fetch + loading + error

```typescript
function MiComponente() {
  const [data, setData] = useState<Tipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await algunServicio.metodo();
        setData(result);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error mensaje={error} />;
  if (!data) return <Vacio />;
  return <Contenido data={data} />;
}
```

## Referencias

- [Estructura del proyecto](01-estructura.md)
- [Routing](02-routing.md)
- [Servicios API](04-servicios-api.md)
- [Tipos](05-tipos.md)
