import type { SeccionLeccion } from "@/types/api.types";
import type { ToneColors } from "@/hooks/useToneColors";

interface Props {
  secciones: SeccionLeccion[];
  tone: ToneColors;
  /** Variante compacta para tarjetas (ej. Principio Clave) */
  compacto?: boolean;
}

export default function Secciones({ secciones, tone, compacto = false }: Props) {
  if (!secciones?.length) return null;
  return (
    <div className={compacto ? "space-y-4" : "space-y-6"}>
      {secciones.map((sec, i) => (
        <section key={i}>
          {sec.titulo && (
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: tone.color }} />
              <h4 className={`font-semibold text-foreground leading-snug ${compacto ? "text-[13px]" : "text-sm"}`}>
                {sec.titulo}
              </h4>
            </div>
          )}
          {sec.parrafos?.map((p, j) => (
            <p
              key={j}
              className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0"
              style={{ fontFamily: "'Lora', serif", whiteSpace: "pre-line" }}
            >
              {p}
            </p>
          ))}
          {sec.lista && sec.lista.length > 0 && (
            <ul className="space-y-1.5 mt-2">
              {sec.lista.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span
                    className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tone.soft, boxShadow: `0 0 0 2px ${tone.bg}` }}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed flex-1">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
