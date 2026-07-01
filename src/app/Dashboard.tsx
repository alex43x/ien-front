import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Brain, Flame, Users, Sparkles, ShieldCheck, HeartHandshake,
  CheckCircle2, Clock, Heart, Package, Activity, TrendingUp,
  BookOpen, Send, ChevronDown, ChevronUp, Bell,
} from "lucide-react";

// ─── Brand palette (from IEN logo) ───────────────────────────────────────────

const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828" },
} as const;
type Tone = keyof typeof C;

const GRAY = { base: "#3E3A38", mid: "#7A7270", light: "#E8E4E2", faint: "#F7F5F4" };

// ─── Program data ─────────────────────────────────────────────────────────────

const BLOCKS = [
  { id: 1, start: 1,  end: 5,  title: "Autoconciencia",   icon: Brain,          tone: "yellow" as Tone },
  { id: 2, start: 6,  end: 10, title: "Autoconfianza",    icon: Sparkles,       tone: "green"  as Tone },
  { id: 3, start: 11, end: 15, title: "Autocontrol",      icon: ShieldCheck,    tone: "red"    as Tone },
  { id: 4, start: 16, end: 20, title: "Automotivación",   icon: Flame,          tone: "yellow" as Tone },
  { id: 5, start: 21, end: 25, title: "Empatía",          icon: HeartHandshake, tone: "green"  as Tone },
  { id: 6, start: 26, end: 30, title: "Comp. Social",     icon: Users,          tone: "red"    as Tone },
];

const TODAY = 12;
const ACTIVE = BLOCKS.find((b) => TODAY >= b.start && TODAY <= b.end)!;
const tone = C[ACTIVE.tone];

const READING = {
  cita: "Entre el estímulo y la respuesta hay un espacio. En ese espacio reside nuestra libertad.",
  autor: "Viktor Frankl",
  titulo: "La diferencia entre gestionar y reprimir",
  cuerpo: "Reprimir significa empujar la emoción hacia adentro, negarla. A corto plazo funciona, pero regresa con más fuerza. Gestionar, en cambio, significa reconocer la emoción, nombrarla, y decidir conscientemente cómo responder. Al nombrarla, el cerebro reduce automáticamente su intensidad — un fenómeno llamado «affect labeling» con respaldo en neurociencia.",
  pregunta: "¿Hay alguna emoción que sueles reprimir en lugar de reconocer? ¿Qué sientes ahora mismo, exactamente?",
};

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

const pct = Math.round(((TODAY - 1) / 30) * 100);
const r = 36;
const circ = 2 * Math.PI * r;

// ─── Small helpers ────────────────────────────────────────────────────────────

function Tag({ children, tone: t }: { children: React.ReactNode; tone: Tone }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
      style={{ backgroundColor: C[t].soft, color: C[t].text }}>
      {children}
    </span>
  );
}

function AdherBar({ v, t }: { v: number; t: Tone }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: GRAY.light }}>
        <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: C[t].color }} />
      </div>
      <span className="text-[10px] font-mono" style={{ color: C[t].color }}>{v}%</span>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const BlockIcon = ACTIVE.icon;

  return (
    <div className="min-h-screen bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-6 py-3 flex items-center justify-between">
        <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#7A7270]">
            <span className="font-medium text-[#3E3A38]">María González</span>
            <span>·</span>
            <Tag tone={ACTIVE.tone}>Día {TODAY} — Bloque {ACTIVE.id}</Tag>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
            style={{ backgroundColor: C.green.bg, color: C.green.text, border: `1px solid ${C.green.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.green.color }} />
            Activo
          </div>
          <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#7A7270] hover:bg-[#F0EDEC] transition-all">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.red.color }} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-4">

        {/* ── Row 1: Hero card + Progress + Supplements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Today block card */}
          <div className="lg:col-span-1 rounded-2xl p-5 flex flex-col justify-between"
            style={{ backgroundColor: tone.bg, border: `1.5px solid ${tone.border}` }}>
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tone.soft }}>
                  <BlockIcon size={22} style={{ color: tone.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: tone.text }}>
                    Bloque {ACTIVE.id} · Días {ACTIVE.start}–{ACTIVE.end}
                  </p>
                  <p className="font-['Lora'] text-lg font-semibold text-[#3E3A38] leading-tight">{ACTIVE.title}</p>
                </div>
              </div>
              <p className="font-['Lora'] text-sm italic text-[#4A4644] leading-relaxed">
                "{READING.cita}"
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: tone.text }}>— {READING.autor}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate("/lectura")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: tone.color }}>
                <BookOpen size={13} />
                Lectura del día
              </button>
              <button className="px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-white/60"
                style={{ borderColor: tone.border, color: tone.text }}>
                <CheckCircle2 size={14} />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Progreso del programa</p>

            <div className="flex items-center gap-5 mb-5">
              {/* Donut */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                  <circle cx="44" cy="44" r={r} fill="none" stroke={GRAY.light} strokeWidth="8" />
                  <circle cx="44" cy="44" r={r} fill="none" stroke={C.yellow.color} strokeWidth="8"
                    strokeDasharray={`${circ * pct / 100} ${circ}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-['Lora'] text-base font-semibold text-[#3E3A38]">{pct}%</span>
                </div>
              </div>
              <div>
                <p className="font-['Lora'] text-2xl font-semibold text-[#3E3A38]">{TODAY - 1} <span className="text-base text-[#7A7270] font-normal">/ 30</span></p>
                <p className="text-xs text-[#7A7270] mt-0.5">días completados</p>
                <div className="flex gap-3 mt-2">
                  <div>
                    <p className="font-['Lora'] font-semibold text-[#3E3A38] text-sm">5</p>
                    <p className="text-[10px] font-mono text-[#7A7270]">racha</p>
                  </div>
                  <div className="w-px" style={{ backgroundColor: GRAY.light }} />
                  <div>
                    <p className="font-['Lora'] font-semibold text-[#3E3A38] text-sm">82%</p>
                    <p className="text-[10px] font-mono text-[#7A7270]">adherencia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block strip */}
            <div className="space-y-2">
              {BLOCKS.map((b) => {
                const isDone = b.id < ACTIVE.id;
                const isNow = b.id === ACTIVE.id;
                const total = b.end - b.start + 1;
                const done = isDone ? total : isNow ? TODAY - b.start + 1 : 0;
                const p = Math.round((done / total) * 100);
                const bc = C[b.tone];
                const Icon = b.icon;
                return (
                  <div key={b.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isDone || isNow ? bc.soft : GRAY.faint }}>
                      <Icon size={12} style={{ color: isDone || isNow ? bc.color : GRAY.mid }} />
                    </div>
                    <div className="flex-1">
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: GRAY.light }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: bc.color }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono w-7 text-right" style={{ color: isDone || isNow ? bc.color : GRAY.mid }}>{p}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplements */}
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Suplementos · hoy</p>
            <div className="space-y-3">
              {SUPPLEMENTS.map((s, i) => {
                const Icon = s.icon;
                const bc = C[s.tone];
                const done = !!checked[i];
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all"
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
                      onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Mood chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Esta semana</p>
                <p className="font-['Lora'] text-base font-semibold text-[#3E3A38] mt-0.5">Estado emocional</p>
              </div>
              <div className="flex gap-4">
                {[{ l: "Bienestar", c: C.green.color }, { l: "Ansiedad", c: C.red.color }, { l: "Energía", c: C.yellow.color }].map((l) => (
                  <div key={l.l} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.c }} />
                    <span className="text-[10px] text-[#7A7270] font-mono hidden sm:block">{l.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={MOOD} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,58,56,0.06)" />
                <XAxis dataKey="dia" tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                <YAxis domain={[0, 10]} tick={{ fill: "#7A7270", fontSize: 10, fontFamily: "DM Mono" }} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(62,58,56,0.1)", borderRadius: 10, fontSize: 11, fontFamily: "DM Mono" }} />
                <Area type="monotone" dataKey="bien" name="Bienestar" stroke={C.green.color} fill={C.green.color} fillOpacity={0.1} strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="ansi" name="Ansiedad"  stroke={C.red.color}   fill={C.red.color}   fillOpacity={0.08} strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="ener" name="Energía"   stroke={C.yellow.color} fill="none" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Block grid */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Los 6 bloques</p>
            <div className="grid grid-cols-2 gap-2">
              {BLOCKS.map((b) => {
                const isDone = b.id < ACTIVE.id;
                const isNow = b.id === ACTIVE.id;
                const bc = C[b.tone];
                const Icon = b.icon;
                return (
                  <div key={b.id} className="rounded-xl p-3 transition-all"
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
                    {/* day dots */}
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: b.end - b.start + 1 }).map((_, i) => {
                        const dayN = b.start + i;
                        const filled = dayN < TODAY || (isNow && dayN <= TODAY);
                        return (
                          <div key={i} className="w-2 h-2 rounded-full"
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

        {/* ── Row 3: Reading panel (expandable) ── */}
        <div className="bg-white rounded-2xl border overflow-hidden transition-all"
          style={{ borderColor: readingOpen ? tone.border : "rgba(62,58,56,0.09)" }}>
          <button
            className="w-full flex items-center gap-4 px-5 py-4 text-left"
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
              <p className="font-['Lora'] font-semibold text-[#3E3A38] truncate mt-0.5">{READING.titulo}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {saved && <div className="flex items-center gap-1 text-xs font-mono" style={{ color: C.green.color }}>
                <CheckCircle2 size={13} /> Completada
              </div>}
              <div className="flex items-center gap-1 text-[#7A7270] text-xs font-mono">
                <Clock size={12} /> 4 min
              </div>
              {readingOpen ? <ChevronUp size={16} className="text-[#7A7270]" /> : <ChevronDown size={16} className="text-[#7A7270]" />}
            </div>
          </button>

          {readingOpen && (
            <div className="px-5 pb-5 border-t" style={{ borderColor: tone.border }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-5">
                {/* Text */}
                <div>
                  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}>
                    <p className="font-['Lora'] text-sm italic text-[#3E3A38] leading-relaxed">"{READING.cita}"</p>
                    <p className="text-xs font-mono mt-2" style={{ color: tone.text }}>— {READING.autor}</p>
                  </div>
                  <p className="text-sm text-[#4A4644] leading-relaxed">{READING.cuerpo}</p>
                </div>

                {/* Question */}
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: tone.soft, color: tone.text }}>1</span>
                    <p className="text-sm font-medium text-[#3E3A38] leading-snug">{READING.pregunta}</p>
                  </div>
                  {saved ? (
                    <div className="rounded-xl p-4 text-sm text-[#4A4644] leading-relaxed"
                      style={{ backgroundColor: tone.bg }}>
                      {answer}
                      <div className="flex items-center gap-1.5 mt-2">
                        <CheckCircle2 size={12} style={{ color: tone.color }} />
                        <span className="text-xs font-mono" style={{ color: tone.text }}>Guardado</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        className="w-full rounded-xl border text-sm text-[#3E3A38] p-3 resize-none focus:outline-none bg-[#F7F5F4]"
                        style={{ borderColor: "rgba(62,58,56,0.12)", minHeight: 100, fontFamily: "inherit" }}
                        placeholder="Escribe tu reflexión aquí..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                      <button
                        disabled={!answer.trim()}
                        onClick={() => setSaved(true)}
                        className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: tone.color }}>
                        <Send size={11} /> Guardar reflexión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
