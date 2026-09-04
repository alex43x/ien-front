import type { TablaInfoDatos } from "@/types/api.types";
import { useGray } from "@/hooks/useToneColors";

interface Props {
  tabla: TablaInfoDatos;
}

export default function TablaInfo({ tabla }: Props) {
  const gray = useGray();
  if (!tabla?.filas?.length) return null;
  return (
    <div>
      {tabla.titulo && (
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          {tabla.titulo}
        </p>
      )}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: gray.light }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: gray.faint }}>
              {tabla.columnas.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  {col.etiqueta}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.filas.map((fila, i) => (
              <tr key={i} className={i > 0 ? "border-t" : ""} style={{ borderColor: gray.light }}>
                {fila.map((celda, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2.5 align-top leading-relaxed ${
                      j === 0 ? "text-[13px] font-medium text-foreground" : "text-sm text-muted-foreground"
                    }`}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
