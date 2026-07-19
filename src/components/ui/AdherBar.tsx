import { C, GRAY } from "@/constants/colors";
import type { Tone } from "@/constants/colors";

interface AdherBarProps {
  v: number;
  t: Tone;
}

export function AdherBar({ v, t }: AdherBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: GRAY.light }}>
        <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: C[t].color }} />
      </div>
      <span className="text-[10px] font-mono" style={{ color: C[t].color }}>{v}%</span>
    </div>
  );
}
