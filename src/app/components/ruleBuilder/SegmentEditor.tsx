'use client'

import { useCallback } from 'react'
import {
  STAT_FIELDS,
  OPERATORS,
  OP_SYMBOLS,
  OPERATORS_BY_TYPE,
  fieldType,
  DEFAULT_VALUE,
} from './ruleBuilderConstants'
import { emptyCondition, emptyThreshold, buildFormulaPreview } from './ruleBuilderUtils'
import ScoreEditor from './ScoreEditor'
import PointsCell from './PointsCell'
import type { PointsValue, Segment } from './types'

interface Props {
  seg: Segment
  index: number
  isFallback: boolean
  onChange: (seg: Segment) => void
  onRemove: () => void
  disabled?: boolean
}

function SegmentPreview({ seg }: { seg: Segment }) {
  const formula = buildFormulaPreview(seg.score)
  const rowStyle = { display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' } as const
  const labelStyle = {
    fontSize: 10,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    minWidth: 40,
    paddingTop: 2,
  } as const
  const monoStyle = {
    fontFamily: 'var(--mono)',
    fontSize: 12,
    lineHeight: 1.8,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2,
  } as const
  return (
    <div
      style={{
        background: 'var(--surface3)',
        borderRadius: 7,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginTop: 8,
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
        segment summary
      </div>
      {/* when */}
      <div style={rowStyle}>
        <span style={labelStyle}>when</span>
        <div style={monoStyle}>
          {seg.when.length === 0 ? (
            <span style={{ color: 'var(--accent)' }}>always</span>
          ) : (
            seg.when.map((c, i) => (
              <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {i > 0 && <span style={{ color: 'var(--muted)', marginRight: 3 }}>AND</span>}
                <span style={{ color: 'var(--accent2)' }}>{c.field}</span>
                <span style={{ color: 'var(--muted)' }}>{OP_SYMBOLS[c.operator]}</span>
                <span style={{ color: 'var(--accent)' }}>{String(c.value)}</span>
              </span>
            ))
          )}
        </div>
      </div>
      {/* score */}
      <div style={rowStyle}>
        <span style={labelStyle}>score</span>
        <div style={monoStyle}>
          {formula ? (
            formula.parts.map((pt, i) => (
              <span key={i} style={{ color: pt.c }}>
                {pt.t}
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--muted)' }}>—</span>
          )}
        </div>
      </div>
      {/* thresholds */}
      {seg.thresholds.length > 0 && (
        <div style={rowStyle}>
          <span style={labelStyle}>if</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {seg.thresholds.map(t => (
              <div key={t.id} style={monoStyle}>
                <span style={{ color: 'var(--muted)' }}>score</span>
                <span style={{ color: 'var(--muted)' }}>&nbsp;{OP_SYMBOLS[t.operator]}&nbsp;</span>
                <span style={{ color: 'var(--accent)' }}>{t.value}</span>
                <span style={{ color: 'var(--muted)' }}>&nbsp;→&nbsp;</span>
                <span style={{ color: 'var(--accent2)' }}>{ptsLabel(t.points)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* default */}
      <div style={rowStyle}>
        <span style={labelStyle}>{seg.thresholds.length === 0 ? 'return' : 'else'}</span>
        <div style={monoStyle}>
          <span style={{ color: 'var(--muted)' }}>→&nbsp;</span>
          <span style={{ color: 'var(--accent2)' }}>{ptsLabel(seg.default)}</span>
        </div>
      </div>
    </div>
  )
}

export function ptsLabel(pts: PointsValue): string {
  if (typeof pts !== 'object' || pts === null) return `${pts} pts`
  if (pts.operation === 'as_is') return 'score as-is'
  if (pts.operation === 'multiply') return `score × ${pts.factor}`
  return `score + ${pts.value}`
}

export default function SegmentEditor({ seg, onChange, onRemove, isFallback, disabled }: Props) {
  const upd = useCallback(
    (k: keyof Segment, v: Segment[keyof Segment]) => onChange({ ...seg, [k]: v }),
    [seg, onChange],
  )
  const addCond = () => upd('when', [...seg.when, emptyCondition()])
  const updCond = (id: string, k: string, v: unknown) =>
    upd(
      'when',
      seg.when.map(c => (c.id === id ? { ...c, [k]: v } : c)),
    )
  const rmCond = (id: string) =>
    upd(
      'when',
      seg.when.filter(c => c.id !== id),
    )
  const addThr = () => upd('thresholds', [...seg.thresholds, emptyThreshold()])
  const updThr = (id: string, k: string, v: unknown) =>
    upd(
      'thresholds',
      seg.thresholds.map(t => (t.id === id ? { ...t, [k]: v } : t)),
    )
  const rmThr = (id: string) =>
    upd(
      'thresholds',
      seg.thresholds.filter(t => t.id !== id),
    )

  return (
    <div className='segment-card'>
      <div className='segment-card-header'>
        <span className='segment-drag'>⠿</span>
        <input
          className='segment-label-input'
          value={seg.label}
          disabled={disabled}
          onChange={e => upd('label', e.target.value)}
        />
        {isFallback && <span className='fallback-badge'>fallback</span>}
        {!disabled && (
          <button className='btn-icon' onClick={onRemove}>
            ✕
          </button>
        )}
      </div>
      <div className='segment-body'>
        {/* WHEN */}
        <div>
          <div className='section-label'>
            when conditions
            {isFallback && (
              <span style={{ color: 'var(--accent)', fontSize: 10, marginLeft: 6 }}>
                (empty = always matches)
              </span>
            )}
          </div>
          <div className='conditions-list'>
            {seg.when.map(c => (
              <div key={c.id} className='condition-row'>
                <select
                  value={c.field}
                  disabled={disabled}
                  onChange={e => {
                    const newField = e.target.value
                    const type = fieldType(newField)
                    const allowedOps = OPERATORS_BY_TYPE[type]
                    const operator = allowedOps.includes(c.operator) ? c.operator : allowedOps[0]
                    upd(
                      'when',
                      seg.when.map(cond =>
                        cond.id === c.id
                          ? { ...cond, field: newField, operator, value: DEFAULT_VALUE[type] }
                          : cond,
                      ),
                    )
                  }}
                >
                  {STAT_FIELDS.map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                <select
                  value={c.operator}
                  disabled={disabled}
                  onChange={e => updCond(c.id, 'operator', e.target.value)}
                >
                  {OPERATORS_BY_TYPE[fieldType(c.field)].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {fieldType(c.field) === 'boolean' ? (
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[true, false].map(v => (
                      <button
                        key={String(v)}
                        className={`toggle-btn ${c.value === v ? 'active' : ''}`}
                        disabled={disabled}
                        onClick={() => updCond(c.id, 'value', v)}
                      >
                        {String(v)}
                      </button>
                    ))}
                  </div>
                ) : fieldType(c.field) === 'string' ? (
                  <input
                    type='text'
                    value={c.value as string}
                    disabled={disabled}
                    onChange={e => updCond(c.id, 'value', e.target.value)}
                  />
                ) : (
                  <input
                    type='number'
                    value={c.value as number}
                    disabled={disabled}
                    onChange={e => updCond(c.id, 'value', +e.target.value)}
                  />
                )}
                <span className='cond-preview'>
                  <strong>{c.field}</strong> {OP_SYMBOLS[c.operator]} {String(c.value)}
                </span>
                {!disabled && (
                  <button className='btn-icon' onClick={() => rmCond(c.id)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {!disabled && (
            <button className='btn btn-ghost' style={{ marginTop: 6 }} onClick={addCond}>
              + condition
            </button>
          )}
        </div>

        <div className='divider' />

        {/* SCORE */}
        <div>
          <div className='section-label'>score operation</div>
          <ScoreEditor score={seg.score} disabled={disabled} onChange={v => upd('score', v)} />
        </div>

        <div className='divider' />

        {/* THRESHOLDS */}
        <div>
          <div className='section-label'>thresholds — first match wins</div>
          {seg.thresholds.length > 0 && (
            <>
              <table className='thresholds-table'>
                <thead>
                  <tr>
                    <th>if score</th>
                    <th>op</th>
                    <th>value</th>
                    <th>→ points</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {seg.thresholds.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--muted)', fontSize: 11, paddingRight: 0 }}>
                        score
                      </td>
                      <td>
                        <select
                          value={t.operator || 'gte'}
                          disabled={disabled}
                          onChange={e => updThr(t.id, 'operator', e.target.value)}
                        >
                          {OPERATORS.map(o => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type='number'
                          value={t.value}
                          disabled={disabled}
                          onChange={e => updThr(t.id, 'value', +e.target.value)}
                        />
                      </td>
                      <td>
                        <PointsCell
                          value={t.points}
                          disabled={disabled}
                          onChange={v => updThr(t.id, 'points', v)}
                        />
                      </td>
                      {!disabled && (
                        <td>
                          <button className='btn-icon' onClick={() => rmThr(t.id)}>
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* threshold summary */}
              <div className='thr-summary'>
                {seg.thresholds.map((t, i) => (
                  <div key={t.id} className='thr-summary-row'>
                    <span style={{ color: 'var(--muted)' }}>{i + 1}.&nbsp;</span>
                    <span className='match'>
                      score {OP_SYMBOLS[t.operator || 'gte']} {t.value}
                    </span>
                    <span style={{ color: 'var(--muted)' }}> → </span>
                    <span className='pts'>{ptsLabel(t.points)}</span>
                  </div>
                ))}
                <div
                  className='thr-summary-row'
                  style={{ borderTop: '1px solid var(--border)', paddingTop: 3, marginTop: 1 }}
                >
                  <span>no match → </span>
                  <span className='fb'>{ptsLabel(seg.default)}</span>
                </div>
              </div>
            </>
          )}
          {!disabled && (
            <button className='btn btn-ghost' style={{ marginTop: 8 }} onClick={addThr}>
              + threshold
            </button>
          )}
        </div>

        <div className='divider' />

        {/* DEFAULT */}
        <div>
          <div className='section-label'>default points (when no threshold matches)</div>
          <PointsCell value={seg.default} disabled={disabled} onChange={v => upd('default', v)} />
        </div>

        <SegmentPreview seg={seg} />
      </div>
    </div>
  )
}
