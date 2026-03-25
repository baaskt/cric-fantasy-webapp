import { useCallback } from "react";
import { emptySegment } from "./ruleBuilderUtils";
import SegmentEditor from "./SegmentEditor";

export default function RuleEditor({ rule, onChange }) {
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
