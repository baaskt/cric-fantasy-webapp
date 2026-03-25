import { SCORE_OPS, STAT_FIELDS } from './ruleBuilderConstants';
import FieldPicker from './FieldPicker';
import FormulaPreview from './FormulaPreview';

export default function ScoreEditor({ score, onChange }) {
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
