import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { C } from "@/constants/colors";

const TONO = "red" as const;
const tone = C[TONO];

type Question =
  | { id: number; type: "open"; pregunta: string; placeholder: string }
  | { id: number; type: "scale"; pregunta: string; min: string; max: string; steps: number }
  | { id: number; type: "choice"; pregunta: string; opciones: string[] };

const QUESTIONS: Question[] = [
  {
    id: 1, type: "open",
    pregunta: "¿Hay alguna emoción que sueles reprimir en lugar de reconocer? ¿Cuál es?",
    placeholder: "Tómate tu tiempo. No hay respuesta correcta ni incorrecta.",
  },
  {
    id: 2, type: "scale",
    pregunta: "¿Con qué frecuencia comes en respuesta a emociones (no a hambre física real)?",
    min: "Casi nunca", max: "Muy frecuentemente", steps: 5,
  },
  {
    id: 3, type: "scale",
    pregunta: "¿Qué tan capaz te sientes hoy de crear una pausa antes de actuar por impulso?",
    min: "Nada capaz", max: "Completamente capaz", steps: 5,
  },
  {
    id: 4, type: "choice",
    pregunta: "¿Cuál es la emoción que más frecuentemente te lleva a comer sin hambre?",
    opciones: ["Estrés o ansiedad", "Aburrimiento", "Tristeza o soledad", "Ira o frustración", "Cansancio", "Otra"],
  },
  {
    id: 5, type: "open",
    pregunta: "Describe una situación reciente donde podrías haber aplicado la técnica STOP. ¿Qué hubieras elegido con esa pausa?",
    placeholder: "Recuerda: el objetivo no es juzgarte, sino conocerte mejor.",
  },
  {
    id: 6, type: "scale",
    pregunta: "En general, ¿cómo calificarías tu bienestar emocional hoy?",
    min: "Muy bajo", max: "Excelente", steps: 10,
  },
];

type Answers = Record<number, string | number>;

export default function Preguntas() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const q = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = ((current) / total) * 100;
  const answer = answers[q.id];
  const canAdvance = answer !== undefined && answer !== "";

  const next = () => {
    if (current < total - 1) setCurrent((c) => c + 1);
    else setSubmitted(true);
  };
  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F5F4] flex flex-col items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: C.green.soft }}>
            <CheckCircle2 size={36} style={{ color: C.green.color }} />
          </div>
          <h1 className="font-['Lora'] text-3xl font-semibold text-[#3E3A38] mb-3">Reflexión completada</h1>
          <p className="text-[#7A7270] leading-relaxed mb-2">
            Gracias por tomarte este tiempo contigo misma. Cada respuesta es un paso hacia el autoconocimiento.
          </p>
          <p className="text-sm font-['Lora'] italic text-[#7A7270] mb-8">
            "Conocerse es el principio de toda sabiduría." — Aristóteles
          </p>

          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 text-left mb-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-4">Resumen · Día 12 · Bloque 3</p>
            <div className="space-y-3">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: tone.soft }}>
                    <span className="text-[9px] font-mono font-bold" style={{ color: tone.color }}>{q.id}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7270] leading-snug">{q.pregunta}</p>
                    <p className="text-xs font-semibold text-[#3E3A38] mt-0.5">
                      {q.type === "scale"
                        ? `${answers[q.id]} / ${q.steps}`
                        : String(answers[q.id] || "—")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#3E3A38" }}>
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F4] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-5 py-3 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => current > 0 ? prev() : navigate("/lectura")} className="text-[#7A7270] hover:text-[#3E3A38] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: tone.soft }}>
              <ShieldCheck size={11} style={{ color: tone.color }} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Autocontrol · Día 12</p>
          </div>
          <p className="text-sm font-semibold text-[#3E3A38] mt-0.5">Preguntas de reflexión</p>
        </div>
        <span className="text-xs font-mono text-[#7A7270] flex-shrink-0">{current + 1}/{total}</span>
      </header>

      {/* Progress */}
      <div className="h-1 bg-[#E8E4E2] flex-shrink-0">
        <div className="h-full transition-all duration-500" style={{ width: `${progress + (100 / total)}%`, backgroundColor: tone.color }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full">

          {/* Question number */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-['Lora'] font-semibold text-sm"
              style={{ backgroundColor: tone.soft, color: tone.color }}>
              {current + 1}
            </div>
            <div className="flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="h-1 rounded-full transition-all"
                  style={{
                    width: i === current ? 20 : 6,
                    backgroundColor: i <= current ? tone.color : C.yellow.soft,
                  }} />
              ))}
            </div>
          </div>

          {/* Question */}
          <h2 className="font-['Lora'] text-xl font-semibold text-[#3E3A38] leading-snug mb-8">
            {q.pregunta}
          </h2>

          {/* Answer input by type */}
          {q.type === "open" && (
            <textarea
              className="w-full rounded-2xl border-2 text-sm text-[#3E3A38] p-4 resize-none focus:outline-none transition-all bg-white"
              style={{
                borderColor: answer ? tone.color : "rgba(62,58,56,0.12)",
                minHeight: 140,
                fontFamily: "'Lora', serif",
                lineHeight: 1.7,
              }}
              placeholder={q.placeholder}
              value={(answer as string) || ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
            />
          )}

          {q.type === "scale" && (
            <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-6">
              <div className="flex gap-2 justify-between mb-4">
                {Array.from({ length: q.steps }).map((_, i) => {
                  const val = i + 1;
                  const selected = answer === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                      className="flex-1 aspect-square rounded-xl font-mono font-semibold text-sm transition-all hover:scale-105"
                      style={{
                        backgroundColor: selected ? tone.color : tone.bg,
                        color: selected ? "white" : tone.color,
                        border: `2px solid ${selected ? tone.color : tone.soft}`,
                      }}>
                      {val}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-mono text-[#7A7270]">{q.min}</span>
                <span className="text-xs font-mono text-[#7A7270]">{q.max}</span>
              </div>
              {answer && (
                <div className="mt-4 pt-4 border-t border-[rgba(62,58,56,0.08)] text-center">
                  <span className="font-['Lora'] text-2xl font-semibold" style={{ color: tone.color }}>{answer}</span>
                  <span className="text-[#7A7270] font-mono text-sm">/{q.steps}</span>
                </div>
              )}
            </div>
          )}

          {q.type === "choice" && (
            <div className="space-y-2">
              {q.opciones.map((op) => {
                const selected = answer === op;
                return (
                  <button
                    key={op}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: op }))}
                    className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border-2 text-sm font-medium text-left transition-all hover:border-opacity-100"
                    style={{
                      backgroundColor: selected ? tone.bg : "white",
                      borderColor: selected ? tone.color : "rgba(62,58,56,0.1)",
                      color: selected ? tone.text : "#3E3A38",
                    }}>
                    {op}
                    {selected && <CheckCircle2 size={16} style={{ color: tone.color }} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {current > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-[#7A7270] border border-[rgba(62,58,56,0.12)] bg-white hover:bg-[#F7F5F4] transition-all">
                <ChevronLeft size={15} />
                Anterior
              </button>
            )}
            <button
              disabled={!canAdvance}
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: tone.color }}>
              {current === total - 1 ? (
                <><Send size={14} /> Enviar respuestas</>
              ) : (
                <>Siguiente <ChevronRight size={15} /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
