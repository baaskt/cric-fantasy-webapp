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
import { DEFAULT_RULES } from './defaultRules'
import RuleEditor from './RuleEditor'
import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import type { DefaultRulesConfig, ModeData, ModeName, SelectedRule } from './types'

function fallbackCopy(text: string, onSuccess: () => void) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try {
    document.execCommand('copy')
    onSuccess()
  } finally {
    document.body.removeChild(ta)
  }
}

export default function RuleBuilder() {
  const { isAdmin } = useAuth()
  const admin = isAdmin()
  const { activeTournament } = useTournament()
  const currentTournamentId = activeTournament?.tournamentId
  const [modeData, setModeData] = useState<ModeData>(() => initModeData(DEFAULT_RULES))
  const [activeMode, setActiveMode] = useState<ModeName>('match')
  const [selected, setSelected] = useState<SelectedRule | null>(null)
  const [mobilePanel, setMobilePanel] = useState<'sidebar' | 'editor' | 'preview'>('editor')
  const [copied, setCopied] = useState(false)
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
  const copy = () => {
    const markCopied = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(displayJson)
        .then(markCopied)
        .catch(() => {
          fallbackCopy(displayJson, markCopied)
        })
    } else {
      fallbackCopy(displayJson, markCopied)
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
                            <button
                              className='btn-icon'
                              onClick={e => {
                                e.stopPropagation()
                                removeRule(cat.id, rule.id)
                              }}
                            >
                              ✕
                            </button>
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
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Editor ── */}
        <div className={`editor ${mobilePanel === 'editor' ? 'rb-active' : ''}`}>
          {activeRule ? (
            <RuleEditor
              key={activeRule.id}
              rule={activeRule}
              onChange={r => updateRule(selected!.catId, selected!.ruleId, r)}
            />
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
              (copied ? (
                <span className='copied-badge'>copied!</span>
              ) : (
                <button className='btn btn-accent' onClick={copy}>
                  copy
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
