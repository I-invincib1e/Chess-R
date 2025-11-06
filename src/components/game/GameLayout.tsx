import React from 'react';
import { motion } from 'framer-motion';
import { ChessBoard } from '../ChessBoard';
import { GameControls } from '../GameControls';
import { GameMode, ThemeType } from '../../types';
import { Trophy, Clock, Target } from 'lucide-react';

interface GameLayoutProps {
  gameMode: GameMode;
  theme: ThemeType;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ gameMode, theme }) => {
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
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-2 py-4 sm:p-6">
        {/* Header with game info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-6"
        >
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-br ${getDifficultyColor(gameMode)} border`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Trophy className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Chess Arena</h2>
                  <p className="text-sm text-gray-400">Mode: {getDifficultyLabel(gameMode)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Unlimited</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Training</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main game area */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Left sidebar - Game info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Game Info</h3>
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
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Move Quality</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < 3 ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Accuracy</span>
                  <span className="text-white font-medium">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Time Avg</span>
                  <span className="text-white font-medium">12s</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center - Chess Board */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <ChessBoard gameMode={gameMode} theme={theme} />
            </div>
            
            {/* Game Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};