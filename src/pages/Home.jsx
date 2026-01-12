import React, { useMemo, useState } from "react";
import AccessKeyModal from "../components/AccessKeyModal";
import { isAdmin } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { flashcards } from "../data/data";

export const Home = () => {
  const navigate = useNavigate();
  const [openKey, setOpenKey] = useState(false);

  const [extraCats, setExtraCats] = useState(() => {
    const saved = localStorage.getItem("flash_categories");
    return saved ? JSON.parse(saved) : [];
  });

  const categories = useMemo(() => {
    const fromCards = flashcards.map((c) => c.category);
    return [...new Set([...fromCards, ...extraCats])].filter(Boolean);
  }, [extraCats]);

  const addCategoryPrompt = () => {
    const name = prompt("Új témakör neve:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;

    const next = [...extraCats, trimmed];
    setExtraCats(next);
    localStorage.setItem("flash_categories", JSON.stringify(next));
  };

  const onAddCategoryClick = () => {
    if (isAdmin()) addCategoryPrompt();
    else setOpenKey(true);
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="header">
          <div>
            <h1 className="title">FlashCards</h1>
            <div className="subtle">Mobile-first by design.</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className="arrowBtn"
              style={{
                width: "auto",
                padding: "12px 14px",
                minWidth: 120,
                justifyContent: "center",
                fontSize: 14,
                letterSpacing: 0.4,
              }}
              onClick={() => navigate(`/topic/${cat}`)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button className="addBtn" onClick={onAddCategoryClick}>
          Új témakör hozzáadása
        </button>
      </div>

      <AccessKeyModal
        open={openKey}
        onClose={() => setOpenKey(false)}
        onSuccess={() => {
          setOpenKey(false);
          addCategoryPrompt();
        }}
      />
    </div>
  );
};
