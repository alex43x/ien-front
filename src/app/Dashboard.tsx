import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CheckCircle2, Clock, Heart, Package, Activity, TrendingUp,
  BookOpen, Send, ChevronDown, ChevronUp, CalendarDays, Flame, Pill, CheckSquare, Square,
} from "lucide-react";

import { C, GRAY } from "@/constants/colors";
import { BLOCKS } from "@/constants/program";
import type { Tone } from "@/constants/colors";
import { Tag } from "@/components/ui/Tag";
import { planService } from "../services/plan.service";
import type { Leccion, PlanProfileResponse } from "../types/api.types";

const SUPPLEMENT_ICONS: Record<string, any> = {
  'Ashwagandha': TrendingUp,
  'Magnesio': Activity,
  'L-Teanina': Heart,
  'Omega': Activity,
  'Rhodiola': TrendingUp,
  'Cardiosmile': Heart,
  'Coenzima': Package,
  'Complejo': Package,
  'Proteína': Package,
  'Melatonina': Heart,
  'Ginkgo': Activity,
};

const SUPPLEMENT_TONES: Record<string, string> = {
  'Ashwagandha': 'green',
  'Magnesio': 'green',
  'Omega': 'red',
  'Rhodiola': 'green',
  'Cardiosmile': 'red',
  'L-Teanina': 'green',
};

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
  const [dayError, setDayError] = useState<string | null>(null);

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [readingOpen, setReadingOpen] = useState(false);

  const setAnswer = (id: string, value: any) => setAnswers(prev => ({ ...prev, [id]: value }));

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

    if (leccion?.campos_respuesta && leccion.campos_respuesta.length > 0) {
      const faltan = leccion.campos_respuesta.filter(c => {
        const v = answers[c.id];
        if (c.tipo === 'escala') return v === undefined;
        if (c.tipo === 'actividad') return !v;
        return v === undefined || v === '';
      });
      if (faltan.length > 0) {
        setDayError(`Completá: ${faltan.map(c => c.etiqueta).join(', ')}`);
        return;
      }
    }

    setCompletando(true);
    setDayError(null);
    try {
      const respuesta_usuario = leccion?.campos_respuesta?.length
        ? leccion.campos_respuesta.map(c => ({
            id: c.id,
            valor: answers[c.id],
            tipo: c.tipo
          }))
        : undefined;

      const result = await planService.completeDay(respuesta_usuario);
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
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                await planService.autocompleteTest();
                const [todayPlan, profileData] = await Promise.all([
                  planService.getTodayPlan(),
                  planService.getProfile()
                ]);
                setLeccion(todayPlan.leccion);
                setProfile(profileData);
                setHitoAlcanzado(null);
              } catch (error) {
                console.error("Error auto-completing test:", error);
              }
            }}
            title="Auto-completar test inicial (DEV)"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all"
          >
            DEV: AUTO TEST
          </button>
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

        {/* ── Estado del plan ── */}
        {profile && !planLoading && (
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 shadow-sm">
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
              <div className="rounded-xl p-3" style={{ backgroundColor: C.green.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={13} style={{ color: C.green.color }} />
                  <p className="text-[10px] font-mono" style={{ color: C.green.text }}>Inicio</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">
                  {new Date(profile.fecha_inicio).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: C.yellow.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={13} style={{ color: C.yellow.color }} />
                  <p className="text-[10px] font-mono" style={{ color: C.yellow.text }}>Completados</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">{profile.dias_completados} / {profile.dias_totales}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: C.red.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={13} style={{ color: C.red.color }} />
                  <p className="text-[10px] font-mono" style={{ color: C.red.text }}>Racha actual</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">{profile.racha_dias} días</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: C.green.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={13} style={{ color: C.green.color }} />
                  <p className="text-[10px] font-mono" style={{ color: C.green.text }}>Mejor racha</p>
                </div>
                <p className="text-sm font-semibold text-[#3E3A38]">{profile.racha_maxima} días</p>
              </div>
            </div>
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
                  {leccion?.datos_leccion?.concepto && (
                    <p className="font-['Lora'] text-sm italic text-[#4A4644] leading-relaxed">
                      {leccion.datos_leccion.concepto}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate("/bloque-intro")}
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
              {(leccion?.datos_leccion?.suplementacion ?? []).map((sup, i) => {
                const toneKey = Object.keys(SUPPLEMENT_TONES).find(k => sup.nombre.includes(k)) ?? sup.nombre;
                const st = (SUPPLEMENT_TONES[toneKey] ?? 'green') as Tone;
                const bc = C[st];
                const done = !!checked[i];
                const Icon = Object.keys(SUPPLEMENT_ICONS).find(k => sup.nombre.includes(k))
                  ? SUPPLEMENT_ICONS[Object.keys(SUPPLEMENT_ICONS).find(k => sup.nombre.includes(k))!]
                  : Pill;
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
                      <p className="text-xs font-semibold text-[#3E3A38] truncate">{sup.nombre}</p>
                      <p className="text-[10px] font-mono text-[#7A7270]">{sup.dosis} · {sup.horario}</p>
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
              {(!leccion?.datos_leccion?.suplementacion || leccion.datos_leccion.suplementacion.length === 0) && (
                <p className="text-xs text-[#7A7270] text-center py-4">Sin suplementación para hoy</p>
              )}
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
                        {leccion.datos_leccion?.concepto && (
                          <div className="rounded-xl p-4 mb-4 shadow-sm" style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}>
                            <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: tone.text }}>Concepto clave</p>
                            <p className="font-['Lora'] text-sm italic text-[#3E3A38] leading-relaxed">{leccion.datos_leccion.concepto}</p>
                          </div>
                        )}
                        {leccion.datos_leccion?.contenido && (
                          <p className="text-sm text-[#4A4644] leading-relaxed">{leccion.datos_leccion.contenido}</p>
                        )}
                      </div>

                      <div>
                        {leccion.datos_leccion?.ejercicio && (
                          <div className="mb-3">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-1">Ejercicio del día</p>
                            <p className="text-sm font-semibold text-[#3E3A38]">{leccion.datos_leccion.ejercicio.nombre}</p>
                            <p className="text-sm text-[#4A4644] mt-1 leading-relaxed">{leccion.datos_leccion.ejercicio.instruccion}</p>
                          </div>
                        )}
                        {!profile?.actividad_completada_hoy ? (
                          <div className="space-y-4">
                            {leccion.campos_respuesta?.map((campo) => (
                              <div key={campo.id}>
                                <p className="text-xs font-medium text-[#3E3A38] mb-1.5">{campo.etiqueta}</p>
                                {campo.tipo === 'escala' && (
                                  <div>
                                    <input
                                      type="range"
                                      min={campo.min ?? 1}
                                      max={campo.max ?? 10}
                                      value={answers[campo.id] ?? (campo.min ?? 1)}
                                      onChange={(e) => setAnswer(campo.id, parseInt(e.target.value))}
                                      className="w-full accent-current h-2 rounded-full appearance-none cursor-pointer"
                                      style={{ accentColor: tone.color }}
                                    />
                                    <div className="flex justify-between text-[10px] font-mono text-[#7A7270] mt-1">
                                      <span>{campo.min ?? 1}</span>
                                      <span className="font-semibold text-sm" style={{ color: tone.color }}>
                                        {answers[campo.id] ?? '—'}
                                      </span>
                                      <span>{campo.max ?? 10}</span>
                                    </div>
                                  </div>
                                )}
                                {campo.tipo === 'texto' && (
                                  <textarea
                                    className="w-full rounded-xl border text-sm text-[#3E3A38] p-3 resize-none focus:outline-none bg-[#F7F5F4] transition-all focus:shadow-sm"
                                    style={{ borderColor: "rgba(62,58,56,0.12)", minHeight: 80, fontFamily: "inherit" }}
                                    placeholder="Escribe tu respuesta aquí..."
                                    value={answers[campo.id] ?? ''}
                                    onChange={(e) => setAnswer(campo.id, e.target.value)}
                                  />
                                )}
                                {campo.tipo === 'actividad' && (
                                  <button
                                    type="button"
                                    onClick={() => setAnswer(campo.id, !answers[campo.id])}
                                    className="flex items-center gap-2.5 p-3 rounded-xl w-full text-left transition-all hover:shadow-sm"
                                    style={{ backgroundColor: answers[campo.id] ? tone.bg : GRAY.faint }}>
                                    {answers[campo.id] ? (
                                      <CheckSquare size={18} style={{ color: tone.color }} />
                                    ) : (
                                      <Square size={18} className="text-[#7A7270]" />
                                    )}
                                    <span className="text-sm" style={{ color: answers[campo.id] ? '#3E3A38' : '#7A7270' }}>
                                      {answers[campo.id] ? 'Completado' : 'Marcar como hecho'}
                                    </span>
                                  </button>
                                )}
                              </div>
                            ))}
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
                            {dayError && (
                              <p className="mt-2 rounded-xl bg-[#FAEAEA] px-3 py-2 text-xs font-medium text-[#E96B6B]">
                                {dayError}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl p-4 text-sm text-[#4A4644] leading-relaxed shadow-sm" style={{ backgroundColor: tone.bg }}>
                            Actividad completada
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
