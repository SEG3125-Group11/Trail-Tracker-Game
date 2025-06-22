// src/components/GameConfig.jsx
import React from 'react';

function GameConfig({ config, setConfig, onStart }) {
  return (
    <section className="config-screen">
      <h1>Trail Tracker</h1>
      <label>
        Difficulty&nbsp;
        <select
          value={config.difficulty}
          onChange={(e) =>
            setConfig({ ...config, difficulty: e.target.value })
          }
        >
          <option value="novice">Novice</option>
          <option value="journeyer">Journeyer</option>
          <option value="expert">Expert</option>
        </select>
      </label>

      <label>
        <input
          type="checkbox"
          checked={config.assist}
          onChange={(e) =>
            setConfig({ ...config, assist: e.target.checked })
          }
        />
        &nbsp;Enable assist flash
      </label>

      <button onClick={onStart}>Play</button>
    </section>
  );
}

export default GameConfig;
