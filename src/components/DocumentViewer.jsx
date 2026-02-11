import { useRef, useState, useMemo } from "react";

/** Paper-friendly highlight palette */
const TYPE_COLORS = {
  bias: { r: 196, g: 64, b: 48 },     // warm red
  fallacy: { r: 184, g: 134, b: 11 },  // dark gold
  tactic: { r: 46, g: 125, b: 110 },   // teal
};

function severityAlpha(sev) {
  return sev === "high" ? 0.2 : sev === "medium" ? 0.14 : 0.08;
}

function bgColor(findings) {
  if (!findings?.length) return null;
  let rSum = 0, gSum = 0, bSum = 0, wSum = 0, alphaComp = 1;
  for (const f of findings) {
    const c = TYPE_COLORS[f.type] ?? TYPE_COLORS.bias;
    const w = severityAlpha(f.severity);
    rSum += c.r * w; gSum += c.g * w; bSum += c.b * w;
    wSum += w; alphaComp *= 1 - w;
  }
  return {
    r: Math.round(rSum / wSum),
    g: Math.round(gSum / wSum),
    b: Math.round(bSum / wSum),
    a: Math.min(0.3, 1 - alphaComp),
  };
}

function pickPrimary(findings) {
  let best = null, bestScore = -Infinity;
  for (const f of findings) {
    const score =
      (f.severity === "high" ? 3 : f.severity === "medium" ? 2 : 1) * 1000 +
      (f.confidence ?? 0) * 100;
    if (score > bestScore) { bestScore = score; best = f; }
  }
  return best;
}

export default function DocumentViewer({ content, spans, selectedFinding, onSelect }) {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const segments = useMemo(() => {
    if (!content) return [];
    const sorted = (spans ?? []).slice().sort((a, b) => a.start - b.start);
    if (sorted.length === 0) return [{ text: content, span: null }];
    const segs = [];
    let last = 0;
    for (const sp of sorted) {
      if (sp.start > last) segs.push({ text: content.slice(last, sp.start), span: null });
      segs.push({ text: content.slice(sp.start, sp.end), span: sp });
      last = sp.end;
    }
    if (last < content.length) segs.push({ text: content.slice(last), span: null });
    return segs;
  }, [content, spans]);

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-ink-faint italic">
          No document loaded
        </p>
      </div>
    );
  }

  const isSelected = (span) =>
    selectedFinding && span?.findings?.some((f) => f.id === selectedFinding.id);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-2.5 border-b border-rule-light flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-serif)] text-sm text-ink">
          Document
        </h2>
        {spans?.length > 0 && (
          <div className="flex items-center gap-4 text-[10px] text-ink-muted tracking-wide">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-bias" />
              Bias
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fallacy" />
              Fallacy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tactic" />
              Tactic
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6">
        <p className="text-ink-light leading-relaxed whitespace-pre-wrap text-sm">
          {segments.map((seg, i) => {
            if (!seg.span) return <span key={i}>{seg.text}</span>;
            const findings = seg.span.findings ?? [];
            const primary = seg.span.primary ?? pickPrimary(findings);
            const color = bgColor(findings);
            if (!color) return <span key={i}>{seg.text}</span>;

            const selected = isSelected(seg.span);
            const alpha = hovered === i ? color.a * 0.5 : color.a;

            return (
              <span
                key={i}
                className={`cursor-pointer px-0.5 -mx-0.5 transition-all duration-150 border-b ${
                  selected
                    ? "border-b-2 border-accent"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})` }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(primary)}
                title={primary?.label}
              >
                {seg.text}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
