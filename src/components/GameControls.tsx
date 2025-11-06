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

  const getButtonClasses = (baseColor: string, enabled: boolean) => `
    relative p-3 rounded-xl font-medium transition-all duration-200
    ${enabled 
      ? `bg-gradient-to-r ${baseColor} text-white shadow-lg hover:shadow-xl` 
      : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-zinc-700/50'
    }
    backdrop-blur-sm border border-white/10
    before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:opacity-0 hover:before:opacity-20
    before:transition-opacity before:duration-200
  `;

  return (
    <motion.div 
      className="flex flex-wrap gap-3 justify-center items-center p-4 bg-black/30 rounded-2xl backdrop-blur-md border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Undo Button */}
      <motion.button
        variants={buttonVariants}
        initial="enabled"
        whileHover={canUndo ? "hover" : "disabled"}
        whileTap={canUndo ? "tap" : "disabled"}
        animate={canUndo ? "enabled" : "disabled"}
        className={getButtonClasses("from-blue-600 to-blue-700", canUndo)}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (take back your last move)"
      >
        <div className="flex items-center gap-2">
          <Undo className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Undo</span>
        </div>
      </motion.button>

      {/* Redo Button */}
      <motion.button
        variants={buttonVariants}
        initial="enabled"
        whileHover={canRedo ? "hover" : "disabled"}
        whileTap={canRedo ? "tap" : "disabled"}
        animate={canRedo ? "enabled" : "disabled"}
        className={getButtonClasses("from-blue-600 to-blue-700", canRedo)}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo move"
      >
        <div className="flex items-center gap-2">
          <Redo className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Redo</span>
        </div>
      </motion.button>

      {/* New Game Button */}
      {onNewGame && (
        <motion.button
          variants={buttonVariants}
          initial="enabled"
          whileHover="hover"
          whileTap="tap"
          animate="enabled"
          className={getButtonClasses("from-orange-600 to-red-600", true)}
          onClick={onNewGame}
          title="Start a new game"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">New Game</span>
          </div>
        </motion.button>
      )}

      {/* Pause/Play Button */}
      {onTogglePause && (
        <motion.button
          variants={buttonVariants}
          initial="enabled"
          whileHover="hover"
          whileTap="tap"
          animate="enabled"
          className={getButtonClasses(isPaused ? "from-green-600 to-emerald-600" : "from-yellow-600 to-orange-600", true)}
          onClick={onTogglePause}
          title={isPaused ? "Resume game" : "Pause game"}
        >
          <div className="flex items-center gap-2">
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            <span className="hidden sm:inline text-sm">{isPaused ? "Resume" : "Pause"}</span>
          </div>
        </motion.button>
      )}

      {/* Analyze Button */}
      {onAnalyze && (
        <motion.button
          variants={buttonVariants}
          initial="enabled"
          whileHover="hover"
          whileTap="tap"
          animate={isAnalyzing ? "disabled" : "enabled"}
          className={getButtonClasses("from-purple-600 to-indigo-600", !isAnalyzing)}
          onClick={onAnalyze}
          disabled={isAnalyzing}
          title="Analyze current position"
        >
          <div className="flex items-center gap-2">
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.div>
            ) : (
              <RotateCcw className="w-5 h-5" />
            )}
            <span className="hidden sm:inline text-sm">{isAnalyzing ? "Analyzing..." : "Analyze"}</span>
          </div>
        </motion.button>
      )}

      {/* Save Button */}
      <motion.button
        variants={buttonVariants}
        initial="enabled"
        whileHover="hover"
        whileTap="tap"
        animate="enabled"
        className={getButtonClasses("from-green-600 to-emerald-600", true)}
        onClick={onSave}
        title="Save game (PGN format)"
      >
        <div className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Save</span>
        </div>
      </motion.button>

      {/* Download Button */}
      <motion.button
        variants={buttonVariants}
        initial="enabled"
        whileHover="hover"
        whileTap="tap"
        animate="enabled"
        className={getButtonClasses("from-cyan-600 to-blue-600", true)}
        onClick={onSave}
        title="Download game as PGN"
      >
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Download</span>
        </div>
      </motion.button>

      {/* Share Button */}
      {onShare && (
        <motion.button
          variants={buttonVariants}
          initial="enabled"
          whileHover="hover"
          whileTap="tap"
          animate="enabled"
          className={getButtonClasses("from-pink-600 to-purple-600", true)}
          onClick={onShare}
          title="Share game"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Share</span>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
};