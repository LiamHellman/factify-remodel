import OpenAI from "openai";

let client = null;
function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overall", "findings"],
  properties: {
    overall: {
      type: "object",
      additionalProperties: false,
      required: ["fallacyScore", "biasScore", "tacticScore", "verifiabilityScore"],
      properties: {
        fallacyScore: { type: "integer", minimum: 0, maximum: 100 },
        biasScore: { type: "integer", minimum: 0, maximum: 100 },
        tacticScore: { type: "integer", minimum: 0, maximum: 100 },
        verifiabilityScore: { type: "integer", minimum: 0, maximum: 100 },
      },
    },
    findings: {
      type: "array",
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id", "category", "categoryId", "label", "severity",
          "confidence", "start", "end", "quote", "explanation",
        ],
        properties: {
          id: { type: "string" },
          category: { type: "string", enum: ["fallacy", "bias", "tactic"] },
          categoryId: { type: "string" },
          label: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          start: { type: "integer", minimum: 0 },
          end: { type: "integer", minimum: 0 },
          quote: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
  },
};

/**
 * Repair/clamp finding spans to match actual text positions.
 */
function clampFindings(text, findings) {
  const n = text.length;
  return (findings || [])
    .map((f) => {
      let start = Math.max(0, Math.min(Number(f.start) || 0, n));
      let end = Math.max(0, Math.min(Number(f.end) || 0, n));
      if (end < start) [start, end] = [end, start];

      // If slice doesn't match quote, try to find the quote
      if (text.slice(start, end) !== f.quote && f.quote) {
        const idx = text.indexOf(f.quote);
        if (idx !== -1) {
          start = idx;
          end = idx + f.quote.length;
        }
      }

      if (text.slice(start, end) !== f.quote) return null;
      return { ...f, start, end };
    })
    .filter(Boolean)
    .slice(0, 12);
}

export async function analyzeWithLLM(text, settings = {}) {
  const maxFindings = Math.max(1, Math.min(Number(settings.maxFindings ?? 10), 12));
  const temperature = Math.max(0, Math.min(Number(settings.temperature ?? 0.2), 1));

  const system = [
    "You are an expert critical-reasoning auditor. Analyze text for:",
    "(A) logical fallacies, (B) cognitive biases, (C) manipulative rhetoric/tactics.",
    "",
    "OUTPUT: JSON matching the schema exactly. All indices are CHARACTER indices.",
    "For every finding: quote MUST equal text.slice(start, end) exactly.",
    `Return at most ${maxFindings} findings total.`,
    "",
    "SCORING (0-100): Higher is ALWAYS better.",
    "- fallacyScore: 0=fallacy-ridden, 100=logically rigorous",
    "- biasScore: 0=heavily biased, 100=balanced and fair",
    "- tacticScore: 0=manipulative, 100=transparent",
    "- verifiabilityScore: 0=vague/unsupported, 100=specific/sourced",
    "",
    "SEVERITY: low=subtle, medium=meaningful, high=dominant distortion",
    "CATEGORIES: fallacy | bias | tactic",
    "Only flag what is actually present. Prefer precision over volume.",
  ].join("\n");

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const resp = await getClient().responses.create({
    model,
    temperature,
    input: [
      { role: "system", content: system },
      { role: "user", content: text },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "argument_analysis",
        strict: true,
        schema: SCHEMA,
      },
    },
  });

  const parsed = JSON.parse(resp.output_text);
  parsed.findings = clampFindings(text, parsed.findings || []);

  // Normalize for frontend
  parsed.scores = {
    fallacies: parsed.overall?.fallacyScore ?? 0,
    bias: parsed.overall?.biasScore ?? 0,
    tactic: parsed.overall?.tacticScore ?? 0,
    factcheck: parsed.overall?.verifiabilityScore ?? 0,
  };

  parsed.findings = (parsed.findings || []).map((f) => ({
    ...f,
    type: f.category,
    originalText: f.quote,
  }));

  return parsed;
}
