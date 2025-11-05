# Quick Improvement Checklist

This is a condensed version of SUGGESTIONS.md focusing on actionable items you can implement quickly.

## 🔥 Critical Bugs to Fix First

### 1. Pawn Promotion (30-60 minutes)
**Problem**: Pawns don't promote when reaching the opposite end  
**Fix**: Add promotion logic in move handler

```typescript
// In ChessBoard.tsx, modify move logic:
const handleMove = (from: Position, to: Position) => {
  const piece = board[from.y][from.x];
  
  // Check for pawn promotion
  if (piece?.type === 'pawn' && (to.y === 0 || to.y === 7)) {
    // Show promotion UI or auto-promote to queen
    piece.type = 'queen';
  }
  
  // Continue with move...
};
```

### 2. Missing Castling (2-3 hours)
**Problem**: Cannot castle  
**Fix**: Track king/rook movement, add castling validation

```typescript
// Add to game state:
const [castlingRights, setCastlingRights] = useState({
  whiteKingSide: true,
  whiteQueenSide: true,
  blackKingSide: true,
  blackQueenSide: true
});

// In getKingMoves, add castling logic
```

### 3. Missing En Passant (1-2 hours)
**Problem**: Special pawn capture not working  
**Fix**: Track last move, check en passant conditions in getPawnMoves

```typescript
// Add to game state:
const [lastMove, setLastMove] = useState<Move | null>(null);

// In getPawnMoves, check if last move was 2-square pawn move
```

---

## ⚡ Performance Quick Wins (2-3 hours total)

### 4. Memoize Expensive Calculations
```typescript
// In ChessBoard.tsx
const winProbability = useMemo(() => {
  const evaluation = evaluatePosition(board);
  return calculateWinProbability(evaluation);
}, [board]);

const gameState = useMemo(() => {
  const whiteInCheck = isKingInCheck(board, 'white');
  const blackInCheck = isKingInCheck(board, 'black');
  const whiteCheckmated = isCheckmate(board, 'white');
  const blackCheckmated = isCheckmate(board, 'black');
  
  return {
    isCheck: whiteInCheck || blackInCheck,
    isCheckmate: whiteCheckmated || blackCheckmated,
    winner: whiteCheckmated ? 'black' : blackCheckmated ? 'white' : null
  };
}, [board]);
```

### 5. Optimize Board Copying
```typescript
// Create src/utils/boardUtils.ts
export const cloneBoard = (board: (Piece | null)[][]): (Piece | null)[][] => {
  return board.map(row => [...row]);
};

// Use throughout codebase instead of inline board.map(row => [...row])
```

### 6. Memoize Components
```typescript
// Memoize pieces that don't change often
export const CapturedPieces = React.memo(({ pieces, side, theme }) => {
  // Component code
});

export const GameInfo = React.memo(({ turn, isThinking, gameMode }) => {
  // Component code
});
```

---

## 🎨 Code Quality (1-2 hours total)

### 7. Remove Duplicate ThemeSelector
```bash
# Delete one of these files:
rm src/components/ThemeSelector.tsx
# OR
rm src/components/settings/ThemeSelector.tsx

# Update imports in files that use it
```

### 8. Extract Constants
```typescript
// Create src/constants/chess.ts
export const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
} as const;

export const AI_DEPTH = {
  easy: 2,
  medium: 3,
  hard: 4,
  grandmaster: 5
} as const;

export const BOARD_SIZE = 8;

export const STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
```

### 9. Add Error Boundary
```typescript
// Create src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chess game error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-zinc-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap App.tsx
// In main.tsx:
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🎯 UX Improvements (1-2 hours total)

### 10. Add Board Flip Button
```typescript
// In ChessBoard.tsx
const [isBoardFlipped, setIsBoardFlipped] = useState(false);

const displayBoard = isBoardFlipped ? [...board].reverse() : board;

// Add button to GameControls
<button onClick={() => setIsBoardFlipped(!isBoardFlipped)}>
  <RotateCcw className="w-5 h-5" />
</button>
```

### 11. Add Loading States
```typescript
// In App.tsx, show loading for page transitions
const [isTransitioning, setIsTransitioning] = useState(false);

const handleNavigate = async (page: string) => {
  setIsTransitioning(true);
  await new Promise(resolve => setTimeout(resolve, 300));
  setCurrentPage(page);
  setIsTransitioning(false);
};

{isTransitioning && <LoadingSpinner message="Loading..." />}
```

### 12. Improve Move Highlighting
```typescript
// In ChessBoard.tsx, add move hint animation
<motion.div
  className={`w-4 h-4 rounded-full ${themes[theme].board.possible}`}
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
/>
```

---

## 🧪 Add Basic Testing (1-2 hours)

### 13. Install Testing Tools
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 14. Create First Tests
```typescript
// src/utils/__tests__/moveValidation.test.ts
import { describe, it, expect } from 'vitest';
import { getValidMoves } from '../moveValidation';
import { getInitialBoard } from '../chessLogic';

describe('moveValidation', () => {
  it('should allow pawn to move forward', () => {
    const board = getInitialBoard();
    const piece = board[6][4]; // White pawn at e2
    const moves = getValidMoves({ x: 4, y: 6 }, piece!, board);
    
    expect(moves).toContainEqual({ x: 4, y: 5 }); // e3
    expect(moves).toContainEqual({ x: 4, y: 4 }); // e4
  });

  it('should not allow pawn to move backward', () => {
    const board = getInitialBoard();
    const piece = board[6][4];
    const moves = getValidMoves({ x: 4, y: 6 }, piece!, board);
    
    expect(moves).not.toContainEqual({ x: 4, y: 7 });
  });
});
```

---

## 📊 Implementation Order

Do these in order for best results:

1. ✅ **Add Error Boundary** (30 min) - Prevents crashes
2. ✅ **Extract Constants** (30 min) - Cleaner code
3. ✅ **Optimize Board Copying** (30 min) - Better performance
4. ✅ **Memoize Calculations** (1 hour) - Better performance
5. ✅ **Remove Duplicate Files** (15 min) - Less confusion
6. ✅ **Add Pawn Promotion** (1 hour) - Critical feature
7. ✅ **Add Board Flip** (30 min) - Nice UX improvement
8. ✅ **Add Loading States** (1 hour) - Better UX
9. ✅ **Memoize Components** (1 hour) - Better performance
10. ✅ **Add Castling** (2 hours) - Important feature
11. ✅ **Add En Passant** (1 hour) - Complete chess rules
12. ✅ **Basic Tests** (2 hours) - Quality assurance

**Total Time: ~12-15 hours**

---

## 🚀 After Quick Wins

Once you've completed these, move on to:

1. **Move History System** - Track all moves in algebraic notation
2. **Undo/Redo** - Let players take back moves
3. **Save/Load Games** - Implement PGN export/import
4. **AI in Web Worker** - Non-blocking AI calculations
5. **Drag and Drop** - More intuitive piece movement
6. **Sound Effects** - Audio feedback for moves

See SUGGESTIONS.md for detailed implementation guides for these features.

---

## 📝 Testing Your Changes

After each change:

```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint

# Test the game manually
npm run dev

# Run tests (after setting up Vitest)
npm test
```

---

## 💡 Pro Tips

1. **Test edge cases**: Promotion on capture, castling through check, en passant validation
2. **Use React DevTools**: Profile re-renders before and after optimization
3. **Check mobile**: Test on actual mobile devices, not just browser DevTools
4. **Consider accessibility**: Add ARIA labels, keyboard navigation
5. **Monitor bundle size**: Use `npm run build` and check dist/ folder size

---

## 🆘 Common Pitfalls

1. **Don't optimize prematurely**: Fix bugs first, then optimize
2. **Don't break existing features**: Test thoroughly after changes
3. **Don't forget edge cases**: En passant can only happen immediately after 2-square pawn move
4. **Don't ignore TypeScript errors**: Fix them, don't use `@ts-ignore`
5. **Don't forget to update both player and AI**: Move validation changes affect both

---

## 📚 Useful Resources

- **Chess Rules**: https://www.fide.com/FIDE/handbook/LawsOfChess.pdf
- **React Performance**: https://react.dev/learn/render-and-commit
- **Minimax Algorithm**: https://www.chessprogramming.org/Minimax
- **PGN Format**: https://www.chessclub.com/help/PGN-spec

Good luck with the improvements! Start small, test often, and gradually work through the list.
