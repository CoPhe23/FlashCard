import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { flashcards as defaultCards } from "../data/data";
import { isAdmin, setAdmin } from "../utils/auth";

const LS_CARDS = "flash_cards";

export default function AddCard() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  if (!isAdmin()) {
    navigate(`/topic/${category}`);
    return null;
  }

  const save = () => {
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) return;

    const saved = localStorage.getItem(LS_CARDS);
    const cards = saved ? JSON.parse(saved) : defaultCards;

    const next = [...cards, { id: Date.now(), category, question: q, answer: a }];
    localStorage.setItem(LS_CARDS, JSON.stringify(next));

    navigate(`/topic/${category}`);
  };

  const logout = () => {
    setAdmin(false);
    navigate(`/topic/${category}`);
  };

 return (
  <div className="page">
    <div className="addWrapPremium">
      <button className="iconBtn" onClick={() => navigate(`/topic/${category}`)}>←</button>

      <div className="addHeader">
        <div className="addTitlePremium">{category}</div>
        <div className="adminBadge">ADMIN MODE</div>
      </div>

      <div className="adminPanel">
        <input
          className="adminInput"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="kérdés..."
        />

        <input
          className="adminInput"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="válasz..."
        />

        <button className="addPrimaryBtn" onClick={save}>Hozzáadás</button>
      </div>

      <button className="adminExitBtn" onClick={logout}>Kilépés admin módból</button>
    </div>
  </div>
);

}
