import { Brain, Scale, AlertOctagon, ArrowRight } from "lucide-react";

const TOGGLES = [
  { key: "bias", label: "Bias Detection", icon: Brain, dot: "bg-bias" },
  { key: "fallacies", label: "Logical Fallacies", icon: Scale, dot: "bg-fallacy" },
  { key: "tactic", label: "Tactics", icon: AlertOctagon, dot: "bg-tactic" },
];

export default function ControlBar({
  checks,
  onToggle,
  onAnalyze,
  isAnalyzing,
  hasContent,
}) {
  const anyOn = Object.values(checks).some(Boolean);
  const enabled = hasContent && !isAnalyzing && anyOn;

  return (
    <div className="h-12 px-5 bg-paper-warm border-b border-rule flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-1.5">
        {TOGGLES.map(({ key, label, icon: Icon, dot }) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border transition-colors tracking-wide ${
              checks[key]
                ? "bg-white border-rule text-ink"
                : "border-transparent text-ink-faint hover:text-ink-muted"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-opacity ${dot} ${
                checks[key] ? "opacity-100" : "opacity-20"
              }`}
            />
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onAnalyze}
        disabled={!enabled}
        className="flex items-center gap-2 px-5 py-1.5 bg-accent hover:bg-accent-warm disabled:bg-rule-light disabled:text-ink-faint text-white text-xs font-semibold tracking-wide transition-colors"
      >
        <ArrowRight className="w-3.5 h-3.5" />
        {isAnalyzing ? "Analyzing…" : "Analyze"}
      </button>
    </div>
  );
}
