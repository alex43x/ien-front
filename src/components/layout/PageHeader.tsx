import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  onBack?: () => void;
  rightContent?: ReactNode;
  bottomContent?: ReactNode;
}

export function PageHeader({ onBack, rightContent, bottomContent }: PageHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
        )}
        <img src="/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        {bottomContent}
      </div>
      {rightContent}
    </header>
  );
}
