import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  onBack?: () => void;
  rightContent?: ReactNode;
  bottomContent?: ReactNode;
}

export function PageHeader({ onBack, rightContent, bottomContent }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-[#7A7270] hover:text-[#3E3A38] transition-colors">
            <ChevronLeft size={20} />
          </button>
        )}
        <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        {bottomContent}
      </div>
      {rightContent}
    </header>
  );
}
