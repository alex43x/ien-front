import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import type { TestInicialResponse } from "@/types/api.types";
import { useToneColors, useGray } from "@/hooks/useToneColors";

interface Props {
  data: TestInicialResponse;
  compact?: boolean;
}

const MAX_SCORE = 25;

export default function TestInicialResultados({ data, compact = false }: Props) {
  const [respuestasOpen, setRespuestasOpen] = useState(false);
  const redTone = useToneColors("red");
  const greenTone = useToneColors("green");
  const yellowTone = useToneColors("yellow");
  const gray = useGray();

  const puntuaciones = data.puntuaciones_por_competencia ?? [];
  const respuestas = data.respuestas ?? [];
  const competenciasMejorar = data.competencias_a_mejorar ?? [];

  const scoreColor = (score: number) => {
    if (score < 20) return redTone;
    if (score >= 22) return greenTone;
    return yellowTone;
  };

  return (
    <div className="space-y-4">
      {/* Resumen por competencia */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Test Inicial</p>
          {data.fecha_completado && (
            <p className="text-[10px] font-mono text-muted-foreground">
              {new Date(data.fecha_completado).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        <p className="font-['Lora'] text-base font-semibold text-foreground">Puntuaciones por competencia</p>

        <div className="mt-4 space-y-3.5">
          {puntuaciones.map((p) => {
            const pct = Math.round((p.puntuacion / MAX_SCORE) * 100);
            const color = scoreColor(p.puntuacion);
            return (
              <div key={p.competencia}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{p.competencia_label}</p>
                  <p className="text-xs font-mono font-semibold" style={{ color: color.color }}>
                    {p.puntuacion}/{MAX_SCORE}
                  </p>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: gray.light }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {competenciasMejorar.length > 0 && (
          <div className="mt-4 rounded-xl p-3 flex items-start gap-2.5" style={{ backgroundColor: yellowTone.bg }}>
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: yellowTone.color }} />
            <div>
              <p className="text-xs font-semibold text-foreground">Áreas a mejorar</p>
              <p className="text-xs text-muted-foreground mt-0.5">{competenciasMejorar.join(", ")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Respuestas individuales (expandible) */}
      {!compact && respuestas.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card transition-colors"
            onClick={() => setRespuestasOpen(!respuestasOpen)}
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Detalle</p>
              <p className="font-['Lora'] text-sm font-semibold text-foreground mt-0.5">
                Respuestas individuales ({respuestas.length} preguntas)
              </p>
            </div>
            {respuestasOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>

          {respuestasOpen && (
            <div className="border-t border-border px-5 pb-5">
              <div className="divide-y divide-border">
                {respuestas.map((r) => {
                  const color = scoreColor(r.score * 5);
                  return (
                    <div key={r.pregunta_numero} className="py-3.5 first:pt-4 last:pb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-semibold mt-0.5"
                          style={{ backgroundColor: color.bg, color: color.color }}
                        >
                          {r.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">{r.texto}</p>
                          <p className="text-[10px] font-mono mt-1" style={{ color: color.color }}>
                            {r.competencia_label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}