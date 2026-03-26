import { MODES } from './ruleBuilderConstants';

export const uid = () => Math.random().toString(36).slice(2, 8);
export const emptyCondition = () => ({ id: uid(), field: "runs", operator: "gte", value: 0 });
export const emptyThreshold = () => ({ id: uid(), value: 0, operator: "gte", points: 0 });
export const emptySegment   = () => ({
  id: uid(), label: "New Segment",
  when: [], score: { operation: "field", field: "runs" }, thresholds: [], default: 0,
});
export const emptyRule = () => ({
  id: uid(), name: "newRule", type: "scored_segments", segments: [emptySegment()],
});
export const emptyGroupRule = () => ({
  id: uid(), name: "impact", type: "group", rules: [],
});
export const emptyChildRule = () => ({
  id: uid(), name: "newChild", type: "scored_segments", segments: [emptySegment()],
});

export function buildFormulaPreview(score) {
  const op = score.operation;
  if (!op) return null;

  if (op === "field") {
    if (!score.field) return null;
    return { parts: [{ t: score.field, c: "var(--accent2)" }], note: "raw field value" };
  }
  if (op === "fixed") {
    return {
      parts: [{ t: String(score.value ?? 0), c: "var(--accent)" }],
      note: "constant — ignores player stats",
    };
  }
  if (op === "multiply") {
    if (!score.field) return null;
    return {
      parts: [
        { t: score.field, c: "var(--accent2)" },
        { t: "  ×  ",       c: "var(--muted)"   },
        { t: String(score.factor ?? 1), c: "var(--accent)" },
      ],
      note: "field × factor",
    };
  }
  if (op === "sum") {
    const fields = score.fields || [];
    if (!fields.length) return null;
    const parts = [];
    fields.forEach((f, i) => {
      if (i) parts.push({ t: " + ", c: "var(--muted)" });
      parts.push({ t: f, c: "var(--accent2)" });
    });
    return { parts, note: "sum of all selected fields" };
  }
  if (op === "weighted_sum") {
    const fields  = score.fields  || [];
    const weights = score.weights || [];
    if (!fields.length) return null;
    const parts = [];
    fields.forEach((f, i) => {
      if (i) parts.push({ t: " + ", c: "var(--muted)" });
      const w = weights[i] ?? 1;
      if (w !== 1) {
        parts.push({ t: "(", c: "var(--muted)" });
        parts.push({ t: f,   c: "var(--accent2)" });
        parts.push({ t: " × ", c: "var(--muted)" });
        parts.push({ t: String(w), c: "var(--accent)" });
        parts.push({ t: ")", c: "var(--muted)" });
      } else {
        parts.push({ t: f, c: "var(--accent2)" });
      }
    });
    return { parts, note: "each field multiplied by its weight, then summed" };
  }
  if (op === "ratio") {
    const { numerator: n, denominator: d, factor: fac = 1 } = score;
    if (!n || !d) return null;
    const parts = [
      { t: "(", c: "var(--muted)" },
      { t: n,   c: "var(--accent2)" },
      { t: " ÷ ", c: "var(--muted)" },
      { t: d,   c: "var(--accent2)" },
      { t: ")", c: "var(--muted)" },
    ];
    if (fac !== 1) {
      parts.push({ t: " × ", c: "var(--muted)" });
      parts.push({ t: String(fac), c: "var(--accent)" });
    }
    return { parts, note: "ratio scaled by optional factor" };
  }
  if (op === "difference") {
    const fields = score.fields || [];
    if (!fields.length) return null;
    const parts = [{ t: fields[0], c: "var(--accent2)" }];
    fields.slice(1).forEach(f => {
      parts.push({ t: " − ", c: "var(--accent3)" });
      parts.push({ t: f,     c: "var(--text)"    });
    });
    const allowNeg = score.allowNegative ?? true;
    if (!allowNeg) parts.push({ t: "  →  max(…, 0)", c: "var(--accent)" });
    return {
      parts,
      note: allowNeg ? "result can be negative" : "negative results clamped to 0",
    };
  }
  return null;
}

export function initModeData(defaultRules) {
  return Object.fromEntries(
    Object.entries(MODES).map(([mode, { categories }]) => {
      const base = categories.map(name => ({ id: uid(), name, rules: [] }));
      return [mode, parseJsonToCategories(defaultRules[mode] || {}, base)];
    })
  );
}

export function parseJsonToModes(parsed, existing) {
  return Object.fromEntries(
    Object.entries(existing).map(([mode, cats]) => [
      mode,
      parseJsonToCategories(parsed[mode] || {}, cats),
    ])
  );
}

export function parseJsonToCategories(parsed, existing) {
  const parseRule = (name, def) => {
    if (def.type === "group") {
      return {
        id: uid(), name, type: "group",
        rules: Object.entries(def.rules || {}).map(([cn, cd]) => parseRule(cn, cd)),
      };
    }
    return {
      id: uid(), name, type: def.type || "scored_segments",
      segments: (def.segments || []).map(seg => ({
        id: uid(),
        label: seg.label || "Segment",
        when: (seg.when || []).map(c => ({ id: uid(), ...c })),
        score: seg.score || { operation: "field", field: "runs" },
        thresholds: (seg.thresholds || []).map(t => ({ id: uid(), ...t })),
        default: seg.default ?? 0,
      })),
    };
  };

  return existing.map(cat => {
    const data = parsed[cat.name];
    if (!data) return cat;
    return {
      ...cat,
      rules: Object.entries(data).map(([name, def]) => parseRule(name, def)),
    };
  });
}

const serialiseScore = s => {
  if (!s || !s.operation) return s;
  if (s.operation === "fixed") return { operation: "fixed", value: s.value ?? 0 };
  return s;
};

const serialisePoints = p => {
  if (typeof p === "object" && p !== null) return p;
  return Number(p ?? 0);
};

const serialiseRule = rule => {
  if (rule.type === "group") {
    return {
      type: "group",
      rules: Object.fromEntries(
        (rule.rules || []).map(child => [child.name, serialiseRule(child)])
      ),
    };
  }
  return {
    type: rule.type,
    segments: (rule.segments || []).map(seg => ({
      label: seg.label,
      when: seg.when.map(({ field, operator, value }) => ({ field, operator, value })),
      score: serialiseScore(seg.score),
      thresholds: seg.thresholds.map(({ value, operator, points }) => ({
        operator,
        value: Number(value ?? 0),
        points: serialisePoints(points),
      })),
      default: serialisePoints(seg.default),
    })),
  };
};

export function buildRuleJson(rule) {
  return JSON.stringify({ [rule.name]: serialiseRule(rule) }, null, 2);
}

export function buildJson(modeData) {
  const out = {};
  for (const [mode, cats] of Object.entries(modeData)) {
    const modeOut = {};
    for (const cat of cats) {
      if (!cat.rules.length) continue;
      modeOut[cat.name] = {};
      for (const rule of cat.rules) {
        modeOut[cat.name][rule.name] = serialiseRule(rule);
      }
    }
    if (Object.keys(modeOut).length) out[mode] = modeOut;
  }
  return JSON.stringify(out, null, 2);
}

export function highlight(json) {
  return json
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, m => {
      if (/^"/.test(m)) return /:$/.test(m) ? `<span class="json-key">${m}</span>` : `<span class="json-str">${m}</span>`;
      if (/true|false/.test(m)) return `<span class="json-bool">${m}</span>`;
      if (/null/.test(m)) return `<span class="json-null">${m}</span>`;
      return `<span class="json-num">${m}</span>`;
    });
}
