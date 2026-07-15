import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { C, GRAY } from "@/constants/colors";
import type { TestInicialResponse } from "@/types/api.types";

interface Props {
  data: TestInicialResponse;
  compact?: boolean;
}

const MAX_SCORE = 25;

function scoreColor(score: number) {
  if (score < 20) return C.red;
  if (score >= 22) return C.green;
  return C.yellow;
}

export default function TestInicialResultados({ data, compact = false }: Props) {
  const [respuestasOpen, setRespuestasOpen] = useState(false);

  const puntuaciones = data.puntuaciones_por_competencia ?? [];
  const respuestas = data.respuestas ?? [];
  const competenciasMejorar = data.competencias_a_mejorar ?? [];

  return (
    <div className="space-y-4">
      {/* Resumen por competencia */}
      <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Test Inicial</p>
          {data.fecha_completado && (
            <p className="text-[10px] font-mono text-[#7A7270]">
              {new Date(data.fecha_completado).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        <p className="font-['Lora'] text-base font-semibold text-[#3E3A38]">Puntuaciones por competencia</p>

        <div className="mt-4 space-y-3.5">
          {puntuaciones.map((p) => {
            const pct = Math.round((p.puntuacion / MAX_SCORE) * 100);
            const color = scoreColor(p.puntuacion);
            return (
              <div key={p.competencia}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-[#3E3A38]">{p.competencia_label}</p>
                  <p className="text-xs font-mono font-semibold" style={{ color: color.color }}>
                    {p.puntuacion}/{MAX_SCORE}
                  </p>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: GRAY.light }}>
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
          <div className="mt-4 rounded-xl p-3 flex items-start gap-2.5" style={{ backgroundColor: C.yellow.bg }}>
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: C.yellow.color }} />
            <div>
              <p className="text-xs font-semibold text-[#3E3A38]">Áreas a mejorar</p>
              <p className="text-xs text-[#7A7270] mt-0.5">{competenciasMejorar.join(", ")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Respuestas individuales (expandible) */}
      {!compact && respuestas.length > 0 && (
        <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FCFAF8] transition-colors"
            onClick={() => setRespuestasOpen(!respuestasOpen)}
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Detalle</p>
              <p className="font-['Lora'] text-sm font-semibold text-[#3E3A38] mt-0.5">
                Respuestas individuales ({respuestas.length} preguntas)
              </p>
            </div>
            {respuestasOpen ? <ChevronUp size={16} className="text-[#7A7270]" /> : <ChevronDown size={16} className="text-[#7A7270]" />}
          </button>

          {respuestasOpen && (
            <div className="border-t border-[rgba(62,58,56,0.09)] px-5 pb-5">
              <div className="divide-y divide-[rgba(62,58,56,0.06)]">
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
                          <p className="text-sm text-[#3E3A38] leading-relaxed">{r.texto}</p>
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
