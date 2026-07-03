import { useState } from "react";
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
  Bell,
  ChevronRight,
} from "lucide-react";

const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800" },
  green: { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860" },
  red: { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828" },
} as const;

type Tone = keyof typeof C;

type Metric = {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
};

type Patient = {
  name: string;
  lastSeen: string;
  activeDays: number;
  score: number;
  status: string;
  flagged: boolean;
  responses: Array<{ question: string; answer: string; rating: number }>;
};

const METRICS: Metric[] = [
  { label: "Usuarios hoy", value: "128", detail: "+14% vs ayer", tone: "green", icon: Users },
  { label: "Total de usuarios", value: "3.420", detail: "1.023 nuevos este mes", tone: "yellow", icon: Activity },
  { label: "Respuestas promedio", value: "8.4 / 10", detail: "34 respuestas por usuario", tone: "green", icon: ClipboardList },
  { label: "Sesiones activas", value: "74", detail: "58% de participantes", tone: "red", icon: ShieldCheck },
];

const WEEK_DATA = [
  { day: "L", users: 90, score: 8.2 },
  { day: "M", users: 115, score: 8.7 },
  { day: "X", users: 107, score: 8.1 },
  { day: "J", users: 132, score: 8.9 },
  { day: "V", users: 149, score: 9.0 },
  { day: "S", users: 98, score: 8.4 },
  { day: "D", users: 122, score: 8.6 },
];

const PATIENTS: Patient[] = [
  {
    name: "Carla Ramírez",
    lastSeen: "Hace 2 h",
    activeDays: 18,
    score: 8.9,
    status: "Muy bien",
    flagged: false,
    responses: [
      { question: "Autoconciencia", answer: "Se reconoce mejor", rating: 9 },
      { question: "Autocontrol", answer: "Ha controlado la ira", rating: 8 },
      { question: "Empatía", answer: "Escucha activamente", rating: 9 },
    ],
  },
  {
    name: "Luis Paredes",
    lastSeen: "Ayer",
    activeDays: 12,
    score: 7.4,
    status: "En seguimiento",
    flagged: true,
    responses: [
      { question: "Automotivación", answer: "Le cuesta cumplir metas", rating: 6 },
      { question: "Ansiedad", answer: "Menos ataques", rating: 7 },
      { question: "Relaciones", answer: "Evita confrontaciones", rating: 8 },
    ],
  },
  {
    name: "Ana Solís",
    lastSeen: "Hace 30 min",
    activeDays: 24,
    score: 9.2,
    status: "Excelente",
    flagged: false,
    responses: [
      { question: "Bienestar", answer: "Muy conectada con sus emociones", rating: 10 },
      { question: "Autoconfianza", answer: "Más segura en decisiones", rating: 9 },
      { question: "Energía", answer: "Se siente con impulso", rating: 9 },
    ],
  },
];

export default function AdminDashboard() {
  const [selected, setSelected] = useState(PATIENTS[0]);

  return (
    <div className="min-h-screen bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
          <div>
            <p className="text-sm font-semibold text-[#3E3A38]">Panel de administración</p>
            <p className="text-xs text-[#7A7270]">Monitorea usuarios, respuestas y evaluaciones</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-[#1E6860]"
            style={{ backgroundColor: C.green.bg, border: `1px solid ${C.green.border}` }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4DAAA0]" /> Admin activo
          </div>
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7A7270] hover:bg-[#F0EDEC] transition-all">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#E96B6B]" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            const tone = C[metric.tone];
            return (
              <div key={metric.label} className="rounded-3xl p-5 bg-white border border-[rgba(62,58,56,0.09)] shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">{metric.label}</p>
                    <p className="mt-3 text-3xl font-['Lora'] font-semibold text-[#3E3A38]">{metric.value}</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: tone.soft, color: tone.color }}>
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
                  <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Actividad de usuarios y puntuación</h2>
                </div>
                <div className="text-sm text-[#7A7270] font-mono">Últimos 7 días</div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEK_DATA} margin={{ top: 10, right: 20, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,58,56,0.06)" />
                    <XAxis dataKey="day" tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                    <YAxis yAxisId="left" orientation="left" tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(62,58,56,0.1)", borderRadius: 10, fontSize: 11, fontFamily: "DM Mono" }} />
                    <Area yAxisId="left" type="monotone" dataKey="users" name="Usuarios" stroke={C.green.color} fill={C.green.color} fillOpacity={0.16} strokeWidth={2} dot={false} />
                    <Area yAxisId="right" type="monotone" dataKey="score" name="Puntaje" stroke={C.yellow.color} fill="none" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Resumen general</p>
                  <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Promedio de respuestas por categoría</h2>
                </div>
                <div className="text-sm text-[#7A7270] font-mono">Basado en datos estáticos</div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Autoconciencia", value: 8.7, tone: "green" as Tone },
                  { label: "Autocontrol", value: 7.9, tone: "yellow" as Tone },
                  { label: "Empatía", value: 8.5, tone: "green" as Tone },
                  { label: "Automotivación", value: 8.0, tone: "red" as Tone },
                ].map((item) => {
                  const tone = C[item.tone];
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#3E3A38]">{item.label}</span>
                        <span className="text-sm font-semibold" style={{ color: tone.color }}>{item.value.toFixed(1)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#F1F0EE] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value * 10}%`, backgroundColor: tone.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5 flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Evaluar paciente</p>
              <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Selecciona un paciente</h2>
            </div>
            <div className="space-y-3">
              {PATIENTS.map((patient) => (
                <button
                  key={patient.name}
                  onClick={() => setSelected(patient)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition-all ${selected.name === patient.name ? "border-[#4DAAA0] bg-[#E6F5F3]" : "border-[rgba(62,58,56,0.09)] bg-white hover:bg-[#F7F5F4]"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#3E3A38]">{patient.name}</p>
                      <p className="text-[11px] text-[#7A7270] mt-1">Último ingreso {patient.lastSeen}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#7A7270]">{patient.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono text-[#7A7270]">
                    <span className="rounded-full bg-[#F7F5F4] px-2 py-1">Días activos {patient.activeDays}</span>
                    <span className="rounded-full bg-[#F7F5F4] px-2 py-1">Puntaje {patient.score.toFixed(1)}</span>
                    {patient.flagged && <span className="rounded-full bg-[#F8D0D0] px-2 py-1 text-[#8A2828]">Revisión</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-3xl bg-[#F7F5F4] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Detalle de evaluación</p>
                  <p className="font-semibold text-[#3E3A38] mt-1">{selected.name}</p>
                </div>
                <div className="text-xs text-[#7A7270]">Calificación {selected.score.toFixed(1)}</div>
              </div>
              <div className="space-y-3">
                {selected.responses.map((item) => (
                  <div key={item.question} className="rounded-2xl bg-white p-4 border border-[rgba(62,58,56,0.08)]">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-[#3E3A38]">{item.question}</p>
                      <span className="text-xs font-semibold" style={{ color: C[item.rating >= 9 ? "green" : item.rating >= 8 ? "yellow" : "red"].color }}>
                        {item.rating}/10
                      </span>
                    </div>
                    <p className="text-sm text-[#7A7270] mt-2">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Pacientes recientes</p>
                <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Actividad y registros</h2>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold text-[#4DAAA0]"
                style={{ borderColor: C.green.border }}>
                Ver todo <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-[#3E3A38]">
                <thead>
                  <tr className="border-b border-[rgba(62,58,56,0.08)] text-[10px] uppercase tracking-wider text-[#7A7270]">
                    <th className="py-3 px-4">Paciente</th>
                    <th className="py-3 px-4">Último registro</th>
                    <th className="py-3 px-4">Sesiones</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(62,58,56,0.08)]">
                  {PATIENTS.map((patient) => (
                    <tr key={patient.name}>
                      <td className="py-4 px-4 font-medium">{patient.name}</td>
                      <td className="py-4 px-4 text-[#7A7270]">{patient.lastSeen}</td>
                      <td className="py-4 px-4 text-[#7A7270]">{patient.activeDays}</td>
                      <td className="py-4 px-4 text-[#3E3A38]">{patient.score.toFixed(1)}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${patient.flagged ? "bg-[#F8D0D0] text-[#8A2828]" : "bg-[#E6F5F3] text-[#1E6860]"}`}>
                          {patient.flagged ? "Requiere revisión" : patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Resumen rápido</p>
            <div className="space-y-4">
              {[
                { label: "Promedio de respuesta", value: "8.4 / 10" },
                { label: "Tasa de retención", value: "82%" },
                { label: "Pacientes en seguimiento", value: "15" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-[#F7F5F4] p-4">
                  <p className="text-xs text-[#7A7270] uppercase tracking-wider font-mono">{item.label}</p>
                  <p className="mt-3 text-2xl font-['Lora'] font-semibold text-[#3E3A38]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
