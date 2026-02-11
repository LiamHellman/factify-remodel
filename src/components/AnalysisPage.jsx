import { useState, useMemo } from "react";
import { analyzeText } from "../api/analyze";
import { buildHighlightSpans } from "../utils/highlights";
import InputPanel from "./InputPanel";
import DocumentViewer from "./DocumentViewer";
import InsightsPanel from "./InsightsPanel";
import ControlBar from "./ControlBar";

const TYPE_MAP = {
  bias: new Set(["bias"]),
  fallacies: new Set(["fallacy"]),
  tactic: new Set(["tactic"]),
};

export default function AnalysisPage() {
  const [content, setContent] = useState("");
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [checks, setChecks] = useState({
    bias: true,
    fallacies: true,
    tactic: true,
  });

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setSelectedFinding(null);
    try {
      const data = await analyzeText(content, {
        maxFindings: 10,
        temperature: 0.2,
      });
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const enabledFindings = useMemo(() => {
    const all = results?.findings ?? [];
    if (all.length === 0) return [];
    const enabled = new Set();
    for (const [key, types] of Object.entries(TYPE_MAP)) {
      if (checks[key]) for (const t of types) enabled.add(t);
    }
    return all.filter((f) => enabled.has(f.type));
  }, [results, checks]);

  const spans = useMemo(
    () => buildHighlightSpans(content, enabledFindings),
    [content, enabledFindings]
  );

  const filteredResults = useMemo(() => {
    if (!results) return null;
    return { ...results, findings: enabledFindings };
  }, [results, enabledFindings]);

  const handleSelect = (f) => {
    setSelectedFinding((prev) => (prev?.id === f?.id ? null : f));
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <ControlBar
        checks={checks}
        onToggle={(k) => setChecks((p) => ({ ...p, [k]: !p[k] }))}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        hasContent={!!content.trim()}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left — Input */}
        <div className="w-72 border-r border-rule-light bg-paper flex-shrink-0 overflow-y-auto">
          <InputPanel content={content} onChange={setContent} />
        </div>

        {/* Center — Document */}
        <div className="flex-1 min-w-0 bg-white">
          <DocumentViewer
            content={content}
            spans={spans}
            selectedFinding={selectedFinding}
            onSelect={handleSelect}
          />
        </div>

        {/* Right — Insights */}
        <div className="w-96 border-l border-rule-light bg-paper flex-shrink-0 overflow-hidden">
          <InsightsPanel
            results={filteredResults}
            selectedFinding={selectedFinding}
            onSelect={handleSelect}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
}
