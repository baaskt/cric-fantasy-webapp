import { useState, useRef, useEffect } from "react";
import { useRequest } from "@/hooks/useRequest";
import { TOURNAMENTS } from "@/util/constants/endpoints";

export default function ImportModal({ onClose, onImport, currentTournamentId }) {
  const [text, setText]               = useState("");
  const [error, setError]             = useState("");
  const [selectedTourId, setSelectedTourId] = useState('');
  const fileRef                       = useRef();

  const { data: tourData } = useRequest(TOURNAMENTS.GET_ALL_URL + 'true');
  const allTournaments = (tourData?.result ?? []).filter(t => t.tournamentId !== currentTournamentId);

  const configUrl = selectedTourId
    ? `${TOURNAMENTS.RULE_CONFIG}${selectedTourId}/ruleConfig`
    : null;
  const { data: configData, isLoading: configLoading, error: configError } = useRequest(configUrl);

  useEffect(() => {
    if (!configData?.result) return;
    onImport(configData.result);
    onClose();
  }, [configData]);

  useEffect(() => {
    if (!configError) return;
    setError('Failed to load config from that tournament.');
    setSelectedTourId('');
  }, [configError]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setText(ev.target.result); setError(""); };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      onImport(JSON.parse(text));
      onClose();
    } catch (e) {
      setError(`Invalid JSON — ${e.message}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>Import JSON Config</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tour-picker">
            <label className="tour-picker-label">load from tournament</label>
            <div className="tour-picker-row">
              <select className="tour-picker-select"
                value={selectedTourId}
                onChange={e => { setSelectedTourId(e.target.value); setError(''); }}
                disabled={configLoading || !allTournaments.length}>
                <option value="">— select a tournament —</option>
                {allTournaments.map(t => (
                  <option key={t.tournamentId} value={t.tournamentId}>{t.tournamentName}</option>
                ))}
              </select>
              {configLoading && <span className="tour-picker-loading">loading…</span>}
            </div>
            <div className="tour-picker-divider">— or paste / upload below —</div>
          </div>
          <p className="import-hint">
            Paste your rule JSON below or upload a <code>.json</code> file.
            Matching categories will be replaced; others are left untouched.
          </p>
          <button className="import-btn" onClick={() => fileRef.current.click()}>↑ upload .json file</button>
          <input ref={fileRef} type="file" accept=".json,application/json"
            style={{ display: "none" }} onChange={handleFile} />
          <textarea className="json-textarea" value={text}
            onChange={e => { setText(e.target.value); setError(""); }}
            placeholder={'{\n  "bowling": {\n    "basePoints": { ... }\n  }\n}'} />
          {error && <div className="import-error">⚠ {error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>cancel</button>
          <button className="btn btn-accent2" onClick={handleImport} disabled={!text.trim()}>
            import & apply
          </button>
        </div>
      </div>
    </div>
  );
}
