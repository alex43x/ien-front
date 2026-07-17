import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Users, Activity, TrendingUp, Calendar } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { ReportesUsuarios, GraficaSemanal } from "../types/api.types";
import { C } from "../constants/colors";

export default function AdminReports() {
  const [reportes, setReportes] = useState<ReportesUsuarios | null>(null);
  const [chartData, setChartData] = useState<GraficaSemanal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, c] = await Promise.all([
          adminService.reportesUsuarios(),
          adminService.graficaSemanal(),
        ]);
        setReportes(r);
        setChartData(c);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const chartFormatted = chartData.map((d) => ({
    ...d,
    day: weekDays[new Date(d.fecha + "T00:00:00").getDay()],
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Reportes</p>
        <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">Usuarios y actividad</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Registrados (total)", value: reportes?.registrados.total.toString() || "0", icon: Users, tone: C.green },
          { label: "Registrados hoy", value: reportes?.registrados.hoy.toString() || "0", icon: Activity, tone: C.yellow },
          { label: "Registrados (semana)", value: reportes?.registrados.semanal.toString() || "0", icon: TrendingUp, tone: C.green },
          { label: "Planes activos (hoy)", value: reportes?.activos.hoy.toString() || "0", icon: Calendar, tone: C.green },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-card rounded-3xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="mt-3 text-3xl font-['Lora'] font-semibold text-foreground">{item.value}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: item.tone.soft, color: item.tone.color }}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-3xl border border-border p-5">
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Gráfica semanal</p>
            <h2 className="font-['Lora'] text-lg font-semibold text-foreground mt-1">Actividad diaria (7 días)</h2>
          </div>
          <div className="h-[280px]">
            {chartFormatted.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartFormatted} margin={{ top: 10, right: 20, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "DM Mono" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "DM Mono" }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11, fontFamily: "DM Mono" }} />
                  <Area type="monotone" dataKey="cantidad" name="Actividad" stroke={C.green.color} fill={C.green.color} fillOpacity={0.16} strokeWidth={2} dot={{ fill: C.green.color, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Sin datos disponibles</div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-5">
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Comparativa</p>
            <h2 className="font-['Lora'] text-lg font-semibold text-foreground mt-1">Registrados vs Activos</h2>
          </div>
          <div className="h-[280px]">
            {chartFormatted.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartFormatted} margin={{ top: 10, right: 20, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "DM Mono" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "DM Mono" }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11, fontFamily: "DM Mono" }} />
                  <Bar dataKey="cantidad" name="Actividad" fill={C.green.color} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Sin datos disponibles</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-3xl border border-border p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-4">Registrados</p>
          <div className="space-y-4">
            {[
              { label: "Total", value: reportes?.registrados.total.toString() || "0" },
              { label: "Hoy", value: reportes?.registrados.hoy.toString() || "0" },
              { label: "Esta semana", value: reportes?.registrados.semanal.toString() || "0" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-background p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{item.label}</p>
                <p className="mt-2 text-2xl font-['Lora'] font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-4">Planes activos</p>
          <div className="space-y-4">
            {[
              { label: "Total activos", value: reportes?.activos.total.toString() || "0" },
              { label: "Activos hoy", value: reportes?.activos.hoy.toString() || "0" },
              { label: "Activos (semana)", value: reportes?.activos.semanal.toString() || "0" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-background p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{item.label}</p>
                <p className="mt-2 text-2xl font-['Lora'] font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-4">Resumen</p>
          <div className="space-y-4">
            {[
              { label: "Total registrados", value: reportes?.registrados.total.toString() || "0" },
              { label: "Total activos", value: reportes?.activos.total.toString() || "0" },
              { label: "Tasa de actividad", value: reportes && reportes.registrados.total > 0 ? `${((reportes.activos.total / reportes.registrados.total) * 100).toFixed(1)}%` : "0%" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-background p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{item.label}</p>
                <p className="mt-2 text-2xl font-['Lora'] font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
