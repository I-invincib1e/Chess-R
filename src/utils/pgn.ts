import { Move } from '../types/game';

export interface PGNMetadata {
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;
  result?: '1-0' | '0-1' | '1/2-1/2' | '*';
}

export const exportToPGN = (
  moves: Move[],
  result: '1-0' | '0-1' | '1/2-1/2' | '*',
  metadata?: PGNMetadata
): string => {
  const lines: string[] = [];
  
  // PGN headers
  lines.push(`[Event "${metadata?.event || 'Casual Game'}"]`);
  lines.push(`[Site "${metadata?.site || 'Chess App'}"]`);
  lines.push(`[Date "${metadata?.date || new Date().toISOString().split('T')[0]}"]`);
  lines.push(`[Round "${metadata?.round || '-'}"]`);
  lines.push(`[White "${metadata?.white || 'Player'}"]`);
  lines.push(`[Black "${metadata?.black || 'AI'}"]`);
  lines.push(`[Result "${metadata?.result || result}"]`);
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

export const downloadPGN = (pgn: string, filename?: string) => {
  const blob = new Blob([pgn], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `chess-game-${Date.now()}.pgn`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const savePGNToLocalStorage = (pgn: string, key: string = 'lastGame') => {
  try {
    localStorage.setItem(`chess_${key}`, pgn);
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
};

export const loadPGNFromLocalStorage = (key: string = 'lastGame'): string | null => {
  try {
    return localStorage.getItem(`chess_${key}`);
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};
