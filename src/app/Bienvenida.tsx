import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { C } from "@/constants/colors";
import { BLOCKS } from "@/constants/program";
import { useAuth } from "../context/AuthContext";

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(lines: string[], speed = 38, pauseBetween = 520) {
  const [displayed, setDisplayed] = useState<string[]>(["", ""]);
  const [done, setDone] = useState(false);
  const frame = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    const progress: string[] = lines.map(() => "");

    const tick = () => {
      if (lineIdx >= lines.length) { setDone(true); return; }
      const target = lines[lineIdx];
      if (charIdx <= target.length) {
        progress[lineIdx] = target.slice(0, charIdx);
        setDisplayed([...progress]);
        charIdx++;
        frame.current = setTimeout(tick, speed);
      } else {
        lineIdx++;
        charIdx = 0;
        frame.current = setTimeout(tick, pauseBetween);
      }
    };

    frame.current = setTimeout(tick, 300);
    return () => { if (frame.current) clearTimeout(frame.current); };
  }, []);

  return { displayed, done };
}

const INTERVAL = 3200;

export default function Bienvenida() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [allSeen, setAllSeen] = useState(false);
  const nombre = user?.nombre || "";
  const { displayed, done: typeDone } = useTypewriter(
    ["Hola,", `${nombre}.`],
    42,
    340,
  );

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDirection(1);
      setActive((prev) => {
        const next = prev + 1;
        if (next >= BLOCKS.length) { setAllSeen(true); return prev; }
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const goTo = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
    setPaused(true);
    if (idx === BLOCKS.length - 1) setAllSeen(true);
  };

  const goNext = () => {
    if (active < BLOCKS.length - 1) { setDirection(1); setActive((p) => p + 1); setPaused(true); }
    if (active === BLOCKS.length - 2) setAllSeen(true);
  };
  const goPrev = () => {
    if (active > 0) { setDirection(-1); setActive((p) => p - 1); setPaused(true); }
  };

  const block = BLOCKS[active];
  const tone = C[block.tone];
  const Icon = block.icon;

  return (
    <div className="min-h-screen bg-[#F7F5F4] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-6 py-3 flex items-center justify-between">
        <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        <div className="flex items-center gap-2 text-xs font-mono text-[#7A7270]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4DAAA0]" />
          Programa activo
        </div>
      </header>

      <div className="flex-1 flex items-stretch">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-0 px-6 py-10">

          {/* ── Left: greeting, partners, CTA ── */}
          <motion.div
            className="lg:w-[42%] flex flex-col justify-center pr-0 lg:pr-12 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold mb-6 self-start"
              style={{ backgroundColor: C.yellow.soft, color: C.yellow.text }}>
              <Heart size={11} style={{ color: C.yellow.color }} />
              30 días de Inteligencia Emocional
            </div>

            <h1 className="font-['Lora'] text-4xl font-semibold text-[#3E3A38] leading-tight mb-4 min-h-[6rem]">
              <span className="block">{displayed[0]}</span>
              <span className="block" style={{ color: C.yellow.color }}>
                {displayed[1]}
                {!typeDone && (
                  <span
                    className="inline-block w-0.5 h-9 ml-1 rounded-full align-middle"
                    style={{
                      backgroundColor: C.yellow.color,
                      verticalAlign: "middle",
                      animation: "ien-blink 0.9s step-start infinite",
                    }}
                  />
                )}
              </span>
            </h1>

            <motion.p
              className="text-[#7A7270] text-sm leading-relaxed mb-8"
              initial={{ opacity: 0, y: 8 }}
              animate={typeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Durante los próximos 30 días trabajarás seis competencias de Inteligencia Emocional que transformarán tu relación con la alimentación desde adentro hacia afuera.
            </motion.p>

            {/* Partners */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={typeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-3">Tus aliados en este camino</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-6 p-6 rounded-xl" style={{ backgroundColor: C.red.bg }}>
                  <img src="/src/imports/cardiosmile.jpeg" alt="Cardiosmile" className="h-28 w-auto object-contain rounded-lg" />
                  <div>
                    <p className="text-lg font-semibold text-[#3E3A38]">Cardiosmile</p>
                    <p className="text-sm text-[#7A7270]">Salud cardiovascular como acto de amor propio</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 rounded-xl" style={{ backgroundColor: C.green.bg }}>
                  <img src="/src/imports/vitamin_shoppe.jpeg" alt="Vitamin Shoppe" className="h-28 w-auto object-contain rounded-lg" />
                  <div>
                    <p className="text-lg font-semibold text-[#3E3A38]">Vitamin Shoppe</p>
                    <p className="text-sm text-[#7A7270]">Suplementación de calidad para tu energía vital</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              onClick={() => navigate("/dashboard")}
              initial={{ opacity: 0, y: 10 }}
              animate={typeDone ? { opacity: allSeen ? 1 : 0.4, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
              whileHover={{ scale: allSeen ? 1.02 : 1 }}
              whileTap={{ scale: allSeen ? 0.98 : 1 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white self-start"
              style={{
                backgroundColor: "#3E3A38",
                cursor: allSeen ? "pointer" : "default",
              }}
              disabled={!allSeen}
            >
              Ir al programa
              <ArrowRight size={16} />
            </motion.button>
            <p className="text-xs text-[#7A7270] font-mono mt-2">
              {allSeen ? "Empieza tu recorrido de 30 días" : "Explora todos los bloques para continuar"}
            </p>
          </motion.div>

          {/* ── Divider ── */}
          <div className="hidden lg:block w-px bg-[rgba(62,58,56,0.08)] self-stretch mx-0" />

          {/* ── Right: block carousel ── */}
          <motion.div
            className="lg:w-[58%] flex flex-col justify-center pl-0 lg:pl-12"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            {/* Main carousel card */}
            <div
              className="relative rounded-3xl overflow-hidden mb-4"
              style={{ border: `2px solid ${tone.soft}`, transition: "border-color 0.5s ease" }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <motion.div
                key={`bg-${block.tone}`}
                className="absolute inset-0"
                style={{ backgroundColor: tone.bg }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative p-8 min-h-[260px] flex flex-col justify-between">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={block.id}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 48 }),
                      center: { opacity: 1, x: 0 },
                      exit: (d: number) => ({ opacity: 0, x: d * -48 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: tone.soft }}>
                        <Icon size={32} style={{ color: tone.color }} />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: tone.text }}>
                          Bloque {block.id} · Días {block.start}–{block.end}
                        </p>
                        <h2 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38]">{block.title}</h2>
                      </div>
                    </div>
                    <p className="text-[#4A4644] text-sm leading-relaxed font-['Lora']">{block.desc}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Arrows + dots */}
                <div className="flex items-center justify-between mt-6">
                  <button onClick={goPrev} disabled={active === 0}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-25"
                    style={{ backgroundColor: tone.soft }}>
                    <ChevronLeft size={16} style={{ color: tone.color }} />
                  </button>

                  <div className="flex items-center gap-2">
                    {BLOCKS.map((b, i) => {
                      const bc = C[b.tone];
                      return (
                        <button key={i} onClick={() => goTo(i)}
                          className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                          style={{
                            width: i === active ? 28 : 8,
                            backgroundColor: i < active ? bc.soft : i === active ? "transparent" : "#E8E4E2",
                            border: i === active ? `1.5px solid ${bc.color}` : "none",
                          }}>
                          {i === active && !paused && (
                            <motion.div
                              key={`fill-${active}`}
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ backgroundColor: bc.color }}
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                            />
                          )}
                          {i === active && paused && (
                            <div className="absolute inset-0 rounded-full" style={{ backgroundColor: bc.color }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button onClick={goNext} disabled={active === BLOCKS.length - 1}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-25"
                    style={{ backgroundColor: tone.soft }}>
                    <ChevronRight size={16} style={{ color: tone.color }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Block strip */}
            <div className="grid grid-cols-6 gap-2">
              {BLOCKS.map((b, i) => {
                const bc = C[b.tone];
                const BIcon = b.icon;
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <motion.button
                    key={b.id}
                    onClick={() => goTo(i)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all"
                    style={{
                      backgroundColor: isActive ? bc.bg : isPast ? `${bc.soft}70` : "#FFFFFF",
                      border: `1.5px solid ${isActive ? bc.color : "rgba(62,58,56,0.08)"}`,
                    }}
                  >
                    <BIcon size={15} style={{ color: isActive || isPast ? bc.color : "#C0BCBA" }} />
                    <span className="text-[9px] font-mono font-medium leading-tight text-center hidden sm:block"
                      style={{ color: isActive ? bc.text : "#9A9694" }}>
                      B{b.id}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
