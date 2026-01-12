import React, { useState } from "react";
import { checkKey, setAdmin } from "../utils/auth";

export default function AccessKeyModal({ open, onClose, onSuccess }) {
  const [value, setValue] = useState("");
  const [bad, setBad] = useState(false);

  if (!open) return null;

  const login = () => {
    if (!checkKey(value)) {
      setBad(true);
      return;
    }
    setAdmin(true);
    setValue("");
    setBad(false);
    onClose?.();
    onSuccess?.();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalTitle">Titkos kulcs szükséges</div>
        <div className="modalSub">Add meg a kulcsot a művelet folytatásához.</div>

        <div className="modalLabel">Kulcs</div>
        <input
          className={`modalInput ${bad ? "modalBad" : ""}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setBad(false);
          }}
          type="password"
        />

        <button className="modalBtn" onClick={login}>Belépés</button>
      </div>
    </div>
  );
}
