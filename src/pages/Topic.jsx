import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { flashcards } from "../data/data";
import AccessKeyModal from "../components/AccessKeyModal";
import { isAdmin } from "../utils/auth";

const LS_CARDS = "flash_cards";

export default function Topic() {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [allCards, setAllCards] = useState(() => {
    const saved = localStorage.getItem(LS_CARDS);
    return saved ? JSON.parse(saved) : flashcards;
  });

  useEffect(() => {
    const saved = localStorage.getItem(LS_CARDS);
    setAllCards(saved ? JSON.parse(saved) : flashcards);
  }, [location.pathname]);

  const cards = allCards.filter((c) => c.category === category);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [openKey, setOpenKey] = useState(false);

  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
  }, [category, cards.length]);

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

  const goAdd = () => {
    if (isAdmin()) navigate(`/add/${category}`);
    else setOpenKey(true);
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="topicHeader">
  <button className="iconBtn" onClick={() => navigate("/")}>←</button>

  <div className="topicCenter">
    <h2 className="title">{category}</h2>
    <div className="subtle">
      {cards.length === 0 ? "0 / 0" : `${index + 1} / ${cards.length}`}
    </div>
  </div>

  <div className="topicRightSpace" />
</div>

        {cards.length === 0 ? (
          <div className="emptyText">
            Nincs kártya ebben a témakörben.
          </div>
        ) : (
          <div className="desktopShorts">
            <div className="cardAnim">
              <div className="card" onClick={() => setShowAnswer((v) => !v)}>
                <div className={`flip ${showAnswer ? "isFlipped" : ""}`}>
                  <div className="face front">
                    <div className="cardLabel">Kérdés</div>
                    <div className="cardBody">
                      <p className="cardText">{cards[index].question}</p>
                    </div>
                    <div className="tapHint">Tap/click → fordítás</div>
                  </div>

                  <div className="face back">
                    <div className="cardLabel">Válasz</div>
                    <div className="cardBody">
                      <p className="cardText">{cards[index].answer}</p>
                    </div>
                    <div className="tapHint">Tap/click → fordítás</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="topicControls">
  <div className="navArrows">
    <button className="arrowBtn" onClick={goPrev} disabled={index === 0}>↑</button>
    <button className="arrowBtn" onClick={goNext} disabled={index === cards.length - 1}>↓</button>
  </div>
</div>

          </div>
        )}

       
      </div>
      <div className="topicBottomBar">
  <button className="addBtn" onClick={goAdd}>
    Új kártya hozzáadása
  </button>
</div>


      <AccessKeyModal
        open={openKey}
        onClose={() => setOpenKey(false)}
        onSuccess={() => navigate(`/add/${category}`)}
      />
    </div>
  );
}
