import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import { BLOCKS } from "@/constants/program";
import type { Block } from "@/constants/program";
import type { DiaPlan } from "@/types/api.types";
import { useToneColors, useGray, type ToneColors, type GrayColors } from "@/hooks/useToneColors";

interface Props {
  dias: DiaPlan[];
}

function getBlockForDay(dayNum: number) {
  return BLOCKS.find(b => dayNum >= b.start && dayNum <= b.end) ?? BLOCKS[0];
}

function renderValorCampo(campo: { id: string; valor: any; tipo: string }, toneColor: string, greenColor: string, greenText: string, grayMid: string, grayLight: string, grayFaint: string) {
  if (campo.tipo === "escala") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: grayLight }}>
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
        className="rounded-xl p-3 text-sm text-muted-foreground leading-relaxed italic"
        style={{ backgroundColor: grayFaint, borderLeft: `3px solid ${toneColor}` }}
      >
        &ldquo;{campo.valor}&rdquo;
      </div>
    );
  }
  if (campo.tipo === "accion") {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 size={14} style={{ color: campo.valor ? greenColor : grayMid }} />
        <span className="text-xs font-medium" style={{ color: campo.valor ? greenText : grayMid }}>
          {campo.valor ? "Completado" : "No completado"}
        </span>
      </div>
    );
  }
  return <span className="text-sm text-muted-foreground">{String(campo.valor)}</span>;
}

function BlockFilterButton({ block, count, isSelected, onClick }: { block: Block; count: number; isSelected: boolean; onClick: () => void }) {
  const bc = useToneColors(block.tone);
  const Icon = block.icon;
  return (
    <button
      onClick={onClick}
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
      {block.title} ({count})
    </button>
  );
}

function DayCard({ dia, block, isExpanded, onToggle, greenTone, gray }: { dia: DiaPlan; block: Block; isExpanded: boolean; onToggle: () => void; greenTone: ToneColors; gray: GrayColors }) {
  const bc = useToneColors(block.tone);
  const navigate = useNavigate();
  const tieneRespuestas = dia.respuesta_usuario && dia.respuesta_usuario.length > 0;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-card transition-colors"
        onClick={onToggle}
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
            <p className="text-sm font-semibold text-foreground truncate">
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
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
              {new Date(dia.fecha_completado).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {tieneRespuestas && (
            <span className="text-[10px] font-mono text-muted-foreground">
              {dia.respuesta_usuario!.length} resp.
            </span>
          )}
          <CheckCircle2 size={14} style={{ color: greenTone.color }} />
          {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          {dia.leccion?.datos_leccion?.concepto && (
            <div
              className="rounded-xl p-3 mb-4"
              style={{ backgroundColor: bc.bg, borderLeft: `3px solid ${bc.color}` }}
            >
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: bc.text }}>Concepto</p>
              <p className="text-sm italic text-foreground leading-relaxed">
                {dia.leccion.datos_leccion.concepto}
              </p>
            </div>
          )}

          {tieneRespuestas && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Respuestas</p>
              {dia.respuesta_usuario!.map((r, i) => {
                const campo = dia.leccion?.campos_respuesta?.find(c => c.id === r.id);
                const pasoTexto = dia.leccion?.datos_leccion?.ejercicio?.pasos?.[i]?.texto;
                const etiqueta = campo?.etiqueta || pasoTexto || `Paso ${i + 1}`;
                return (
                  <div key={i}>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{etiqueta}</p>
                    {renderValorCampo(r, bc.color, greenTone.color, greenTone.text, gray.mid, gray.light, gray.faint)}
                  </div>
                );
              })}
            </div>
          )}

          {!tieneRespuestas && (
            <p className="text-xs text-muted-foreground text-center py-2">Sin respuestas registradas</p>
          )}

          {dia.leccion && (
            <button
              onClick={() => navigate(`/lectura/${dia.dia_numero}`, { state: { leccion: dia.leccion, savedAnswers: dia.respuesta_usuario, returnTo: window.location.pathname } })}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: bc.bg, color: bc.text }}
            >
              <ExternalLink size={13} />
              Ver lección completa
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActividadesDiariasLista({ dias }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const greenTone = useToneColors("green");
  const gray = useGray();

  const completados = dias.filter(d => d.completado);

  const bloquesConDias = BLOCKS.filter(b =>
    completados.some(d => d.dia_numero >= b.start && d.dia_numero <= b.end)
  );

  const diasFiltrados = selectedBlock !== null
    ? completados.filter(d => d.dia_numero >= selectedBlock.start && d.dia_numero <= selectedBlock.end)
    : completados;

  if (completados.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 shadow-sm text-center">
        <BookOpen size={28} className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Aún no hay actividades completadas</p>
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
              ? "bg-foreground text-background shadow-sm"
              : "bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          Todos ({completados.length})
        </button>
        {bloquesConDias.map(b => (
          <BlockFilterButton
            key={b.id}
            block={b}
            count={completados.filter(d => d.dia_numero >= b.start && d.dia_numero <= b.end).length}
            isSelected={selectedBlock?.id === b.id}
            onClick={() => setSelectedBlock(selectedBlock?.id === b.id ? null : b)}
          />
        ))}
      </div>

      {/* Day list */}
      <div className="space-y-2">
        {diasFiltrados.map((dia) => {
          const block = getBlockForDay(dia.dia_numero);
          return (
            <DayCard
              key={dia.dia_numero}
              dia={dia}
              block={block}
              isExpanded={expandedDay === dia.dia_numero}
              onToggle={() => setExpandedDay(expandedDay === dia.dia_numero ? null : dia.dia_numero)}
              greenTone={greenTone}
              gray={gray}
            />
          );
        })}

        {diasFiltrados.length === 0 && selectedBlock !== null && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No hay actividades completadas en este bloque</p>
          </div>
        )}
      </div>
    </div>
  );
}
