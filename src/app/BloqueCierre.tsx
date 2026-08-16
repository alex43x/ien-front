import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, ArrowRight, Award } from "lucide-react";
import { BLOCKS } from "@/constants/program";
import { useToneColors } from "@/hooks/useToneColors";
import { planService } from "../services/plan.service";

interface BloqueCierreState {
  diaActual: number;
  conclusion: string;
  respuesta_usuario?: { id: string; valor: any; tipo: string }[];
}

export default function BloqueCierre() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as BloqueCierreState | null;
  const [scrollPct, setScrollPct] = useState(0);
  const [noScrollNeeded, setNoScrollNeeded] = useState(false);
  const [completando, setCompletando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const diaActual = navState?.diaActual ?? 5;
  const conclusion = navState?.conclusion ?? "";
  const respuesta_usuario = navState?.respuesta_usuario;

  const activeBlock = BLOCKS.find(b => diaActual >= b.start && diaActual <= b.end) ?? BLOCKS[0];
  const tone = useToneColors(activeBlock.tone);

  // Redirigir si no hay datos
  useEffect(() => {
    if (!navState?.conclusion) {
      navigate("/lectura", { replace: true });
    }
  }, []);

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
  }, []);

  const canContinue = noScrollNeeded || scrollPct >= 80;

  const handleComplete = async () => {
    if (completando) return;
    setCompletando(true);
    setError(null);
    try {
      await planService.completeDay(respuesta_usuario);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error al completar el día:", err);
      setError("Ocurrió un error al guardar tu progreso. Inténtalo de nuevo.");
    } finally {
      setCompletando(false);
    }
  };

  // Render el texto de conclusión párrafo a párrafo
  const renderConclusion = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => {
      const isTitle =
        paragraph.startsWith("Conclusión") ||
        paragraph.startsWith("Reflexión Final");
      if (isTitle) {
        return (
          <h3
            key={i}
            className="font-['Lora'] text-lg font-semibold text-foreground mb-4"
          >
            {paragraph}
          </h3>
        );
      }
      return (
        <p
          key={i}
          className="text-base text-muted-foreground leading-relaxed mb-4"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div
      className="h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-5 py-3 flex items-center gap-4 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ backgroundColor: tone.soft }}
            >
              <Award size={11} style={{ color: tone.color }} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Cierre · Bloque {activeBlock.id}
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground truncate mt-0.5">
            {activeBlock.title}
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted flex-shrink-0">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${scrollPct}%`, backgroundColor: tone.color }}
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-8">
        <div className="max-w-lg mx-auto">

          {/* Badge de cierre */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: tone.soft }}
            >
              <CheckCircle2 size={28} style={{ color: tone.color }} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Día {diaActual} · Cierre de bloque
              </p>
              <h1 className="font-['Lora'] text-xl font-semibold text-foreground">
                Reflexión Final
              </h1>
            </div>
          </div>

          {/* Conclusión */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8">
            <div
              className="rounded-xl p-4 mb-6"
              style={{
                backgroundColor: tone.bg,
                borderLeft: `4px solid ${tone.color}`,
              }}
            >
              <p
                className="text-xs font-mono uppercase tracking-wider mb-2"
                style={{ color: tone.text }}
              >
                Cierre del bloque
              </p>
            </div>
            {renderConclusion(conclusion)}
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 pb-6">
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive mb-3">
                {error}
              </p>
            )}
            <div
              className={`transition-all duration-500 ${
                canContinue
                  ? "opacity-100 translate-y-0"
                  : "opacity-40 translate-y-2"
              }`}
            >
              <button
                disabled={!canContinue || completando}
                onClick={handleComplete}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-background transition-all hover:opacity-90 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: tone.color }}
              >
                {completando ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <ArrowRight size={15} /> Finalizar y volver al inicio
                  </>
                )}
              </button>
              {!canContinue && (
                <p className="text-center text-xs font-mono text-muted-foreground mt-2">
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
