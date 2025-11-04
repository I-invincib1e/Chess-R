# Implementation Examples

Complete code examples for the most requested features.

---

## 1. Pawn Promotion Implementation

### Step 1: Create Promotion Modal Component

```typescript
// src/components/PromotionModal.tsx
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
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       bg-zinc-900 rounded-xl p-6 shadow-2xl border-2 border-zinc-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Choose Promotion
            </h3>
            
            <div className="grid grid-cols-4 gap-4">
              {pieces.map(pieceType => (
                <motion.button
                  key={pieceType}
                  onClick={() => onSelect(pieceType)}
                  className={`w-16 h-16 flex items-center justify-center rounded-lg
                             ${themes[theme].board.light} hover:ring-4 
                             ${themes[theme].board.highlight} transition-all`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`text-4xl ${themes[theme].pieces[color]}`}>
                    {getPieceSymbol({ type: pieceType, color })}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

### Step 2: Update ChessBoard Component

```typescript
// In ChessBoard.tsx

// Add state
const [showPromotionModal, setShowPromotionModal] = useState(false);
const [promotionPosition, setPromotionPosition] = useState<Position | null>(null);
const [promotionColor, setPromotionColor] = useState<'white' | 'black'>('white');

// Modify handleSquareClick
const handleSquareClick = (position: Position) => {
  if (turn === 'black' || gameState.isCheckmate || gameState.isDraw) return;
  
  const piece = board[position.y][position.x];

  if (!selectedSquare) {
    if (piece && piece.color === turn) {
      setSelectedSquare(position);
      setPossibleMoves(getValidMoves(position, piece, board));
    }
  } else {
    const isValidMove = possibleMoves.some(
      move => move.x === position.x && move.y === position.y
    );

    if (isValidMove) {
      const movingPiece = board[selectedSquare.y][selectedSquare.x];
      
      // Check for pawn promotion
      if (movingPiece?.type === 'pawn' && (position.y === 0 || position.y === 7)) {
        setPromotionPosition(position);
        setPromotionColor(movingPiece.color);
        setShowPromotionModal(true);
        return;
      }
      
      // Normal move
      executeMove(selectedSquare, position);
    }
    setSelectedSquare(null);
    setPossibleMoves([]);
  }
};

// Add executeMove helper
const executeMove = (from: Position, to: Position, promotionType?: PieceType) => {
  const capturedPiece = board[to.y][to.x];
  const newBoard = board.map(row => [...row]);
  
  if (capturedPiece) {
    setCapturedPieces([...capturedPieces, capturedPiece]);
  }
  
  newBoard[to.y][to.x] = newBoard[from.y][from.x];
  
  // Apply promotion
  if (promotionType && newBoard[to.y][to.x]) {
    newBoard[to.y][to.x]!.type = promotionType;
  }
  
  newBoard[from.y][from.x] = null;
  setBoard(newBoard);
  setTurn('black');
};

// Add promotion handler
const handlePromotion = (pieceType: PieceType) => {
  if (selectedSquare && promotionPosition) {
    executeMove(selectedSquare, promotionPosition, pieceType);
    setShowPromotionModal(false);
    setPromotionPosition(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
  }
};

// Add to JSX
<PromotionModal
  show={showPromotionModal}
  color={promotionColor}
  theme={theme}
  onSelect={handlePromotion}
/>
```

---

## 2. Castling Implementation

### Step 1: Add Castling State

```typescript
// In ChessBoard.tsx or game state

interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

const [castlingRights, setCastlingRights] = useState<CastlingRights>({
  whiteKingSide: true,
  whiteQueenSide: true,
  blackKingSide: true,
  blackQueenSide: true
});

// Track when king/rook moves
const updateCastlingRights = (from: Position, piece: Piece) => {
  setCastlingRights(prev => {
    const updated = { ...prev };
    
    // King moves - lose both castling rights
    if (piece.type === 'king') {
      if (piece.color === 'white') {
        updated.whiteKingSide = false;
        updated.whiteQueenSide = false;
      } else {
        updated.blackKingSide = false;
        updated.blackQueenSide = false;
      }
    }
    
    // Rook moves - lose corresponding castling right
    if (piece.type === 'rook') {
      if (piece.color === 'white') {
        if (from.x === 0 && from.y === 7) updated.whiteQueenSide = false;
        if (from.x === 7 && from.y === 7) updated.whiteKingSide = false;
      } else {
        if (from.x === 0 && from.y === 0) updated.blackQueenSide = false;
        if (from.x === 7 && from.y === 0) updated.blackKingSide = false;
      }
    }
    
    return updated;
  });
};
```

### Step 2: Add Castling to Move Validation

```typescript
// In src/utils/moveValidation.ts

export const getCastlingMoves = (
  from: Position,
  piece: Piece,
  board: (Piece | null)[][],
  castlingRights: CastlingRights
): Position[] => {
  const moves: Position[] = [];
  
  if (piece.type !== 'king') return moves;
  
  // Can't castle if in check
  if (isKingInCheck(board, piece.color)) return moves;
  
  const row = piece.color === 'white' ? 7 : 0;
  
  // King-side castling
  if (piece.color === 'white' ? castlingRights.whiteKingSide : castlingRights.blackKingSide) {
    // Check if squares are empty
    if (!board[row][5] && !board[row][6]) {
      // Check if king passes through check
      const passThrough = { x: 5, y: row };
      const tempBoard = board.map(r => [...r]);
      tempBoard[row][5] = piece;
      tempBoard[from.y][from.x] = null;
      
      if (!isKingInCheck(tempBoard, piece.color)) {
        moves.push({ x: 6, y: row });
      }
    }
  }
  
  // Queen-side castling
  if (piece.color === 'white' ? castlingRights.whiteQueenSide : castlingRights.blackQueenSide) {
    // Check if squares are empty
    if (!board[row][3] && !board[row][2] && !board[row][1]) {
      // Check if king passes through check
      const passThrough = { x: 3, y: row };
      const tempBoard = board.map(r => [...r]);
      tempBoard[row][3] = piece;
      tempBoard[from.y][from.x] = null;
      
      if (!isKingInCheck(tempBoard, piece.color)) {
        moves.push({ x: 2, y: row });
      }
    }
  }
  
  return moves;
};

// Update getKingMoves to include castling
export const getKingMoves = (
  from: Position,
  piece: Piece,
  board: (Piece | null)[][],
  castlingRights?: CastlingRights
): Position[] => {
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
  
  // Add castling moves
  if (castlingRights) {
    moves.push(...getCastlingMoves(from, piece, board, castlingRights));
  }

  return moves;
};
```

### Step 3: Execute Castling Move

```typescript
// In ChessBoard.tsx, modify executeMove

const executeMove = (from: Position, to: Position, promotionType?: PieceType) => {
  const capturedPiece = board[to.y][to.x];
  const movingPiece = board[from.y][from.x];
  const newBoard = board.map(row => [...row]);
  
  if (capturedPiece) {
    setCapturedPieces([...capturedPieces, capturedPiece]);
  }
  
  // Check for castling
  if (movingPiece?.type === 'king' && Math.abs(to.x - from.x) === 2) {
    // King-side castling
    if (to.x === 6) {
      const rook = newBoard[from.y][7];
      newBoard[from.y][5] = rook; // Move rook
      newBoard[from.y][7] = null;
    }
    // Queen-side castling
    else if (to.x === 2) {
      const rook = newBoard[from.y][0];
      newBoard[from.y][3] = rook; // Move rook
      newBoard[from.y][0] = null;
    }
  }
  
  newBoard[to.y][to.x] = newBoard[from.y][from.x];
  
  if (promotionType && newBoard[to.y][to.x]) {
    newBoard[to.y][to.x]!.type = promotionType;
  }
  
  newBoard[from.y][from.x] = null;
  
  // Update castling rights
  if (movingPiece) {
    updateCastlingRights(from, movingPiece);
  }
  
  setBoard(newBoard);
  setTurn('black');
};
```

---

## 3. Move History with Algebraic Notation

```typescript
// src/types/game.ts
export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  notation: string;
  timestamp: number;
}

// src/utils/notation.ts
export const getAlgebraicNotation = (
  from: Position,
  to: Position,
  piece: Piece,
  board: (Piece | null)[][],
  captured?: Piece,
  isCheck?: boolean,
  isCheckmate?: boolean
): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const toSquare = `${files[to.x]}${ranks[to.y]}`;
  
  // Castling
  if (piece.type === 'king' && Math.abs(to.x - from.x) === 2) {
    return to.x === 6 ? 'O-O' : 'O-O-O';
  }
  
  // Pawn moves
  if (piece.type === 'pawn') {
    let notation = '';
    if (captured) {
      notation = `${files[from.x]}x${toSquare}`;
    } else {
      notation = toSquare;
    }
    
    // Promotion
    if (to.y === 0 || to.y === 7) {
      // Assume queen promotion for now
      notation += '=Q';
    }
    
    return notation + (isCheckmate ? '#' : isCheck ? '+' : '');
  }
  
  // Other pieces
  const pieceSymbol = {
    knight: 'N',
    bishop: 'B',
    rook: 'R',
    queen: 'Q',
    king: 'K'
  }[piece.type] || '';
  
  const captureSymbol = captured ? 'x' : '';
  const checkSymbol = isCheckmate ? '#' : isCheck ? '+' : '';
  
  // Check for ambiguity (multiple pieces of same type can move to same square)
  let disambiguation = '';
  // ... ambiguity logic here ...
  
  return `${pieceSymbol}${disambiguation}${captureSymbol}${toSquare}${checkSymbol}`;
};

// src/components/game/MoveHistory.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Move } from '../../types/game';

interface MoveHistoryProps {
  moves: Move[];
  onMoveClick?: (index: number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, onMoveClick }) => {
  // Group moves into pairs (white, black)
  const movePairs: [Move, Move | undefined][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-3">Move History</h3>
      
      <div className="space-y-1">
        {movePairs.map((pair, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-12 gap-2 text-sm"
          >
            {/* Move number */}
            <div className="col-span-2 text-zinc-500">
              {index + 1}.
            </div>
            
            {/* White's move */}
            <button
              onClick={() => onMoveClick?.(index * 2)}
              className="col-span-5 text-left text-white hover:bg-zinc-800 
                         rounded px-2 py-1 transition-colors"
            >
              {pair[0].notation}
            </button>
            
            {/* Black's move */}
            {pair[1] && (
              <button
                onClick={() => onMoveClick?.(index * 2 + 1)}
                className="col-span-5 text-left text-white hover:bg-zinc-800 
                           rounded px-2 py-1 transition-colors"
              >
                {pair[1].notation}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
```

---

## 4. Undo/Redo Implementation

```typescript
// In ChessBoard.tsx or game state

const [moveHistory, setMoveHistory] = useState<Move[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);

const canUndo = historyIndex >= 0;
const canRedo = historyIndex < moveHistory.length - 1;

const handleUndo = () => {
  if (!canUndo) return;
  
  // Go back one move
  const newIndex = historyIndex - 1;
  setHistoryIndex(newIndex);
  
  // Replay all moves up to newIndex
  replayMovesToIndex(newIndex);
};

const handleRedo = () => {
  if (!canRedo) return;
  
  // Go forward one move
  const newIndex = historyIndex + 1;
  setHistoryIndex(newIndex);
  
  // Replay all moves up to newIndex
  replayMovesToIndex(newIndex);
};

const replayMovesToIndex = (index: number) => {
  const newBoard = getInitialBoard();
  const newCaptured: Piece[] = [];
  
  // Replay moves from start to index
  for (let i = 0; i <= index; i++) {
    const move = moveHistory[i];
    // Apply move to newBoard
    if (move.captured) {
      newCaptured.push(move.captured);
    }
    // ... move logic ...
  }
  
  setBoard(newBoard);
  setCapturedPieces(newCaptured);
  setTurn(index % 2 === 0 ? 'black' : 'white');
};

const addMoveToHistory = (move: Move) => {
  // Remove any moves after current position (if we're not at the end)
  const newHistory = moveHistory.slice(0, historyIndex + 1);
  newHistory.push(move);
  
  setMoveHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};
```

---

## 5. Web Worker for AI

```typescript
// src/workers/aiWorker.ts
import { getBestMove } from '../utils/aiLogic';
import { Piece, Position, GameMode } from '../types/chess';

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;
  
  if (type === 'GET_BEST_MOVE') {
    const { board, difficulty, capturedPieces } = payload;
    
    try {
      const bestMove = getBestMove(board, difficulty, capturedPieces);
      
      self.postMessage({
        type: 'BEST_MOVE_RESULT',
        payload: { move: bestMove }
      });
    } catch (error) {
      self.postMessage({
        type: 'BEST_MOVE_ERROR',
        payload: { error: error.message }
      });
    }
  }
};

// In ChessBoard.tsx
import { useRef, useEffect } from 'react';

const aiWorkerRef = useRef<Worker | null>(null);

useEffect(() => {
  // Initialize worker
  aiWorkerRef.current = new Worker(
    new URL('../workers/aiWorker.ts', import.meta.url),
    { type: 'module' }
  );
  
  // Listen for messages
  aiWorkerRef.current.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;
    
    if (type === 'BEST_MOVE_RESULT') {
      const { move } = payload;
      if (move) {
        executeMove(move.from, move.to);
      }
      setIsThinking(false);
    }
  };
  
  return () => {
    aiWorkerRef.current?.terminate();
  };
}, []);

const makeAIMove = () => {
  setIsThinking(true);
  
  aiWorkerRef.current?.postMessage({
    type: 'GET_BEST_MOVE',
    payload: {
      board,
      difficulty: gameMode,
      capturedPieces
    }
  });
};
```

---

## 6. PGN Export/Import

```typescript
// src/utils/pgn.ts

export const exportToPGN = (
  moves: Move[],
  result: '1-0' | '0-1' | '1/2-1/2' | '*',
  metadata?: {
    white?: string;
    black?: string;
    event?: string;
    date?: string;
  }
): string => {
  const lines: string[] = [];
  
  // PGN headers
  lines.push(`[Event "${metadata?.event || 'Casual Game'}"]`);
  lines.push(`[Date "${metadata?.date || new Date().toISOString().split('T')[0]}"]`);
  lines.push(`[White "${metadata?.white || 'Player'}"]`);
  lines.push(`[Black "${metadata?.black || 'AI'}"]`);
  lines.push(`[Result "${result}"]`);
  lines.push('');
  
  // Moves
  let moveText = '';
  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    moveText += `${moveNumber}. ${moves[i].notation} `;
    if (moves[i + 1]) {
      moveText += `${moves[i + 1].notation} `;
    }
  }
  moveText += result;
  
  lines.push(moveText);
  
  return lines.join('\n');
};

export const importFromPGN = (pgn: string): Move[] => {
  // Parse PGN string
  // This is simplified - full PGN parsing is complex
  const lines = pgn.split('\n');
  const moveLine = lines.find(line => !line.startsWith('[') && line.trim());
  
  if (!moveLine) return [];
  
  // Extract moves from notation
  // ... parsing logic ...
  
  return [];
};

// In a component
const handleExport = () => {
  const pgn = exportToPGN(moveHistory, '1-0', {
    white: 'Player',
    black: 'AI',
    event: 'Chess Game'
  });
  
  // Download as file
  const blob = new Blob([pgn], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chess-game-${Date.now()}.pgn`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

These implementations give you complete, working code for the most requested features. Copy and adapt them to your needs!
