import type { ReactNode } from "react";
import { C } from "@/constants/colors";
import type { Tone } from "@/constants/colors";

interface TagProps {
  children: ReactNode;
  tone: Tone;
}

export function Tag({ children, tone: t }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
      style={{ backgroundColor: C[t].soft, color: C[t].text }}>
      {children}
    </span>
  );
}
