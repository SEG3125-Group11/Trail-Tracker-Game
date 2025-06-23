import React, { useEffect, useState } from 'react';

/* screens */
import Home from './components/Home.jsx';
import GamePage from './components/GamePage.jsx';
import ResultsModal from './components/ResultsModal.jsx';
import Footer from './components/Footer.jsx'; 


export default function App() {
  /* which page? */
  const [screen, setScreen] = useState('home');  // 'home' | 'game' | 'result'

  /* game settings selected on Home */
  const [config, setConfig] = useState({
    difficulty: 'novice',
    theme: 'forest',
    assist: true,
  });

  /* result object from GamePage */
  const [result, setResult] = useState(null);

  /* ---- keep <body> class = current theme ---- */
  useEffect(() => {
    document.body.classList.remove('theme-forest', 'theme-coral', 'theme-nebula');
    document.body.classList.add(`theme-${config.theme}`);
  }, [config.theme]);

  /* restart same config */
  const restartGame = () => {
    setScreen(''); // force unmount
    setTimeout(() => setScreen('game'));
  };

  /* ---- render by screen ---- */
  return (
    <>
      <main className="app">
        {screen === 'home' && (
          <Home
            config={config}
            setConfig={setConfig}
            onStart={() => setScreen('game')}
          />
        )}

        {screen === 'game' && (
          <GamePage
            config={config}
            onGameEnd={(r) => { setResult(r); setScreen('result'); }}
            onRestart={restartGame}
            onHome={() => setScreen('home')}
          />
        )}

        {screen === 'result' && (
          <ResultsModal
            score={result}
            onRestart={() => setScreen('home')}
          />
        )}
      </main>

      {/* Footer appears on every screen */}
      <Footer />
    </>
  );
}
