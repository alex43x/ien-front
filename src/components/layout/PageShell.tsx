import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}
      style={{ fontFamily: "'Inter', sans-serif" }}>
      {children}
    </div>
  );
}
