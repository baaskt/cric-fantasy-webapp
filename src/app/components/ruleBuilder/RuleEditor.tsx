'use client'

import { useCallback } from 'react'
import { emptySegment, emptyChildRule } from './ruleBuilderUtils'
import SegmentEditor from './SegmentEditor'
import type { GroupRule, Rule, ScoredSegmentsRule } from './types'

interface Props {
  rule: Rule
  onChange: (rule: Rule) => void
}

export default function RuleEditor({ rule, onChange }: Props) {
  // scored_segments
  const updSeg = useCallback(
    (id: string, seg: ScoredSegmentsRule['segments'][number]) => {
      if (rule.type !== 'scored_segments') return
      onChange({ ...rule, segments: rule.segments.map(s => (s.id === id ? seg : s)) })
    },
    [rule, onChange],
  )
  const rmSeg = (id: string) => {
    if (rule.type !== 'scored_segments') return
    onChange({ ...rule, segments: rule.segments.filter(s => s.id !== id) })
  }
  const addSeg = () => {
    if (rule.type !== 'scored_segments') return
    onChange({ ...rule, segments: [...rule.segments, emptySegment()] })
  }

  // group children
  const updChild = useCallback(
    (id: string, child: ScoredSegmentsRule) => {
      if (rule.type !== 'group') return
      onChange({ ...rule, rules: rule.rules.map(r => (r.id === id ? child : r)) } as GroupRule)
    },
    [rule, onChange],
  )
  const rmChild = (id: string) => {
    if (rule.type !== 'group') return
    onChange({ ...rule, rules: rule.rules.filter(r => r.id !== id) } as GroupRule)
  }
  const addChild = () => {
    if (rule.type !== 'group') return
    onChange({ ...rule, rules: [...(rule.rules ?? []), emptyChildRule()] } as GroupRule)
  }

  if (rule.type === 'group') {
    return (
      <div>
        <div className='rule-editor-header'>
          <input
            className='rule-name-input'
            value={rule.name}
            onChange={e => onChange({ ...rule, name: e.target.value })}
            placeholder='groupName'
          />
          <span style={{ color: 'var(--accent2)', fontSize: 11, paddingTop: 8 }}>group</span>
        </div>
        <div className='section-label' style={{ marginBottom: 12 }}>
          child rules — each evaluates independently and contributes to{' '}
          <code style={{ color: 'var(--accent2)' }}>
            {rule.name}.<em>childName</em>
          </code>
        </div>
        {(rule.rules ?? []).map(child => (
          <div
            key={child.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: 'var(--surface2)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--accent2)', fontSize: 11, minWidth: 80 }}>
                {rule.name}.
              </span>
              <input
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--accent2)',
                  outline: 'none',
                }}
                value={child.name}
                onChange={e => updChild(child.id, { ...child, name: e.target.value })}
              />
              <span style={{ color: 'var(--muted)', fontSize: 10 }}>scored_segments</span>
              <button className='btn-icon' onClick={() => rmChild(child.id)}>
                ✕
              </button>
            </div>
            <div style={{ padding: '14px 14px 0' }}>
              <RuleEditor
                rule={child}
                onChange={updated => updChild(child.id, updated as ScoredSegmentsRule)}
              />
            </div>
          </div>
        ))}
        <button className='add-segment-btn' onClick={addChild}>
          ＋ add child rule
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className='rule-editor-header'>
        <input
          className='rule-name-input'
          value={rule.name}
          onChange={e => onChange({ ...rule, name: e.target.value })}
          placeholder='ruleName'
        />
        <span style={{ color: 'var(--muted)', fontSize: 11, paddingTop: 8 }}>scored_segments</span>
      </div>
      <div className='section-label' style={{ marginBottom: 12 }}>
        segments — evaluated top to bottom, first match wins
      </div>
      {rule.segments.map((seg, i) => (
        <SegmentEditor
          key={seg.id}
          seg={seg}
          index={i}
          isFallback={seg.when.length === 0}
          onChange={upd => updSeg(seg.id, upd)}
          onRemove={() => rmSeg(seg.id)}
        />
      ))}
      <button className='add-segment-btn' onClick={addSeg}>
        ＋ add segment
      </button>
    </div>
  )
}
