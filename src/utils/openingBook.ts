import { Position } from '../types/chess';

interface OpeningMove {
  from: Position;
  to: Position;
  name: string;
  frequency: number;
}

interface OpeningLine {
  moves: string;
  responses: OpeningMove[];
}

// Common chess openings database
// Format: sequence of moves -> possible responses with names
const OPENING_BOOK: Record<string, OpeningLine> = {
  '': {
    moves: 'start',
    responses: [
      { from: { x: 4, y: 6 }, to: { x: 4, y: 4 }, name: "King's Pawn Opening", frequency: 45 },
      { from: { x: 3, y: 6 }, to: { x: 3, y: 4 }, name: "Queen's Pawn Opening", frequency: 40 },
      { from: { x: 2, y: 7 }, to: { x: 5, y: 5 }, name: 'English Opening', frequency: 10 },
      { from: { x: 6, y: 7 }, to: { x: 5, y: 5 }, name: 'Reti Opening', frequency: 5 },
    ]
  },
  'e4': {
    moves: 'e2e4',
    responses: [
      { from: { x: 4, y: 1 }, to: { x: 4, y: 3 }, name: 'Open Game', frequency: 50 },
      { from: { x: 2, y: 1 }, to: { x: 2, y: 3 }, name: 'Sicilian Defense', frequency: 35 },
      { from: { x: 4, y: 1 }, to: { x: 4, y: 2 }, name: 'French Defense', frequency: 10 },
      { from: { x: 2, y: 1 }, to: { x: 2, y: 2 }, name: 'Caro-Kann Defense', frequency: 5 },
    ]
  },
  'd4': {
    moves: 'd2d4',
    responses: [
      { from: { x: 3, y: 1 }, to: { x: 3, y: 3 }, name: "Queen's Gambit", frequency: 40 },
      { from: { x: 6, y: 0 }, to: { x: 5, y: 2 }, name: 'Indian Defense', frequency: 35 },
      { from: { x: 4, y: 1 }, to: { x: 4, y: 3 }, name: 'Indian Game', frequency: 15 },
      { from: { x: 5, y: 1 }, to: { x: 5, y: 3 }, name: 'Dutch Defense', frequency: 10 },
    ]
  },
  'e4e5': {
    moves: 'e2e4-e7e5',
    responses: [
      { from: { x: 6, y: 7 }, to: { x: 5, y: 5 }, name: "King's Knight Opening", frequency: 60 },
      { from: { x: 5, y: 7 }, to: { x: 2, y: 4 }, name: "King's Bishop Opening", frequency: 20 },
      { from: { x: 3, y: 6 }, to: { x: 3, y: 4 }, name: "Queen's Pawn Game", frequency: 10 },
      { from: { x: 5, y: 6 }, to: { x: 5, y: 4 }, name: "King's Gambit", frequency: 10 },
    ]
  },
  'e4c5': {
    moves: 'e2e4-c7c5',
    responses: [
      { from: { x: 6, y: 7 }, to: { x: 5, y: 5 }, name: 'Sicilian Defense', frequency: 70 },
      { from: { x: 2, y: 6 }, to: { x: 2, y: 4 }, name: 'Sicilian, Closed', frequency: 20 },
      { from: { x: 3, y: 6 }, to: { x: 3, y: 4 }, name: 'Sicilian, Smith-Morra', frequency: 10 },
    ]
  },
  'd4d5': {
    moves: 'd2d4-d7d5',
    responses: [
      { from: { x: 2, y: 6 }, to: { x: 2, y: 4 }, name: "Queen's Gambit", frequency: 60 },
      { from: { x: 6, y: 7 }, to: { x: 5, y: 5 }, name: 'London System', frequency: 20 },
      { from: { x: 4, y: 6 }, to: { x: 4, y: 4 }, name: 'Stonewall Attack', frequency: 10 },
      { from: { x: 1, y: 7 }, to: { x: 2, y: 5 }, name: 'Richter-Veresov', frequency: 10 },
    ]
  },
  'd4Nf6': {
    moves: 'd2d4-g8f6',
    responses: [
      { from: { x: 2, y: 6 }, to: { x: 2, y: 4 }, name: 'Indian Defense', frequency: 50 },
      { from: { x: 6, y: 7 }, to: { x: 5, y: 5 }, name: 'London System', frequency: 30 },
      { from: { x: 1, y: 0 }, to: { x: 2, y: 2 }, name: 'Trompowsky Attack', frequency: 15 },
      { from: { x: 5, y: 7 }, to: { x: 6, y: 5 }, name: 'Torre Attack', frequency: 5 },
    ]
  },
};

function movesToKey(moveHistory: string[]): string {
  // Convert move history to a simple key for lookup
  // This is simplified - in a real implementation, you'd use proper move notation
  return moveHistory.join('-');
}

export const getOpeningMove = (moveHistory: string[]): OpeningMove | null => {
  const key = movesToKey(moveHistory);
  const opening = OPENING_BOOK[key];
  
  if (!opening || !opening.responses.length) {
    return null;
  }
  
  // Select a move based on frequency (weighted random selection)
  const totalFrequency = opening.responses.reduce((sum, move) => sum + move.frequency, 0);
  let random = Math.random() * totalFrequency;
  
  for (const move of opening.responses) {
    random -= move.frequency;
    if (random <= 0) {
      return move;
    }
  }
  
  return opening.responses[0];
};

export const getOpeningName = (moveHistory: string[]): string => {
  const key = movesToKey(moveHistory);
  const opening = OPENING_BOOK[key];
  
  if (opening && opening.responses.length > 0) {
    return opening.responses[0].name;
  }
  
  // Try to find a partial match for longer sequences
  for (let i = moveHistory.length - 1; i >= 0; i--) {
    const partialKey = movesToKey(moveHistory.slice(0, i));
    const partialOpening = OPENING_BOOK[partialKey];
    if (partialOpening?.responses.length) {
      return partialOpening.responses[0].name;
    }
  }
  
  return 'Unknown Opening';
};

export const isInOpeningBook = (moveHistory: string[]): boolean => {
  const key = movesToKey(moveHistory);
  return key in OPENING_BOOK;
};
