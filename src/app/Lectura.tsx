import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, BookOpen, ShieldCheck, Pill, CheckSquare, Square, Send } from "lucide-react";
import { C } from "@/constants/colors";
import { planService } from "../services/plan.service";
import api from "../services/api";
import type { Leccion } from "../types/api.types";

export default function Lectura() {
  const navigate = useNavigate();
  const [scrollPct, setScrollPct] = useState(0);
  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [completando, setCompletando] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const setAnswer = (id: string, value: any) => setAnswers(prev => ({ ...prev, [id]: value }));

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
              campos_respuesta: todayLesson.leccion.campos_respuesta ?? [],
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

  const handleComplete = async () => {
    if (completando || !leccion) return;
    setCompletando(true);
    try {
      if (leccion.campos_respuesta && leccion.campos_respuesta.length > 0) {
        const respuestas = leccion.campos_respuesta.map(campo => ({
          id: campo.id,
          valor: answers[campo.id] ?? '',
          tipo: campo.tipo
        }));
        await planService.responderDiario({ dia_numero: leccion.dia_actual, respuestas });
      }
      await planService.completeDay();
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al completar actividad:", err);
    } finally {
      setCompletando(false);
    }
  };

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
              <p className="text-sm text-[#4A4644] mb-5 leading-relaxed">{leccion.datos_leccion.ejercicio.instruccion}</p>

              {leccion.campos_respuesta && leccion.campos_respuesta.length > 0 && (
                <div className="space-y-4">
                  {leccion.campos_respuesta.map((campo, idx) => (
                    <div key={campo.id} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-['Lora'] text-lg font-bold"
                        style={{ backgroundColor: tone.soft, color: tone.color }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <p className="text-sm font-medium text-[#3E3A38] mb-2">{campo.etiqueta}</p>
                        {campo.tipo === 'escala' && (
                          <div className="bg-[#F7F5F4] rounded-xl p-4">
                            <div className="flex gap-1.5 justify-between mb-3">
                              {Array.from({ length: (campo.max ?? 10) - (campo.min ?? 1) + 1 }, (_, i) => (campo.min ?? 1) + i).map((val) => {
                                const selected = (answers[campo.id] ?? Math.round(((campo.min ?? 1) + (campo.max ?? 10)) / 2)) === val;
                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAnswer(campo.id, val)}
                                    className="flex-1 aspect-square rounded-xl font-mono font-semibold text-sm transition-all hover:scale-105"
                                    style={{
                                      backgroundColor: selected ? tone.color : tone.bg,
                                      color: selected ? 'white' : tone.color,
                                      border: `2px solid ${selected ? tone.color : tone.soft}`,
                                    }}>
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[10px] font-mono text-[#7A7270]">{campo.min ?? 1}</span>
                              <span className="text-[10px] font-mono text-[#7A7270]">{campo.max ?? 10}</span>
                            </div>
                          </div>
                        )}
                        {campo.tipo === 'texto' && (
                          <textarea
                            className="w-full rounded-xl border text-sm text-[#3E3A38] p-3 resize-none focus:outline-none bg-[#F7F5F4] transition-all focus:shadow-sm"
                            style={{ borderColor: "rgba(62,58,56,0.12)", minHeight: 80, fontFamily: "'Lora', serif" }}
                            placeholder="Escribe tu respuesta aquí..."
                            value={answers[campo.id] ?? ''}
                            onChange={(e) => setAnswer(campo.id, e.target.value)}
                          />
                        )}
                        {campo.tipo === 'actividad' && (
                          <button
                            type="button"
                            onClick={() => setAnswer(campo.id, !answers[campo.id])}
                            className="flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all hover:shadow-sm border"
                            style={{
                              backgroundColor: answers[campo.id] ? tone.bg : '#F7F5F4',
                              borderColor: answers[campo.id] ? tone.color : 'rgba(62,58,56,0.09)'
                            }}>
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suplementación recomendada */}
          {leccion.datos_leccion?.suplementacion && leccion.datos_leccion.suplementacion.length > 0 && (
            <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pill size={14} style={{ color: tone.color }} />
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Suplementación recomendada</p>
              </div>
              <div className="space-y-3">
                {leccion.datos_leccion.suplementacion.map((sup, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: tone.bg }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tone.soft }}>
                      <Pill size={13} style={{ color: tone.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3E3A38]">{sup.nombre}</p>
                      <p className="text-xs text-[#7A7270] mt-0.5">{sup.dosis} · {sup.horario}</p>
                      <p className="text-xs text-[#4A4644] mt-1">{sup.beneficio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Principio o recomendación */}
          {leccion.datos_leccion?.principio && (
            <p className="text-base font-['Lora'] italic text-[#4A4644] leading-relaxed mb-10">
              💡 {leccion.datos_leccion.principio}
            </p>
          )}

          {/* CTA */}
          <div className="sticky bottom-0 pb-6 mt-8">
            <div className={`transition-all duration-500 ${canContinue ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"}`}>
              <button
                disabled={!canContinue || completando}
                onClick={handleComplete}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: tone.color }}>
                {completando
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <><Send size={15} /> Completar actividad</>
                }
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
