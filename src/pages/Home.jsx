import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessKeyModal from "../components/AccessKeyModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";


export const Home = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [openKey, setOpenKey] = useState(false);
  const [admin, setAdmin] = useState(false);

  const loadTopics = async () => {
    const r = await fetch(`${API}/api/topics`, { credentials: "include" });
    const data = await r.json();
    setTopics(Array.isArray(data) ? data : []);
  };

  const loadMe = async () => {
    const r = await fetch(`${API}/api/auth/me`, { credentials: "include" });
    const data = await r.json();
    setAdmin(!!data?.admin);
  };

  useEffect(() => {
    loadMe();
    loadTopics();
  }, []);

  const addCategoryPrompt = async () => {
    const name = prompt("Új témakör neve:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const r = await fetch(`${API}/api/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: trimmed }),
    });

    if (!r.ok) return;

    loadTopics();
  };

  const onAddCategoryClick = async () => {
    const r = await fetch(`${API}/api/auth/me`, { credentials: "include" });
    const data = await r.json();

    if (data?.admin) addCategoryPrompt();
    else setOpenKey(true);
  };

  const logoutAdmin = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAdmin(false);
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 className="title">FlashCards</h1>
            <div className="subtle">Mobile-first by design.</div>
          </div>

          {admin && (
  <button
    className="adminExitBtn"
    onClick={logoutAdmin}
    title="Kilépés admin módból"
  >
    ⛨
  </button>
)}

        </div>

        <div className="homeCats">
          {topics.map((t) => (
            <button
              key={t.id}
              className="arrowBtn"
              style={{
                width: "auto",
                padding: "12px 14px",
                minWidth: 120,
                justifyContent: "center",
                fontSize: 14,
                letterSpacing: 0.4,
              }}
              onClick={() => navigate(`/topic/${t.id}`)}

            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="homeAddRow">
          <button className="addBtn" onClick={onAddCategoryClick}>
            Új témakör hozzáadása
          </button>
        </div>
      </div>

      <AccessKeyModal
        open={openKey}
        onClose={() => setOpenKey(false)}
        onSuccess={async () => {
          setOpenKey(false);
          await loadMe();
          addCategoryPrompt();
        }}
      />
    </div>
  );
};
