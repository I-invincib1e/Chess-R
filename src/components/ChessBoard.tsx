import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode, ThemeType, Piece, Position, PieceType } from '../types';
import { getValidMoves, getInitialBoard } from '../utils/chessLogic';
import { getBestMove } from '../utils/aiLogic';
import { themes } from '../utils/themes';
import { GameInfo } from './GameInfo';
import { CapturedPieces } from './CapturedPieces';
import { WinProbability } from './game/WinProbability';
import { GameNotification } from './game/GameNotification';
import { GameEndScreen } from './game/GameEndScreen';
import { PromotionModal } from './PromotionModal';
import { getPieceSymbol } from '../utils/pieceUtils';
import { isKingInCheck, isCheckmate } from '../utils/gameStateUtils';
import { evaluatePosition, calculateWinProbability } from '../utils/evaluationUtils';
import { cloneBoard } from '../utils/boardUtils';
import { AI_THINKING_DELAY, NOTIFICATION_DURATION } from '../constants/chess';

interface ChessBoardProps {
  gameMode: GameMode;
  theme: ThemeType;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ gameMode, theme }) => {
  const [board, setBoard] = useState(getInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [isThinking, setIsThinking] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [winProbability, setWinProbability] = useState({ white: 50, black: 50 });
  const [gameState, setGameState] = useState({
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    winner: null as 'white' | 'black' | null
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'check' | 'checkmate' | 'draw' | 'win' | 'lose'>('check');
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [gameStats] = useState({
    accuracy: 85.5,
    mistakes: 2,
    averageTime: 15,
    openingName: 'Queen\'s Gambit'
  });
  
  // Pawn promotion state
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionMove, setPromotionMove] = useState<{ from: Position; to: Position } | null>(null);
  const [promotionColor, setPromotionColor] = useState<'white' | 'black'>('white');

  // Memoize win probability calculation
  const calculatedWinProbability = useMemo(() => {
    const evaluation = evaluatePosition(board);
    return calculateWinProbability(evaluation);
  }, [board]);

  // Memoize game state checks
  const calculatedGameState = useMemo(() => {
    const whiteInCheck = isKingInCheck(board, 'white');
    const blackInCheck = isKingInCheck(board, 'black');
    const whiteCheckmated = isCheckmate(board, 'white');
    const blackCheckmated = isCheckmate(board, 'black');

    return {
      isCheck: whiteInCheck || blackInCheck,
      isCheckmate: whiteCheckmated || blackCheckmated,
      isDraw: false,
      winner: whiteCheckmated ? 'black' as const : blackCheckmated ? 'white' as const : null
    };
  }, [board]);

  // Update win probability when calculated
  useEffect(() => {
    setWinProbability(calculatedWinProbability);
  }, [calculatedWinProbability]);

  // Update game state and notifications
  useEffect(() => {
    if (calculatedGameState.isCheckmate) {
      setGameState(calculatedGameState);
      setNotificationType(calculatedGameState.winner === 'white' ? 'win' : 'lose');
      setShowNotification(true);
      setShowEndScreen(true);
    } else if (calculatedGameState.isCheck) {
      setGameState(calculatedGameState);
      setNotificationType('check');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), NOTIFICATION_DURATION);
    } else {
      setGameState(calculatedGameState);
    }
  }, [calculatedGameState]);

  // AI move trigger
  useEffect(() => {
    if (turn === 'black' && !calculatedGameState.isCheckmate && !calculatedGameState.isDraw) {
      makeAIMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, calculatedGameState.isCheckmate, calculatedGameState.isDraw]);

  const executeMove = useCallback((from: Position, to: Position, promotionType?: PieceType) => {
    const capturedPiece = board[to.y][to.x];
    const newBoard = cloneBoard(board);
    
    if (capturedPiece) {
      setCapturedPieces(prev => [...prev, capturedPiece]);
    }
    
    newBoard[to.y][to.x] = newBoard[from.y][from.x];
    
    // Apply promotion
    if (promotionType && newBoard[to.y][to.x]) {
      newBoard[to.y][to.x]!.type = promotionType;
    }
    
    newBoard[from.y][from.x] = null;
    setBoard(newBoard);
    setTurn(prev => prev === 'white' ? 'black' : 'white');
  }, [board]);

  const makeAIMove = useCallback(async () => {
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, AI_THINKING_DELAY));
    
    const aiMove = getBestMove(board, gameMode, capturedPieces);
    if (aiMove) {
      const { from, to } = aiMove;
      const movingPiece = board[from.y][from.x];
      
      // Check for AI pawn promotion (auto-promote to queen)
      if (movingPiece?.type === 'pawn' && to.y === 0) {
        executeMove(from, to, 'queen');
      } else {
        executeMove(from, to);
      }
    }
    setIsThinking(false);
  }, [board, gameMode, capturedPieces, executeMove]);

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
          setPromotionMove({ from: selectedSquare, to: position });
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

  const handlePromotion = useCallback((pieceType: PieceType) => {
    if (promotionMove) {
      executeMove(promotionMove.from, promotionMove.to, pieceType);
      setShowPromotionModal(false);
      setPromotionMove(null);
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  }, [promotionMove, executeMove]);

  const handlePlayAgain = () => {
    setBoard(getInitialBoard());
    setCapturedPieces([]);
    setTurn('white');
    setGameState({
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      winner: null
    });
    setShowEndScreen(false);
  };

  const handleAnalyze = () => {
    // Implement game analysis logic
    console.log('Analyzing game...');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      <GameInfo turn={turn} isThinking={isThinking} gameMode={gameMode} />
      
      <WinProbability 
        whiteProb={winProbability.white} 
        blackProb={winProbability.black} 
      />
      
      <div className="space-y-4">
        <CapturedPieces pieces={capturedPieces.filter(p => p.color === 'white')} side="white" theme={theme} />
        
        <motion.div 
          className={`grid grid-cols-8 gap-0 border-4 ${themes[theme].board.border} rounded-lg overflow-hidden shadow-2xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {board.map((row, y) =>
            row.map((piece, x) => {
              const isSelected = selectedSquare?.x === x && selectedSquare?.y === y;
              const isLight = (x + y) % 2 === 0;
              const highlighted = possibleMoves.some(move => move.x === x && move.y === y);

              return (
                <motion.div
                  key={`${x}-${y}`}
                  className={`w-full aspect-square flex items-center justify-center relative
                    ${isLight ? themes[theme].board.light : themes[theme].board.dark}
                    ${isSelected ? `ring-4 ${themes[theme].board.selected}` : ''}
                    ${highlighted ? `ring-4 ${themes[theme].board.highlight}` : ''}
                    cursor-pointer transition-all duration-200`}
                  onClick={() => handleSquareClick({ x, y })}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <AnimatePresence mode="wait">
                    {piece && (
                      <motion.div
                        key={`piece-${x}-${y}`}
                        className={`text-4xl ${themes[theme].pieces[piece.color]}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        {getPieceSymbol(piece)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {highlighted && !piece && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-4 h-4 rounded-full ${themes[theme].board.possible}`}
                    />
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
        
        <CapturedPieces pieces={capturedPieces.filter(p => p.color === 'black')} side="black" theme={theme} />
      </div>

      <GameNotification
        type={notificationType}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <PromotionModal
        show={showPromotionModal}
        color={promotionColor}
        theme={theme}
        onSelect={handlePromotion}
      />

      {showEndScreen && (
        <GameEndScreen
          winner={gameState.winner || 'draw'}
          stats={gameStats}
          onPlayAgain={handlePlayAgain}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
};