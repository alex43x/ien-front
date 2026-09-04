import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import type { GrupoDocument } from "../../types/api.types";

interface GroupSelectProps {
  value: string;
  onChange: (grupoId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function GroupSelect({ value, onChange, disabled, required }: GroupSelectProps) {
  const [grupos, setGrupos] = useState<GrupoDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .listarGrupos()
      .then(setGrupos)
      .catch((err) => console.error("Error fetching grupos", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        Cargando grupos...
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
    >
      <option value="">Seleccionar grupo</option>
      {grupos.map((g) => (
        <option key={g._id} value={g._id}>{g.nombre}</option>
      ))}
    </select>
  );
}