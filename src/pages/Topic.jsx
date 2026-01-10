import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { flashcards } from "../data/data";

export default function Topic() {
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

  const { category } = useParams();
  const navigate = useNavigate();

  const cards = flashcards.filter((c) => c.category === category);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="page">
        <div className="shell">
          <div className="header">
            <button className="arrowBtn" onClick={() => navigate("/")}>
              ←
            </button>
            <div>
              <h2 className="title">{category}</h2>
              <div className="subtle">Nincs kártya ebben a kategóriában.</div>
            </div>
            <div style={{ width: 52 }} />
          </div>
        </div>
      </div>
    );
  }

  const card = cards[index];

  const goPrev = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setShowAnswer(false);
  };

  const goNext = () => {
    if (index === cards.length - 1) return;
    setIndex((i) => i + 1);
    setShowAnswer(false);
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="header">
          <button className="arrowBtn" onClick={() => navigate("/")}>
            ←
          </button>

          <div>
            <h2 className="title">{category}</h2>
            <div className="subtle">
              {index + 1} / {cards.length}
            </div>
          </div>

          <div style={{ width: 52 }} />
        </div>

        <div className="desktopShorts">
          <div className="card" onClick={() => setShowAnswer((v) => !v)}>
            <div className="cardLabel">{showAnswer ? "Válasz" : "Kérdés"}</div>

            <div className="cardBody">
              <p className="cardText">
                {showAnswer ? card.answer : card.question}
              </p>
            </div>

            <div className="tapHint">Tap/click → fordítás</div>
          </div>

          <div className="navArrows">
            <button
              className="arrowBtn"
              onClick={goPrev}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              className="arrowBtn"
              onClick={goNext}
              disabled={index === cards.length - 1}
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
