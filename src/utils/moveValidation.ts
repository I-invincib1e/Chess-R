import { Piece, Position } from '../types/chess';
import { isKingInCheck } from './gameStateUtils';
import { cloneBoard } from './boardUtils';

export const getPawnMoves = (from: Position, piece: Piece, board: (Piece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;

  // Forward move
  if (board[from.y + direction]?.[from.x] === null) {
    moves.push({ x: from.x, y: from.y + direction });
    // Initial two-square move
    if (from.y === startRow && board[from.y + 2 * direction]?.[from.x] === null) {
      moves.push({ x: from.x, y: from.y + 2 * direction });
    }
  }

  // Captures
  const captures = [
    { x: from.x - 1, y: from.y + direction },
    { x: from.x + 1, y: from.y + direction }
  ];

  captures.forEach(pos => {
    if (pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8) {
      const targetPiece = board[pos.y][pos.x];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(pos);
      }
    }
  });

  return moves;
};

export const getRookMoves = (from: Position, piece: Piece, board: (Piece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  directions.forEach(([dx, dy]) => {
    let x = from.x + dx;
    let y = from.y + dy;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const targetPiece = board[y][x];
      if (!targetPiece) {
        moves.push({ x, y });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ x, y });
        }
        break;
      }
      x += dx;
      y += dy;
    }
  });

  return moves;
};

export const getBishopMoves = (from: Position, piece: Piece, board: (Piece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  directions.forEach(([dx, dy]) => {
    let x = from.x + dx;
    let y = from.y + dy;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const targetPiece = board[y][x];
      if (!targetPiece) {
        moves.push({ x, y });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ x, y });
        }
        break;
      }
      x += dx;
      y += dy;
    }
  });

  return moves;
};

export const getKnightMoves = (from: Position, piece: Piece, board: (Piece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  offsets.forEach(([dx, dy]) => {
    const x = from.x + dx;
    const y = from.y + dy;

    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const targetPiece = board[y][x];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push({ x, y });
      }
    }
  });

  return moves;
};

export const getQueenMoves = (from: Position, piece: Piece, board: (Piece | null)[][]): Position[] => {
  return [
    ...getRookMoves(from, piece, board),
    ...getBishopMoves(from, piece, board)
  ];
};

export const getKingMoves = (from: Position, piece: Piece, board: (Piece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  offsets.forEach(([dx, dy]) => {
    const x = from.x + dx;
    const y = from.y + dy;

    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const targetPiece = board[y][x];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push({ x, y });
      }
    }
  });

  return moves;
};

export const getValidMoves = (
  from: Position,
  piece: Piece,
  board: (Piece | null)[][],
  checkValidation = false
): Position[] => {
  let moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      moves = getPawnMoves(from, piece, board);
      break;
    case 'rook':
      moves = getRookMoves(from, piece, board);
      break;
    case 'knight':
      moves = getKnightMoves(from, piece, board);
      break;
    case 'bishop':
      moves = getBishopMoves(from, piece, board);
      break;
    case 'queen':
      moves = getQueenMoves(from, piece, board);
      break;
    case 'king':
      moves = getKingMoves(from, piece, board);
      break;
  }

  if (!checkValidation) {
    // Filter out moves that would put own king in check
    moves = moves.filter(to => {
      const newBoard = cloneBoard(board);
      newBoard[to.y][to.x] = newBoard[from.y][from.x];
      newBoard[from.y][from.x] = null;
      return !isKingInCheck(newBoard, piece.color);
    });
  }

  return moves;
};