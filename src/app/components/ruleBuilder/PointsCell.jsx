import { POINTS_OPS } from './ruleBuilderConstants';

export default function PointsCell({ value, onChange }) {
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
      <select value={op} onChange={e => {
        const next = e.target.value;
        if (next === "fixed")    return onChange(0);
        if (next === "as_is")    return onChange({ operation: "as_is" });
        if (next === "multiply") return onChange({ operation: "multiply", factor: value.factor ?? 1 });
        if (next === "add")      return onChange({ operation: "add", value: value.value ?? 0 });
      }}>
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
