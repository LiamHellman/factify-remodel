import { useState } from "react";
import { BarChart3, List, AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import ScoreCard from "./ScoreCard";

export default function InsightsPanel({
  results,
  selectedFinding,
  onSelect,
  isAnalyzing,
}) {
  const [tab, setTab] = useState("summary");
  const [expandedId, setExpandedId] = useState(null);

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="w-7 h-7 text-accent animate-spin mb-4" />
        <h3 className="font-[family-name:var(--font-serif)] text-xl text-ink">
          Deconstructing Argument
        </h3>
        <p className="text-[11px] text-ink-faint mt-1">
          Exposing persuasive tactics…
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <BarChart3 className="w-7 h-7 text-ink-faint mb-4" />
        <h3 className="font-[family-name:var(--font-serif)] text-xl text-ink-muted">
          No Analysis Yet
        </h3>
        <p className="text-[11px] text-ink-faint mt-1">
          Upload a document and click Analyze to see insights
        </p>
      </div>
    );
  }

  const severityBadge = {
    low: "bg-paper-dark text-ink-muted",
    medium: "bg-fallacy/10 text-fallacy",
    high: "bg-bias/10 text-bias",
  };

  const typeBadge = {
    bias: "bg-bias/10 text-bias",
    fallacy: "bg-fallacy/10 text-fallacy",
    tactic: "bg-tactic/10 text-tactic",
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-rule-light px-4 py-2 flex gap-1 flex-shrink-0">
        {[
          { key: "summary", label: "Summary", icon: BarChart3 },
          { key: "findings", label: "Findings", icon: List },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs tracking-wide transition-colors ${
              tab === key
                ? "bg-white text-accent font-medium border border-rule-light"
                : "text-ink-faint hover:text-ink-muted"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tab === "summary" ? (
          <>
            <ScoreCard
              label="Neutrality"
              score={results.scores?.bias ?? 0}
              color="red"
              desc="Measures emotional nudges and loaded language"
            />
            <ScoreCard
              label="Soundness"
              score={results.scores?.fallacies ?? 0}
              color="gold"
              desc="Identifies gaps in logical reasoning"
            />
            <ScoreCard
              label="Transparency"
              score={results.scores?.tactic ?? 0}
              color="teal"
              desc="Detects hidden persuasive techniques"
            />
            <ScoreCard
              label="Verifiability"
              score={results.scores?.factcheck ?? 0}
              color="slate"
              desc="Ability to back claims with evidence"
            />
          </>
        ) : (
          <>
            {!results.findings?.length ? (
              <div className="text-center py-10">
                <AlertCircle className="w-8 h-8 text-ink-faint mx-auto mb-2" />
                <p className="text-[11px] text-ink-faint">
                  No linguistic tricks detected
                </p>
              </div>
            ) : (
              results.findings.map((f) => {
                const selected = selectedFinding?.id === f.id;
                const expanded = expandedId === f.id;

                return (
                  <button
                    key={f.id}
                    onClick={() => onSelect(f)}
                    className={`w-full text-left p-3.5 border transition-colors ${
                      selected
                        ? "bg-white border-accent/30 shadow-sm"
                        : "bg-paper-warm border-rule-light hover:border-rule"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-sm font-medium text-ink">
                        {f.label}
                      </span>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${
                            typeBadge[f.type] ?? typeBadge.bias
                          }`}
                        >
                          {f.type}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${
                            severityBadge[f.severity] ?? severityBadge.low
                          }`}
                        >
                          {f.severity}
                        </span>
                      </div>
                    </div>

                    <p
                      className={`text-xs text-ink-muted leading-relaxed ${
                        expanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {f.explanation}
                    </p>

                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expanded ? null : f.id);
                      }}
                      className="inline-flex items-center gap-0.5 mt-1.5 text-[10px] text-accent hover:text-accent-warm tracking-wide"
                    >
                      {expanded ? "Less" : "More"}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
