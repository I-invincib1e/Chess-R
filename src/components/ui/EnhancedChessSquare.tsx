import React from 'react';
import { motion } from 'framer-motion';
import { Piece, Position } from '../../types';
import { getPieceSymbol } from '../../utils/pieceUtils';

interface EnhancedChessSquareProps {
  piece: Piece | null;
  position: Position;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  theme: {
    light: string;
    dark: string;
    selected: string;
    lastMove: string;
    possible: string;
  };
  onClick: () => void;
  index: number;
}

export const EnhancedChessSquare: React.FC<EnhancedChessSquareProps> = ({
  piece,
  position,
  isLight,
  isSelected,
  isPossibleMove,
  isLastMove,
  isInCheck,
  theme,
  onClick,
  index,
}) => {
  const getSquareColor = () => {
    if (isSelected) return theme.selected;
    if (isLastMove) return theme.lastMove;
    if (isInCheck) return 'bg-gradient-to-br from-red-500/30 to-orange-500/30';
    return isLight ? theme.light : theme.dark;
  };

  const getSquareBorder = () => {
    if (isSelected) return 'border-2 border-cyan-400 shadow-lg shadow-cyan-400/50';
    if (isInCheck) return 'border-2 border-red-500 shadow-lg shadow-red-500/50';
    if (isLastMove) return 'border-2 border-yellow-500/50';
    return '';
  };

  const renderPiece = () => {
    if (!piece) return null;

    const pieceSymbol = getPieceSymbol(piece);
    const isPieceWhite = piece.color === 'white';

    return (
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: index * 0.01,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span
          className={`text-5xl sm:text-6xl md:text-7xl select-none cursor-pointer filter transition-all duration-300
                     ${isPieceWhite ? 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'}
                     hover:brightness-110`}
          style={{
            filter: isPieceWhite 
              ? 'drop-shadow(0 2px 4px rgba(255,255,255,0.3)) brightness(1.1)' 
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) brightness(0.9)',
          }}
        >
          {pieceSymbol}
        </span>

        {/* Piece glow effect */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `radial-gradient(circle at center, ${isPieceWhite ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}, transparent)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    );
  };

  const renderMoveIndicator = () => {
    if (!isPossibleMove) return null;

    const isCapture = piece !== null;

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {isCapture ? (
          <motion.div
            className="w-4 h-4 border-2 border-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent)',
            }}
          />
        ) : (
          <motion.div
            className="w-3 h-3 bg-cyan-400 rounded-full"
            animate={{
              scale: [1, 0.8, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className={`relative w-full h-full cursor-pointer transition-all duration-300 ${getSquareColor()} ${getSquareBorder()}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.02,
        duration: 0.3,
        type: "spring",
        bounce: 0.4
      }}
      layout
    >
      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
        whileHover={{ opacity: 1 }}
      />

      {/* Grid pattern for visual interest */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`,
        }}
      />

      {/* Render piece */}
      {renderPiece()}

      {/* Render move indicator */}
      {renderMoveIndicator()}

      {/* Coordinate labels (optional, for educational mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 text-xs text-gray-500 m-1">
          {String.fromCharCode(97 + position.col)}{8 - position.row}
        </div>
      )}
    </motion.div>
  );
};