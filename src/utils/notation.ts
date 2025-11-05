import { Position, Piece, PieceType } from '../types/chess';
import { FILES, RANKS } from '../constants/chess';

export const getAlgebraicNotation = (
  from: Position,
  to: Position,
  piece: Piece,
  board: (Piece | null)[][],
  captured?: Piece,
  promotion?: PieceType,
  isCastling?: boolean,
  isCheck?: boolean,
  isCheckmate?: boolean
): string => {
  const toSquare = `${FILES[to.x]}${RANKS[to.y]}`;
  
  // Castling
  if (isCastling) {
    return to.x === 6 ? 'O-O' : 'O-O-O';
  }
  
  // Pawn moves
  if (piece.type === 'pawn') {
    let notation = '';
    if (captured) {
      notation = `${FILES[from.x]}x${toSquare}`;
    } else {
      notation = toSquare;
    }
    
    // Promotion
    if (promotion) {
      const promotionSymbol = {
        queen: 'Q',
        rook: 'R',
        bishop: 'B',
        knight: 'N',
        king: 'K',
        pawn: 'P'
      }[promotion];
      notation += `=${promotionSymbol}`;
    }
    
    return notation + (isCheckmate ? '#' : isCheck ? '+' : '');
  }
  
  // Other pieces
  const pieceSymbol = {
    knight: 'N',
    bishop: 'B',
    rook: 'R',
    queen: 'Q',
    king: 'K',
    pawn: ''
  }[piece.type];
  
  const captureSymbol = captured ? 'x' : '';
  const checkSymbol = isCheckmate ? '#' : isCheck ? '+' : '';
  
  // Check for ambiguity (multiple pieces of same type can move to same square)
  let disambiguation = '';
  const ambiguousPieces = findAmbiguousPieces(from, to, piece, board);
  
  if (ambiguousPieces.length > 0) {
    const sameFile = ambiguousPieces.some(p => p.x === from.x);
    const sameRank = ambiguousPieces.some(p => p.y === from.y);
    
    if (!sameFile) {
      disambiguation = FILES[from.x];
    } else if (!sameRank) {
      disambiguation = RANKS[from.y];
    } else {
      disambiguation = `${FILES[from.x]}${RANKS[from.y]}`;
    }
  }
  
  return `${pieceSymbol}${disambiguation}${captureSymbol}${toSquare}${checkSymbol}`;
};

function findAmbiguousPieces(
  from: Position,
  to: Position,
  piece: Piece,
  board: (Piece | null)[][]
): Position[] {
  const ambiguous: Position[] = [];
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (x === from.x && y === from.y) continue;
      
      const otherPiece = board[y][x];
      if (otherPiece?.type === piece.type && otherPiece.color === piece.color) {
        // Check if this piece can also move to the target square
        // This is simplified - in a full implementation, you'd check valid moves
        ambiguous.push({ x, y });
      }
    }
  }
  
  return ambiguous;
}

export const positionToAlgebraic = (position: Position): string => {
  return `${FILES[position.x]}${RANKS[position.y]}`;
};

export const algebraicToPosition = (algebraic: string): Position | null => {
  if (algebraic.length < 2) return null;
  
  const file = algebraic[0];
  const rank = algebraic[1];
  
  const x = FILES.indexOf(file as typeof FILES[number]);
  const y = RANKS.indexOf(rank as typeof RANKS[number]);
  
  if (x === -1 || y === -1) return null;
  
  return { x, y };
};
