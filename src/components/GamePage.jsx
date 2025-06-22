import React, { useEffect, useState, useRef } from 'react';
import GameBoard from './GameBoard.jsx';
import './GamePage.css';

export default function GamePage({ config, onGameEnd, onRestart, onHome }) {
  const [elapsed, setElapsed] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start timer only when onRecallStart() is triggered from GameBoard
  const handleRecallStart = () => {
    if (timerRef.current) return; // avoid restarting

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
    setIsTiming(true);
  };

  // Stop + clean timer
  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsTiming(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // Format mm:ss.t
  const fmt = (ms) => {
    const s = (ms / 1000).toFixed(1);
    const [secs, tenths] = s.split('.');
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${m}:${ss}.${tenths}`;
  };

  return (
    <section className="game-page">
      <header className="game-header">
        <button className="header-btn" onClick={onHome}>⤺&nbsp;Home</button>

        <div className="info">
          <span className="pill diff">{config.difficulty}</span>
          <span className="pill theme">{config.theme}</span>
          <span className="pill steps">Steps&nbsp;{steps}</span>
          <span className="pill timer">{fmt(elapsed)}</span>
        </div>

        <button
          className="header-btn"
          onClick={() => {
            setElapsed(0);     
            setSteps(0);
            stopTimer();       
            onRestart();
          }}
        >
          ↻&nbsp;Restart
        </button>
      </header>

      <GameBoard
        config={config}
        onStep={setSteps}
        onRecallStart={handleRecallStart}  
        onComplete={(res) => {
          stopTimer(); 
          onGameEnd({ ...res, time: elapsed });
        }}
      />
    </section>
  );
}
