import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { C } from "@/constants/colors";
import { planService } from "../services/plan.service";
import api from "../services/api";
import type { Leccion } from "../types/api.types";

export default function Lectura() {
  const navigate = useNavigate();
  const [scrollPct, setScrollPct] = useState(0);
  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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
  }, [loading]);

  // Load lesson from API
  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        // Intentar obtener la lección de hoy
        const todayData = await planService.getTodayPlan();
        if (todayData.leccion) {
          setLeccion(todayData.leccion);
        } else {
          // Si ya se completó hoy, la lección viene como null en /today.
          // La buscamos en el historial completo de días para que el usuario pueda releerla.
          const profile = await planService.getProfile();
          const response = await api.get('/plan/days');
          const allDays = response.data.dias || [];
          const todayLesson = allDays.find((d: any) => d.dia_numero === profile.dia_actual);
          if (todayLesson && todayLesson.leccion) {
            setLeccion({
              dia_actual: todayLesson.dia_numero,
              titulo: todayLesson.leccion.titulo,
              tipo: todayLesson.leccion.tipo,
              emociones_objetivo: todayLesson.leccion.emociones_objetivo,
              respuesta_tipo: todayLesson.leccion.respuesta_tipo,
              datos_leccion: todayLesson.leccion.datos_leccion
            });
          }
        }
      } catch (err) {
        console.error("Error al cargar la lectura del día:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, []);

  const canContinue = scrollPct >= 80;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F5F4]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  if (!leccion) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F7F5F4] px-4 text-center">
        <BookOpen size={48} className="text-[#7A7270] mb-4" />
        <h2 className="text-lg font-semibold text-[#3E3A38]">Lectura no disponible</h2>
        <p className="text-sm text-[#7A7270] mt-1 max-w-xs">No se encontró contenido activo para hoy. Asegúrate de tener un plan iniciado.</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 px-4 py-2 bg-[#3E3A38] text-white text-xs font-semibold rounded-xl">Volver al Dashboard</button>
      </div>
    );
  }

  // Mapear tono de color basado en el bloque/contenido
  const tone = C.green; // default fallback

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
              Día {leccion.dia_actual} · {leccion.tipo}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#3E3A38] truncate mt-0.5">{leccion.titulo}</p>
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
              Lectura del día
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Lora'] text-3xl font-semibold text-[#3E3A38] leading-tight mb-6">
            {leccion.titulo}
          </h1>

          {/* Concepto / Cita */}
          {leccion.datos_leccion?.concepto && (
            <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: tone.bg, borderLeft: `4px solid ${tone.color}` }}>
              <p className="font-['Lora'] text-lg italic text-[#3E3A38] leading-relaxed">
                "{leccion.datos_leccion.concepto}"
              </p>
            </div>
          )}

          {/* Cuerpo principal del contenido */}
          {leccion.datos_leccion?.contenido && (
            <div className="space-y-5 mb-8">
              <p className="text-base text-[#4A4644] leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
                {leccion.datos_leccion.contenido}
              </p>
            </div>
          )}

          {/* Ejercicio del día */}
          {leccion.datos_leccion?.ejercicio && (
            <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 mb-8">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-2">Ejercicio del día</p>
              <h3 className="text-sm font-semibold text-[#3E3A38] mb-3">{leccion.datos_leccion.ejercicio.nombre}</h3>
              <p className="text-sm text-[#4A4644] mb-4 leading-relaxed">{leccion.datos_leccion.ejercicio.instruccion}</p>
              {leccion.datos_leccion.ejercicio.pasos && (
                <div className="space-y-3">
                  {leccion.datos_leccion.ejercicio.pasos.map((paso: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-['Lora'] text-lg font-bold"
                        style={{ backgroundColor: tone.soft, color: tone.color }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <p className="text-sm text-[#7A7270]">{paso}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Principio o recomendación */}
          {leccion.datos_leccion?.principio && (
            <p className="text-base font-['Lora'] italic text-[#4A4644] leading-relaxed mb-10">
              💡 {leccion.datos_leccion.principio}
            </p>
          )}

          {/* CTA */}
          <div className="sticky bottom-0 pb-6">
            <div className={`transition-all duration-500 ${canContinue ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"}`}>
              <button
                disabled={!canContinue}
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: tone.color }}>
                Volver al Dashboard para responder
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
