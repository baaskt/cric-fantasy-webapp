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
import { emptyCondition, emptyThreshold } from './ruleBuilderUtils'
import ScoreEditor from './ScoreEditor'
import PointsCell from './PointsCell'
import type { PointsValue, Segment } from './types'

interface Props {
  seg: Segment
  index: number
  isFallback: boolean
  onChange: (seg: Segment) => void
  onRemove: () => void
}

export function ptsLabel(pts: PointsValue): string {
  if (typeof pts !== 'object' || pts === null) return `${pts} pts`
  if (pts.operation === 'as_is') return 'score as-is'
  if (pts.operation === 'multiply') return `score × ${pts.factor}`
  return `score + ${pts.value}`
}

export default function SegmentEditor({ seg, onChange, onRemove, isFallback }: Props) {
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
          onChange={e => upd('label', e.target.value)}
        />
        {isFallback && <span className='fallback-badge'>fallback</span>}
        <button className='btn-icon' onClick={onRemove}>
          ✕
        </button>
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
                    onChange={e => updCond(c.id, 'value', e.target.value)}
                  />
                ) : (
                  <input
                    type='number'
                    value={c.value as number}
                    onChange={e => updCond(c.id, 'value', +e.target.value)}
                  />
                )}
                <span className='cond-preview'>
                  <strong>{c.field}</strong> {OP_SYMBOLS[c.operator]} {String(c.value)}
                </span>
                <button className='btn-icon' onClick={() => rmCond(c.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button className='btn btn-ghost' style={{ marginTop: 6 }} onClick={addCond}>
            + condition
          </button>
        </div>

        <div className='divider' />

        {/* SCORE */}
        <div>
          <div className='section-label'>score operation</div>
          <ScoreEditor score={seg.score} onChange={v => upd('score', v)} />
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
                          onChange={e => updThr(t.id, 'value', +e.target.value)}
                        />
                      </td>
                      <td>
                        <PointsCell value={t.points} onChange={v => updThr(t.id, 'points', v)} />
                      </td>
                      <td>
                        <button className='btn-icon' onClick={() => rmThr(t.id)}>
                          ✕
                        </button>
                      </td>
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
          <button className='btn btn-ghost' style={{ marginTop: 8 }} onClick={addThr}>
            + threshold
          </button>
        </div>

        <div className='divider' />

        {/* DEFAULT */}
        <div>
          <div className='section-label'>default points (when no threshold matches)</div>
          <PointsCell value={seg.default} onChange={v => upd('default', v)} />
        </div>
      </div>
    </div>
  )
}
