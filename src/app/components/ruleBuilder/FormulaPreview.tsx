'use client'

import { buildFormulaPreview } from './ruleBuilderUtils'
import type { ScoreOp } from './types'

interface Props {
  score: ScoreOp
}

export default function FormulaPreview({ score }: Props) {
  const p = buildFormulaPreview(score)
  if (!p) return null
  return (
    <div
      style={{
        background: 'var(--surface3)',
        borderRadius: 7,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        formula preview
      </div>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          lineHeight: 1.9,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {p.parts.map((pt, i) => (
          <span key={i} style={{ color: pt.c }}>
            {pt.t}
          </span>
        ))}
        <span style={{ color: 'var(--muted)', marginLeft: 8 }}>=&nbsp;score</span>
      </div>
      {p.note && (
        <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>{p.note}</div>
      )}
    </div>
  )
}
