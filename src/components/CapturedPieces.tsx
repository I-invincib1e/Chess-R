import React from 'react';
import { motion } from 'framer-motion';
import { Piece } from '../types/chess';
import { themes } from '../utils/themes';
import { ThemeType } from '../types/theme';

interface CapturedPiecesProps {
  pieces: Piece[];
  side: 'white' | 'black';
  theme: ThemeType;
}

export const CapturedPieces = React.memo<CapturedPiecesProps>(({ pieces, side, theme }) => {
  const getPieceSymbol = (piece: Piece): string => {
    const symbols: Record<string, string> = {
      'white-king': '♔', 'white-queen': '♕', 'white-rook': '♖',
      'white-bishop': '♗', 'white-knight': '♘', 'white-pawn': '♙',
      'black-king': '♚', 'black-queen': '♛', 'black-rook': '♜',
      'black-bishop': '♝', 'black-knight': '♞', 'black-pawn': '♟'
    };
    return symbols[`${piece.color}-${piece.type}`];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-wrap gap-1 p-2 rounded-lg bg-black/20 ${
        side === 'white' ? 'justify-start' : 'justify-end'
      }`}
    >
      {pieces.map((piece, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-2xl ${themes[theme].pieces[piece.color]}`}
        >
          {getPieceSymbol(piece)}
        </motion.div>
      ))}
    </motion.div>
  );
});