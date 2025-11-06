import React from 'react';
import { motion } from 'framer-motion';
import { Undo, Redo, Save, Download, RotateCcw, Share2, Pause, Play } from 'lucide-react';

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onAnalyze?: () => void;
  onNewGame?: () => void;
  onShare?: () => void;
  onTogglePause?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isPaused?: boolean;
  isAnalyzing?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onRedo,
  onSave,
  onAnalyze,
  onNewGame,
  onShare,
  onTogglePause,
  canUndo = true,
  canRedo = true,
  isPaused = false,
  isAnalyzing = false,
}) => {
  const buttonVariants = {
    enabled: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.1 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    disabled: {
      scale: 1,
      opacity: 0.5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 p-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo Group */}
        <div className="flex items-center bg-white/5 rounded-lg p-1">
          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover={canUndo ? "hover" : "disabled"}
            whileTap={canUndo ? "tap" : "disabled"}
            animate={canUndo ? "enabled" : "disabled"}
            className={`p-2 rounded-md transition-colors ${
              canUndo ? 'text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
            }`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo move"
          >
            <Undo className="w-4 h-4" />
          </motion.button>

          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover={canRedo ? "hover" : "disabled"}
            whileTap={canRedo ? "tap" : "disabled"}
            animate={canRedo ? "enabled" : "disabled"}
            className={`p-2 rounded-md transition-colors ${
              canRedo ? 'text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
            }`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo move"
          >
            <Redo className="w-4 h-4" />
          </motion.button>
        </div>

        {/* New Game */}
        {onNewGame && (
          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover="hover"
            whileTap="tap"
            animate="enabled"
            className="p-2 rounded-md bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transition-all"
            onClick={onNewGame}
            title="New game"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}

        {/* Pause/Play */}
        {onTogglePause && (
          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover="hover"
            whileTap="tap"
            animate="enabled"
            className={`p-2 rounded-md text-white transition-all ${
              isPaused 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
            }`}
            onClick={onTogglePause}
            title={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </motion.button>
        )}
      </div>

      {/* Secondary Actions - Dropdown style */}
      <div className="flex items-center gap-1">
        {/* Analyze */}
        {onAnalyze && (
          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover="hover"
            whileTap="tap"
            animate={isAnalyzing ? "disabled" : "enabled"}
            className={`p-2 rounded-md transition-all ${
              isAnalyzing 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'text-white hover:bg-white/10'
            }`}
            onClick={onAnalyze}
            disabled={isAnalyzing}
            title="Analyze position"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.div>
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
          </motion.button>
        )}

        {/* Save/Download Group */}
        <div className="flex items-center bg-white/5 rounded-lg p-1">
          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover="hover"
            whileTap="tap"
            animate="enabled"
            className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            onClick={onSave}
            title="Save game"
          >
            <Save className="w-4 h-4" />
          </motion.button>

          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover="hover"
            whileTap="tap"
            animate="enabled"
            className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            onClick={onSave}
            title="Download PGN"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Share */}
        {onShare && (
          <motion.button
            variants={buttonVariants}
            initial="enabled"
            whileHover="hover"
            whileTap="tap"
            animate="enabled"
            className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            onClick={onShare}
            title="Share game"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};