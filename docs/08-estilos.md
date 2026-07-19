# Estilos

## Tailwind CSS v4

Se usa Tailwind CSS v4 con el plugin `@tailwindcss/vite`. No hay archivo `tailwind.config.js` — la configuración se hace con `@theme inline` en [`src/styles/theme.css`](../src/styles/theme.css).

## Paleta de colores ([`src/constants/colors.ts`](../src/constants/colors.ts))

```typescript
export const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828" },
};

export const GRAY = { base: "#3E3A38", mid: "#7A7270", light: "#E8E4E2", faint: "#F7F5F4" };
```

Uso típico en componentes:

```typescript
import { C } from "@/constants/colors";

<div style={{ backgroundColor: C.green.bg, border: `1px solid ${C.green.border}`, color: C.green.text }}>
  Activo
</div>
```

## Tipografía

| Font | Uso |
|------|-----|
| Inter (sans-serif) | UI general, labels, botones |
| Lora (serif) | Títulos, números grandes (metric cards) |
| DM Mono (monospace) | Datos, fechas, tablas |

Se cargan via Google Fonts en [`src/styles/fonts.css`](../src/styles/fonts.css).

## Archivos CSS

| Archivo | Contenido |
|---------|-----------|
| [`index.css`](../src/styles/index.css) | Importa todos los CSS |
| [`tailwind.css`](../src/styles/tailwind.css) | `@import "tailwindcss"` + `tw-animate-css` |
| [`theme.css`](../src/styles/theme.css) | CSS custom properties con `@theme inline` |
| [`globals.css`](../src/styles/globals.css) | Keyframe `ien-blink` |
| [`fonts.css`](../src/styles/fonts.css) | Google Fonts (Inter, Lora, DM Mono) |

## Convenciones de estilo

- Clases Tailwind inline, sin archivos CSS adicionales por componente
- El sistema de colores se importa desde `constants/colors.ts` como objetos
- Fondos de página: `bg-[#F7F5F4]` (gray faint)
- Bordes: `border-[rgba(62,58,56,0.09)]` (gray base con opacidad)
- Sombras sutiles en cards: `shadow-sm`
- Cards: `rounded-3xl` + `bg-white` + `border`
- Botones: `rounded-2xl` o `rounded-xl` según contexto
