import { Piece } from '../types/chess';

/**
 * Deep clone a chess board
 */
export const cloneBoard = (board: (Piece | null)[][]): (Piece | null)[][] => {
  return board.map(row => [...row]);
};

/**
 * Create an empty 8x8 chess board
 */
export const createEmptyBoard = (): (Piece | null)[][] => {
  return Array(8).fill(null).map(() => Array(8).fill(null));
};

/**
 * Check if a position is within board bounds
 */
export const isValidPosition = (x: number, y: number): boolean => {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
};
