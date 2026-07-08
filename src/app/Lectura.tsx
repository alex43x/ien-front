import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Clock, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { C } from "@/constants/colors";
import { READING_DIA_12 } from "@/content/readings";

export default function Lectura() {
  const navigate = useNavigate();
  const [scrollPct, setScrollPct] = useState(0);
  const [timeLeft, setTimeLeft] = useState(READING_DIA_12.tiempoMin * 60);
  const timerRunning = true;
  const contentRef = useRef<HTMLDivElement>(null);
  const tone = C[READING_DIA_12.tono];

  // Scroll progress
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setScrollPct(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Reading timer
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const canContinue = scrollPct >= 80 || timeLeft <= 0;

  return (
    <div className="h-screen flex flex-col bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-5 py-3 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => navigate("/dashboard")} className="text-[#7A7270] hover:text-[#3E3A38] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: tone.soft }}>
              <ShieldCheck size={11} style={{ color: tone.color }} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">
              Bloque {READING_DIA_12.bloque} · Día {READING_DIA_12.dia}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#3E3A38] truncate mt-0.5">{READING_DIA_12.titulo}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono flex-shrink-0"
          style={{ color: timeLeft > 0 ? C.yellow.color : C.green.color }}>
          <Clock size={13} />
          {timeLeft > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : "Completado"}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-[#E8E4E2] flex-shrink-0">
        <div className="h-full transition-all duration-300" style={{ width: `${scrollPct}%`, backgroundColor: tone.color }} />
      </div>

      {/* Reading content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-8">

          {/* Intro badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: tone.soft }}>
              <BookOpen size={13} style={{ color: tone.color }} />
            </div>
            <span className="text-xs font-mono font-semibold" style={{ color: tone.text }}>
              Lectura del día — {READING_DIA_12.tiempoMin} minutos
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Lora'] text-3xl font-semibold text-[#3E3A38] leading-tight mb-6">
            {READING_DIA_12.titulo}
          </h1>

          {/* Pull quote */}
          <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: tone.bg, borderLeft: `4px solid ${tone.color}` }}>
            <p className="font-['Lora'] text-lg italic text-[#3E3A38] leading-relaxed">
              "{READING_DIA_12.cita}"
            </p>
            <p className="text-sm font-mono mt-3" style={{ color: tone.text }}>— {READING_DIA_12.autor}</p>
          </div>

          {/* Body */}
          <div className="space-y-5 mb-8">
            {READING_DIA_12.paragraphs.map((p, i) => (
              <p key={i} className="text-base text-[#4A4644] leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{p}</p>
            ))}
          </div>

          {/* STOP list */}
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 mb-8">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">La técnica STOP</p>
            <div className="space-y-3">
              {READING_DIA_12.lista.map((item) => (
                <div key={item.letra} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-['Lora'] text-lg font-bold"
                    style={{ backgroundColor: tone.soft, color: tone.color }}>
                    {item.letra}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3E3A38]">{item.palabra}</p>
                    <p className="text-sm text-[#7A7270] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing */}
          <p className="text-base font-['Lora'] italic text-[#4A4644] leading-relaxed mb-10">
            {READING_DIA_12.cierre}
          </p>

          {/* CTA */}
          <div className="sticky bottom-0 pb-6">
            <div className={`transition-all duration-500 ${canContinue ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"}`}>
              <button
                disabled={!canContinue}
                onClick={() => navigate("/preguntas")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: tone.color }}>
                Ir a las preguntas de reflexión
                <ArrowRight size={16} />
              </button>
              {!canContinue && (
                <p className="text-center text-xs font-mono text-[#7A7270] mt-2">
                  Continúa leyendo para desbloquear ({scrollPct}%)
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
