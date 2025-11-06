import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameControls } from '../GameControls';
import { GameMode, ThemeType, Piece } from '../../types';
import { Move } from '../../types/game';
import { Trophy, Clock, Target, Info, History, BarChart3, X, Menu } from 'lucide-react';
import { MoveHistory } from './MoveHistory';
import { WinProbability } from './WinProbability';
import { CapturedPieces } from '../CapturedPieces';

interface GameLayoutProps {
  gameMode: GameMode;
  theme: ThemeType;
  board: (Piece | null)[][];
  turn: 'white' | 'black';
  isThinking: boolean;
  winProbability: { white: number; black: number };
  capturedPieces: Piece[];
  moveHistory: Move[];
  historyIndex: number;
  gameStats: {
    accuracy: number;
    mistakes: number;
    averageTime: number;
    openingName: string;
  };
  children?: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  gameMode,
  theme,
  turn,
  isThinking,
  winProbability,
  capturedPieces,
  moveHistory,
  historyIndex,
  gameStats,
  children
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'stats'>('info');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getDifficultyColor = (mode: GameMode) => {
    switch (mode) {
      case 'easy': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'medium': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'hard': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'grandmaster': return 'from-purple-500/20 to-indigo-500/20 border-purple-500/30';
      default: return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
    }
  };

  const getDifficultyLabel = (mode: GameMode) => {
    switch (mode) {
      case 'easy': return 'Beginner';
      case 'medium': return 'Intermediate';
      case 'hard': return 'Advanced';
      case 'grandmaster': return 'Grandmaster';
      default: return 'Custom';
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Fixed Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </motion.button>
            
            <motion.div
              className={`p-2 rounded-lg bg-gradient-to-br ${getDifficultyColor(gameMode)} border`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-white">Chess Arena</h1>
              <p className="text-xs text-gray-400">{getDifficultyLabel(gameMode)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{isThinking ? "AI Thinking..." : `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-300">
              <Target className="w-4 h-4" />
              <span className="text-sm">Training</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Sidebar - Collapsible */}
        <AnimatePresence>
          {(isSidebarOpen || isLargeScreen) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute lg:relative w-80 h-full bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col"
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-white/10">
                {[
                  { id: 'info', label: 'Info', icon: Info },
                  { id: 'history', label: 'History', icon: History },
                  { id: 'stats', label: 'Stats', icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'info' | 'history' | 'stats')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-white/10 text-white border-b-2 border-cyan-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3">Game Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>Your Color:</span>
                            <span className="text-white font-medium">White</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>AI Color:</span>
                            <span className="text-white font-medium">Black</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Theme:</span>
                            <span className="text-white font-medium capitalize">{theme}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Moves:</span>
                            <span className="text-white font-medium">{moveHistory.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3">Win Probability</h3>
                        <WinProbability whiteProb={winProbability.white} blackProb={winProbability.black} />
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3">Captured Pieces</h3>
                        <div className="space-y-2">
                          <CapturedPieces 
                            pieces={capturedPieces.filter(p => p.color === 'white')} 
                            side="white" 
                            theme={theme} 
                          />
                          <CapturedPieces 
                            pieces={capturedPieces.filter(p => p.color === 'black')} 
                            side="black" 
                            theme={theme} 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'history' && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <MoveHistory 
                        moves={moveHistory} 
                        currentMoveIndex={historyIndex}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3">Performance</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Accuracy</span>
                              <span className="text-white font-medium">{gameStats.accuracy}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${gameStats.accuracy}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Move Quality</span>
                              <span className="text-white font-medium">Good</span>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`flex-1 h-2 rounded-full ${
                                    i < 3 ? 'bg-green-500' : 'bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3">Statistics</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>Average Time:</span>
                            <span className="text-white font-medium">{gameStats.averageTime}s</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Mistakes:</span>
                            <span className="text-white font-medium">{gameStats.mistakes}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Opening:</span>
                            <span className="text-white font-medium">{gameStats.openingName}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              {children}
            </div>
          </div>

          {/* Fixed Bottom Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-md border-t border-white/10 p-4"
          >
            <div className="max-w-4xl mx-auto">
              <GameControls
                onUndo={() => {}}
                onRedo={() => {}}
                onSave={() => {}}
                onNewGame={() => {}}
                onAnalyze={() => {}}
                onShare={() => {}}
                onTogglePause={() => {}}
                canUndo={true}
                canRedo={false}
                isPaused={false}
                isAnalyzing={false}
              />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};