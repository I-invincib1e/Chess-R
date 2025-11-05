import { Piece, Position, GameMode } from '../types/chess';
import { getValidMoves } from './moveValidation';
import { isKingInCheck, isCheckmate } from './gameStateUtils';
import { cloneBoard } from './boardUtils';
import { transpositionTable, hashPosition } from './transpositionTable';
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

// Quiescence search - continue searching tactical positions
const quiescence = (
  board: (Piece | null)[][],
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  checkmatePriority: boolean
): number => {
  const standPat = evaluateBoard(board, checkmatePriority);
  
  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;
  } else {
    if (standPat <= alpha) return alpha;
    if (beta > standPat) beta = standPat;
  }

  // Only consider captures and checks in quiescence search
  const moves = getCaptureMoves(board, isMaximizing ? 'black' : 'white');
  
  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const score = quiescence(newBoard, alpha, beta, !isMaximizing, checkmatePriority);
    
    if (isMaximizing) {
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    } else {
      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
  }
  
  return isMaximizing ? alpha : beta;
};

// Get only capture moves for quiescence search
const getCaptureMoves = (board: (Piece | null)[][], color: 'white' | 'black'): Array<{
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
          // Only include captures
          if (board[to.y][to.x]) {
            moves.push({ from: { x, y }, to });
          }
        });
      }
    }
  }
  return moves;
};

// Minimax algorithm with alpha-beta pruning, transposition table, and quiescence search
const minimax = (
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  checkmatePriority: boolean,
  turn: 'white' | 'black' = 'black'
): number => {
  // Check transposition table
  const positionHash = hashPosition(board, turn);
  const ttEntry = transpositionTable.get(positionHash);
  
  if (ttEntry && ttEntry.depth >= depth) {
    if (ttEntry.flag === 'exact') return ttEntry.score;
    if (ttEntry.flag === 'lowerbound') alpha = Math.max(alpha, ttEntry.score);
    if (ttEntry.flag === 'upperbound') beta = Math.min(beta, ttEntry.score);
    if (alpha >= beta) return ttEntry.score;
  }

  // At depth 0, use quiescence search instead of static evaluation
  if (depth === 0) {
    return quiescence(board, alpha, beta, isMaximizing, checkmatePriority);
  }

  const moves = getAllValidMoves(board, isMaximizing ? 'black' : 'white');
  
  if (moves.length === 0) {
    // Checkmate or stalemate
    if (isKingInCheck(board, isMaximizing ? 'black' : 'white')) {
      return isMaximizing ? -CHECKMATE_SCORE : CHECKMATE_SCORE;
    }
    return 0; // Stalemate
  }

  let bestScore: number;
  let flag: 'exact' | 'lowerbound' | 'upperbound' = 'exact';

  if (isMaximizing) {
    bestScore = -Infinity;
    for (const move of moves) {
      const evaluation = minimax(
        makeMove(board, move.from, move.to),
        depth - 1,
        alpha,
        beta,
        false,
        checkmatePriority,
        'white'
      );
      bestScore = Math.max(bestScore, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        flag = 'lowerbound';
        break;
      }
    }
  } else {
    bestScore = Infinity;
    for (const move of moves) {
      const evaluation = minimax(
        makeMove(board, move.from, move.to),
        depth - 1,
        alpha,
        beta,
        true,
        checkmatePriority,
        'black'
      );
      bestScore = Math.min(bestScore, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        flag = 'upperbound';
        break;
      }
    }
  }

  // Store in transposition table
  transpositionTable.store({
    zobristHash: positionHash,
    depth,
    score: bestScore,
    flag
  });

  return bestScore;
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