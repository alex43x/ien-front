import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Users,
  ClipboardList,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import type { AdminMetrics, GraficaSemanal, ReportesUsuarios, PaginacionPacientes } from "../types/api.types";

const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800" },
  green: { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860" },
  red: { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828" },
} as const;

type Tone = keyof typeof C;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics[]>([]);
  const [weeklyChart, setWeeklyChart] = useState<GraficaSemanal[]>([]);
  const [reportes, setReportes] = useState<ReportesUsuarios | null>(null);
  const [pacientes, setPacientes] = useState<PaginacionPacientes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, chartData, reportesData, pacientesData] = await Promise.all([
          adminService.getMetrics(),
          adminService.graficaSemanal(),
          adminService.reportesUsuarios(),
          adminService.listarPacientes(1, 5),
        ]);
        setMetrics(metricsData);
        setWeeklyChart(chartData);
        setReportes(reportesData);
        setPacientes(pacientesData);
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalUsuarios = metrics.reduce((s, m) => s + m.total_activaciones, 0);
  const activosTotales = metrics.reduce((s, m) => s + m.usuarios_activos, 0);
  const riesgoTotal = metrics.reduce((s, m) => s + m.usuarios_en_riesgo, 0);
  const promDia = metrics.length > 0 ? (metrics.reduce((s, m) => s + m.promedio_dia_progreso, 0) / metrics.length) : 0;

  const metricCards = [
    { label: "Usuarios activos", value: activosTotales.toString(), detail: `${reportes?.activos.hoy || 0} hoy`, tone: "green" as Tone, icon: Users },
    { label: "Total de usuarios", value: totalUsuarios.toString(), detail: `${reportes?.registrados.semanal || 0} nuevos esta semana`, tone: "yellow" as Tone, icon: Activity },
    { label: "Promedio día progreso", value: promDia.toFixed(1), detail: `en ${metrics.length} sucursales`, tone: "green" as Tone, icon: ClipboardList },
    { label: "Usuarios en riesgo", value: riesgoTotal.toString(), detail: "requieren atención", tone: "red" as Tone, icon: ShieldCheck },
  ];

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const chartData = weeklyChart.map((d) => ({ ...d, day: weekDays[new Date(d.fecha + "T00:00:00").getDay()] }));

  const statusColor = (estado: string) => {
    if (estado === "activo") return { bg: C.green.bg, text: C.green.text };
    if (estado === "completado") return { bg: C.yellow.bg, text: C.yellow.text };
    return { bg: C.red.bg, text: C.red.text };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const tone = C[metric.tone];
          return (
            <div key={metric.label} className="rounded-3xl p-5 bg-white border border-[rgba(62,58,56,0.09)] shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">{metric.label}</p>
                  <p className="mt-3 text-3xl font-['Lora'] font-semibold text-[#3E3A38]">{metric.value}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: tone.soft, color: tone.color }}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-xs text-[#7A7270]">{metric.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.1fr] gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Tendencia semanal</p>
                <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Actividad de usuarios</h2>
              </div>
              <div className="text-sm text-[#7A7270] font-mono">Últimos 7 días</div>
            </div>
            <div className="h-[260px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,58,56,0.06)" />
                    <XAxis dataKey="day" tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                    <YAxis tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(62,58,56,0.1)", borderRadius: 10, fontSize: 11, fontFamily: "DM Mono" }} />
                    <Area type="monotone" dataKey="cantidad" name="Actividad" stroke={C.green.color} fill={C.green.color} fillOpacity={0.16} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-[#7A7270]">Sin datos disponibles</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Resumen por sucursal</p>
                <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Métricas por tienda</h2>
              </div>
            </div>
            <div className="space-y-4">
              {metrics.length === 0 ? (
                <p className="text-sm text-[#7A7270]">No hay métricas disponibles</p>
              ) : (
                metrics.slice(0, 5).map((m) => (
                  <div key={m.tienda_id} className="rounded-2xl bg-[#F7F5F4] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[#3E3A38]">{m.nombre_tienda}</span>
                      <span className="text-xs font-mono text-[#7A7270]">{m.ciudad}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-[#7A7270]">
                      <span>Activos: {m.usuarios_activos}</span>
                      <span>Completados: {m.completados}</span>
                      <span>Racha prom: {m.racha_promedio.toFixed(1)}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#E8E4E2] overflow-hidden">
                      <div className="h-full rounded-full bg-[#4DAAA0]" style={{ width: `${Math.min((m.usuarios_activos / Math.max(m.total_activaciones, 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Resumen rápido</p>
            <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Indicadores generales</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Usuarios registrados", value: reportes?.registrados.total.toString() || "0" },
              { label: "Planes activos", value: reportes?.activos.total.toString() || "0" },
              { label: "Nuevos hoy", value: reportes?.registrados.hoy.toString() || "0" },
              { label: "Activos hoy", value: reportes?.activos.hoy.toString() || "0" },
              { label: "Usuarios en riesgo", value: riesgoTotal.toString() },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-[#F7F5F4] p-4">
                <p className="text-xs text-[#7A7270] uppercase tracking-wider font-mono">{item.label}</p>
                <p className="mt-3 text-2xl font-['Lora'] font-semibold text-[#3E3A38]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Pacientes recientes</p>
            <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Actividad y registros</h2>
          </div>
          <button
            onClick={() => navigate("/admin/pacientes")}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold text-[#4DAAA0]"
            style={{ borderColor: C.green.border }}
          >
            Ver todo <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#3E3A38]">
            <thead>
              <tr className="border-b border-[rgba(62,58,56,0.08)] text-[10px] uppercase tracking-wider text-[#7A7270]">
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Día actual</th>
                <th className="py-3 px-4">Racha</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(62,58,56,0.08)]">
              {pacientes?.pacientes.map((p) => {
                const sc = p.plan ? statusColor(p.plan.estado) : { bg: C.red.bg, text: C.red.text };
                return (
                  <tr key={p.id} className="cursor-pointer hover:bg-[#F7F5F4]" onClick={() => navigate(`/admin/pacientes/${p.id}`)}>
                    <td className="py-4 px-4 font-medium">{p.nombre}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.email}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.plan?.dia_actual || "-"}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{p.plan?.racha_dias || "-"}</td>
                    <td className="py-4 px-4">
                      {p.plan ? (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {p.plan.estado}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold bg-[#F0EDEC] text-[#7A7270]">Sin plan</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(!pacientes || pacientes.pacientes.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[#7A7270]">No hay pacientes registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
