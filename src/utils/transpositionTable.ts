import { Piece } from '../types/chess';

interface TranspositionEntry {
  zobristHash: bigint;
  depth: number;
  score: number;
  flag: 'exact' | 'lowerbound' | 'upperbound';
  bestMove?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

class TranspositionTable {
  private table: Map<string, TranspositionEntry>;
  private maxSize: number;

  constructor(maxSize: number = 1000000) {
    this.table = new Map();
    this.maxSize = maxSize;
  }

  get(zobristHash: bigint): TranspositionEntry | undefined {
    return this.table.get(zobristHash.toString());
  }

  store(entry: TranspositionEntry): void {
    // If table is full, remove oldest entries (simple FIFO)
    if (this.table.size >= this.maxSize) {
      const firstKey = this.table.keys().next().value;
      this.table.delete(firstKey);
    }
    
    const key = entry.zobristHash.toString();
    const existing = this.table.get(key);
    
    // Only replace if this entry is deeper or doesn't exist
    if (!existing || entry.depth >= existing.depth) {
      this.table.set(key, entry);
    }
  }

  clear(): void {
    this.table.clear();
  }

  size(): number {
    return this.table.size;
  }
}

// Global transposition table
export const transpositionTable = new TranspositionTable();

// Zobrist hashing for position identification
class ZobristHash {
  private pieceKeys: bigint[][][];
  private turnKey: bigint;
  
  constructor() {
    // Initialize random keys for each piece type, color, and square
    this.pieceKeys = [];
    
    // 8x8 board, 6 piece types, 2 colors
    for (let square = 0; square < 64; square++) {
      const row: bigint[][] = [];
      for (let type = 0; type < 6; type++) {
        row.push([
          this.randomBigInt(),
          this.randomBigInt()
        ]);
      }
      this.pieceKeys.push(row);
    }
    
    this.turnKey = this.randomBigInt();
  }
  
  private randomBigInt(): bigint {
    // Generate a random 64-bit number
    const high = BigInt(Math.floor(Math.random() * 0x100000000));
    const low = BigInt(Math.floor(Math.random() * 0x100000000));
    return (high << 32n) | low;
  }
  
  hash(board: (Piece | null)[][], turn: 'white' | 'black'): bigint {
    let hash = 0n;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece) {
          const square = y * 8 + x;
          const typeIndex = this.getPieceTypeIndex(piece.type);
          const colorIndex = piece.color === 'white' ? 0 : 1;
          hash ^= this.pieceKeys[square][typeIndex][colorIndex];
        }
      }
    }
    
    // Include turn in hash
    if (turn === 'black') {
      hash ^= this.turnKey;
    }
    
    return hash;
  }
  
  private getPieceTypeIndex(type: string): number {
    const types = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    return types.indexOf(type);
  }
}

export const zobristHash = new ZobristHash();

export const hashPosition = (
  board: (Piece | null)[][],
  turn: 'white' | 'black'
): bigint => {
  return zobristHash.hash(board, turn);
};
