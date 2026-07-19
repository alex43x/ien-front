import { useTheme } from "../context/ThemeContext";
import { C, GRAY, type Tone } from "../constants/colors";

export interface ToneColors {
  color: string;
  bg: string;
  border: string;
  soft: string;
  text: string;
}

export function useToneColors(tone: Tone): ToneColors {
  const { theme } = useTheme();
  const t = C[tone];
  if (theme === "dark") {
    return { color: t.colorDark, bg: t.bgDark, border: t.borderDark, soft: t.softDark, text: t.textDark };
  }
  return { color: t.color, bg: t.bg, border: t.border, soft: t.soft, text: t.text };
}

export interface GrayColors {
  base: string;
  mid: string;
  light: string;
  faint: string;
}

export function useGray(): GrayColors {
  const { theme } = useTheme();
  if (theme === "dark") {
    return { base: GRAY.baseDark, mid: GRAY.midDark, light: GRAY.lightDark, faint: GRAY.faintDark };
  }
  return { base: GRAY.base, mid: GRAY.mid, light: GRAY.light, faint: GRAY.faint };
}
