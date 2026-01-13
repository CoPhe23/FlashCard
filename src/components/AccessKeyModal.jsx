import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AccessKeyModal({ open, onClose, onSuccess }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e?.preventDefault?.();
    setErr("");
    const trimmed = key.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: trimmed }),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => null);
        setErr(data?.error || "Hibás kulcs.");
        setLoading(false);
        return;
      }

      setKey("");
      setLoading(false);
      onSuccess?.();
    } catch {
      setErr("Nem érem el a szervert.");
      setLoading(false);
    }
  };

  return (
  <div className="modalBackdrop" onClick={onClose}>
    <div className="modalCard" onClick={(e) => e.stopPropagation()}>
      <div className="modalTopRow">
  <button className="modalBackBtn" onClick={onClose} type="button">
    ←
  </button>
</div>

      <div className="modalTitle">Titkos kulcs szükséges</div>
      <div className="modalSub">Add meg a kulcsot a művelet folytatásához.</div>

      <form onSubmit={submit} className="modalForm">
        <input
  type="password"
  className="modalInput"
  placeholder="Kulcs"
  value={key}
  onChange={(e) => setKey(e.target.value)}
  autoFocus
/>


        {err && <div className="modalError">{err}</div>}

        <div className="modalActions">
          <button className="addBtn" type="submit" disabled={loading}>
            {loading ? "..." : "Belépés"}
          </button>

         
        </div>
      </form>
    </div>
  </div>
);

}
