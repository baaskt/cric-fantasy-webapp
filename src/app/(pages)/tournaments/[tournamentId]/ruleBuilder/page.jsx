'use client'

import { useCallback, useRef, useState } from "react";

// ─── Palette & Tokens ────────────────────────────────────────────────────────
const SCORE_OPS  = ["field", "fixed", "multiply", "sum", "weighted_sum", "ratio", "difference"];
const OPERATORS  = ["gte", "gt", "lte", "lt", "eq", "neq"];
const CATEGORIES = ["batting", "bowling", "fielding", "bonus", "tournament"];
const POINTS_OPS = ["fixed", "as_is", "multiply", "add"];
const STAT_FIELDS = [
  "runsScored","wickets","ballsBowled","ballsFaced","runsConceded","dots","maidens","isKnockOff",
  "noBalls","fours","sixes","duck","catches","runouts","stumpings","isKeeper","wicketCode", "wides","isWinningTeam", "isPlayerOfMatch",
  "strikeRate", "Eco", "oversBowled"
];
const OP_SYMBOLS = { gte: "≥", gt: ">", lte: "≤", lt: "<", eq: "=" , neq: "≠"};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);
const emptyCondition = () => ({ id: uid(), field: "runs", operator: "gte", value: 0 });
const emptyThreshold = () => ({ id: uid(), value: 0, operator: "gte", points: 0 });
const emptySegment   = () => ({
  id: uid(), label: "New Segment",
  when: [], score: { operation: "field", field: "runs" }, thresholds: [], default: 0,
});
const emptyRule = () => ({
  id: uid(), name: "newRule", type: "scored_segments", segments: [emptySegment()],
});

// ─── Formula preview ──────────────────────────────────────────────────────────
function buildFormulaPreview(score) {
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

function FormulaPreview({ score }) {
  const p = buildFormulaPreview(score);
  if (!p) return null;
  return (
    <div style={{
      background: "var(--surface3)", borderRadius: 7, padding: "8px 12px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>
        formula preview
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.9, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {p.parts.map((pt, i) => <span key={i} style={{ color: pt.c }}>{pt.t}</span>)}
        <span style={{ color: "var(--muted)", marginLeft: 8 }}>=&nbsp;score</span>
      </div>
      {p.note && <div style={{ fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>{p.note}</div>}
    </div>
  );
}

// ─── JSON ↔ state ─────────────────────────────────────────────────────────────
function parseJsonToCategories(parsed, existing) {
  return existing.map(cat => {
    const data = parsed[cat.name];
    if (!data) return cat;
    return {
      ...cat,
      rules: Object.entries(data).map(([name, def]) => ({
        id: uid(), name, type: def.type || "scored_segments",
        segments: (def.segments || []).map(seg => ({
          id: uid(),
          label: seg.label || "Segment",
          when: (seg.when || []).map(c => ({ id: uid(), ...c })),
          score: seg.score || { operation: "field", field: "runs" },
          thresholds: (seg.thresholds || []).map(t => ({ id: uid(), ...t })),
          default: seg.default ?? 0,
        })),
      })),
    };
  });
}

function buildJson(categories) {
  const out = {};
  for (const cat of categories) {
    if (!cat.rules.length) continue;
    out[cat.name] = {};
    for (const rule of cat.rules) {
      out[cat.name][rule.name] = {
        type: rule.type,
        segments: rule.segments.map(seg => ({
          label: seg.label,
          when: seg.when.map(({ field, operator, value }) => ({ field, operator, value })),
          score: seg.score,
          thresholds: seg.thresholds.map(({ value, operator, points }) => ({
            operator,
            value: Number(value),
            points: typeof points === "object" ? points : Number(points),
          })),
          default: typeof seg.default === "object" ? seg.default : Number(seg.default),
        })),
      };
    }
  }
  return JSON.stringify(out, null, 2);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f12; --surface: #13161b; --surface2: #1b1f27; --surface3: #222733;
    --border: #2a2f3d; --accent: #c8f04a; --accent2: #4af0c8; --accent3: #f04a7a;
    --text: #e8ecf4; --muted: #6b7490;
    --mono: 'DM Mono', monospace; --serif: 'Fraunces', serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--mono); font-size: 13px; }
  .app { display: grid; grid-template-columns: 260px 1fr 380px; height: 100vh; overflow: hidden; }

  /* sidebar */
  .sidebar { background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .sidebar-header { padding: 16px 16px 12px; border-bottom: 1px solid var(--border); }
  .sidebar-header h1 { font-family: var(--serif); font-size: 18px; font-weight: 600; color: var(--accent); letter-spacing: -.3px; }
  .sidebar-header p  { color: var(--muted); font-size: 11px; margin-top: 3px; }
  .sidebar-actions   { padding: 8px; border-bottom: 1px solid var(--border); }
  .sidebar-body { flex: 1; overflow-y: auto; padding: 10px 8px; }
  .sidebar-body::-webkit-scrollbar { width: 4px; }
  .sidebar-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .import-btn {
    width: 100%; padding: 7px 10px; background: none; border: 1px dashed var(--border);
    border-radius: 6px; color: var(--muted); font-family: var(--mono); font-size: 11px;
    cursor: pointer; text-align: center; transition: all .15s;
  }
  .import-btn:hover, .import-btn.flash { border-color: var(--accent2); color: var(--accent2); }
  .import-btn.flash { border-style: solid; }

  .cat-group  { margin-bottom: 6px; }
  .cat-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 8px; cursor: pointer; border-radius: 6px;
    font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--muted); transition: background .15s;
  }
  .cat-header:hover  { background: var(--surface2); }
  .cat-header.active { color: var(--accent2); }
  .cat-badge { background: var(--surface3); color: var(--muted); border-radius: 999px; padding: 1px 7px; font-size: 10px; }
  .rule-item { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px 5px 20px; border-radius: 5px; cursor: pointer; color: var(--muted); transition: all .15s; }
  .rule-item:hover  { background: var(--surface2); color: var(--text); }
  .rule-item.active { background: var(--surface2); color: var(--accent); }
  .rule-name-label  { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn-icon { background: none; border: none; cursor: pointer; color: var(--muted); padding: 2px 4px; border-radius: 3px; font-size: 14px; line-height: 1; transition: color .15s, background .15s; }
  .btn-icon:hover { color: var(--accent3); background: rgba(240,74,122,.1); }
  .add-rule-btn { margin: 4px 8px 0 20px; padding: 4px 8px; background: none; border: 1px dashed var(--border); border-radius: 5px; color: var(--muted); font-family: var(--mono); font-size: 11px; cursor: pointer; text-align: left; transition: all .15s; }
  .add-rule-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; width: 560px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,.6); }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .modal-header h2 { font-family: var(--serif); font-size: 16px; font-weight: 600; color: var(--text); }
  .modal-body   { flex: 1; padding: 16px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .modal-footer { padding: 12px 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }
  .json-textarea { width: 100%; min-height: 240px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--mono); font-size: 11.5px; padding: 12px; resize: vertical; outline: none; line-height: 1.6; transition: border-color .15s; }
  .json-textarea:focus { border-color: var(--accent2); }
  .import-error { color: var(--accent3); font-size: 11px; background: rgba(240,74,122,.08); border: 1px solid rgba(240,74,122,.2); border-radius: 6px; padding: 8px 12px; }
  .import-hint  { color: var(--muted); font-size: 11px; line-height: 1.7; }

  /* editor */
  .editor { overflow-y: auto; padding: 24px 28px; background: var(--bg); }
  .editor::-webkit-scrollbar { width: 4px; }
  .editor::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .editor-empty { height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: var(--muted); }
  .editor-empty-icon { font-size: 48px; opacity: .3; }
  .editor-empty p { font-family: var(--serif); font-style: italic; font-size: 16px; }

  .rule-editor-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .rule-name-input { font-family: var(--serif); font-size: 22px; font-weight: 600; background: none; border: none; color: var(--text); outline: none; flex: 1; border-bottom: 1px solid transparent; transition: border-color .15s; }
  .rule-name-input:focus { border-bottom-color: var(--accent); }
  .section-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

  .segment-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 12px; overflow: hidden; }
  .segment-card-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--surface2); }
  .segment-label-input { flex: 1; background: none; border: none; font-family: var(--mono); font-size: 12px; font-weight: 500; color: var(--text); outline: none; }
  .segment-drag { color: var(--muted); font-size: 16px; cursor: grab; }
  .segment-body { padding: 14px; display: flex; flex-direction: column; gap: 14px; }

  .field-row   { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .field-label { color: var(--muted); font-size: 11px; min-width: 86px; }

  select, input[type="text"], input[type="number"] {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-family: var(--mono); font-size: 12px;
    padding: 5px 8px; border-radius: 6px; outline: none; transition: border-color .15s;
  }
  select:focus, input:focus { border-color: var(--accent2); }
  select { cursor: pointer; }
  input[type="number"] { width: 72px; }
  input[type="text"]   { width: 130px; }

  .pill-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--surface3); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; font-size: 11px; }
  .pill-tag .rm { color: var(--muted); cursor: pointer; font-size: 13px; }
  .pill-tag .rm:hover { color: var(--accent3); }

  .conditions-list { display: flex; flex-direction: column; gap: 6px; }
  .condition-row { display: flex; align-items: center; gap: 6px; background: var(--surface2); border-radius: 7px; padding: 6px 10px; flex-wrap: wrap; }
  .cond-preview  { font-size: 11px; color: var(--muted); margin-left: 4px; }
  .cond-preview strong { color: var(--accent2); }

  .thresholds-table { width: 100%; border-collapse: collapse; }
  .thresholds-table th { text-align: left; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 0 6px 6px; font-weight: 400; }
  .thresholds-table td { padding: 3px 6px; }

  .thr-summary { margin-top: 8px; display: flex; flex-direction: column; gap: 3px; padding: 6px 10px; background: var(--surface2); border-radius: 6px; }
  .thr-summary-row { font-size: 11px; color: var(--muted); }
  .thr-summary-row .match { color: var(--text); }
  .thr-summary-row .pts   { color: var(--accent2); }
  .thr-summary-row .fb    { color: var(--accent); }

  .btn { font-family: var(--mono); font-size: 11px; border-radius: 6px; padding: 5px 12px; cursor: pointer; border: none; transition: all .15s; }
  .btn-ghost   { background: none; border: 1px dashed var(--border); color: var(--muted); }
  .btn-ghost:hover   { border-color: var(--accent2); color: var(--accent2); }
  .btn-accent  { background: var(--accent);  color: #0d0f12; font-weight: 500; }
  .btn-accent:hover  { background: #d4f55e; }
  .btn-accent2 { background: var(--accent2); color: #0d0f12; font-weight: 500; }
  .btn-accent2:hover { background: #6af5d5; }

  .score-op-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
  .score-op-btn { padding: 5px 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: var(--mono); font-size: 10.5px; cursor: pointer; text-align: center; transition: all .15s; }
  .score-op-btn:hover  { border-color: var(--accent2); color: var(--accent2); }
  .score-op-btn.active { border-color: var(--accent2); color: var(--accent2); background: rgba(74,240,200,.08); }
  .toggle-btn { padding: 4px 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: var(--mono); font-size: 11px; cursor: pointer; transition: all .15s; }
  .toggle-btn.active { border-color: var(--accent2); color: var(--accent2); background: rgba(74,240,200,.08); }

  .add-segment-btn { width: 100%; padding: 10px; background: none; border: 1px dashed var(--border); border-radius: 8px; color: var(--muted); font-family: var(--mono); font-size: 12px; cursor: pointer; transition: all .15s; }
  .add-segment-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* preview */
  .preview { background: var(--surface); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .preview-header { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .preview-header span { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .preview-body { flex: 1; overflow-y: auto; padding: 16px; }
  .preview-body::-webkit-scrollbar { width: 4px; }
  .preview-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  pre { font-family: var(--mono); font-size: 11.5px; line-height: 1.7; color: var(--text); white-space: pre-wrap; word-break: break-word; }
  .json-key  { color: #7ec8e3; }
  .json-str  { color: #c8f04a; }
  .json-num  { color: #f0a44a; }
  .json-bool { color: #f04a7a; }
  .json-null { color: var(--muted); }
  .copied-badge { background: var(--accent); color: #0d0f12; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 500; }
  .divider { height: 1px; background: var(--border); margin: 2px 0; }
  .fallback-badge { font-size: 10px; background: rgba(200,240,74,.1); color: var(--accent); border: 1px solid rgba(200,240,74,.3); border-radius: 4px; padding: 1px 6px; }
`;

// ─── Syntax highlighter ───────────────────────────────────────────────────────
function highlight(json) {
  return json
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, m => {
      if (/^"/.test(m)) return /:$/.test(m) ? `<span class="json-key">${m}</span>` : `<span class="json-str">${m}</span>`;
      if (/true|false/.test(m)) return `<span class="json-bool">${m}</span>`;
      if (/null/.test(m)) return `<span class="json-null">${m}</span>`;
      return `<span class="json-num">${m}</span>`;
    });
}

// ─── Field Picker ─────────────────────────────────────────────────────────────
function FieldPicker({ fields = [], onChange, showDiffHints = false }) {
  const available = STAT_FIELDS.filter(f => !fields.includes(f));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="field-label">fields</span>
        <select value="" onChange={e => {
          if (e.target.value) onChange([...fields, e.target.value]);
          e.target.value = "";
        }}>
          <option value="" disabled>+ add field…</option>
          {available.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      {fields.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingLeft: 94 }}>
          {fields.map((f, i) => (
            <span key={f} className="pill-tag">
              {showDiffHints && i === 0 && <span style={{ color: "var(--accent2)", fontSize: 10 }}>base</span>}
              {showDiffHints && i  >  0 && <span style={{ color: "var(--accent3)", fontSize: 10 }}>−</span>}
              {f}
              <span className="rm" onClick={() => onChange(fields.filter(x => x !== f))}>×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Score Editor ─────────────────────────────────────────────────────────────
function ScoreEditor({ score, onChange }) {
  const op  = score.operation;
  const set = (k, v) => onChange({ ...score, [k]: v });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="score-op-grid">
        {SCORE_OPS.map(o => (
          <button key={o} className={`score-op-btn ${op === o ? "active" : ""}`}
            onClick={() => onChange({ operation: o })}>{o}</button>
        ))}
      </div>

      {op === "field" && (
        <div className="field-row">
          <span className="field-label">field</span>
          <select value={score.field || ""} onChange={e => set("field", e.target.value)}>
            <option value="" disabled>select…</option>
            {STAT_FIELDS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      )}

      {op === "fixed" && (
        <div className="field-row">
          <span className="field-label">value</span>
          <input type="number" value={score.value ?? 0} onChange={e => set("value", +e.target.value)} />
        </div>
      )}

      {op === "multiply" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="field-row">
            <span className="field-label">field</span>
            <select value={score.field || ""} onChange={e => set("field", e.target.value)}>
              <option value="" disabled>select…</option>
              {STAT_FIELDS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="field-row">
            <span className="field-label">× factor</span>
            <input type="number" value={score.factor ?? 1} onChange={e => set("factor", +e.target.value)} />
          </div>
        </div>
      )}

      {op === "sum" && (
        <FieldPicker fields={score.fields || []} onChange={fs => onChange({ ...score, fields: fs })} />
      )}

      {op === "weighted_sum" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FieldPicker
            fields={score.fields || []}
            onChange={fs => {
              const ws = (score.weights || []).slice(0, fs.length);
              while (ws.length < fs.length) ws.push(1);
              onChange({ ...score, fields: fs, weights: ws });
            }}
          />
          {(score.fields || []).length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 94 }}>
              {(score.fields || []).map((f, i) => (
                <div key={f} className="field-row" style={{ gap: 6 }}>
                  <span className="pill-tag" style={{ minWidth: 110 }}>{f}</span>
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>weight</span>
                  <input type="number" step="0.1"
                    value={(score.weights || [])[i] ?? 1}
                    onChange={e => {
                      const ws = [...(score.weights || [])];
                      ws[i] = +e.target.value;
                      set("weights", ws);
                    }} style={{ width: 70 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {op === "ratio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="field-row">
            <span className="field-label">numerator</span>
            <select value={score.numerator || ""} onChange={e => set("numerator", e.target.value)}>
              <option value="" disabled>select…</option>
              {STAT_FIELDS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="field-row">
            <span className="field-label">÷ denominator</span>
            <select value={score.denominator || ""} onChange={e => set("denominator", e.target.value)}>
              <option value="" disabled>select…</option>
              {STAT_FIELDS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="field-row">
            <span className="field-label">× factor</span>
            <input type="number" value={score.factor ?? 1} onChange={e => set("factor", +e.target.value)} />
          </div>
        </div>
      )}

      {op === "difference" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FieldPicker showDiffHints
            fields={score.fields || []}
            onChange={fs => onChange({ ...score, fields: fs })}
          />
          <div className="field-row">
            <span className="field-label">allow negative</span>
            <div style={{ display: "flex", gap: 5 }}>
              {[true, false].map(v => (
                <button key={String(v)}
                  className={`toggle-btn ${(score.allowNegative ?? true) === v ? "active" : ""}`}
                  onClick={() => set("allowNegative", v)}>
                  {v ? "yes" : "no — clamp to 0"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* formula preview — shown for all ops */}
      <FormulaPreview score={score} />
    </div>
  );
}

// ─── Points Cell ─────────────────────────────────────────────────────────────
function PointsCell({ value, onChange }) {
  const isObj = typeof value === "object" && value !== null;
  const op    = isObj ? value.operation : "fixed";
  if (!isObj) {
    return (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <input type="number" value={value ?? 0} onChange={e => onChange(+e.target.value)} style={{ width: 64 }} />
        <button className="btn-icon" title="Make dynamic" onClick={() => onChange({ operation: "as_is" })}>⚙</button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <select value={op} onChange={e => onChange({ operation: e.target.value })}>
        {POINTS_OPS.map(o => <option key={o}>{o}</option>)}
      </select>
      {op === "multiply" && (
        <input type="number" value={value.factor ?? 1}
          onChange={e => onChange({ ...value, factor: +e.target.value })} style={{ width: 52 }} />
      )}
      {op === "add" && (
        <input type="number" value={value.value ?? 0}
          onChange={e => onChange({ ...value, value: +e.target.value })} style={{ width: 52 }} />
      )}
      <button className="btn-icon" title="Make fixed" onClick={() => onChange(0)}>✕</button>
    </div>
  );
}

// ─── Threshold summary helper ─────────────────────────────────────────────────
function ptsLabel(pts) {
  if (typeof pts !== "object" || pts === null) return `${pts} pts`;
  if (pts.operation === "as_is")    return "score as-is";
  if (pts.operation === "multiply") return `score × ${pts.factor}`;
  if (pts.operation === "add")      return `score + ${pts.value}`;
  return pts.operation;
}

// ─── Segment Editor ───────────────────────────────────────────────────────────
function SegmentEditor({ seg, onChange, onRemove, isFallback }) {
  const upd     = useCallback((k, v) => onChange({ ...seg, [k]: v }), [seg, onChange]);
  const addCond = () => upd("when", [...seg.when, emptyCondition()]);
  const updCond = (id, k, v) => upd("when", seg.when.map(c => c.id === id ? { ...c, [k]: v } : c));
  const rmCond  = id => upd("when", seg.when.filter(c => c.id !== id));
  const addThr  = () => upd("thresholds", [...seg.thresholds, emptyThreshold()]);
  const updThr  = (id, k, v) => upd("thresholds", seg.thresholds.map(t => t.id === id ? { ...t, [k]: v } : t));
  const rmThr   = id => upd("thresholds", seg.thresholds.filter(t => t.id !== id));

  return (
    <div className="segment-card">
      <div className="segment-card-header">
        <span className="segment-drag">⠿</span>
        <input className="segment-label-input" value={seg.label} onChange={e => upd("label", e.target.value)} />
        {isFallback && <span className="fallback-badge">fallback</span>}
        <button className="btn-icon" onClick={onRemove}>✕</button>
      </div>
      <div className="segment-body">

        {/* WHEN */}
        <div>
          <div className="section-label">
            when conditions
            {isFallback && <span style={{ color: "var(--accent)", fontSize: 10, marginLeft: 6 }}>(empty = always matches)</span>}
          </div>
          <div className="conditions-list">
            {seg.when.map(c => (
              <div key={c.id} className="condition-row">
                <select value={c.field} onChange={e => updCond(c.id, "field", e.target.value)}>
                  {STAT_FIELDS.map(f => <option key={f}>{f}</option>)}
                </select>
                <select value={c.operator} onChange={e => updCond(c.id, "operator", e.target.value)}>
                  {OPERATORS.map(o => <option key={o}>{o}</option>)}
                </select>
                <input type={c.field === "isKeeper" ? "text" : "number"} value={c.value}
                  onChange={e => updCond(c.id, "value", c.field === "isKeeper" ? e.target.value === "true" : +e.target.value)} />
                <span className="cond-preview">
                  <strong>{c.field}</strong> {OP_SYMBOLS[c.operator]} {String(c.value)}
                </span>
                <button className="btn-icon" onClick={() => rmCond(c.id)}>✕</button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 6 }} onClick={addCond}>+ condition</button>
        </div>

        <div className="divider" />

        {/* SCORE */}
        <div>
          <div className="section-label">score operation</div>
          <ScoreEditor score={seg.score} onChange={v => upd("score", v)} />
        </div>

        <div className="divider" />

        {/* THRESHOLDS */}
        <div>
          <div className="section-label">thresholds — first match wins</div>
          {seg.thresholds.length > 0 && (
            <>
              <table className="thresholds-table">
                <thead>
                  <tr><th>if score</th><th>op</th><th>value</th><th>→ points</th><th></th></tr>
                </thead>
                <tbody>
                  {seg.thresholds.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: "var(--muted)", fontSize: 11, paddingRight: 0 }}>score</td>
                      <td>
                        <select value={t.operator || "gte"} onChange={e => updThr(t.id, "operator", e.target.value)}>
                          {OPERATORS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td>
                        <input type="number" value={t.value} onChange={e => updThr(t.id, "value", +e.target.value)} />
                      </td>
                      <td><PointsCell value={t.points} onChange={v => updThr(t.id, "points", v)} /></td>
                      <td><button className="btn-icon" onClick={() => rmThr(t.id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* threshold summary */}
              <div className="thr-summary">
                {seg.thresholds.map((t, i) => (
                  <div key={t.id} className="thr-summary-row">
                    <span style={{ color: "var(--muted)" }}>{i + 1}.&nbsp;</span>
                    <span className="match">score {OP_SYMBOLS[t.operator || "gte"]} {t.value}</span>
                    <span style={{ color: "var(--muted)" }}> → </span>
                    <span className="pts">{ptsLabel(t.points)}</span>
                  </div>
                ))}
                <div className="thr-summary-row" style={{ borderTop: "1px solid var(--border)", paddingTop: 3, marginTop: 1 }}>
                  <span>no match → </span>
                  <span className="fb">{ptsLabel(seg.default)}</span>
                </div>
              </div>
            </>
          )}
          <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={addThr}>+ threshold</button>
        </div>

        <div className="divider" />

        {/* DEFAULT */}
        <div>
          <div className="section-label">default points (when no threshold matches)</div>
          <PointsCell value={seg.default} onChange={v => upd("default", v)} />
        </div>
      </div>
    </div>
  );
}

// ─── Rule Editor ──────────────────────────────────────────────────────────────
function RuleEditor({ rule, onChange }) {
  const updSeg = useCallback((id, seg) =>
    onChange({ ...rule, segments: rule.segments.map(s => s.id === id ? seg : s) }),
  [rule, onChange]);
  const rmSeg  = id => onChange({ ...rule, segments: rule.segments.filter(s => s.id !== id) });
  const addSeg = ()  => onChange({ ...rule, segments: [...rule.segments, emptySegment()] });

  return (
    <div>
      <div className="rule-editor-header">
        <input className="rule-name-input" value={rule.name}
          onChange={e => onChange({ ...rule, name: e.target.value })} placeholder="ruleName" />
        <span style={{ color: "var(--muted)", fontSize: 11, paddingTop: 8 }}>scored_segments</span>
      </div>
      <div className="section-label" style={{ marginBottom: 12 }}>
        segments — evaluated top to bottom, first match wins
      </div>
      {rule.segments.map((seg, i) => (
        <SegmentEditor key={seg.id} seg={seg} index={i}
          isFallback={seg.when.length === 0}
          onChange={upd => updSeg(seg.id, upd)}
          onRemove={() => rmSeg(seg.id)} />
      ))}
      <button className="add-segment-btn" onClick={addSeg}>＋ add segment</button>
    </div>
  );
}

// ─── Import Modal ─────────────────────────────────────────────────────────────
function ImportModal({ onClose, onImport }) {
  const [text, setText]   = useState("");
  const [error, setError] = useState("");
  const fileRef           = useRef();

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setText(ev.target.result); setError(""); };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      onImport(JSON.parse(text));
      onClose();
    } catch (e) {
      setError(`Invalid JSON — ${e.message}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>Import JSON Config</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="import-hint">
            Paste your rule JSON below or upload a <code>.json</code> file.
            Matching categories will be replaced; others are left untouched.
          </p>
          <button className="import-btn" onClick={() => fileRef.current.click()}>↑ upload .json file</button>
          <input ref={fileRef} type="file" accept=".json,application/json"
            style={{ display: "none" }} onChange={handleFile} />
          <textarea className="json-textarea" value={text}
            onChange={e => { setText(e.target.value); setError(""); }}
            placeholder={'{\n  "bowling": {\n    "basePoints": { ... }\n  }\n}'} />
          {error && <div className="import-error">⚠ {error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>cancel</button>
          <button className="btn btn-accent2" onClick={handleImport} disabled={!text.trim()}>
            import & apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function RuleBuilder() {
  const [categories,    setCategories]    = useState(() => CATEGORIES.map(name => ({ id: uid(), name, rules: [] })));
  const [selected,      setSelected]      = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [showImport,    setShowImport]    = useState(false);
  const [importFlash,   setImportFlash]   = useState(false);
  const [expandedCats,  setExpandedCats]  = useState(() => Object.fromEntries(CATEGORIES.map(n => [n, true])));

  const json = buildJson(categories);

  const addRule = catId => {
    const rule = emptyRule();
    setCategories(cats => cats.map(c => c.id === catId ? { ...c, rules: [...c.rules, rule] } : c));
    setSelected({ catId, ruleId: rule.id });
  };
  const updateRule = (catId, ruleId, rule) =>
    setCategories(cats => cats.map(c => c.id === catId ? { ...c, rules: c.rules.map(r => r.id === ruleId ? rule : r) } : c));
  const removeRule = (catId, ruleId) => {
    setCategories(cats => cats.map(c => c.id === catId ? { ...c, rules: c.rules.filter(r => r.id !== ruleId) } : c));
    if (selected?.ruleId === ruleId) setSelected(null);
  };
  const handleImport = parsed => {
    setCategories(prev => parseJsonToCategories(parsed, prev));
    setSelected(null);
    setImportFlash(true);
    setTimeout(() => setImportFlash(false), 2200);
  };
  const copy = () => {
    navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };

  const activeRule   = selected ? categories.find(c => c.id === selected.catId)?.rules.find(r => r.id === selected.ruleId) : null;
  const totalRules   = categories.reduce((n, c) => n + c.rules.length, 0);

  return (
    <>
      <style>{css}</style>
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      <div className="app">

        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>Rule Builder</h1>
            <p>Cricket Points Engine · {totalRules} rule{totalRules !== 1 ? "s" : ""}</p>
          </div>
          <div className="sidebar-actions">
            <button className={`import-btn ${importFlash ? "flash" : ""}`} onClick={() => setShowImport(true)}>
              {importFlash ? "✓ imported successfully!" : "↑ import json config"}
            </button>
          </div>
          <div className="sidebar-body">
            {categories.map(cat => {
              const expanded = expandedCats[cat.name];
              return (
                <div key={cat.id} className="cat-group">
                  <div className={`cat-header ${selected?.catId === cat.id ? "active" : ""}`}
                    onClick={() => setExpandedCats(e => ({ ...e, [cat.name]: !e[cat.name] }))}>
                    <span>{expanded ? "▾" : "▸"}&nbsp;{cat.name}</span>
                    <span className="cat-badge">{cat.rules.length}</span>
                  </div>
                  {expanded && (
                    <>
                      {cat.rules.map(rule => (
                        <div key={rule.id}
                          className={`rule-item ${selected?.ruleId === rule.id ? "active" : ""}`}
                          onClick={() => setSelected({ catId: cat.id, ruleId: rule.id })}>
                          <span className="rule-name-label">{rule.name}</span>
                          <button className="btn-icon" onClick={e => { e.stopPropagation(); removeRule(cat.id, rule.id); }}>✕</button>
                        </div>
                      ))}
                      <button className="add-rule-btn" onClick={() => addRule(cat.id)}>＋ add rule</button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Editor ── */}
        <div className="editor">
          {activeRule
            ? <RuleEditor key={activeRule.id} rule={activeRule} onChange={r => updateRule(selected.catId, selected.ruleId, r)} />
            : <div className="editor-empty">
                <div className="editor-empty-icon">⚙</div>
                <p>Select or create a rule to edit</p>
              </div>
          }
        </div>

        {/* ── JSON Preview ── */}
        <div className="preview">
          <div className="preview-header">
            <span>json output</span>
            {copied ? <span className="copied-badge">copied!</span>
                    : <button className="btn btn-accent" onClick={copy}>copy</button>}
          </div>
          <div className="preview-body" style={{textAlign:'left'}}>
            <pre dangerouslySetInnerHTML={{ __html: highlight(json) }} />
          </div>
        </div>

      </div>
    </>
  );
}
