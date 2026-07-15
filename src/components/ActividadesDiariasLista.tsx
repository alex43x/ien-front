import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, BookOpen } from "lucide-react";
import { C, GRAY } from "@/constants/colors";
import { BLOCKS } from "@/constants/program";
import type { Block } from "@/constants/program";
import type { DiaPlan } from "@/types/api.types";

interface Props {
  dias: DiaPlan[];
}

function getBlockForDay(dayNum: number) {
  return BLOCKS.find(b => dayNum >= b.start && dayNum <= b.end) ?? BLOCKS[0];
}

function renderValorCampo(campo: { id: string; valor: any; tipo: string }, toneColor: string) {
  if (campo.tipo === "escala") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: GRAY.light }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${((campo.valor as number) / 10) * 100}%`, backgroundColor: toneColor }}
          />
        </div>
        <span className="text-xs font-mono font-semibold" style={{ color: toneColor }}>
          {campo.valor}
        </span>
      </div>
    );
  }
  if (campo.tipo === "texto" || campo.tipo === "reflexion") {
    return (
      <div
        className="rounded-xl p-3 text-sm text-[#4A4644] leading-relaxed italic"
        style={{ backgroundColor: GRAY.faint, borderLeft: `3px solid ${toneColor}` }}
      >
        "{campo.valor}"
      </div>
    );
  }
  if (campo.tipo === "actividad") {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 size={14} style={{ color: campo.valor ? C.green.color : GRAY.mid }} />
        <span className="text-xs font-medium" style={{ color: campo.valor ? C.green.text : GRAY.mid }}>
          {campo.valor ? "Completado" : "No completado"}
        </span>
      </div>
    );
  }
  return <span className="text-sm text-[#4A4644]">{String(campo.valor)}</span>;
}

export default function ActividadesDiariasLista({ dias }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const completados = dias.filter(d => d.completado);

  const bloquesConDias = BLOCKS.filter(b =>
    completados.some(d => d.dia_numero >= b.start && d.dia_numero <= b.end)
  );

  const diasFiltrados = selectedBlock !== null
    ? completados.filter(d => d.dia_numero >= selectedBlock.start && d.dia_numero <= selectedBlock.end)
    : completados;

  if (completados.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-8 shadow-sm text-center">
        <BookOpen size={28} className="mx-auto mb-3 text-[#7A7270]" />
        <p className="text-sm text-[#7A7270]">Aún no hay actividades completadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Block filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedBlock(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedBlock === null
              ? "bg-[#3E3A38] text-white shadow-sm"
              : "bg-[#F7F5F4] text-[#7A7270] hover:bg-[#E8E4E2]"
          }`}
        >
          Todos ({completados.length})
        </button>
        {bloquesConDias.map(b => {
          const count = completados.filter(d => d.dia_numero >= b.start && d.dia_numero <= b.end).length;
          const bc = C[b.tone];
          const isSelected = selectedBlock?.id === b.id;
          const Icon = b.icon;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBlock(isSelected ? null : b)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? "text-white shadow-sm"
                  : "hover:opacity-80"
              }`}
              style={{
                backgroundColor: isSelected ? bc.color : bc.bg,
                color: isSelected ? "white" : bc.text,
              }}
            >
              <Icon size={12} />
              {b.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Day list */}
      <div className="space-y-2">
        {diasFiltrados.map((dia) => {
          const block = getBlockForDay(dia.dia_numero);
          const bc = C[block.tone];
          const isExpanded = expandedDay === dia.dia_numero;
          const tieneRespuestas = dia.respuesta_usuario && dia.respuesta_usuario.length > 0;

          return (
            <div
              key={dia.dia_numero}
              className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#FCFAF8] transition-colors"
                onClick={() => setExpandedDay(isExpanded ? null : dia.dia_numero)}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bc.soft }}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: bc.color }}>
                    {dia.dia_numero}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#3E3A38] truncate">
                      {dia.leccion?.titulo || `Día ${dia.dia_numero}`}
                    </p>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: bc.soft, color: bc.color }}
                    >
                      {block.title}
                    </span>
                  </div>
                  {dia.fecha_completado && (
                    <p className="text-[10px] font-mono text-[#7A7270] mt-0.5">
                      {new Date(dia.fecha_completado).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {tieneRespuestas && (
                    <span className="text-[10px] font-mono text-[#7A7270]">
                      {dia.respuesta_usuario!.length} resp.
                    </span>
                  )}
                  <CheckCircle2 size={14} style={{ color: C.green.color }} />
                  {isExpanded ? <ChevronUp size={14} className="text-[#7A7270]" /> : <ChevronDown size={14} className="text-[#7A7270]" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[rgba(62,58,56,0.09)] px-5 pb-5 pt-4">
                  {dia.leccion?.datos_leccion?.concepto && (
                    <div
                      className="rounded-xl p-3 mb-4"
                      style={{ backgroundColor: bc.bg, borderLeft: `3px solid ${bc.color}` }}
                    >
                      <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: bc.text }}>Concepto</p>
                      <p className="text-sm italic text-[#3E3A38] leading-relaxed">
                        {dia.leccion.datos_leccion.concepto}
                      </p>
                    </div>
                  )}

                  {tieneRespuestas && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Respuestas</p>
                      {dia.respuesta_usuario!.map((r, i) => {
                        const campo = dia.leccion?.campos_respuesta?.find(c => c.id === r.id);
                        const etiqueta = campo?.etiqueta || r.id;
                        return (
                          <div key={i}>
                            <p className="text-xs font-medium text-[#7A7270] mb-1">{etiqueta}</p>
                            {renderValorCampo(r, bc.color)}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!tieneRespuestas && (
                    <p className="text-xs text-[#7A7270] text-center py-2">Sin respuestas registradas</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {diasFiltrados.length === 0 && selectedBlock !== null && (
          <div className="text-center py-6">
            <p className="text-sm text-[#7A7270]">No hay actividades completadas en este bloque</p>
          </div>
        )}
      </div>
    </div>
  );
}
