import { ArrowLeft } from "lucide-react";

export default function Header({ showBack, onBack }) {
  return (
    <header className="h-14 px-6 bg-paper border-b border-rule flex items-center justify-between sticky top-0 z-50">
      <button
        onClick={onBack}
        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
      >
        {showBack && <ArrowLeft className="w-4 h-4 text-ink-muted" />}
        <span className="font-[family-name:var(--font-serif)] text-2xl text-ink tracking-tight">
          Factify
        </span>
      </button>

      <span className="text-[11px] text-ink-faint tracking-wide hidden sm:block">
        Bias & Fallacy Detection
      </span>
    </header>
  );
}
