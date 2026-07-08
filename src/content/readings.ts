export interface StopItem {
  letra: string;
  palabra: string;
  desc: string;
}

export interface Reading {
  bloque: number;
  dia: number;
  tono: "red" | "green" | "yellow";
  titulo: string;
  cita: string;
  autor: string;
  tiempoMin: number;
  paragraphs: string[];
  lista: StopItem[];
  cierre: string;
  cuerpo: string;
  pregunta: string;
}

export const READING_DIA_12: Reading = {
  bloque: 3,
  dia: 12,
  tono: "red",
  titulo: "La diferencia entre gestionar y reprimir",
  cita: "Entre el estímulo y la respuesta hay un espacio. En ese espacio reside nuestra libertad y nuestra capacidad de elegir.",
  autor: "Viktor Frankl",
  tiempoMin: 4,
  paragraphs: [
    "Cuando sentimos el impulso de comer sin hambre real, solemos actuar en piloto automático. El estímulo llega —aburrimiento, estrés, soledad— y la respuesta ocurre casi sin darnos cuenta. Buscamos comida no porque el cuerpo lo necesite, sino porque la mente necesita alivio.",
    "La clave no está en suprimir ese impulso. Eso sería represión, y la represión no funciona: la emoción que empujamos hacia adentro regresa con más fuerza, habitualmente a través del cuerpo — un atracón, una noche sin dormir, una explosión de ira en el momento menos esperado.",
    "Gestionar, en cambio, significa algo distinto. Significa reconocer la emoción, darle un nombre: «Estoy sintiendo ansiedad ahora mismo». Este simple acto de nombrar —en neurociencia se llama affect labeling— reduce de manera automática la intensidad de la emoción. No la resuelve, pero crea el espacio que Viktor Frankl describe: el espacio donde vive tu libertad.",
    "La técnica STOP es una herramienta sencilla para construir esa pausa consciente entre el estímulo y la respuesta:",
  ],
  lista: [
    { letra: "S", palabra: "Stop", desc: "Detente físicamente. Pon los pies en el suelo." },
    { letra: "T", palabra: "Take a breath", desc: "Respira una sola vez, lento y profundo." },
    { letra: "O", palabra: "Observe", desc: "Observa qué estás sintiendo sin juzgarlo." },
    { letra: "P", palabra: "Proceed with awareness", desc: "Decide con conciencia qué quieres hacer." },
  ],
  cierre: "No se trata de tener fuerza de voluntad infinita. Se trata de ensanchar ese espacio donde vive tu libertad. Cada vez que practicas la pausa, ese espacio crece un poco más.",
  cuerpo: "Reprimir significa empujar la emoción hacia adentro, negarla. A corto plazo funciona, pero regresa con más fuerza. Gestionar, en cambio, significa reconocer la emoción, nombrarla, y decidir conscientemente cómo responder. Al nombrarla, el cerebro reduce automáticamente su intensidad — un fenómeno llamado «affect labeling» con respaldo en neurociencia.",
  pregunta: "¿Hay alguna emoción que sueles reprimir en lugar de reconocer? ¿Qué sientes ahora mismo, exactamente?",
};
