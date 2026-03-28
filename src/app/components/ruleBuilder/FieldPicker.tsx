'use client'

import { STAT_FIELDS } from './ruleBuilderConstants'

interface Props {
  fields: string[]
  onChange: (fields: string[]) => void
  showDiffHints?: boolean
  disabled?: boolean
}

export default function FieldPicker({
  fields = [],
  onChange,
  showDiffHints = false,
  disabled,
}: Props) {
  const available = STAT_FIELDS.filter(f => !fields.includes(f))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className='field-label'>fields</span>
        <select
          value=''
          disabled={disabled}
          onChange={e => {
            if (e.target.value) onChange([...fields, e.target.value])
            e.target.value = ''
          }}
        >
          <option value='' disabled>
            + add field…
          </option>
          {available.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      {fields.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingLeft: 94 }}>
          {fields.map((f, i) => (
            <span key={f} className='pill-tag'>
              {showDiffHints && i === 0 && (
                <span style={{ color: 'var(--accent2)', fontSize: 10 }}>base</span>
              )}
              {showDiffHints && i > 0 && (
                <span style={{ color: 'var(--accent3)', fontSize: 10 }}>−</span>
              )}
              {f}
              {!disabled && (
                <span className='rm' onClick={() => onChange(fields.filter(x => x !== f))}>
                  ×
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
