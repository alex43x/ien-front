export const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828" },
} as const;

export type Tone = keyof typeof C;

export const GRAY = { base: "#3E3A38", mid: "#7A7270", light: "#E8E4E2", faint: "#F7F5F4" } as const;
