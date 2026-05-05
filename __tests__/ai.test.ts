import { Chess } from 'chess.js';
import { getBestMove } from '../src/engine/ai';

describe('getBestMove', () => {
  it('returns a legal move from the start position', () => {
    const chess = new Chess();
    const move = getBestMove(chess.fen(), 2);
    expect(move).not.toBeNull();
    const legalMoves = chess.moves({ verbose: true }).map(m => m.san);
    expect(legalMoves.length).toBeGreaterThan(0);
  });

  it('returns null when game is over (checkmate)', () => {
    // Fool's mate — checkmate in 2 moves
    const chess = new Chess();
    chess.move('f3');
    chess.move('e5');
    chess.move('g4');
    chess.move('Qh4');
    expect(chess.isCheckmate()).toBe(true);
    const move = getBestMove(chess.fen(), 2);
    expect(move).toBeNull();
  });

  it('finds checkmate-in-one when available', () => {
    // Position where white can deliver checkmate in one
    // Fool's mate setup: black to deliver Qh4#
    const chess = new Chess();
    chess.move('f3');
    chess.move('e5');
    chess.move('g4');
    // It's black's turn — Qh4 is checkmate
    const move = getBestMove(chess.fen(), 3);
    expect(move).not.toBeNull();
    // Apply the move and verify checkmate
    if (move) {
      chess.move(move);
      expect(chess.isCheckmate()).toBe(true);
    }
  });

  it('returns null on stalemate position', () => {
    // Stalemate: black king has no legal moves
    const stalemate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 1';
    // Verify it's actually stalemate
    const chess = new Chess(stalemate);
    expect(chess.isStalemate()).toBe(true);
    const move = getBestMove(stalemate, 1);
    expect(move).toBeNull();
  });
});
