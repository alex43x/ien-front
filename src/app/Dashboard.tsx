import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CheckCircle2, Clock, Heart, Package, Activity, TrendingUp,
  BookOpen, Send, ChevronDown, ChevronUp, CalendarDays, Flame,
} from "lucide-react";

import { C, GRAY } from "@/constants/colors";
import { BLOCKS } from "@/constants/program";
import type { Tone } from "@/constants/colors";
import { Tag } from "@/components/ui/Tag";
import { AdherBar } from "@/components/ui/AdherBar";
import { planService } from "../services/plan.service";
import type { Leccion, PlanProfileResponse } from "../types/api.types";

const SUPPLEMENTS = [
  { product: "Omega-3 Concentrado",  brand: "Cardiosmile",    dose: "1 sobre · desayuno", tone: "red"   as Tone, icon: Heart },
  { product: "Multivitamínico",      brand: "Vitamin Shoppe", dose: "2 cáps · mañana",    tone: "green" as Tone, icon: Package },
  { product: "CoQ10 + Magnesio",     brand: "Cardiosmile",    dose: "1 cáps · cena",      tone: "red"   as Tone, icon: Activity },
  { product: "Ashwagandha KSM-66",   brand: "Vitamin Shoppe", dose: "600 mg · noche",     tone: "green" as Tone, icon: TrendingUp },
];

const MOOD = [
  { dia: "L", bien: 5, ansi: 7, ener: 4 },
  { dia: "M", bien: 6, ansi: 6, ener: 5 },
  { dia: "X", bien: 7, ansi: 5, ener: 7 },
  { dia: "J", bien: 7, ansi: 4, ener: 8 },
  { dia: "V", bien: 8, ansi: 3, ener: 8 },
  { dia: "S", bien: 9, ansi: 3, ener: 9 },
  { dia: "D", bien: 8, ansi: 2, ener: 9 },
];

const r = 36;
const circ = 2 * Math.PI * r;

export default function Dashboard() {
  const navigate = useNavigate();

  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [profile, setProfile] = useState<PlanProfileResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [completando, setCompletando] = useState(false);
  const [hitoAlcanzado, setHitoAlcanzado] = useState<number | null>(null);

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [answer, setAnswer] = useState("");
  const [readingOpen, setReadingOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setPlanLoading(true);
        const [todayData, profileData] = await Promise.all([
          planService.getTodayPlan(),
          planService.getProfile(),
        ]);
        setLeccion(todayData.leccion);
        setProfile(profileData);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setPlanError("no_plan");
        } else {
          setPlanError("error");
        }
      } finally {
        setPlanLoading(false);
      }
    };
    load();
  }, []);

  const handleCompleteDay = async () => {
    if (completando) return;
    setCompletando(true);
    try {
      const result = await planService.completeDay(answer.trim() || undefined);
      setHitoAlcanzado(result.hito_alcanzado);
      const profileData = await planService.getProfile();
      setProfile(profileData);
      setLeccion(null);
    } catch (_) {
    } finally {
      setCompletando(false);
    }
  };

  const TODAY = profile?.dia_actual ?? 1;
  const diasCompletados = profile?.dias_completados ?? 0;
  const pct = Math.round((diasCompletados / 30) * 100);
  const ACTIVE = BLOCKS.find((b) => TODAY >= b.start && TODAY <= b.end) ?? BLOCKS[0];
  const tone = C[ACTIVE.tone];
  const BlockIcon = ACTIVE.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {import.meta.env.DEV && (
        <div className="flex justify-end">
          <button
            onClick={async () => {
              try {
                await planService.advanceDay();
                const [todayPlan, profileData] = await Promise.all([
                  planService.getTodayPlan(),
                  planService.getProfile()
                ]);
                setLeccion(todayPlan.leccion);
                setProfile(profileData);
                setHitoAlcanzado(null);
              } catch (error) {
                console.error("Error advancing day:", error);
              }
            }}
            title="Avanzar día (DEV)"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all"
          >
            DEV: AVANZAR DÍA
          </button>
        </div>
      )}

        {/* ── Row 1: Hero card + Progress + Supplements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Today block card */}
          <div
            className="lg:col-span-1 rounded-2xl p-5 flex flex-col justify-between shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${tone.bg} 0%, white 80%)`,
              border: `1.5px solid ${tone.border}`,
            }}>
            {planLoading ? (
              <div className="flex-1 flex items-center justify-center py-8">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
              </div>
            ) : planError === 'no_plan' ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
                <BookOpen size={28} style={{ color: tone.color }} />
                <p className="text-sm font-medium text-[#3E3A38]">No tenés un plan activo</p>
                <p className="text-xs text-[#7A7270]">Completá el test inicial para comenzar</p>
                <button onClick={() => navigate('/preguntas')} className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: tone.color }}>Iniciar test</button>
              </div>
            ) : profile?.actividad_completada_hoy ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: tone.soft }}>
                  <CheckCircle2 size={28} style={{ color: tone.color }} />
                </div>
                <p className="font-['Lora'] text-base font-semibold text-[#3E3A38]">¡Actividad completada!</p>
                <p className="text-xs text-[#7A7270]">Volvé mañana para el día {TODAY}</p>
                {hitoAlcanzado && (
                  <div
                    className="mt-1 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm"
                    style={{ backgroundColor: tone.soft, color: tone.text }}>
                    🏅 ¡Racha de {hitoAlcanzado} días!
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: tone.soft }}>
                      <BlockIcon size={22} style={{ color: tone.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: tone.text }}>
                        Bloque {ACTIVE.id} · Días {ACTIVE.start}–{ACTIVE.end}
                      </p>
                      <p className="font-['Lora'] text-lg font-semibold text-[#3E3A38] leading-tight">
                        {leccion?.titulo || ACTIVE.title}
                      </p>
                    </div>
                  </div>
                  {leccion?.datos_leccion?.cita && (
                    <>
                      <p className="font-['Lora'] text-sm italic text-[#4A4644] leading-relaxed">
                        "{leccion.datos_leccion.cita}"
                      </p>
                      {leccion.datos_leccion.autor && (
                        <p className="text-xs font-mono mt-1" style={{ color: tone.text }}>— {leccion.datos_leccion.autor}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate("/lectura")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: tone.color }}>
                    <BookOpen size={13} />
                    Lectura del día
                  </button>
                  <button
                    onClick={handleCompleteDay}
                    disabled={completando}
                    className="px-3 py-2.5 rounded-xl text-xs font-medium border transition-all hover:bg-white/60 disabled:opacity-50"
                    style={{ borderColor: tone.border, color: tone.text }}>
                    {completando ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 size={14} />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Progress */}
          <div
            className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-5">Progreso del programa</p>

            <div className="flex items-center gap-5 mb-5">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90 drop-shadow-sm">
                  <circle cx="44" cy="44" r={r} fill="none" stroke={GRAY.light} strokeWidth="8" />
                  <circle cx="44" cy="44" r={r} fill="none" stroke={C.yellow.color} strokeWidth="8"
                    strokeDasharray={`${circ * pct / 100} ${circ}`} strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.6s ease" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-['Lora'] text-lg font-semibold text-[#3E3A38]">{pct}%</span>
                </div>
              </div>
              <div>
                <p className="font-['Lora'] text-3xl font-semibold text-[#3E3A38]">{diasCompletados} <span className="text-base text-[#7A7270] font-normal">/ 30</span></p>
                <p className="text-xs text-[#7A7270] mt-0.5">días completados</p>
                <div className="flex gap-4 mt-3">
                  <div>
                    <p className="font-['Lora'] font-semibold text-[#3E3A38] text-sm">{profile?.racha_dias ?? '—'}</p>
                    <p className="text-[10px] font-mono text-[#7A7270]">racha</p>
                  </div>
                  <div className="w-px" style={{ backgroundColor: GRAY.light }} />
                  <div>
                    <p className="font-['Lora'] font-semibold text-[#3E3A38] text-sm">{pct}%</p>
                    <p className="text-[10px] font-mono text-[#7A7270]">adherencia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {BLOCKS.map((b) => {
                const isDone = b.id < ACTIVE.id;
                const isNow = b.id === ACTIVE.id;
                const total = b.end - b.start + 1;
                const done = isDone ? total : isNow ? TODAY - b.start + 1 : 0;
                const p = Math.round((done / total) * 100);
                const bc = C[b.tone];
                const Icon = b.icon;
                return (
                  <div key={b.id} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isDone || isNow ? bc.soft : GRAY.faint }}>
                      <Icon size={12} style={{ color: isDone || isNow ? bc.color : GRAY.mid }} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 rounded-full shadow-inner" style={{ backgroundColor: GRAY.light }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p}%`, backgroundColor: bc.color }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono w-7 text-right" style={{ color: isDone || isNow ? bc.color : GRAY.mid }}>{p}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplements */}
          <div
            
            className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Suplementos · hoy</p>
            <div className="space-y-3">
              {SUPPLEMENTS.map((s, i) => {
                const Icon = s.icon;
                const bc = C[s.tone];
                const done = !!checked[i];
                return (
                  <div
                    key={i}
                    
                    className="flex items-center gap-3 p-3 rounded-xl transition-shadow hover:shadow-sm cursor-pointer"
                    onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
                    style={{ backgroundColor: done ? bc.bg : GRAY.faint }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: bc.soft }}>
                      <Icon size={14} style={{ color: bc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#3E3A38] truncate">{s.product}</p>
                      <p className="text-[10px] font-mono text-[#7A7270]">{s.dose}</p>
                      <AdherBar v={done ? 100 : [92, 84, 78, 70][i]} t={s.tone} />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setChecked((p) => ({ ...p, [i]: !p[i] })); }}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95"
                      style={{ borderColor: bc.color, backgroundColor: done ? bc.color : "transparent" }}>
                      <CheckCircle2 size={13} color={done ? "white" : bc.color} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Row 2: Mood chart + Block overview ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Mood chart */}
          <div
            
            className="lg:col-span-3 bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Esta semana</p>
                <p className="font-['Lora'] text-base font-semibold text-[#3E3A38] mt-0.5">Estado emocional</p>
              </div>
              <div className="flex gap-4">
                {[{ l: "Bienestar", c: C.green.color }, { l: "Ansiedad", c: C.red.color }, { l: "Energía", c: C.yellow.color }].map((l) => (
                  <div key={l.l} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: l.c }} />
                    <span className="text-[10px] font-medium text-[#7A7270] hidden sm:block">{l.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MOOD} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="bienGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={C.green.color} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="ansiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.red.color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={C.red.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,58,56,0.06)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(62,58,56,0.1)", borderRadius: 12, fontSize: 11, fontFamily: "DM Mono", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                <Area type="monotone" dataKey="bien" name="Bienestar" stroke={C.green.color} fill="url(#bienGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: C.green.color, stroke: "white", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="ansi" name="Ansiedad"  stroke={C.red.color}   fill="url(#ansiGrad)"   strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: C.red.color, stroke: "white", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="ener" name="Energía"   stroke={C.yellow.color} fill="none" strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 4, fill: C.yellow.color, stroke: "white", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Block grid */}
          <div
            
            className="lg:col-span-2 bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Los 6 bloques</p>
            <div className="grid grid-cols-2 gap-2.5">
              {BLOCKS.map((b) => {
                const isDone = b.id < ACTIVE.id;
                const isNow = b.id === ACTIVE.id;
                const bc = C[b.tone];
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    
                    className="rounded-xl p-3 transition-all"
                    style={{
                      backgroundColor: isNow ? bc.bg : isDone ? `${bc.soft}88` : GRAY.faint,
                      border: isNow ? `1.5px solid ${bc.border}` : `1px solid ${GRAY.light}`,
                    }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: isDone || isNow ? bc.soft : GRAY.light }}>
                        <Icon size={13} style={{ color: isDone || isNow ? bc.color : GRAY.mid }} />
                      </div>
                      {isDone && <CheckCircle2 size={12} style={{ color: bc.color }} />}
                      {isNow && <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: bc.color }} />}
                    </div>
                    <p className="text-xs font-semibold text-[#3E3A38] leading-tight">{b.title}</p>
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: GRAY.mid }}>Días {b.start}–{b.end}</p>
                    <div className="flex gap-0.5 mt-2 flex-wrap">
                      {Array.from({ length: b.end - b.start + 1 }).map((_, i) => {
                        const dayN = b.start + i;
                        const filled = dayN < TODAY || (isNow && dayN <= TODAY);
                        return (
                          <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                            style={{ backgroundColor: filled ? bc.color : bc.soft }} />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Row 3: Plan status ── */}
        {profile && !planLoading && (
          <div
            
            className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Estado del plan</p>
              <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                profile.estado === 'activo' ? 'text-[#1E6860]' :
                profile.estado === 'completado' ? 'text-[#D9A030]' : 'text-[#E96B6B]'
              }`}
                style={{
                  backgroundColor: profile.estado === 'activo' ? C.green.bg :
                    profile.estado === 'completado' ? C.yellow.soft : C.red.bg,
                }}>
                {profile.estado === 'activo' ? 'Activo' : profile.estado === 'completado' ? 'Completado' : 'Abandonado'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl p-3" style={{ backgroundColor: GRAY.faint }}>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={13} className="text-[#7A7270]" />
                  <p className="text-[10px] font-mono text-[#7A7270]">Inicio</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">
                  {new Date(profile.fecha_inicio).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: GRAY.faint }}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={13} className="text-[#7A7270]" />
                  <p className="text-[10px] font-mono text-[#7A7270]">Completados</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">{profile.dias_completados} / {profile.dias_totales}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: GRAY.faint }}>
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={13} style={{ color: C.yellow.color }} />
                  <p className="text-[10px] font-mono text-[#7A7270]">Racha actual</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">{profile.racha_dias} días</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: GRAY.faint }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={13} className="text-[#7A7270]" />
                  <p className="text-[10px] font-mono text-[#7A7270]">Mejor racha</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">{profile.racha_maxima} días</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Row 4: Reading panel ── */}
        {leccion && (
          <div
            
            className="bg-white rounded-2xl border overflow-hidden transition-all shadow-sm"
            style={{ borderColor: readingOpen ? tone.border : "rgba(62,58,56,0.09)" }}>
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FCFAF8] transition-colors"
              onClick={() => setReadingOpen(!readingOpen)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tone.soft }}>
                <BookOpen size={16} style={{ color: tone.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: tone.text }}>Lectura del día {TODAY}</p>
                  <Tag tone={ACTIVE.tone}>{ACTIVE.title}</Tag>
                </div>
                <p className="font-['Lora'] font-semibold text-[#3E3A38] truncate mt-0.5">{leccion.titulo}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {profile?.actividad_completada_hoy && <div className="flex items-center gap-1 text-xs font-mono" style={{ color: C.green.color }}>
                  <CheckCircle2 size={13} /> Completada
                </div>}
                <div className="flex items-center gap-1 text-[#7A7270] text-xs font-mono">
                  <Clock size={12} /> {leccion.tipo}
                </div>
                {readingOpen ? <ChevronUp size={16} className="text-[#7A7270]" /> : <ChevronDown size={16} className="text-[#7A7270]" />}
              </div>
            </button>

            {readingOpen && (
                <div
                  className="overflow-hidden">
                  <div className="border-t px-5 pb-5" style={{ borderColor: tone.border }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-5">
                      <div>
                        {leccion.datos_leccion?.cita && (
                          <div className="rounded-xl p-4 mb-4 shadow-sm" style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}>
                            <p className="font-['Lora'] text-sm italic text-[#3E3A38] leading-relaxed">"{leccion.datos_leccion.cita}"</p>
                            {leccion.datos_leccion.autor && (
                              <p className="text-xs font-mono mt-2" style={{ color: tone.text }}>— {leccion.datos_leccion.autor}</p>
                            )}
                          </div>
                        )}
                        {leccion.datos_leccion?.cuerpo && (
                          <p className="text-sm text-[#4A4644] leading-relaxed">{leccion.datos_leccion.cuerpo}</p>
                        )}
                      </div>

                      <div>
                        {leccion.datos_leccion?.pregunta && (
                          <div className="flex items-start gap-3 mb-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold flex-shrink-0 mt-0.5 shadow-sm"
                              style={{ backgroundColor: tone.soft, color: tone.text }}>1</span>
                            <p className="text-sm font-medium text-[#3E3A38] leading-snug">{leccion.datos_leccion.pregunta}</p>
                          </div>
                        )}
                        {!profile?.actividad_completada_hoy ? (
                          <div>
                            <textarea
                              className="w-full rounded-xl border text-sm text-[#3E3A38] p-3 resize-none focus:outline-none bg-[#F7F5F4] transition-all focus:shadow-sm"
                              style={{ borderColor: "rgba(62,58,56,0.12)", minHeight: 100, fontFamily: "inherit" }}
                              placeholder="Escribe tu reflexión aquí..."
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                            />
                            <button
                              disabled={completando}
                              onClick={handleCompleteDay}
                              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 shadow-sm"
                              style={{ backgroundColor: tone.color }}>
                              {completando
                                ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                : <><Send size={11} /> Completar actividad</>
                              }
                            </button>
                          </div>
                        ) : (
                          <div className="rounded-xl p-4 text-sm text-[#4A4644] leading-relaxed shadow-sm" style={{ backgroundColor: tone.bg }}>
                            {answer || "Actividad completada"}
                            <div className="flex items-center gap-1.5 mt-2">
                              <CheckCircle2 size={12} style={{ color: tone.color }} />
                              <span className="text-xs font-mono" style={{ color: tone.text }}>Guardado</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}

    </div>
  );
}
