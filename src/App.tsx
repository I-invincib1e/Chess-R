import React, { useState } from 'react';
import { HomePage } from './components/home/HomePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { Navigation } from './components/Navigation';
import { GameSetupFlow } from './components/setup/GameSetupFlow';
import { GameContainer } from './components/game/GameContainer';
import { ThemeType } from './types/theme';
import { GamePreferences } from './types/game';
import { LoadingSpinner } from './components/LoadingSpinner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings' | 'game'>('home');
  const [theme, setTheme] = useState<ThemeType>('cyber');
  const [showSetup, setShowSetup] = useState(false);
  const [gamePreferences, setGamePreferences] = useState<GamePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayClick = () => {
    setShowSetup(true);
  };

  const handleGameSetupComplete = async (prefs: GamePreferences, selectedTheme: ThemeType) => {
    setIsLoading(true);
    setGamePreferences(prefs);
    setTheme(selectedTheme);
    setShowSetup(false);
    setCurrentPage('game');
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Navigation onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {currentPage === 'home' && (
        <HomePage onPlayClick={handlePlayClick} />
      )}
      
      {currentPage === 'settings' && (
        <SettingsPage currentTheme={theme} onThemeChange={setTheme} />
      )}
      
      {currentPage === 'game' && gamePreferences && (
        <GameContainer gameMode={gamePreferences.difficulty} theme={theme} />
      )}

      {showSetup && (
        <GameSetupFlow
          onComplete={handleGameSetupComplete}
          onCancel={() => setShowSetup(false)}
        />
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  );
}