import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { BLOCKS } from "@/constants/program";
import { useAuth } from "../context/AuthContext";
import { planService } from "../services/plan.service";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useToneColors } from "../hooks/useToneColors";
import type { BienvenidaResponse } from "../types/api.types";
import type { Block } from "@/constants/program";

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

function BlockDot({ block, active, paused, onSelect }: { block: Block; active: boolean; paused: boolean; onSelect: () => void }) {
  const bc = useToneColors(block.tone);
  return (
    <button onClick={onSelect}
      className="relative h-2 rounded-full overflow-hidden transition-all duration-300 bg-muted"
      style={{
        width: active ? 28 : 8,
        border: active ? `1.5px solid ${bc.color}` : "none",
      }}>
      {active && !paused && (
        <motion.div
          key={`fill-${block.id}`}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: bc.color }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: INTERVAL / 1000, ease: "linear" }}
        />
      )}
      {active && paused && (
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: bc.color }} />
      )}
    </button>
  );
}

function BlockThumb({ block, active, isPast, onSelect }: { block: Block; active: boolean; isPast: boolean; onSelect: () => void }) {
  const bc = useToneColors(block.tone);
  const BIcon = block.icon;
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all"
      style={{
        backgroundColor: active ? bc.bg : isPast ? `${bc.soft}70` : undefined,
        border: `1.5px solid ${active ? bc.color : "var(--border)"}`,
      }}
    >
      <BIcon size={15} style={{ color: active || isPast ? bc.color : undefined }} className={!active && !isPast ? "text-muted-foreground" : ""} />
      <span className={`text-[9px] font-mono font-medium leading-tight text-center hidden sm:block ${active ? "" : "text-muted-foreground"}`}
        style={active ? { color: bc.text } : undefined}>
        B{block.id}
      </span>
    </motion.button>
  );
}

export default function Bienvenida() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [allSeen, setAllSeen] = useState(false);
  const [bienvenida, setBienvenida] = useState<BienvenidaResponse | null>(null);
  const nombre = user?.nombre || "";
  const { displayed, done: typeDone } = useTypewriter(
    ["Hola,", `${nombre}.`],
    42,
    340,
  );

  useEffect(() => {
    planService.getBienvenida().then(setBienvenida).catch(console.error);
  }, []);

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
  const tone = useToneColors(block.tone);
  const Icon = block.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <img src="/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Programa activo
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-stretch">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-0 px-6 py-10">

          <motion.div
            className="lg:w-[42%] flex flex-col justify-center pr-0 lg:pr-12 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold mb-6 self-start bg-primary/10 text-primary">
              <Heart size={11} className="text-primary" />
              {bienvenida?.titulo || "              30 días de Inteligencia Emocional"}
            </div>

            <h1 className="font-['Lora'] text-4xl font-semibold text-foreground leading-tight mb-4 min-h-[6rem]">
              <span className="block">{displayed[0]}</span>
              <span className="block text-primary">
                {displayed[1]}
                {!typeDone && (
                  <span
                    className="inline-block w-0.5 h-9 ml-1 rounded-full align-middle bg-primary"
                    style={{ animation: "ien-blink 0.9s step-start infinite" }}
                  />
                )}
              </span>
            </h1>

            <motion.p
              className="text-muted-foreground text-sm leading-relaxed mb-8"
              initial={{ opacity: 0, y: 8 }}
              animate={typeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Durante los próximos 30 días trabajarás seis competencias de Inteligencia Emocional que transformarán tu relación con la alimentación desde adentro hacia afuera.
            </motion.p>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={typeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Tus aliados en este camino</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-6 p-6 rounded-xl bg-destructive/5">
                  <img src="/imports/cardiosmile.jpeg" alt="Cardiosmile" className="h-28 w-auto object-contain rounded-2xl" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">Cardiosmile</p>
                    <p className="text-sm text-muted-foreground">Salud cardiovascular como acto de amor propio</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 rounded-xl bg-accent/5">
                  <img src="/imports/vitamin_shoppe.jpeg" alt="Vitamin Shoppe" className="h-28 w-auto object-contain rounded-2xl" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">Vitamin Shoppe</p>
                    <p className="text-sm text-muted-foreground">Suplementación de calidad para tu energía vital</p>
                  </div>
                </div>
              </div>
            </motion.div>

            </motion.div>

          <div className="hidden lg:block w-px bg-border self-stretch mx-0" />

          <motion.div
            className="lg:w-[58%] flex flex-col justify-center pl-0 lg:pl-12"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
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
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-secondary">
                        <Icon size={32} style={{ color: tone.color }} />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest mb-1 text-muted-foreground">
                          Bloque {block.id} · Días {block.start}–{block.end}
                        </p>
                        <h2 className="font-['Lora'] text-2xl font-semibold text-foreground">{block.title}</h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed font-['Lora']">{block.desc}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-6">
                  <button onClick={goPrev} disabled={active === 0}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-25 bg-secondary">
                    <ChevronLeft size={16} style={{ color: tone.color }} />
                  </button>

                  <div className="flex items-center gap-2">
                    {BLOCKS.map((b, i) => (
                      <BlockDot key={b.id} block={b} active={i === active} paused={paused} onSelect={() => goTo(i)} />
                    ))}
                  </div>

                  <button onClick={goNext} disabled={active === BLOCKS.length - 1}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-25 bg-secondary">
                    <ChevronRight size={16} style={{ color: tone.color }} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {BLOCKS.map((b, i) => (
                <BlockThumb key={b.id} block={b} active={i === active} isPast={i < active} onSelect={() => goTo(i)} />
              ))}
            </div>

            <motion.button
              onClick={() => navigate("/dashboard")}
              initial={{ opacity: 0, y: 10 }}
              animate={typeDone ? { opacity: allSeen ? 1 : 0.4, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
              whileHover={{ scale: allSeen ? 1.02 : 1 }}
              whileTap={{ scale: allSeen ? 0.98 : 1 }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-background bg-foreground mt-6"
              style={{ cursor: allSeen ? "pointer" : "default" }}
              disabled={!allSeen}
            >
              Ir al programa
              <ArrowRight size={16} />
            </motion.button>
            <p className="text-xs text-muted-foreground font-mono mt-2 text-center">
              {allSeen ? "Empieza tu recorrido de 30 días" : "Explora todos los bloques para continuar"}
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
