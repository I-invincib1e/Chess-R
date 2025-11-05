import React from 'react';
import { motion } from 'framer-motion';
import { Move } from '../../types/game';
import { Clock } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex?: number;
  onMoveClick?: (index: number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ 
  moves, 
  currentMoveIndex = -1, 
  onMoveClick 
}) => {
  const movePairs: [Move, Move | undefined][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1]]);
  }

  if (moves.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Move History
        </h3>
        <p className="text-zinc-500 text-sm text-center py-4">
          No moves yet. Make your first move!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Move History
      </h3>
      
      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        {movePairs.map((pair, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-12 gap-2 text-sm"
          >
            <div className="col-span-2 text-zinc-500 font-mono">
              {index + 1}.
            </div>
            
            <button
              onClick={() => onMoveClick?.(index * 2)}
              className={`col-span-5 text-left px-2 py-1 rounded transition-colors font-mono
                ${currentMoveIndex === index * 2 
                  ? 'bg-blue-600 text-white' 
                  : 'text-white hover:bg-zinc-800'
                }`}
            >
              {pair[0].notation}
            </button>
            
            {pair[1] ? (
              <button
                onClick={() => onMoveClick?.(index * 2 + 1)}
                className={`col-span-5 text-left px-2 py-1 rounded transition-colors font-mono
                  ${currentMoveIndex === index * 2 + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'text-white hover:bg-zinc-800'
                  }`}
              >
                {pair[1].notation}
              </button>
            ) : (
              <div className="col-span-5" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
