import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Mail, Store, Calendar, Activity, Zap, Target } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { PerfilPaciente, ProgresoPaciente, TestInicialResponse, DiaPlan } from "../types/api.types";
import { useToneColors, useGray } from "../hooks/useToneColors";
import ErrorNotice from "../components/ui/ErrorNotice";
import { errorMessage } from "../utils/errors";
import TestInicialResultados from "../components/TestInicialResultados";
import ActividadesDiariasLista from "../components/ActividadesDiariasLista";
import AttemptHistory from "../components/AttemptHistory";

type Tab = "progreso" | "test" | "actividades" | "historial";

export default function AdminPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const C = { green: useToneColors("green"), yellow: useToneColors("yellow"), red: useToneColors("red") };
  const GRAY = useGray();
  const [error, setError] = useState("");
  const [testError, setTestError] = useState("");
  const [activitiesError, setActivitiesError] = useState("");
  const [retry, setRetry] = useState(0);
  const currentId = useRef(id);
  currentId.current = id;
  const [profile, setProfile] = useState<PerfilPaciente | null>(null);
  const [progress, setProgress] = useState<ProgresoPaciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("progreso");
  const [testInicial, setTestInicial] = useState<TestInicialResponse | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [actividades, setActividades] = useState<DiaPlan[]>([]);
  const [actividadesLoading, setActividadesLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError("");
    setTestInicial(null);
    setTestLoading(false);
    setActividades([]);
    setActividadesLoading(false);
    setActiveTab("progreso");
    setTestError("");
    setActivitiesError("");
    const fetchData = async () => {
      try {
        const [profileData, progressData] = await Promise.all([
          adminService.perfilPaciente(id),
          adminService.progresoPaciente(id),
        ]);
        if (!active) return;
        setProfile(profileData);
        setProgress(progressData);
      } catch (err) {
        if (active) setError(errorMessage(err, "No se pudo cargar el paciente."));
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [id, retry]);

  const loadTestInicial = async () => {
    if (testInicial || testLoading || !id) return;
    setTestLoading(true);
    setTestError("");
    try {
      const data = await adminService.testInicialPaciente(id);
      if (currentId.current !== id) return;
      setTestInicial(data);
    } catch (err: any) {
      if (currentId.current === id && err.response?.status !== 404) setTestError(errorMessage(err));
    } finally {
      if (currentId.current === id) setTestLoading(false);
    }
  };

  const loadActividades = async () => {
    if (actividades.length > 0 || actividadesLoading || !id) return;
    setActividadesLoading(true);
    setActivitiesError("");
    try {
      const data = await adminService.actividadesPaciente(id);
      if (currentId.current !== id) return;
      setActividades(data.dias);
    } catch (err) {
      if (currentId.current === id) setActivitiesError(errorMessage(err));
    } finally {
      if (currentId.current === id) setActividadesLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "test") loadTestInicial();
    if (tab === "actividades") loadActividades();
  };

  const statusColor = (estado: string) => {
    if (estado === "activo") return { bg: C.green.bg, text: C.green.text, border: C.green.border, label: "Activo" };
    if (estado === "completado") return { bg: C.yellow.bg, text: C.yellow.text, border: C.yellow.border, label: "Completado" };
    if (estado === "abandonado") return { bg: C.red.bg, text: C.red.text, border: C.red.border, label: "Abandonado" };
    if (estado === "pendiente") return { bg: C.yellow.bg, text: C.yellow.text, border: C.yellow.border, label: "Pendiente" };
    if (estado === "reiniciado") return { bg: GRAY.light, text: GRAY.base, border: GRAY.mid, label: "Reiniciado" };
    if (estado === "sin_iniciar") return { bg: GRAY.light, text: GRAY.base, border: GRAY.mid, label: "Sin iniciar" };
    return { bg: GRAY.light, text: GRAY.base, border: GRAY.mid, label: estado };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }
  if (error) return <div className="p-4"><ErrorNotice message={error} onRetry={() => setRetry(n => n + 1)} /></div>;

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Paciente no encontrado</p>
        <button onClick={() => navigate("/admin/pacientes")} className="mt-4 text-sm font-semibold text-accent hover:underline">Volver a pacientes</button>
      </div>
    );
  }

  const sc = progress ? statusColor(progress.estado) : null;
  const daysCompleted = progress?.progreso_diario?.filter((d: any) => d.completado)?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => navigate("/admin/pacientes")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft size={16} />
        Volver a pacientes
      </button>

      <div className="bg-card rounded-3xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Perfil del paciente</p>
            <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">{profile.nombre}</h1>
          </div>
          {progress && sc && (
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
              {sc.label}
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-background p-4 flex items-center gap-3">
            <Mail size={18} className="text-muted-foreground" />
            <div>
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-background p-4 flex items-center gap-3">
            <Store size={18} className="text-muted-foreground" />
            <div>
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Sucursal</p>
              <p className="text-sm font-medium text-foreground">{profile.tienda?.nombre_tienda || "Sin asignar"}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-background p-4 flex items-center gap-3">
            <Calendar size={18} className="text-muted-foreground" />
            <div>
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Registro</p>
              <p className="text-sm font-medium text-foreground">{new Date(profile.fecha_registro).toLocaleDateString()}</p>
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
                <div key={item.label} className="bg-card rounded-3xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.tone.soft }}>
                      <Icon size={16} style={{ color: item.tone.color }} />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  </div>
                  <p className="text-2xl font-['Lora'] font-semibold text-foreground">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-card rounded-3xl border border-border p-2 grid grid-cols-2 sm:grid-cols-4 gap-1">
            {([
              { key: "progreso" as Tab, label: "Progreso" },
              { key: "test" as Tab, label: "Test Inicial" },
              { key: "actividades" as Tab, label: "Actividades Diarias" },
              { key: "historial" as Tab, label: "Historial de intentos" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-background"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "progreso" && (
            <>
              <div className="bg-card rounded-3xl border border-border p-6">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Progreso del plan</p>
                <h2 className="font-['Lora'] text-lg font-semibold text-foreground mt-1">Días completados</h2>
                <div className="mt-4 grid grid-cols-10 sm:grid-cols-15 gap-2">
                  {Array.from({ length: 30 }, (_, i) => {
                    const dayNum = i + 1;
                    const completed = progress.progreso_diario?.some((d: any) => d.dia_numero === dayNum && d.completado);
                    const isCurrent = dayNum === progress.dia_actual;
                    return (
                      <div
                        key={dayNum}
                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-semibold ${
                          completed
                            ? "bg-accent text-background"
                            : isCurrent
                            ? "bg-primary text-background"
                            : "bg-secondary text-muted-foreground"
                        }`}
                        title={`Día ${dayNum}${completed ? " - Completado" : isCurrent ? " - Actual" : " - Pendiente"}`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-accent" /> Completado
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-primary" /> Actual
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-secondary" /> Pendiente
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl border border-border p-6">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Información del plan</p>
                <h2 className="font-['Lora'] text-lg font-semibold text-foreground mt-1">Detalles</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-background p-4">
                    <p className="text-[10px] font-mono uppercase text-muted-foreground">Fecha de inicio</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{progress.fecha_inicio ? new Date(progress.fecha_inicio).toLocaleDateString() : "Sin iniciar"}</p>
                  </div>
                  <div className="rounded-2xl bg-background p-4">
                    <p className="text-[10px] font-mono uppercase text-muted-foreground">Última actividad</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{progress.ultima_fecha_actividad ? new Date(progress.ultima_fecha_actividad).toLocaleDateString() : "Sin actividad"}</p>
                  </div>
                  {progress.hitos_alcanzados?.length > 0 && (
                    <div className="rounded-2xl bg-background p-4 sm:col-span-2">
                      <p className="text-[10px] font-mono uppercase text-muted-foreground">Hitos alcanzados</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {progress.hitos_alcanzados.map((hito) => (
                          <span key={hito} className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
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

          {activeTab === "test" && (
            <div className="bg-card rounded-3xl border border-border p-6">
              {testLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                </div>
              ) : testError ? (
                <ErrorNotice message={testError} onRetry={loadTestInicial} />
              ) : testInicial ? (
                <TestInicialResultados data={testInicial} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">El paciente aún no completó el test inicial</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "actividades" && (
            <div className="bg-card rounded-3xl border border-border p-6">
              {actividadesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                </div>
              ) : activitiesError ? (
                <ErrorNotice message={activitiesError} onRetry={loadActividades} />
              ) : (
                <ActividadesDiariasLista dias={actividades} />
              )}
            </div>
          )}

          {activeTab === "historial" && id && (
            <AttemptHistory key={id} userId={id} />
          )}
        </>
      )}
    </div>
  );
}
