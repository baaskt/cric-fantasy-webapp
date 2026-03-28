'use client'

import { SCORE_OPS, STAT_FIELDS } from './ruleBuilderConstants'
import FieldPicker from './FieldPicker'
import FormulaPreview from './FormulaPreview'
import type { ScoreOp } from './types'

interface Props {
  score: ScoreOp
  onChange: (score: ScoreOp) => void
  disabled?: boolean
}

export default function ScoreEditor({ score, onChange, disabled }: Props) {
  const op = score.operation
  const set = <K extends keyof ScoreOp>(k: K, v: ScoreOp[K]) =>
    onChange({ ...score, [k]: v } as ScoreOp)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className='score-op-grid'>
        {SCORE_OPS.map(o => (
          <button
            key={o}
            className={`score-op-btn ${op === o ? 'active' : ''}`}
            disabled={disabled}
            onClick={() => {
              const base = { operation: o }
              if (o === 'fixed')
                onChange({ ...base, value: (score as { value?: number }).value ?? 0 } as ScoreOp)
              else if (o === 'multiply')
                onChange({
                  ...base,
                  field: (score as { field?: string }).field ?? '',
                  factor: (score as { factor?: number }).factor ?? 1,
                } as ScoreOp)
              else if (o === 'ratio')
                onChange({
                  ...base,
                  numerator: (score as { numerator?: string }).numerator ?? '',
                  denominator: (score as { denominator?: string }).denominator ?? '',
                  factor: (score as { factor?: number }).factor ?? 1,
                } as ScoreOp)
              else if (o === 'weighted_sum')
                onChange({
                  ...base,
                  fields: (score as { fields?: string[] }).fields ?? [],
                  weights: (score as { weights?: number[] }).weights ?? [],
                } as ScoreOp)
              else if (o === 'sum')
                onChange({
                  ...base,
                  fields: (score as { fields?: string[] }).fields ?? [],
                } as ScoreOp)
              else if (o === 'difference')
                onChange({
                  ...base,
                  fields: (score as { fields?: string[] }).fields ?? [],
                  allowNegative: (score as { allowNegative?: boolean }).allowNegative ?? true,
                } as ScoreOp)
              else onChange(base as ScoreOp)
            }}
          >
            {o}
          </button>
        ))}
      </div>

      {op === 'field' && (
        <div className='field-row'>
          <span className='field-label'>field</span>
          <select
            value={(score as { field: string }).field || ''}
            disabled={disabled}
            onChange={e => set('field' as keyof ScoreOp, e.target.value as never)}
          >
            <option value='' disabled>
              select…
            </option>
            {STAT_FIELDS.map(f => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      )}

      {op === 'fixed' && (
        <div className='field-row'>
          <span className='field-label'>value</span>
          <input
            type='number'
            value={(score as { value: number }).value ?? 0}
            disabled={disabled}
            onChange={e => set('value' as keyof ScoreOp, +e.target.value as never)}
          />
        </div>
      )}

      {op === 'multiply' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className='field-row'>
            <span className='field-label'>field</span>
            <select
              value={(score as { field: string }).field || ''}
              disabled={disabled}
              onChange={e => set('field' as keyof ScoreOp, e.target.value as never)}
            >
              <option value='' disabled>
                select…
              </option>
              {STAT_FIELDS.map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className='field-row'>
            <span className='field-label'>× factor</span>
            <input
              type='number'
              value={(score as { factor: number }).factor ?? 1}
              disabled={disabled}
              onChange={e => set('factor' as keyof ScoreOp, +e.target.value as never)}
            />
          </div>
        </div>
      )}

      {op === 'sum' && (
        <FieldPicker
          fields={(score as { fields: string[] }).fields || []}
          disabled={disabled}
          onChange={fs => onChange({ ...score, fields: fs } as ScoreOp)}
        />
      )}

      {op === 'weighted_sum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldPicker
            fields={(score as { fields: string[] }).fields || []}
            disabled={disabled}
            onChange={fs => {
              const ws = [...((score as { weights?: number[] }).weights ?? [])].slice(0, fs.length)
              while (ws.length < fs.length) ws.push(1)
              onChange({ ...score, fields: fs, weights: ws } as ScoreOp)
            }}
          />
          {((score as { fields?: string[] }).fields ?? []).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 94 }}>
              {(score as { fields: string[] }).fields.map((f, i) => (
                <div key={f} className='field-row' style={{ gap: 6 }}>
                  <span className='pill-tag' style={{ minWidth: 110 }}>
                    {f}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>weight</span>
                  <input
                    type='number'
                    step='0.1'
                    value={((score as { weights?: number[] }).weights ?? [])[i] ?? 1}
                    disabled={disabled}
                    onChange={e => {
                      const ws = [...((score as { weights?: number[] }).weights ?? [])]
                      ws[i] = +e.target.value
                      set('weights' as keyof ScoreOp, ws as never)
                    }}
                    style={{ width: 70 }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {op === 'ratio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className='field-row'>
            <span className='field-label'>numerator</span>
            <select
              value={(score as { numerator: string }).numerator || ''}
              disabled={disabled}
              onChange={e => set('numerator' as keyof ScoreOp, e.target.value as never)}
            >
              <option value='' disabled>
                select…
              </option>
              {STAT_FIELDS.map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className='field-row'>
            <span className='field-label'>÷ denominator</span>
            <select
              value={(score as { denominator: string }).denominator || ''}
              disabled={disabled}
              onChange={e => set('denominator' as keyof ScoreOp, e.target.value as never)}
            >
              <option value='' disabled>
                select…
              </option>
              {STAT_FIELDS.map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className='field-row'>
            <span className='field-label'>× factor</span>
            <input
              type='number'
              value={(score as { factor: number }).factor ?? 1}
              disabled={disabled}
              onChange={e => set('factor' as keyof ScoreOp, +e.target.value as never)}
            />
          </div>
        </div>
      )}

      {op === 'difference' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldPicker
            showDiffHints
            fields={(score as { fields: string[] }).fields || []}
            disabled={disabled}
            onChange={fs => onChange({ ...score, fields: fs } as ScoreOp)}
          />
          <div className='field-row'>
            <span className='field-label'>allow negative</span>
            <div style={{ display: 'flex', gap: 5 }}>
              {[true, false].map(v => (
                <button
                  key={String(v)}
                  className={`toggle-btn ${((score as { allowNegative?: boolean }).allowNegative ?? true) === v ? 'active' : ''}`}
                  disabled={disabled}
                  onClick={() => set('allowNegative' as keyof ScoreOp, v as never)}
                >
                  {v ? 'yes' : 'no — clamp to 0'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* formula preview — shown for all ops */}
      <FormulaPreview score={score} />
    </div>
  )
}
