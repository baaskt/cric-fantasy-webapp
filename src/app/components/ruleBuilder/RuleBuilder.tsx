'use client'

import { useState, useEffect } from 'react'
import ImportModal from './ImportModal'
import { MODES } from './ruleBuilderConstants'
import {
  buildJson,
  buildRuleJson,
  emptyRule,
  emptyGroupRule,
  highlight,
  initModeData,
  parseJsonToModes,
} from './ruleBuilderUtils'
import RuleEditor from './RuleEditor'
import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { useRequest } from '@/hooks/useRequest'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import type { DefaultRulesConfig, ModeData, ModeName, SelectedRule } from './types'

export default function RuleBuilder() {
  const { isAdmin } = useAuth()
  const admin = isAdmin()
  const { activeTournament } = useTournament()
  const currentTournamentId = activeTournament?.tournamentId

  // ── API: load rules ──────────────────────────────────────────────────────
  const rulesUrl = currentTournamentId ? `${TOURNAMENTS.RULES}${currentTournamentId}/rules` : null
  const { data: rulesData, isLoading: rulesLoading, error: rulesError } = useRequest(rulesUrl)

  // ── API: save rules ──────────────────────────────────────────────────────
  const baseRulesUrl = currentTournamentId
    ? `${TOURNAMENTS.RULES}${currentTournamentId}/rules`
    : 'noop'
  const [ruleId, setRuleId] = useState<string | null>(null)
  const putUrl = ruleId ? `${baseRulesUrl}/${ruleId}` : 'noop'
  const { trigger: createRule } = useMutateRequest(baseRulesUrl, HttpMethod.POST)
  const { trigger: putRule } = useMutateRequest(putUrl, HttpMethod.PUT)

  const [modeData, setModeData] = useState<ModeData>(
    () =>
      Object.fromEntries(
        Object.entries(MODES).map(([mode, { categories }]) => [
          mode,
          categories.map(name => ({ id: name, name, rules: [] })),
        ]),
      ) as unknown as ModeData,
  )
  const [rulesSeeded, setRulesSeeded] = useState(false)
  const [rulesEmpty, setRulesEmpty] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [activeMode, setActiveMode] = useState<ModeName>('match')
  const [selected, setSelected] = useState<SelectedRule | null>(null)
  const [mobilePanel, setMobilePanel] = useState<'sidebar' | 'editor' | 'preview'>('editor')
  const [showImport, setShowImport] = useState(false)
  const [importFlash, setImportFlash] = useState(false)
  const [showFullJson, setShowFullJson] = useState(false)
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MODES.match.categories.map(n => [n, true])),
  )

  useEffect(() => {
    if (!currentTournamentId) return
    localStorage.setItem(`ruleConfig_${currentTournamentId}`, buildJson(modeData))
  }, [modeData, currentTournamentId])

  // Seed modeData once when API response arrives
  useEffect(() => {
    if (rulesSeeded || rulesEmpty || !rulesData) return
    const raw = rulesData as { result: { ruleId: string; rule: DefaultRulesConfig }[] }
    const result = raw?.result?.[0]
    if (result?.rule) {
      setModeData(initModeData(result.rule))
      setRuleId(result.ruleId ?? null)
      setRulesSeeded(true)
    } else {
      setRulesEmpty(true)
    }
  }, [rulesData, rulesSeeded, rulesEmpty])

  // No rule configured = API error OR API returned empty result array
  const rulesNotConfigured = !rulesLoading && (!!rulesError || rulesEmpty)

  // Auto-open import modal for admins when no rule is configured
  useEffect(() => {
    if (admin && rulesNotConfigured) setShowImport(true)
  }, [admin, rulesNotConfigured])

  const activeCats = modeData[activeMode]
  const json = buildJson(modeData)

  const setActiveCats = (updFn: (cats: ModeData[ModeName]) => ModeData[ModeName]) =>
    setModeData(prev => ({ ...prev, [activeMode]: updFn(prev[activeMode]) }))

  const switchMode = (mode: ModeName) => {
    setActiveMode(mode)
    setSelected(null)
    setExpandedCats(Object.fromEntries(MODES[mode].categories.map(n => [n, true])))
  }

  const addRule = (catId: string) => {
    const rule = emptyRule()
    setActiveCats(cats => cats.map(c => (c.id === catId ? { ...c, rules: [...c.rules, rule] } : c)))
    setSelected({ catId, ruleId: rule.id })
  }
  const addGroupRule = (catId: string) => {
    const rule = emptyGroupRule()
    setActiveCats(cats => cats.map(c => (c.id === catId ? { ...c, rules: [...c.rules, rule] } : c)))
    setSelected({ catId, ruleId: rule.id })
  }
  const updateRule = (
    catId: string,
    ruleId: string,
    rule: ModeData[ModeName][number]['rules'][number],
  ) =>
    setActiveCats(cats =>
      cats.map(c =>
        c.id === catId ? { ...c, rules: c.rules.map(r => (r.id === ruleId ? rule : r)) } : c,
      ),
    )
  const removeRule = (catId: string, ruleId: string) => {
    setActiveCats(cats =>
      cats.map(c => (c.id === catId ? { ...c, rules: c.rules.filter(r => r.id !== ruleId) } : c)),
    )
    if (selected?.ruleId === ruleId) setSelected(null)
  }
  const handleImport = (parsed: DefaultRulesConfig) => {
    setModeData(prev => parseJsonToModes(parsed, prev))
    setSelected(null)
    setImportFlash(true)
    setTimeout(() => setImportFlash(false), 2200)
  }
  const save = async () => {
    if (!currentTournamentId) return
    const payload = { rule: JSON.parse(json) as unknown }
    setSaveStatus('saving')
    try {
      if (ruleId) {
        await putRule(payload as never)
      } else {
        const res = await createRule(payload as never)
        const newRuleId = (res as { result?: { ruleId?: string } })?.result?.ruleId
        if (newRuleId) setRuleId(newRuleId)
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  const selectRule = (catId: string, ruleId: string) => {
    setSelected({ catId, ruleId })
    setShowFullJson(false)
    setMobilePanel('editor')
  }

  const activeRule = selected
    ? activeCats.find(c => c.id === selected.catId)?.rules.find(r => r.id === selected.ruleId)
    : null
  const activeCat = selected ? activeCats.find(c => c.id === selected.catId) : null
  const isFocused = !!activeRule && !showFullJson
  const displayJson = isFocused ? buildRuleJson(activeRule) : json
  const totalRules = activeCats.reduce((n, c) => n + c.rules.length, 0)

  return (
    <div className='rb'>
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
          currentTournamentId={currentTournamentId}
        />
      )}
      <div className='app'>
        {/* ── Sidebar ── */}
        <div className={`sidebar ${mobilePanel === 'sidebar' ? 'rb-active' : ''}`}>
          <div className='sidebar-header'>
            <h1>Rule Builder</h1>
            <p>
              Cricket Points Engine · {totalRules} rule{totalRules !== 1 ? 's' : ''}
            </p>
          </div>
          <div className='mode-tabs'>
            {Object.entries(MODES).map(([key, { label }]) => (
              <button
                key={key}
                className={`mode-tab ${activeMode === key ? 'active' : ''}`}
                onClick={() => switchMode(key as ModeName)}
              >
                {label}
              </button>
            ))}
          </div>
          {admin && (
            <div className='sidebar-actions'>
              <button
                className={`import-btn ${importFlash ? 'flash' : ''}`}
                onClick={() => setShowImport(true)}
              >
                {importFlash ? '✓ imported successfully!' : '↑ import json config'}
              </button>
            </div>
          )}
          <div className='sidebar-body'>
            {activeCats.map(cat => {
              const expanded = expandedCats[cat.name]
              return (
                <div key={cat.id} className='cat-group'>
                  <div
                    className={`cat-header ${selected?.catId === cat.id ? 'active' : ''}`}
                    onClick={() => setExpandedCats(e => ({ ...e, [cat.name]: !e[cat.name] }))}
                  >
                    <span>
                      {expanded ? '▾' : '▸'}&nbsp;{cat.name}
                    </span>
                    <span className='cat-badge'>{cat.rules.length}</span>
                  </div>
                  {expanded && (
                    <>
                      {cat.rules.map(rule => (
                        <div key={rule.id}>
                          <div
                            className={`rule-item ${selected?.ruleId === rule.id ? 'active' : ''}`}
                            onClick={() => selectRule(cat.id, rule.id)}
                          >
                            <span className='rule-name-label'>
                              {rule.type === 'group' && (
                                <span style={{ color: 'var(--accent2)', marginRight: 4 }}>⊞</span>
                              )}
                              {rule.name}
                            </span>
                            {rule.type === 'group' && (
                              <span style={{ fontSize: 10, color: 'var(--muted)', marginRight: 4 }}>
                                {(rule.rules ?? []).length}
                              </span>
                            )}
                            {admin && (
                              <button
                                className='btn-icon'
                                onClick={e => {
                                  e.stopPropagation()
                                  removeRule(cat.id, rule.id)
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          {rule.type === 'group' &&
                            (rule.rules ?? []).map(child => (
                              <div
                                key={child.id}
                                style={{ paddingLeft: 32 }}
                                className={`rule-item ${selected?.ruleId === rule.id ? 'active' : ''}`}
                                onClick={() => selectRule(cat.id, rule.id)}
                              >
                                <span
                                  className='rule-name-label'
                                  style={{ color: 'var(--muted)', fontSize: 11 }}
                                >
                                  └ {child.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      ))}
                      {admin && (
                        <>
                          <button className='add-rule-btn' onClick={() => addRule(cat.id)}>
                            ＋ add rule
                          </button>
                          <button
                            className='add-rule-btn'
                            style={{
                              marginTop: 2,
                              borderColor: 'var(--accent2)',
                              color: 'var(--accent2)',
                            }}
                            onClick={() => addGroupRule(cat.id)}
                          >
                            ⊞ add group rule
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Editor ── */}
        <div className={`editor ${mobilePanel === 'editor' ? 'rb-active' : ''}`}>
          {rulesNotConfigured ? (
            admin ? (
              <div className='editor-empty'>
                <div className='editor-empty-icon'>⚠</div>
                <p>No rule configured for this tournament.</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  Import a rule config to get started.
                </p>
                <button
                  className='btn btn-accent'
                  style={{ marginTop: 12 }}
                  onClick={() => setShowImport(true)}
                >
                  ↑ import json config
                </button>
              </div>
            ) : (
              <div className='editor-empty'>
                <div className='editor-empty-icon'>⚠</div>
                <p>Rules are not configured for this tournament.</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  Contact your admin or tournament host to set up the scoring rules.
                </p>
              </div>
            )
          ) : rulesLoading && !rulesSeeded ? (
            <div className='editor-empty'>
              <div className='editor-empty-icon'>⋯</div>
              <p>Loading rules…</p>
            </div>
          ) : activeRule ? (
            <>
              {!admin && (
                <div
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(36,84,212,0.06)',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 11,
                    color: 'var(--muted)',
                  }}
                >
                  View only — contact your admin to make changes
                </div>
              )}
              <RuleEditor
                key={activeRule.id}
                rule={activeRule}
                disabled={!admin}
                onChange={r => updateRule(selected!.catId, selected!.ruleId, r)}
              />
            </>
          ) : (
            <div className='editor-empty'>
              <div className='editor-empty-icon'>⚙</div>
              <p>Select or create a rule to edit</p>
            </div>
          )}
        </div>

        {/* ── JSON Preview ── */}
        <div className={`preview ${mobilePanel === 'preview' ? 'rb-active' : ''}`}>
          <div className='preview-header'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
              {isFocused ? (
                <>
                  <span className='preview-breadcrumb'>
                    {activeMode} › {activeCat?.name} › {activeRule.name}
                  </span>
                  <button className='preview-toggle' onClick={() => setShowFullJson(true)}>
                    full
                  </button>
                </>
              ) : (
                <>
                  <span>json output</span>
                  {activeRule && (
                    <button className='preview-toggle' onClick={() => setShowFullJson(false)}>
                      focused
                    </button>
                  )}
                </>
              )}
            </div>
            {admin &&
              (saveStatus === 'saved' ? (
                <span className='copied-badge'>saved!</span>
              ) : saveStatus === 'error' ? (
                <span
                  className='copied-badge'
                  style={{ background: 'var(--accent3)', color: '#fff' }}
                >
                  save failed
                </span>
              ) : (
                <button
                  className='btn btn-accent'
                  onClick={() => void save()}
                  disabled={saveStatus === 'saving' || !currentTournamentId}
                  style={{ opacity: saveStatus === 'saving' || !currentTournamentId ? 0.6 : 1 }}
                >
                  {saveStatus === 'saving' ? 'saving…' : 'save'}
                </button>
              ))}
          </div>
          <div className='preview-body' style={{ textAlign: 'left' }}>
            <pre dangerouslySetInnerHTML={{ __html: highlight(displayJson) }} />
          </div>
        </div>
      </div>

      {/* ── Mobile tab bar (hidden on desktop via CSS) ── */}
      <div className='rb-tabs'>
        {(['sidebar', 'editor', 'preview'] as const).map((panel, i) => (
          <button
            key={panel}
            className={`rb-tab ${mobilePanel === panel ? 'active' : ''}`}
            onClick={() => setMobilePanel(panel)}
          >
            {['⊟ Rules', '✎ Editor', '{ } JSON'][i]}
          </button>
        ))}
      </div>
    </div>
  )
}
