/**
 * Severity ranking for findings.
 */
export function severityRank(sev) {
  switch (sev) {
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

/**
 * Build non-overlapping highlight spans from potentially overlapping findings.
 */
export function buildHighlightSpans(text, findings) {
  if (!text || !Array.isArray(findings) || findings.length === 0) return [];

  const n = text.length;
  const boundaries = new Set([0, n]);

  for (const f of findings) {
    if (!f) continue;
    const s = Math.max(0, Math.min(n, f.start));
    const e = Math.max(0, Math.min(n, f.end));
    if (e > s) {
      boundaries.add(s);
      boundaries.add(e);
    }
  }

  const pts = Array.from(boundaries).sort((a, b) => a - b);

  const pickBest = (cands) => {
    let best = null;
    let bestScore = -Infinity;
    for (const f of cands) {
      const score =
        severityRank(f.severity) * 1000 +
        (f.confidence ?? 0) * 100 +
        ((f.end ?? 0) - (f.start ?? 0)) * 0.001;
      if (score > bestScore) {
        bestScore = score;
        best = f;
      }
    }
    return best;
  };

  const spans = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (b <= a) continue;
    const active = findings.filter((f) => f.start <= a && f.end >= b);
    if (active.length === 0) continue;
    const key = active
      .map((f) => f.id)
      .sort()
      .join("|");
    spans.push({
      start: a,
      end: b,
      findings: active,
      primary: pickBest(active),
      _key: key,
    });
  }

  if (spans.length === 0) return [];

  // Merge adjacent spans with identical finding sets
  const merged = [];
  let cur = spans[0];
  for (let i = 1; i < spans.length; i++) {
    const nxt = spans[i];
    if (nxt.start === cur.end && nxt._key === cur._key) {
      cur = { ...cur, end: nxt.end };
    } else {
      merged.push(cur);
      cur = nxt;
    }
  }
  merged.push(cur);
  return merged.map(({ _key, ...rest }) => rest);
}
