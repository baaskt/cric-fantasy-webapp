'use client'

import { POINTS_OPS } from './ruleBuilderConstants'
import type { PointsValue } from './types'

interface Props {
  value: PointsValue
  onChange: (value: PointsValue) => void
}

export default function PointsCell({ value, onChange }: Props) {
  if (typeof value !== 'object' || value === null) {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <input
          type='number'
          value={value ?? 0}
          onChange={e => onChange(+e.target.value)}
          style={{ width: 64 }}
        />
        <button
          className='btn-icon'
          title='Make dynamic'
          onClick={() => onChange({ operation: 'as_is' })}
        >
          ⚙
        </button>
      </div>
    )
  }
  const op = value.operation
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <select
        value={op}
        onChange={e => {
          const next = e.target.value
          if (next === 'fixed') return onChange(0)
          if (next === 'as_is') return onChange({ operation: 'as_is' })
          if (next === 'multiply')
            return onChange({ operation: 'multiply', factor: op === 'multiply' ? value.factor : 1 })
          if (next === 'add')
            return onChange({ operation: 'add', value: op === 'add' ? value.value : 0 })
        }}
      >
        {POINTS_OPS.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {op === 'multiply' && (
        <input
          type='number'
          value={value.factor}
          onChange={e => onChange({ operation: 'multiply', factor: +e.target.value })}
          style={{ width: 52 }}
        />
      )}
      {op === 'add' && (
        <input
          type='number'
          value={value.value}
          onChange={e => onChange({ operation: 'add', value: +e.target.value })}
          style={{ width: 52 }}
        />
      )}
      <button className='btn-icon' title='Make fixed' onClick={() => onChange(0)}>
        ✕
      </button>
    </div>
  )
}
