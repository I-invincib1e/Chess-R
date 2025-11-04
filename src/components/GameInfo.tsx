import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Crown } from 'lucide-react';

interface GameInfoProps {
  turn: 'white' | 'black';
  isThinking: boolean;
  gameMode: string;
}

export const GameInfo = React.memo<GameInfoProps>(({ turn, isThinking, gameMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg"
    >
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5" />
        <span className="text-lg font-semibold">
          {isThinking ? "AI is thinking..." : `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5" />
        <span className="text-sm">
          {gameMode === 'pvp' ? 'Player vs Player' : `vs Computer (${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)})`}
        </span>
      </div>
    </motion.div>
  );
});