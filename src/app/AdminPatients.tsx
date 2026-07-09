import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { PaginacionPacientes } from "../types/api.types";
import { C } from "../constants/colors";

export default function AdminPatients() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginacionPacientes | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const result = await adminService.listarPacientes(page, limit);
        setData(result);
      } catch (err) {
        console.error("Error fetching patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [page]);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const statusColor = (estado: string) => {
    if (estado === "activo") return { bg: C.green.bg, text: C.green.text, label: "Activo" };
    if (estado === "completado") return { bg: C.yellow.bg, text: C.yellow.text, label: "Completado" };
    if (estado === "abandonado") return { bg: C.red.bg, text: C.red.text, label: "Abandonado" };
    return { bg: C.red.bg, text: C.red.text, label: "Sin plan" };
  };

  const filtered = data?.pacientes.filter((p) =>
    search ? p.nombre.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()) : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Gestión</p>
          <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38] mt-1">Pacientes</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#7A7270]">
          <Users size={16} />
          <span>{data?.total || 0} registrados</span>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7270]" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-[#E0DAD4] bg-white pl-10 pr-4 py-3 text-sm text-[#3E3A38] placeholder-[#C0BCBA] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
        />
      </div>

      <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#3E3A38]">
            <thead>
              <tr className="border-b border-[rgba(62,58,56,0.08)] bg-[#F7F5F4] text-[10px] uppercase tracking-wider text-[#7A7270]">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4">Registro</th>
                <th className="py-3 px-4">Día</th>
                <th className="py-3 px-4">Racha</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(62,58,56,0.08)]">
              {filtered?.map((p) => {
                const sc = p.plan ? statusColor(p.plan.estado) : statusColor("");
                return (
                  <tr
                    key={p.id}
                    className="cursor-pointer hover:bg-[#F7F5F4] transition-colors"
                    onClick={() => navigate(`/admin/pacientes/${p.id}`)}
                  >
                    <td className="py-4 px-4 font-medium">{p.nombre}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.email}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.tienda?.nombre || "-"}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{new Date(p.fecha_registro).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.plan?.dia_actual || "-"}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.plan?.racha_dias || "-"}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!filtered || filtered.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-[#7A7270]">No se encontraron pacientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#7A7270]">Página {page} de {totalPages}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-xl border border-[rgba(62,58,56,0.09)] p-2 text-[#7A7270] hover:bg-[#F0EDEC] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const start = Math.max(1, page - 2);
            const p = start + i;
            if (p > totalPages) return null;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-xl text-sm font-medium ${p === page ? "bg-[#4DAAA0] text-white" : "text-[#7A7270] hover:bg-[#F0EDEC]"}`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-xl border border-[rgba(62,58,56,0.09)] p-2 text-[#7A7270] hover:bg-[#F0EDEC] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
