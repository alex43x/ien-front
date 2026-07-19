export const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", border: "#F0D080", soft: "#FAEAB0", text: "#7A5800",
    colorDark: "#F0BC48", bgDark: "#2E2718", borderDark: "#5C4A1A", softDark: "#3D3220", textDark: "#F0BC48" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", border: "#80CFC5", soft: "#B8E8E2", text: "#1E6860",
    colorDark: "#6DBFAA", bgDark: "#1A2E2A", borderDark: "#2A5048", softDark: "#243D38", textDark: "#6DBFAA" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", border: "#EFA8A8", soft: "#F8D0D0", text: "#8A2828",
    colorDark: "#E96B6B", bgDark: "#2E1A1A", borderDark: "#5C2A2A", softDark: "#3D2020", textDark: "#E96B6B" },
} as const;

export type Tone = keyof typeof C;

export const GRAY = {
  base: "#3E3A38", mid: "#7A7270", light: "#E8E4E2", faint: "#F7F5F4",
  baseDark: "#E8E4E2", midDark: "#7A7270", lightDark: "#2E2C2A", faintDark: "#1E1C1A",
} as const;
