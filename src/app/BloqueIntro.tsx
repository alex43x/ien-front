import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { BLOCKS } from "@/constants/program";
import { useToneColors } from "@/hooks/useToneColors";
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

  const activeBlock = BLOCKS.find(b => diaActual >= b.start && diaActual <= b.end) ?? BLOCKS[0];
  const tone = useToneColors(activeBlock.tone);
  const yellowTone = useToneColors("yellow");

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
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  const isEspecial = !!contenidoEspecial;
  const titulo = isEspecial ? contenidoEspecial!.titulo : activeBlock.title;
  const blockNum = activeBlock.id;

  const renderCabecera = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => {
      const isTitle = paragraph.startsWith("Bloque") || paragraph.startsWith("Tema");
      if (isTitle) {
        return <h3 key={i} className="font-['Lora'] text-lg font-semibold text-foreground mb-4">{paragraph}</h3>;
      }
      return <p key={i} className="text-base text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{paragraph}</p>;
    });
  };

  const renderContenido = (contenido: any, tipo?: string) => {
    if (typeof contenido === "string") {
      return contenido.split("\n\n").map((p: string, i: number) => (
        <p key={i} className="text-base text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{p}</p>
      ));
    }

    if (tipo === "reflexion_15_dias") {
      const c = contenido;
      const elements: React.ReactNode[] = [];
      if (c.titulo) {
        elements.push(<p key="t" className="font-['Lora'] text-lg font-semibold text-foreground mb-4">{c.titulo}</p>);
      }
      if (c.progresion_consciente) {
        elements.push(
          <div key="pc" className="rounded-xl p-4 mb-4" style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}>
            <p className="text-base text-foreground leading-relaxed mb-3" style={{ fontFamily: "'Lora', serif" }}>{c.progresion_consciente.texto}</p>
            {c.progresion_consciente.cita && (
              <p className="text-sm italic text-muted-foreground" style={{ fontFamily: "'Lora', serif" }}>&ldquo;{c.progresion_consciente.cita}&rdquo;</p>
            )}
          </div>
        );
      }
      if (c.evolucion_etapas?.length) {
        elements.push(
          <div key="ee" className="space-y-3 mb-4">
            {c.evolucion_etapas.map((etapa: any, i: number) => (
              <div key={i} className="rounded-xl p-4 bg-secondary">
                <p className="text-sm font-semibold text-foreground mb-1">{etapa.titulo}</p>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{etapa.texto}</p>
              </div>
            ))}
          </div>
        );
      }
      if (c.ciencia_transformacion?.length) {
        elements.push(
          <div key="ct" className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Ciencia de la transformación</p>
            <ul className="space-y-2">
              {c.ciencia_transformacion.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" style={{ fontFamily: "'Lora', serif" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tone.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      if (c.agradecimiento) {
        elements.push(
          <div key="ag" className="rounded-xl p-4 mb-4 bg-secondary" style={{ borderLeft: `3px solid ${tone.color}` }}>
            <p className="text-sm font-semibold text-foreground mb-2">{c.agradecimiento.titulo}</p>
            <ul className="space-y-2">
              {c.agradecimiento.puntos.map((p: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{p}</li>
              ))}
            </ul>
          </div>
        );
      }
      if (c.cita_final) {
        elements.push(
          <p key="cf" className="font-['Lora'] text-base italic text-foreground text-center mt-6 mb-2 leading-relaxed">&ldquo;{c.cita_final}&rdquo;</p>
        );
      }
      if (c.firma) {
        elements.push(
          <p key="fm" className="text-xs text-muted-foreground text-center mt-4 font-mono">{c.firma}</p>
        );
      }
      return elements;
    }

    if (tipo === "reflexion_30_dias") {
      const c = contenido;
      const elements: React.ReactNode[] = [];
      if (c.titulo) {
        elements.push(<p key="t" className="font-['Lora'] text-lg font-semibold text-foreground mb-4">{c.titulo}</p>);
      }
      if (c.cita_apertura) {
        elements.push(
          <p key="ca" className="text-base italic text-foreground mb-6 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>&ldquo;{c.cita_apertura}&rdquo;</p>
        );
      }
      if (c.evolucion_dimensiones?.length) {
        elements.push(
          <div key="ed" className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Evolución por dimensiones</p>
            <div className="space-y-2">
              {c.evolucion_dimensiones.map((dim: any, i: number) => (
                <div key={i} className="rounded-xl p-3 bg-secondary">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: tone.soft, color: tone.color }}>Días {dim.dias}</span>
                    <span className="text-xs font-semibold text-foreground">{dim.competencia}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{dim.transformacion}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{dim.resultado}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (c.ciencia_transformacion) {
        const ct = c.ciencia_transformacion;
        elements.push(
          <div key="ct" className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Ciencia de la transformación</p>
            {ct.cambios_neurologicos?.length && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-foreground mb-1">Cambios neurológicos</p>
                <ul className="space-y-1.5">
                  {ct.cambios_neurologicos.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" style={{ fontFamily: "'Lora', serif" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tone.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ct.optimizacion_bioquimica?.length && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Optimización bioquímica</p>
                <ul className="space-y-1.5">
                  {ct.optimizacion_bioquimica.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" style={{ fontFamily: "'Lora', serif" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tone.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }
      if (c.sistema_operativo_social) {
        const sos = c.sistema_operativo_social;
        elements.push(
          <div key="sos" className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">{sos.titulo}</p>
            <div className="space-y-2">
              {sos.ciclo?.map((paso: any, i: number) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3 bg-secondary">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold" style={{ backgroundColor: tone.soft, color: tone.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{paso.paso}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{paso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (c.legado) {
        elements.push(
          <p key="lg" className="text-sm text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{c.legado}</p>
        );
      }
      if (c.compromiso_sagrado) {
        elements.push(
          <div key="cs" className="rounded-xl p-4 mb-4" style={{ backgroundColor: tone.bg, borderLeft: `3px solid ${tone.color}` }}>
            <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: tone.text }}>Compromiso sagrado</p>
            <p className="text-sm text-foreground leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{c.compromiso_sagrado}</p>
          </div>
        );
      }
      if (c.firma) {
        elements.push(
          <p key="fm" className="text-xs text-muted-foreground text-center mt-4 font-mono">{c.firma}</p>
        );
      }
      return elements;
    }

    const elements: React.ReactNode[] = [];
    if (contenido.descripcion) {
      elements.push(
        <p key="desc" className="text-base text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{contenido.descripcion}</p>
      );
    }
    if (contenido.metodologia) {
      elements.push(
        <div key="met" className="rounded-xl p-4 mb-4 bg-secondary" style={{ borderLeft: `3px solid ${tone.color}` }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2 text-muted-foreground">Metodología</p>
          <p className="text-base text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{contenido.metodologia}</p>
        </div>
      );
    }
    if (contenido.estructura) {
      elements.push(
        <div key="est" className="rounded-xl p-4 mb-4 bg-primary/5" style={{ borderLeft: `3px solid ${yellowTone.color}` }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2 text-primary">Estructura</p>
          <p className="text-base text-muted-foreground leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
            {contenido.estructura.duracion} · {contenido.estructura.bloques} bloques · {contenido.estructura.competencias} competencias
          </p>
        </div>
      );
    }
    if (contenido.mensaje) {
      elements.push(
        <p key="msg" className="text-base text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{contenido.mensaje}</p>
      );
    }
    if (contenido.competencias) {
      elements.push(
        <div key="comps" className="space-y-3 mt-4">
          {contenido.competencias.map((c: any, i: number) => (
            <div key={i} className="rounded-xl p-3 bg-secondary">
              <p className="text-sm font-semibold text-foreground">{c.nombre}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.descripcion}</p>
            </div>
          ))}
        </div>
      );
    }
    if (contenido.llamada_a_accion) {
      elements.push(
        <p key="cta" className="text-sm font-semibold text-foreground mt-6 italic">{contenido.llamada_a_accion}</p>
      );
    }
    return elements;
  };

  return (
    <div className="h-screen flex flex-col bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-card border-b border-border px-5 py-3 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center bg-secondary">
              <activeBlock.icon size={11} style={{ color: tone.color }} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Bloque {blockNum}
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground mt-0.5">{titulo}</p>
        </div>
      </header>

      <div className="h-1 bg-muted flex-shrink-0">
        <div className="h-full transition-all duration-500" style={{ width: `${scrollPct}%`, backgroundColor: tone.color }} />
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-secondary">
              <activeBlock.icon size={28} style={{ color: tone.color }} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {isEspecial ? `Día ${diaActual}` : `Bloque ${blockNum} · Días ${activeBlock.start}–${activeBlock.end}`}
              </p>
              <h1 className="font-['Lora'] text-xl font-semibold text-foreground">{titulo}</h1>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            {contenidoEspecial && (
              <div className="mb-6">
                {renderContenido(contenidoEspecial.contenido, contenidoEspecial.tipo)}
              </div>
            )}
            {contenidoEspecial && cabecera && (
              <div className="border-t border-border pt-6 mt-2">
                {renderCabecera(cabecera)}
              </div>
            )}
            {!contenidoEspecial && cabecera && renderCabecera(cabecera)}
          </div>

          <div className="sticky bottom-0 pb-6 mt-8">
            <div className={`transition-all duration-500 ${canContinue ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"}`}>
              <button
                disabled={!canContinue}
                onClick={() => navigate("/lectura")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-background transition-all hover:opacity-90 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: tone.color }}>
                <ArrowRight size={15} /> Continuar a la lección
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
