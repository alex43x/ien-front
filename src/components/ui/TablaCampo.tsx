import type { CampoRespuesta, ValorTabla } from "@/types/api.types";
import { useGray, type ToneColors } from "@/hooks/useToneColors";

interface Props {
  campo: CampoRespuesta;
  valor?: ValorTabla;
  onChange?: (v: ValorTabla) => void;
  readOnly?: boolean;
  tone: ToneColors;
  /** Respuesta en formato viejo (string) para mostrar como cita */
  legacyTexto?: string;
}

export function filaVacia(campo: CampoRespuesta): Record<string, any> {
  return Object.fromEntries(
    (campo.columnas ?? []).map(col => [col.id, col.tipo === "escala" ? (col.min ?? 1) : ""])
  );
}

export function valorInicial(campo: CampoRespuesta): ValorTabla {
  return Array.from({ length: campo.filas ?? 0 }, () => filaVacia(campo));
}

export function tablaCompleta(campo: CampoRespuesta, valor: ValorTabla | undefined): boolean {
  if ((campo.requerido ?? "todas") === "ninguna") return true;
  if (!Array.isArray(valor) || valor.length < (campo.filas ?? 0)) return false;
  return valor.every(fila =>
    (campo.columnas ?? []).every(col => {
      const v = fila?.[col.id];
      return col.tipo === "escala" ? v !== undefined && v !== null : String(v ?? "").trim().length > 0;
    })
  );
}

/** Respuesta en formato viejo (texto plano guardado antes de la migración) */
export function esLegacy(valor: any): boolean {
  return typeof valor === "string";
}

interface CellProps {
  col: NonNullable<CampoRespuesta["columnas"]>[number];
  value: any;
  readOnly: boolean;
  tone: ToneColors;
  onSet: (v: any) => void;
  compacto?: boolean;
  conLabel?: boolean;
}

function Celda({ col, value, readOnly, tone, onSet, compacto = false, conLabel = false }: CellProps) {
  const gray = useGray();

  if (col.tipo === "escala") {
    const min = col.min ?? 1;
    const max = col.max ?? 10;
    const val = typeof value === "number" ? value : min;
    const pct = ((val - min) / (max - min)) * 100;
    return (
      <div className={conLabel ? "space-y-1.5" : "flex items-center gap-2"}>
        {conLabel && <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{col.etiqueta}</p>}
        {readOnly ? (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: tone.bg }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tone.color }} />
            </div>
            <span className="text-xs font-mono font-bold w-5 text-right" style={{ color: tone.color }}>{val}</span>
          </div>
        ) : (
          <div className={`flex items-center gap-2 ${conLabel ? "w-full" : ""}`}>
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={val}
              onChange={e => onSet(Number(e.target.value))}
              className="flex-1 h-1.5 cursor-pointer"
              style={{ accentColor: tone.color }}
              aria-label={col.etiqueta}
            />
            <span
              className={`font-mono font-bold text-center rounded-md flex-shrink-0 ${compacto ? "w-6 text-[11px] py-0.5" : "w-7 text-xs py-1"}`}
              style={{ backgroundColor: tone.soft, color: tone.color }}
            >
              {val}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (readOnly) {
    return (
      <span className={`text-sm text-foreground leading-relaxed ${col.tipo === "numero" ? "font-mono" : ""}`}>
        {String(value ?? "—")}
      </span>
    );
  }

  return (
    <input
      type={col.tipo === "numero" ? "number" : "text"}
      value={value ?? ""}
      onChange={e => onSet(col.tipo === "numero" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
      placeholder={col.etiqueta}
      aria-label={col.etiqueta}
      className={`w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 px-2.5 outline-none transition-all focus:shadow-sm ${
        col.tipo === "numero" ? "font-mono text-right" : ""
      } ${compacto ? "py-1.5" : "py-2"}`}
      style={{ borderColor: gray.light }}
      onFocus={e => (e.currentTarget.style.borderColor = tone.color)}
      onBlur={e => (e.currentTarget.style.borderColor = gray.light)}
    />
  );
}

export default function TablaCampo({ campo, valor, onChange, readOnly = false, tone, legacyTexto }: Props) {
  const columnas = campo.columnas ?? [];
  const nFilas = campo.filas ?? 0;
  const filas: ValorTabla = Array.isArray(valor) && valor.length
    ? Array.from({ length: nFilas }, (_, i) => ({ ...filaVacia(campo), ...(valor[i] ?? {}) }))
    : valorInicial(campo);

  const setCell = (i: number, colId: string, v: any) => {
    if (!onChange || readOnly) return;
    const next = filas.map((fila, idx) => (idx === i ? { ...fila, [colId]: v } : fila));
    onChange(next);
  };

  const gridCols = columnas
    .map(col => (col.tipo === "escala" ? "minmax(120px, 1.2fr)" : col.tipo === "numero" ? "64px" : "minmax(0, 1fr)"))
    .join(" ");

  if (legacyTexto !== undefined && esLegacy(legacyTexto)) {
    return (
      <div
        className="rounded-xl p-3 text-sm italic text-muted-foreground leading-relaxed"
        style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}
      >
        "{legacyTexto}"
      </div>
    );
  }

  return (
    <div>
      {/* Tabla (sm+) */}
      <div className="hidden sm:block">
        <div className="grid gap-2 px-1 pb-1.5" style={{ gridTemplateColumns: gridCols }}>
          {columnas.map(col => (
            <p key={col.id} className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
              {col.etiqueta}
            </p>
          ))}
        </div>
        <div className="space-y-1.5">
          {filas.map((fila, i) => (
            <div
              key={i}
              className="grid gap-2 items-center p-2 rounded-xl"
              style={{ gridTemplateColumns: gridCols, backgroundColor: i % 2 === 0 ? tone.bg : "transparent" }}
            >
              {columnas.map(col => (
                <Celda
                  key={col.id}
                  col={col}
                  value={fila[col.id]}
                  readOnly={readOnly}
                  tone={tone}
                  onSet={v => setCell(i, col.id, v)}
                  compacto
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tarjetas por fila (móvil) */}
      <div className="sm:hidden space-y-3">
        {filas.map((fila, i) => (
          <div key={i} className="rounded-xl border p-3 space-y-3" style={{ borderColor: tone.border, backgroundColor: tone.bg }}>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: tone.color }}>
              {i + 1} / {nFilas}
            </p>
            {columnas.map(col => (
              <Celda
                key={col.id}
                col={col}
                value={fila[col.id]}
                readOnly={readOnly}
                tone={tone}
                onSet={v => setCell(i, col.id, v)}
                conLabel
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
