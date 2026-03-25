'use client'

import { useState } from "react";
import ImportModal from "./ImportModal";
import { CATEGORIES } from "./ruleBuilderConstants";
import { buildJson, emptyRule, highlight, parseJsonToCategories, uid } from "./ruleBuilderUtils";
import RuleEditor from "./RuleEditor";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f12; --surface: #13161b; --surface2: #1b1f27; --surface3: #222733;
    --border: #2a2f3d; --accent: #c8f04a; --accent2: #4af0c8; --accent3: #f04a7a;
    --text: #e8ecf4; --muted: #6b7490;
    --mono: 'DM Mono', monospace; --serif: 'Fraunces', serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--mono); font-size: 13px; }
  .app { display: grid; grid-template-columns: 260px 1fr 380px; height: 100vh; overflow: hidden; }

  /* sidebar */
  .sidebar { background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .sidebar-header { padding: 16px 16px 12px; border-bottom: 1px solid var(--border); }
  .sidebar-header h1 { font-family: var(--serif); font-size: 18px; font-weight: 600; color: var(--accent); letter-spacing: -.3px; }
  .sidebar-header p  { color: var(--muted); font-size: 11px; margin-top: 3px; }
  .sidebar-actions   { padding: 8px; border-bottom: 1px solid var(--border); }
  .sidebar-body { flex: 1; overflow-y: auto; padding: 10px 8px; }
  .sidebar-body::-webkit-scrollbar { width: 4px; }
  .sidebar-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .import-btn {
    width: 100%; padding: 7px 10px; background: none; border: 1px dashed var(--border);
    border-radius: 6px; color: var(--muted); font-family: var(--mono); font-size: 11px;
    cursor: pointer; text-align: center; transition: all .15s;
  }
  .import-btn:hover, .import-btn.flash { border-color: var(--accent2); color: var(--accent2); }
  .import-btn.flash { border-style: solid; }

  .cat-group  { margin-bottom: 6px; }
  .cat-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 8px; cursor: pointer; border-radius: 6px;
    font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--muted); transition: background .15s;
  }
  .cat-header:hover  { background: var(--surface2); }
  .cat-header.active { color: var(--accent2); }
  .cat-badge { background: var(--surface3); color: var(--muted); border-radius: 999px; padding: 1px 7px; font-size: 10px; }
  .rule-item { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px 5px 20px; border-radius: 5px; cursor: pointer; color: var(--muted); transition: all .15s; }
  .rule-item:hover  { background: var(--surface2); color: var(--text); }
  .rule-item.active { background: var(--surface2); color: var(--accent); }
  .rule-name-label  { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn-icon { background: none; border: none; cursor: pointer; color: var(--muted); padding: 2px 4px; border-radius: 3px; font-size: 14px; line-height: 1; transition: color .15s, background .15s; }
  .btn-icon:hover { color: var(--accent3); background: rgba(240,74,122,.1); }
  .add-rule-btn { margin: 4px 8px 0 20px; padding: 4px 8px; background: none; border: 1px dashed var(--border); border-radius: 5px; color: var(--muted); font-family: var(--mono); font-size: 11px; cursor: pointer; text-align: left; transition: all .15s; }
  .add-rule-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; width: 560px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,.6); }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .modal-header h2 { font-family: var(--serif); font-size: 16px; font-weight: 600; color: var(--text); }
  .modal-body   { flex: 1; padding: 16px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .modal-footer { padding: 12px 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }
  .json-textarea { width: 100%; min-height: 240px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--mono); font-size: 11.5px; padding: 12px; resize: vertical; outline: none; line-height: 1.6; transition: border-color .15s; }
  .json-textarea:focus { border-color: var(--accent2); }
  .import-error { color: var(--accent3); font-size: 11px; background: rgba(240,74,122,.08); border: 1px solid rgba(240,74,122,.2); border-radius: 6px; padding: 8px 12px; }
  .import-hint  { color: var(--muted); font-size: 11px; line-height: 1.7; }

  /* editor */
  .editor { overflow-y: auto; padding: 24px 28px; background: var(--bg); }
  .editor::-webkit-scrollbar { width: 4px; }
  .editor::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .editor-empty { height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: var(--muted); }
  .editor-empty-icon { font-size: 48px; opacity: .3; }
  .editor-empty p { font-family: var(--serif); font-style: italic; font-size: 16px; }

  .rule-editor-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .rule-name-input { font-family: var(--serif); font-size: 22px; font-weight: 600; background: none; border: none; color: var(--text); outline: none; flex: 1; border-bottom: 1px solid transparent; transition: border-color .15s; }
  .rule-name-input:focus { border-bottom-color: var(--accent); }
  .section-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

  .segment-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 12px; overflow: hidden; }
  .segment-card-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--surface2); }
  .segment-label-input { flex: 1; background: none; border: none; font-family: var(--mono); font-size: 12px; font-weight: 500; color: var(--text); outline: none; }
  .segment-drag { color: var(--muted); font-size: 16px; cursor: grab; }
  .segment-body { padding: 14px; display: flex; flex-direction: column; gap: 14px; }

  .field-row   { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .field-label { color: var(--muted); font-size: 11px; min-width: 86px; }

  select, input[type="text"], input[type="number"] {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-family: var(--mono); font-size: 12px;
    padding: 5px 8px; border-radius: 6px; outline: none; transition: border-color .15s;
  }
  select:focus, input:focus { border-color: var(--accent2); }
  select { cursor: pointer; }
  input[type="number"] { width: 72px; }
  input[type="text"]   { width: 130px; }

  .pill-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--surface3); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; font-size: 11px; }
  .pill-tag .rm { color: var(--muted); cursor: pointer; font-size: 13px; }
  .pill-tag .rm:hover { color: var(--accent3); }

  .conditions-list { display: flex; flex-direction: column; gap: 6px; }
  .condition-row { display: flex; align-items: center; gap: 6px; background: var(--surface2); border-radius: 7px; padding: 6px 10px; flex-wrap: wrap; }
  .cond-preview  { font-size: 11px; color: var(--muted); margin-left: 4px; }
  .cond-preview strong { color: var(--accent2); }

  .thresholds-table { width: 100%; border-collapse: collapse; }
  .thresholds-table th { text-align: left; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 0 6px 6px; font-weight: 400; }
  .thresholds-table td { padding: 3px 6px; }

  .thr-summary { margin-top: 8px; display: flex; flex-direction: column; gap: 3px; padding: 6px 10px; background: var(--surface2); border-radius: 6px; }
  .thr-summary-row { font-size: 11px; color: var(--muted); }
  .thr-summary-row .match { color: var(--text); }
  .thr-summary-row .pts   { color: var(--accent2); }
  .thr-summary-row .fb    { color: var(--accent); }

  .btn { font-family: var(--mono); font-size: 11px; border-radius: 6px; padding: 5px 12px; cursor: pointer; border: none; transition: all .15s; }
  .btn-ghost   { background: none; border: 1px dashed var(--border); color: var(--muted); }
  .btn-ghost:hover   { border-color: var(--accent2); color: var(--accent2); }
  .btn-accent  { background: var(--accent);  color: #0d0f12; font-weight: 500; }
  .btn-accent:hover  { background: #d4f55e; }
  .btn-accent2 { background: var(--accent2); color: #0d0f12; font-weight: 500; }
  .btn-accent2:hover { background: #6af5d5; }

  .score-op-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
  .score-op-btn { padding: 5px 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: var(--mono); font-size: 10.5px; cursor: pointer; text-align: center; transition: all .15s; }
  .score-op-btn:hover  { border-color: var(--accent2); color: var(--accent2); }
  .score-op-btn.active { border-color: var(--accent2); color: var(--accent2); background: rgba(74,240,200,.08); }
  .toggle-btn { padding: 4px 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: var(--mono); font-size: 11px; cursor: pointer; transition: all .15s; }
  .toggle-btn.active { border-color: var(--accent2); color: var(--accent2); background: rgba(74,240,200,.08); }

  .add-segment-btn { width: 100%; padding: 10px; background: none; border: 1px dashed var(--border); border-radius: 8px; color: var(--muted); font-family: var(--mono); font-size: 12px; cursor: pointer; transition: all .15s; }
  .add-segment-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* preview */
  .preview { background: var(--surface); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .preview-header { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .preview-header span { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .preview-body { flex: 1; overflow-y: auto; padding: 16px; }
  .preview-body::-webkit-scrollbar { width: 4px; }
  .preview-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  pre { font-family: var(--mono); font-size: 11.5px; line-height: 1.7; color: var(--text); white-space: pre-wrap; word-break: break-word; }
  .json-key  { color: #7ec8e3; }
  .json-str  { color: #c8f04a; }
  .json-num  { color: #f0a44a; }
  .json-bool { color: #f04a7a; }
  .json-null { color: var(--muted); }
  .copied-badge { background: var(--accent); color: #0d0f12; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 500; }
  .divider { height: 1px; background: var(--border); margin: 2px 0; }
  .fallback-badge { font-size: 10px; background: rgba(200,240,74,.1); color: var(--accent); border: 1px solid rgba(200,240,74,.3); border-radius: 4px; padding: 1px 6px; }
`;

export default function RuleBuilder() {
  const [categories,    setCategories]    = useState(() => CATEGORIES.map(name => ({ id: uid(), name, rules: [] })));
  const [selected,      setSelected]      = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [showImport,    setShowImport]    = useState(false);
  const [importFlash,   setImportFlash]   = useState(false);
  const [expandedCats,  setExpandedCats]  = useState(() => Object.fromEntries(CATEGORIES.map(n => [n, true])));

  const json = buildJson(categories);

  const addRule = catId => {
    const rule = emptyRule();
    setCategories(cats => cats.map(c => c.id === catId ? { ...c, rules: [...c.rules, rule] } : c));
    setSelected({ catId, ruleId: rule.id });
  };
  const updateRule = (catId, ruleId, rule) =>
    setCategories(cats => cats.map(c => c.id === catId ? { ...c, rules: c.rules.map(r => r.id === ruleId ? rule : r) } : c));
  const removeRule = (catId, ruleId) => {
    setCategories(cats => cats.map(c => c.id === catId ? { ...c, rules: c.rules.filter(r => r.id !== ruleId) } : c));
    if (selected?.ruleId === ruleId) setSelected(null);
  };
  const handleImport = parsed => {
    setCategories(prev => parseJsonToCategories(parsed, prev));
    setSelected(null);
    setImportFlash(true);
    setTimeout(() => setImportFlash(false), 2200);
  };
  const copy = () => {
    navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };

  const activeRule   = selected ? categories.find(c => c.id === selected.catId)?.rules.find(r => r.id === selected.ruleId) : null;
  const totalRules   = categories.reduce((n, c) => n + c.rules.length, 0);

  return (
    <>
      <style>{css}</style>
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      <div className="app">

        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>Rule Builder</h1>
            <p>Cricket Points Engine · {totalRules} rule{totalRules !== 1 ? "s" : ""}</p>
          </div>
          <div className="sidebar-actions">
            <button className={`import-btn ${importFlash ? "flash" : ""}`} onClick={() => setShowImport(true)}>
              {importFlash ? "✓ imported successfully!" : "↑ import json config"}
            </button>
          </div>
          <div className="sidebar-body">
            {categories.map(cat => {
              const expanded = expandedCats[cat.name];
              return (
                <div key={cat.id} className="cat-group">
                  <div className={`cat-header ${selected?.catId === cat.id ? "active" : ""}`}
                    onClick={() => setExpandedCats(e => ({ ...e, [cat.name]: !e[cat.name] }))}>
                    <span>{expanded ? "▾" : "▸"}&nbsp;{cat.name}</span>
                    <span className="cat-badge">{cat.rules.length}</span>
                  </div>
                  {expanded && (
                    <>
                      {cat.rules.map(rule => (
                        <div key={rule.id}
                          className={`rule-item ${selected?.ruleId === rule.id ? "active" : ""}`}
                          onClick={() => setSelected({ catId: cat.id, ruleId: rule.id })}>
                          <span className="rule-name-label">{rule.name}</span>
                          <button className="btn-icon" onClick={e => { e.stopPropagation(); removeRule(cat.id, rule.id); }}>✕</button>
                        </div>
                      ))}
                      <button className="add-rule-btn" onClick={() => addRule(cat.id)}>＋ add rule</button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Editor ── */}
        <div className="editor">
          {activeRule
            ? <RuleEditor key={activeRule.id} rule={activeRule} onChange={r => updateRule(selected.catId, selected.ruleId, r)} />
            : <div className="editor-empty">
                <div className="editor-empty-icon">⚙</div>
                <p>Select or create a rule to edit</p>
              </div>
          }
        </div>

        {/* ── JSON Preview ── */}
        <div className="preview">
          <div className="preview-header">
            <span>json output</span>
            {copied ? <span className="copied-badge">copied!</span>
                    : <button className="btn btn-accent" onClick={copy}>copy</button>}
          </div>
          <div className="preview-body" style={{textAlign:'left'}}>
            <pre dangerouslySetInnerHTML={{ __html: highlight(json) }} />
          </div>
        </div>

      </div>
    </>
  );
}
