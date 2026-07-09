import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Mail, Store, Calendar, Activity, Zap, Target } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { PerfilPaciente, ProgresoPaciente } from "../types/api.types";
import { C } from "../constants/colors";

export default function AdminPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PerfilPaciente | null>(null);
  const [progress, setProgress] = useState<ProgresoPaciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [profileData, progressData] = await Promise.all([
          adminService.perfilPaciente(id),
          adminService.progresoPaciente(id),
        ]);
        setProfile(profileData);
        setProgress(progressData);
      } catch (err) {
        console.error("Error fetching patient detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const statusColor = (estado: string) => {
    if (estado === "activo") return { bg: C.green.bg, text: C.green.text, border: C.green.border };
    if (estado === "completado") return { bg: C.yellow.bg, text: C.yellow.text, border: C.yellow.border };
    return { bg: C.red.bg, text: C.red.text, border: C.red.border };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-[#7A7270]">Paciente no encontrado</p>
        <button onClick={() => navigate("/admin/pacientes")} className="mt-4 text-sm font-semibold text-[#4DAAA0] hover:underline">Volver a pacientes</button>
      </div>
    );
  }

  const sc = progress ? statusColor(progress.estado) : null;
  const daysCompleted = progress?.progreso_diario?.filter((d: any) => d.completado)?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => navigate("/admin/pacientes")} className="flex items-center gap-2 text-sm text-[#7A7270] hover:text-[#3E3A38] transition-colors">
        <ChevronLeft size={16} />
        Volver a pacientes
      </button>

      <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Perfil del paciente</p>
            <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38] mt-1">{profile.nombre}</h1>
          </div>
          {progress && sc && (
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
              {progress.estado}
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#F7F5F4] p-4 flex items-center gap-3">
            <Mail size={18} className="text-[#7A7270]" />
            <div>
              <p className="text-[10px] font-mono uppercase text-[#7A7270]">Email</p>
              <p className="text-sm font-medium text-[#3E3A38]">{profile.email}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F7F5F4] p-4 flex items-center gap-3">
            <Store size={18} className="text-[#7A7270]" />
            <div>
              <p className="text-[10px] font-mono uppercase text-[#7A7270]">Sucursal</p>
              <p className="text-sm font-medium text-[#3E3A38]">{profile.tienda?.nombre_tienda || "Sin asignar"}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F7F5F4] p-4 flex items-center gap-3">
            <Calendar size={18} className="text-[#7A7270]" />
            <div>
              <p className="text-[10px] font-mono uppercase text-[#7A7270]">Registro</p>
              <p className="text-sm font-medium text-[#3E3A38]">{new Date(profile.fecha_registro).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {progress && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Día actual", value: `${progress.dia_actual}/30`, icon: Activity, tone: C.green },
              { label: "Racha actual", value: `${progress.racha_dias} días`, icon: Zap, tone: C.yellow },
              { label: "Racha máxima", value: `${progress.racha_maxima} días`, icon: Target, tone: C.green },
              { label: "Días completados", value: `${daysCompleted}/30`, icon: Activity, tone: C.green },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.tone.soft }}>
                      <Icon size={16} style={{ color: item.tone.color }} />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">{item.label}</p>
                  </div>
                  <p className="text-2xl font-['Lora'] font-semibold text-[#3E3A38]">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Progreso del plan</p>
            <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Días completados</h2>
            <div className="mt-4 grid grid-cols-10 sm:grid-cols-15 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const dayNum = i + 1;
                const completed = progress.progreso_diario?.some((d: any) => d.dia === dayNum && d.completado);
                const isCurrent = dayNum === progress.dia_actual;
                return (
                  <div
                    key={dayNum}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-semibold ${
                      completed
                        ? "bg-[#4DAAA0] text-white"
                        : isCurrent
                        ? "bg-[#D9A030] text-white"
                        : "bg-[#F0EDEC] text-[#7A7270]"
                    }`}
                    title={`Día ${dayNum}${completed ? " - Completado" : isCurrent ? " - Actual" : " - Pendiente"}`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-[11px] text-[#7A7270]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#4DAAA0]" /> Completado
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#D9A030]" /> Actual
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#F0EDEC]" /> Pendiente
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Información del plan</p>
            <h2 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mt-1">Detalles</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#F7F5F4] p-4">
                <p className="text-[10px] font-mono uppercase text-[#7A7270]">Fecha de inicio</p>
                <p className="text-sm font-semibold text-[#3E3A38] mt-1">{new Date(progress.fecha_inicio).toLocaleDateString()}</p>
              </div>
              <div className="rounded-2xl bg-[#F7F5F4] p-4">
                <p className="text-[10px] font-mono uppercase text-[#7A7270]">Última actividad</p>
                <p className="text-sm font-semibold text-[#3E3A38] mt-1">{new Date(progress.ultima_fecha_actividad).toLocaleDateString()}</p>
              </div>
              {progress.hitos_alcanzados.length > 0 && (
                <div className="rounded-2xl bg-[#F7F5F4] p-4 sm:col-span-2">
                  <p className="text-[10px] font-mono uppercase text-[#7A7270]">Hitos alcanzados</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {progress.hitos_alcanzados.map((hito) => (
                      <span key={hito} className="inline-flex items-center rounded-full bg-[#E6F5F3] px-3 py-1 text-[11px] font-semibold text-[#1E6860]">
                        Día {hito}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
