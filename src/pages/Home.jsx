import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessKeyModal from "../components/AccessKeyModal";
import { flashcards } from "../data/data";
import { isAdmin } from "../utils/auth";

export const Home = () => {
  const navigate = useNavigate();
  const [openKey, setOpenKey] = useState(false);

  const baseCategories = [...new Set(flashcards.map(c => c.category))];
  const stored = JSON.parse(localStorage.getItem("flash_categories") || "[]");
  const categories = [...new Set([...baseCategories, ...stored])];

  const addCategoryPrompt = () => {
    const name = prompt("Új témakör neve:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const saved = JSON.parse(localStorage.getItem("flash_categories") || "[]");
    const exists = saved.some(
      c => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;

    const next = [...saved, trimmed];
    localStorage.setItem("flash_categories", JSON.stringify(next));
    location.reload();
  };

  const onAddCategoryClick = () => {
    if (isAdmin()) {
      addCategoryPrompt();
    } else {
      setOpenKey(true);
    }
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

        <div className="homeCats">
          {categories.map(cat => (
            <button
              key={cat}
              className="arrowBtn"
              style={{
                width: "auto",
                padding: "12px 14px",
                minWidth: 120,
                justifyContent: "center",
                fontSize: 14,
                letterSpacing: 0.4
              }}
              onClick={() => navigate(`/topic/${cat}`)}
            >
              {cat}
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
        onSuccess={() => {
          setOpenKey(false);
          addCategoryPrompt();
        }}
      />
    </div>
  );
};
