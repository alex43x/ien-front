import { Brain, Sparkles, ShieldCheck, Flame, HeartHandshake, Users } from "lucide-react";
import type { Tone } from "./colors";

export interface Block {
  id: number;
  start: number;
  end: number;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  tone: Tone;
  desc: string;
}

export const BLOCKS: Block[] = [
  { id: 1, start: 1,  end: 5,  title: "Autoconciencia",     icon: Brain,          tone: "yellow",
    desc: "Aprende a reconocer tus señales internas y distinguir entre el hambre fisiológica y el hambre emocional. El primer paso hacia el cambio es observarte sin juzgarte." },
  { id: 2, start: 6,  end: 10, title: "Autoconfianza",      icon: Sparkles,       tone: "green",
    desc: "Reconstruye tu identidad dejando atrás la historia del 'dietante fallido'. Aquí te conviertes en el protagonista de tu propia historia de cambio." },
  { id: 3, start: 11, end: 15, title: "Autocontrol",        icon: ShieldCheck,    tone: "red",
    desc: "Crea un espacio entre el estímulo y la respuesta. Aprenderás a gestionar los impulsos sin reprimirlos, usando la Pausa Poderosa como herramienta diaria." },
  { id: 4, start: 16, end: 20, title: "Automotivación",     icon: Flame,          tone: "yellow",
    desc: "Ancla el cambio en tus valores más profundos. Pasarás del 'tengo que' al 'quiero', descubriendo la motivación intrínseca que no depende de factores externos." },
  { id: 5, start: 21, end: 25, title: "Empatía",            icon: HeartHandshake, tone: "green",
    desc: "Trátate con la misma amabilidad que ofreces a quienes amas. La autocompasión es la herramienta más poderosa para sostener el cambio a largo plazo." },
  { id: 6, start: 26, end: 30, title: "Competencia Social", icon: Users,          tone: "red",
    desc: "Mantén tus hábitos frente a la presión del entorno. Aprenderás a disfrutar y celebrar en contextos sociales sin culpa y sin renunciar a tu bienestar." },
];
