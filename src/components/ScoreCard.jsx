import { useEffect, useState, useMemo } from "react";

const COLOR_MAP = {
  red:    { stroke: "#c44030", bg: "rgba(196,64,48,0.06)", border: "rgba(196,64,48,0.2)" },
  gold:   { stroke: "#b8860b", bg: "rgba(184,134,11,0.06)", border: "rgba(184,134,11,0.2)" },
  teal:   { stroke: "#2e7d6e", bg: "rgba(46,125,110,0.06)", border: "rgba(46,125,110,0.2)" },
  slate:  { stroke: "#4a6480", bg: "rgba(74,100,128,0.06)", border: "rgba(74,100,128,0.2)" },
};

export default function ScoreCard({ label, score, color = "red", desc }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.red;
  const r = 32;
  const circumference = 2 * Math.PI * r;

  const normalized = useMemo(() => {
    let v = Number(score);
    if (!Number.isFinite(v)) v = 0;
    return Math.max(0, Math.min(100, v));
  }, [score]);

  const [anim, setAnim] = useState(0);
  useEffect(() => setAnim(normalized), [normalized]);

  const offset = circumference * (1 - anim / 100);

  return (
    <div className="p-3.5 border" style={{ backgroundColor: c.bg, borderColor: c.border }}>
      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90">
            <circle cx="28" cy="28" r={r} stroke="currentColor" strokeWidth="4" fill="none" className="text-rule-light" />
            <circle
              cx="28" cy="28" r={r}
              stroke={c.stroke} strokeWidth="4" fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-serif)] text-xl" style={{ color: c.stroke }}>
              {Math.round(normalized)}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">{label}</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
