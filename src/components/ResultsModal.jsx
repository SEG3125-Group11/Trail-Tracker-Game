// File: src/components/ResultsModal.jsx
import React, { useEffect, useState } from 'react';
import './ResultsModal.css';

/**
 * Props
 * ─────────────────────────────────────────────
 * score     { success: boolean, score: number, time: ms }
 * onRestart ()  →  navigate back to Home / start menu
 */
export default function ResultsModal({ score, onRestart }) {
  const { success, score: steps, time } = score ?? { success: false, score: 0, time: 0 };

  /* ------------- generate confetti one time ------------- */
  const [confetti, setConfetti] = useState([]);
  useEffect(() => {
    const pieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,          // vw %
      delay: Math.random() * 400,      // ms
      rot: Math.random() * 360,        // initial rotation
      size: 6 + Math.random() * 4,     // 6-10px width
      hueShift: Math.random() > 0.5,   // true = accent color
    }));
    setConfetti(pieces);
  }, []);

  /* ------------- helper: mm:ss.t format ----------------- */
  const fmt = (ms) => {
    if (!ms && ms !== 0) return '--:--';
    const s  = (ms / 1000).toFixed(1);
    const [secs, tenths] = s.split('.');
    const m  = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${m}:${ss}.${tenths}`;
  };

  /* ------------- render ----------------- */
  return (
    <div className="results-overlay">
      {/* confetti */}
      {confetti.map((p) => (
        <span
          key={p.id}
          className="confetto"
          style={{
            left: `${p.x}vw`,
            width:  p.size,
            height: p.size * 0.4,
            background: p.hueShift
              ? 'var(--accent)'
              : `hsl(${Math.random() * 360}deg 70% 60%)`,
            animationDelay: `${p.delay}ms`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}

      {/* results card */}
      <section className={`modal-card ${success ? 'win' : 'lose'}`}>
        <h2>{success ? '🎉  Great Job!' : '💡  Good Effort!'}</h2>

        <p className="stat">
          Steps matched&nbsp;<strong>{steps}</strong>
        </p>
        <p className="stat">
          Time&nbsp;<strong>{fmt(time)}</strong>
        </p>

        <button className="restart-btn" onClick={onRestart}>
          ⤺ Home
        </button>
      </section>
    </div>
  );
}
