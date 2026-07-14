import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { C } from "@/constants/colors";
import { BLOCKS } from "@/constants/program";
import { planService } from "../services/plan.service";

export default function BloqueIntro() {
  const navigate = useNavigate();
  const [scrollPct, setScrollPct] = useState(0);
  const [noScrollNeeded, setNoScrollNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cabecera, setCabecera] = useState<string | null>(null);
  const [contenidoEspecial, setContenidoEspecial] = useState<{ tipo: string; titulo: string; contenido: any } | null>(null);
  const [diaActual, setDiaActual] = useState<number>(1);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const checkOverflow = () => {
      if (el.scrollHeight <= el.clientHeight + 4) {
        setNoScrollNeeded(true);
      }
    };
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setScrollPct(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    };
    checkOverflow();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [loading]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const today = await planService.getTodayPlan();
        if (!today.cabecera && !today.contenido_especial) {
          navigate("/lectura", { replace: true });
          return;
        }
        setCabecera(today.cabecera);
        setContenidoEspecial(today.contenido_especial);
        setDiaActual(today.dia_actual);
      } catch {
        navigate("/lectura", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const canContinue = noScrollNeeded || scrollPct >= 80;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F5F4]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  const activeBlock = BLOCKS.find(b => diaActual >= b.start && diaActual <= b.end) ?? BLOCKS[0];
  const tone = C[activeBlock.tone];

  const isEspecial = !!contenidoEspecial;
  const titulo = isEspecial ? contenidoEspecial!.titulo : activeBlock.title;
  const blockNum = activeBlock.id;

  const renderCabecera = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => {
      const isTitle = paragraph.startsWith("Bloque") || paragraph.startsWith("Tema");
      if (isTitle) {
        return <h3 key={i} className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mb-4">{paragraph}</h3>;
      }
      return <p key={i} className="text-base text-[#4A4644] leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{paragraph}</p>;
    });
  };

  const renderContenido = (contenido: any) => {
    if (typeof contenido === "string") {
      return contenido.split("\n\n").map((p: string, i: number) => (
        <p key={i} className="text-base text-[#4A4644] leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{p}</p>
      ));
    }
    const elements: React.ReactNode[] = [];
    if (contenido.descripcion) {
      elements.push(
        <p key="desc" className="text-base text-[#4A4644] leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{contenido.descripcion}</p>
      );
    }
    if (contenido.metodologia) {
      elements.push(
        <div key="met" className="rounded-xl p-4 mb-4" style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: tone.text }}>Metodología</p>
          <p className="text-base text-[#4A4644] leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{contenido.metodologia}</p>
        </div>
      );
    }
    if (contenido.estructura) {
      elements.push(
        <div key="est" className="rounded-xl p-4 mb-4" style={{ backgroundColor: C.yellow.bg, borderLeft: `3px solid ${C.yellow.color}` }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: C.yellow.text }}>Estructura</p>
          <p className="text-base text-[#4A4644] leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
            {contenido.estructura.duracion} · {contenido.estructura.bloques} bloques · {contenido.estructura.competencias} competencias
          </p>
        </div>
      );
    }
    if (contenido.mensaje) {
      elements.push(
        <p key="msg" className="text-base text-[#4A4644] leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{contenido.mensaje}</p>
      );
    }
    if (contenido.competencias) {
      elements.push(
        <div key="comps" className="space-y-3 mt-4">
          {contenido.competencias.map((c: any, i: number) => (
            <div key={i} className="rounded-xl p-3" style={{ backgroundColor: GRAY.faint }}>
              <p className="text-sm font-semibold text-[#3E3A38]">{c.nombre}</p>
              <p className="text-xs text-[#7A7270] mt-0.5">{c.descripcion}</p>
            </div>
          ))}
        </div>
      );
    }
    if (contenido.llamada_a_accion) {
      elements.push(
        <p key="cta" className="text-sm font-semibold text-[#3E3A38] mt-6 italic">{contenido.llamada_a_accion}</p>
      );
    }
    return elements;
  };

  const GRAY = { faint: "#F7F5F4" };

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
              <activeBlock.icon size={11} style={{ color: tone.color }} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">
              Bloque {blockNum}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#3E3A38] mt-0.5">{titulo}</p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-[#E8E4E2] flex-shrink-0">
        <div className="h-full transition-all duration-500" style={{ width: `${scrollPct}%`, backgroundColor: tone.color }} />
      </div>

      {/* Scrollable content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-8">
        <div className="max-w-lg mx-auto">
          {/* Title block */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tone.soft }}>
              <activeBlock.icon size={28} style={{ color: tone.color }} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: tone.text }}>
                {isEspecial ? `Día ${diaActual}` : `Bloque ${blockNum} · Días ${activeBlock.start}–${activeBlock.end}`}
              </p>
              <h1 className="font-['Lora'] text-xl font-semibold text-[#3E3A38]">{titulo}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-6 shadow-sm">
            {contenidoEspecial && (
              <div className="mb-6">
                {renderContenido(contenidoEspecial.contenido)}
              </div>
            )}
            {contenidoEspecial && cabecera && (
              <div className="border-t border-[rgba(62,58,56,0.09)] pt-6 mt-2">
                {renderCabecera(cabecera)}
              </div>
            )}
            {!contenidoEspecial && cabecera && renderCabecera(cabecera)}
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 pb-6 mt-8">
            <div className={`transition-all duration-500 ${canContinue ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"}`}>
              <button
                disabled={!canContinue}
                onClick={() => navigate("/lectura")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: tone.color }}>
                <ArrowRight size={15} /> Continuar a la lección
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
