import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieceType, PieceColor } from '../types/chess';
import { getPieceSymbol } from '../utils/pieceUtils';
import { themes } from '../utils/themes';
import { ThemeType } from '../types/theme';

interface PromotionModalProps {
  show: boolean;
  color: PieceColor;
  theme: ThemeType;
  onSelect: (pieceType: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  show,
  color,
  theme,
  onSelect
}) => {
  const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       bg-zinc-900 rounded-xl p-6 shadow-2xl border-2 border-zinc-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Promote Pawn
            </h3>
            
            <p className="text-sm text-zinc-400 mb-4 text-center">
              Choose a piece to promote to:
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              {pieces.map(pieceType => (
                <motion.button
                  key={pieceType}
                  onClick={() => onSelect(pieceType)}
                  className={`w-16 h-16 flex items-center justify-center rounded-lg
                             ${themes[theme].board.light} hover:ring-4 
                             ${themes[theme].board.highlight} transition-all relative group`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={pieceType.charAt(0).toUpperCase() + pieceType.slice(1)}
                >
                  <span className={`text-4xl ${themes[theme].pieces[color]}`}>
                    {getPieceSymbol({ type: pieceType, color })}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                                  bg-zinc-800 px-2 py-1 rounded text-xs whitespace-nowrap
                                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {pieceType.charAt(0).toUpperCase() + pieceType.slice(1)}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
