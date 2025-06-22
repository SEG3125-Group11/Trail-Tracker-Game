// File: src/components/Home.jsx
import React from 'react';
import './Home.css';

/**
 * Props
 * ─────
 * config   {difficulty, theme, assist}
 * setConfig(newConfig)         // update selections
 * onStart  ()                  // begin the game
 */
export default function Home({ config, setConfig, onStart }) {
  /* options */
  const DIFFICULTIES = [
    { label: 'Novice',    value: 'novice' },
    { label: 'Journeyer', value: 'journeyer' },
    { label: 'Expert',    value: 'expert' },
  ];

  const THEMES = [
    { id: 'forest',  label: 'Forest' },
    { id: 'coral',   label: 'Coral Reef' },
    { id: 'nebula',  label: 'Space Nebula' },
  ];

  return (
    <section className="home-root">
      {/* ────────── HERO BANNER ────────── */}
      <div className="hero">
        <h1 className="logo">Trail Tracker</h1>
        <p className="tagline">Can you follow the fireflies?</p>

        {/* floating fireflies */}
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="fly" style={{ '--i': i }} />
        ))}
      </div>

      {/* ────────── SETTINGS CARD ────────── */}
      <div className="settings-card">
        {/* difficulty */}
        <div className="setting-row">
          <h3>Difficulty</h3>
          <div className="pill-row">
            {DIFFICULTIES.map((d) => (
              <label
                key={d.value}
                className={
                  'pill ' + (config.difficulty === d.value ? 'active' : '')
                }
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={d.value}
                  checked={config.difficulty === d.value}
                  onChange={(e) =>
                    setConfig({ ...config, difficulty: e.target.value })
                  }
                />
                {d.label}
              </label>
            ))}
          </div>
        </div>

        {/* theme */}
        <div className="setting-row">
          <h3>Theme</h3>
          <div className="pill-row">
            {THEMES.map((t) => (
              <label
                key={t.id}
                className={'pill ' + (config.theme === t.id ? 'active' : '')}
              >
                <input
                  type="radio"
                  name="theme"
                  value={t.id}
                  checked={config.theme === t.id}
                  onChange={(e) =>
                    setConfig({ ...config, theme: e.target.value })
                  }
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* assist flashes */}
        <div className="setting-row assist-row">
          <label className="switch">
            <input
              type="checkbox"
              checked={config.assist}
              onChange={(e) =>
                setConfig({ ...config, assist: e.target.checked })
              }
            />
            <span className="slider" />
          </label>
          <span className="assist-label">Assist flash</span>
        </div>

        {/* play button */}
        <button className="play-btn" onClick={onStart}>
          ▶︎ Play
        </button>
      </div>
    </section>
  );
}
