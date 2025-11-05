import React from 'react';
import { motion } from 'framer-motion';
import { Undo, Redo, Save, Download } from 'lucide-react';

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onRedo,
  onSave,
  canUndo = true,
  canRedo = true,
}) => {
  return (
    <div className="flex gap-2 justify-center">
      <motion.button
        whileHover={{ scale: canUndo ? 1.05 : 1 }}
        whileTap={{ scale: canUndo ? 0.95 : 1 }}
        className={`p-3 rounded-lg transition-colors ${
          canUndo 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (take back your last move)"
      >
        <Undo className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: canRedo ? 1.05 : 1 }}
        whileTap={{ scale: canRedo ? 0.95 : 1 }}
        className={`p-3 rounded-lg transition-colors ${
          canRedo 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo move"
      >
        <Redo className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
        onClick={onSave}
        title="Save game (PGN format)"
      >
        <Save className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
        onClick={onSave}
        title="Download game"
      >
        <Download className="w-5 h-5" />
      </motion.button>
    </div>
  );
};