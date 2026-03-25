import { useState, useRef } from "react";

export default function ImportModal({ onClose, onImport }) {
  const [text, setText]   = useState("");
  const [error, setError] = useState("");
  const fileRef           = useRef();

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
