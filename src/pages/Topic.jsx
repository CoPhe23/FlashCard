import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccessKeyModal from "../components/AccessKeyModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const Topic = () => {
  const navigate = useNavigate();

  const params = useParams();
  const rawTopicId =
    params.category ?? params.topicId ?? params.id ?? params.topic;
  const topicId = rawTopicId ? String(rawTopicId).toLowerCase() : "";

  const [addErr, setAddErr] = useState("");
  const [openKey, setOpenKey] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [topics, setTopics] = useState([]);
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [showAdminBox, setShowAdminBox] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  const safeJson = async (r) => {
    try {
      return await r.json();
    } catch {
      return null;
    }
  };

  const cardsUrl = useMemo(() => {
    if (!topicId) return null;
    return `${API}/api/cards/${topicId}`;
  }, [topicId]);

  const loadMe = async () => {
    const r = await fetch(`${API}/api/auth/me`, { credentials: "include" });
    if (!r.ok) {
      setAdmin(false);
      return false;
    }
    const data = await safeJson(r);
    const is = !!data?.admin;
    setAdmin(is);
    return is;
  };

  const loadTopics = async () => {
    const r = await fetch(`${API}/api/topics`, { credentials: "include" });
    const data = await safeJson(r);
    setTopics(Array.isArray(data) ? data : []);
  };

  const loadCards = async () => {
    if (!topicId) return;

    const r = await fetch(`${API}/api/cards/${topicId}`, {
      credentials: "include",
    });

    if (!r.ok) {
      setCards([]);
      setIdx(0);
      setFlipped(false);
      return;
    }

    const data = await safeJson(r);
    const arr = Array.isArray(data) ? data : [];

    setCards(arr);
    setFlipped(false);
    setIdx((prev) => {
      if (!arr.length) return 0;
      return Math.min(prev, arr.length - 1);
    });
  };

  useEffect(() => {
    loadMe();
    loadTopics();
  }, []);

  useEffect(() => {
    loadCards();
    setIdx(0);
    setFlipped(false);
  }, [topicId]);

  const topicName = useMemo(() => {
    if (!topicId) return "";
    const byId = topics.find((t) => String(t.id) === String(topicId));
    if (byId?.name) return byId.name;

    const byName = topics.find((t) => String(t.name) === String(topicId));
    if (byName?.name) return byName.name;

    return String(topicId);
  }, [topics, topicId]);

  const normalize = (c) => ({
    question: c?.question ?? c?.q ?? c?.front ?? c?.kerdes ?? "Kérdés",
    answer: c?.answer ?? c?.a ?? c?.back ?? c?.valasz ?? "Válasz",
  });

  const current = cards.length ? normalize(cards[idx]) : null;

  const prev = () => {
    if (!cards.length) return;
    setIdx((i) => (i - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const next = () => {
    if (!cards.length) return;
    setIdx((i) => (i + 1) % cards.length);
    setFlipped(false);
  };

  const logoutAdmin = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAdmin(false);
    setShowAdminBox(false);
  };

  const onAddClick = async () => {
    setAddErr("");
    const is = await loadMe();
    if (is) {
      setShowAdminBox(true);
      return;
    }
    setOpenKey(true);
  };

  const addCard = async () => {
    setAddErr("");

    const qq = q.trim();
    const aa = a.trim();
    if (!qq || !aa) {
      setAddErr("Írj be kérdést és választ is.");
      return;
    }
    if (!cardsUrl) {
      setAddErr("Hibás témakör azonosító.");
      return;
    }

    const r = await fetch(cardsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question: qq, answer: aa }),
    });

    if (r.status === 401) {
      setOpenKey(true);
      return;
    }

    if (!r.ok) {
      const data = await safeJson(r);
      setAddErr(data?.error || "Nem sikerült hozzáadni.");
      return;
    }

    setQ("");
    setA("");
    setShowAdminBox(false);
    await loadCards();
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="topicTop">
          <button className="backBtn" onClick={() => navigate("/")}>
            ←
          </button>

          <div className="topicCenter">
            <div className="topicTitle">{topicName}</div>
            <div className="topicCount">
              {cards.length ? `${idx + 1} / ${cards.length}` : "0 / 0"}
            </div>
          </div>

          {admin && (
            <button
              className="adminExitBtn"
              onClick={logoutAdmin}
              title="Kilépés admin módból"
              type="button"
            >
              ⛨
            </button>
          )}
        </div>

        {showAdminBox && (
  <div className="modalOverlay">
    <div className="modalCard">
      <div className="modalHeader">
        <span>ADMIN MODE</span>
        <button
          className="modalClose"
          onClick={() => {
            setShowAdminBox(false);
            setAdmin(false);
          }}
        >
          ←
        </button>
      </div>

      <div className="modalFields">
        <input
          className="modalInput"
          placeholder="kérdés..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          className="modalInput"
          placeholder="válasz..."
          value={a}
          onChange={(e) => setA(e.target.value)}
        />
      </div>

      {addErr && <div className="modalError">{addErr}</div>}

      <button className="modalPrimaryBtn" onClick={addCard}>
        Hozzáadás
      </button>
    </div>
  </div>
)}

       

        {cards.length ? (
          <div className="desktopShorts">
            <div className="card" onClick={() => setFlipped((f) => !f)}>
              <div className={`flip ${flipped ? "isFlipped" : ""}`}>
                <div className="face front">
                  <div className="cardLabel">KÉRDÉS</div>
                  <div className="cardText">{current?.question}</div>
                  <div className="cardHint">Tap/click → fordítás</div>
                </div>

                <div className="face back">
                  <div className="cardLabel">VÁLASZ</div>
                  <div className="cardText">{current?.answer}</div>
                  <div className="cardHint">Tap/click → fordítás</div>
                </div>
              </div>
            </div>

            <div className="navArrows">
              <button className="arrowBtn" onClick={prev} aria-label="Előző">
                ↑
              </button>
              <button className="arrowBtn" onClick={next} aria-label="Következő">
                ↓
              </button>
            </div>
          </div>
        ) : (
          <div className="emptyTopic">
            <div className="emptyText">Nincs kártya ebben a témakörben.</div>
          </div>
        )}

        <div className="topicBottom">
          <button className="addBtn" onClick={onAddClick}>
            Új kártya hozzáadása
          </button>
        </div>
      </div>

      <AccessKeyModal
        open={openKey}
        onClose={() => setOpenKey(false)}
        onSuccess={async () => {
          setOpenKey(false);
          await loadMe();
          setShowAdminBox(true);
        }}
      />
    </div>
  );
};
