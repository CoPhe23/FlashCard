import React from 'react'
import { useNavigate } from 'react-router-dom';
import { flashcards } from '../data/data';

export const Home = () => {
    const navigate = useNavigate();

    const categories = [...new Set(flashcards.map((c) => c.category))];


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
      </div>
    </div>
  )
}

