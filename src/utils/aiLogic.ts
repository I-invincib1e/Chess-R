import { Piece, Position, GameMode } from '../types/chess';
import { getValidMoves } from './moveValidation';
import { isKingInCheck, isCheckmate } from './gameStateUtils';
import { cloneBoard } from './boardUtils';
import { 
  PIECE_VALUES, 
  AI_DEPTH, 
  AI_RANDOMNESS, 
  CHECKMATE_SCORE, 
  CHECK_BONUS 
} from '../constants/chess';

// Position bonus matrices for each piece type
const POSITION_BONUS = {
  pawn: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  king: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

// Evaluate position for a specific piece
const evaluatePiecePosition = (piece: Piece, x: number, y: number, endgame: boolean): number => {
  const baseValue = PIECE_VALUES[piece.type];
  let positionBonus = 0;

  if (POSITION_BONUS[piece.type]) {
    const matrix = POSITION_BONUS[piece.type];
    const row = piece.color === 'white' ? 7 - y : y;
    positionBonus = matrix[row][x];
  }

  // Increase king safety importance in endgame
  if (piece.type === 'king' && endgame) {
    positionBonus *= 0.5;
  }

  return baseValue + positionBonus;
};

// Check if we're in endgame
const isEndgame = (board: (Piece | null)[][]): boolean => {
  let queens = 0;
  let minorPieces = 0;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        if (piece.type === 'queen') queens++;
        if (piece.type === 'knight' || piece.type === 'bishop') minorPieces++;
      }
    }
  }

  return queens === 0 || (queens === 2 && minorPieces <= 2);
};

// Enhanced board evaluation
const evaluateBoard = (board: (Piece | null)[][], checkmatePriority: boolean): number => {
  let score = 0;
  const endgame = isEndgame(board);

  // Check for checkmate
  if (isCheckmate(board, 'white')) return CHECKMATE_SCORE;
  if (isCheckmate(board, 'black')) return -CHECKMATE_SCORE;

  // Check for check
  if (checkmatePriority) {
    if (isKingInCheck(board, 'white')) score -= CHECK_BONUS;
    if (isKingInCheck(board, 'black')) score += CHECK_BONUS;
  }

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        const value = evaluatePiecePosition(piece, x, y, endgame);
        score += piece.color === 'black' ? value : -value;
      }
    }
  }

  return score;
};

// Get best move based on difficulty
export const getBestMove = (
  board: (Piece | null)[][],
  difficulty: GameMode,
  _capturedPieces: Piece[] = []
): { from: Position; to: Position } | null => {
  const moves = getAllValidMoves(board, 'black');
  
  if (moves.length === 0) return null;

  const checkmatePriority = difficulty !== 'easy';
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const score = minimax(
      newBoard,
      AI_DEPTH[difficulty],
      -Infinity,
      Infinity,
      false,
      checkmatePriority
    );

    // Add randomization for lower difficulties
    const adjustedScore = score + (Math.random() - 0.5) * AI_RANDOMNESS[difficulty];

    if (adjustedScore > bestScore) {
      bestScore = adjustedScore;
      bestMove = move;
    }
  }

  return bestMove;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  checkmatePriority: boolean
): number => {
  if (depth === 0) return evaluateBoard(board, checkmatePriority);

  const moves = getAllValidMoves(board, isMaximizing ? 'black' : 'white');
  
  if (moves.length === 0) {
    // Checkmate or stalemate
    if (isKingInCheck(board, isMaximizing ? 'black' : 'white')) {
      return isMaximizing ? -CHECKMATE_SCORE : CHECKMATE_SCORE;
    }
    return 0; // Stalemate
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const evaluation = minimax(
        makeMove(board, move.from, move.to),
        depth - 1,
        alpha,
        beta,
        false,
        checkmatePriority
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const evaluation = minimax(
        makeMove(board, move.from, move.to),
        depth - 1,
        alpha,
        beta,
        true,
        checkmatePriority
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// Helper function to get all valid moves
const getAllValidMoves = (board: (Piece | null)[][], color: 'white' | 'black'): Array<{
  from: Position;
  to: Position;
}> => {
  const moves = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves({ x, y }, piece, board);
        validMoves.forEach(to => {
          moves.push({ from: { x, y }, to });
        });
      }
    }
  }
  return moves;
};

// Make a move on a board copy
const makeMove = (board: (Piece | null)[][], from: Position, to: Position): (Piece | null)[][] => {
  const newBoard = cloneBoard(board);
  newBoard[to.y][to.x] = newBoard[from.y][from.x];
  newBoard[from.y][from.x] = null;
  return newBoard;
};