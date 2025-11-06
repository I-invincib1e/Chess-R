// Board dimensions
export const BOARD_SIZE = 8;

// Piece values for evaluation
export const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
} as const;

// AI search depth by difficulty (increased with optimizations)
export const AI_DEPTH = {
  easy: 2,
  medium: 4,
  hard: 5,
  grandmaster: 6
} as const;

// AI randomization factor by difficulty
export const AI_RANDOMNESS = {
  easy: 300,
  medium: 150,
  hard: 50,
  grandmaster: 0
} as const;

// File and rank labels
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

// Starting position in FEN notation
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Evaluation scores
export const CHECKMATE_SCORE = 100000;
export const CHECK_BONUS = 500;

// Time constants (in milliseconds)
export const AI_THINKING_DELAY = 500;
export const NOTIFICATION_DURATION = 2500;
export const LOADING_DELAY = 1500;
