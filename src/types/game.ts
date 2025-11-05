import { Position, Piece, PieceType } from './chess';

export type TimeControl = {
  initial: number;
  increment: number;
};

export type GameSetupStep = 'preferences' | 'theme' | 'play';

export interface GamePreferences {
  difficulty: 'easy' | 'medium' | 'hard' | 'grandmaster';
  soundEnabled: boolean;
  showHints: boolean;
}

export type GameState = {
  moves: string[];
  position: string;
  timeWhite: number;
  timeBlack: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  turn: 'white' | 'black';
};

export type Analysis = {
  evaluation: number;
  bestMove: string;
  depth: number;
  variation: string[];
};

export type GameStats = {
  accuracy: number;
  mistakes: number;
  blunders: number;
  averageTime: number;
  openingName: string;
};

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  isCastling?: boolean;
  isEnPassant?: boolean;
  notation: string;
  timestamp: number;
}

export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}