import { useReducer, useEffect, useCallback } from 'react';
import { Chess, type Square, type Move } from 'chess.js';
import { saveGameState, loadGameState, clearGameState } from '../utils/storage';
import { getBestMove } from '../engine/ai';

export type GameMode = 'two-player' | 'vs-cpu';
export type Side = 'w' | 'b';

export interface GameState {
  fen: string;
  selectedSquare: Square | null;
  legalTargets: Square[];
  mode: GameMode;
  playerSide: Side;
  status: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  winner: Side | null;
  cpuThinking: boolean;
}

type Action =
  | { type: 'SELECT'; square: Square }
  | { type: 'MOVE'; move: Move }
  | { type: 'NEW_GAME'; mode: GameMode; playerSide: Side }
  | { type: 'UNDO' }
  | { type: 'CPU_THINKING'; thinking: boolean }
  | { type: 'LOAD'; fen: string; mode: GameMode; playerSide: Side };

function deriveStatus(chess: Chess): Pick<GameState, 'status' | 'winner'> {
  if (chess.isCheckmate()) {
    const winner: Side = chess.turn() === 'w' ? 'b' : 'w';
    return { status: 'checkmate', winner };
  }
  if (chess.isStalemate()) return { status: 'stalemate', winner: null };
  if (chess.isDraw()) return { status: 'draw', winner: null };
  if (chess.inCheck()) return { status: 'check', winner: null };
  return { status: 'playing', winner: null };
}

function getLegalTargets(chess: Chess, square: Square): Square[] {
  return chess
    .moves({ square, verbose: true })
    .map(m => m.to as Square);
}

function makeInitialState(mode: GameMode, playerSide: Side, fen?: string): GameState {
  const chess = new Chess(fen);
  return {
    fen: chess.fen(),
    selectedSquare: null,
    legalTargets: [],
    mode,
    playerSide,
    ...deriveStatus(chess),
    cpuThinking: false,
  };
}

function reducer(state: GameState, action: Action): GameState {
  const chess = new Chess(state.fen);

  switch (action.type) {
    case 'LOAD':
      return makeInitialState(action.mode, action.playerSide, action.fen);

    case 'NEW_GAME':
      return makeInitialState(action.mode, action.playerSide);

    case 'SELECT': {
      if (state.status === 'checkmate' || state.status === 'stalemate' || state.status === 'draw') {
        return state;
      }

      // In vs-cpu mode, only allow selection when it's the player's turn
      if (state.mode === 'vs-cpu' && chess.turn() !== state.playerSide) {
        return state;
      }

      const piece = chess.get(action.square);

      // Deselect if tapping same square
      if (state.selectedSquare === action.square) {
        return { ...state, selectedSquare: null, legalTargets: [] };
      }

      // Move to a legal target
      if (state.selectedSquare && state.legalTargets.includes(action.square)) {
        const move = chess.move({
          from: state.selectedSquare,
          to: action.square,
          promotion: 'q',
        });
        return {
          ...state,
          fen: chess.fen(),
          selectedSquare: null,
          legalTargets: [],
          ...deriveStatus(chess),
        };
      }

      // Select a piece of the current player
      if (piece && piece.color === chess.turn()) {
        return {
          ...state,
          selectedSquare: action.square,
          legalTargets: getLegalTargets(chess, action.square),
        };
      }

      return { ...state, selectedSquare: null, legalTargets: [] };
    }

    case 'MOVE': {
      chess.move(action.move);
      return {
        ...state,
        fen: chess.fen(),
        selectedSquare: null,
        legalTargets: [],
        ...deriveStatus(chess),
        cpuThinking: false,
      };
    }

    case 'UNDO': {
      if (state.mode !== 'two-player') return state;
      chess.undo();
      return {
        ...state,
        fen: chess.fen(),
        selectedSquare: null,
        legalTargets: [],
        ...deriveStatus(chess),
      };
    }

    case 'CPU_THINKING':
      return { ...state, cpuThinking: action.thinking };

    default:
      return state;
  }
}

export function useChessGame() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => makeInitialState('two-player', 'w'),
  );

  // Restore saved game on mount
  useEffect(() => {
    loadGameState().then(saved => {
      if (saved) {
        dispatch({ type: 'LOAD', fen: saved.fen, mode: saved.mode, playerSide: saved.playerSide });
      }
    });
  }, []);

  // Persist state on every fen change
  useEffect(() => {
    saveGameState({ fen: state.fen, mode: state.mode, playerSide: state.playerSide });
  }, [state.fen, state.mode, state.playerSide]);

  // CPU move trigger
  useEffect(() => {
    if (state.mode !== 'vs-cpu') return;
    if (state.status !== 'playing' && state.status !== 'check') return;
    const chess = new Chess(state.fen);
    if (chess.turn() === state.playerSide) return;
    if (state.cpuThinking) return;

    dispatch({ type: 'CPU_THINKING', thinking: true });

    // Defer to next tick so UI can render "CPU thinking" state
    setTimeout(() => {
      const bestMove = getBestMove(state.fen, 3);
      if (bestMove) {
        dispatch({ type: 'MOVE', move: bestMove });
      } else {
        dispatch({ type: 'CPU_THINKING', thinking: false });
      }
    }, 50);
  }, [state.fen, state.mode, state.playerSide, state.status, state.cpuThinking]);

  const selectSquare = useCallback((square: Square) => {
    dispatch({ type: 'SELECT', square });
  }, []);

  const newGame = useCallback((mode: GameMode, playerSide: Side) => {
    clearGameState();
    dispatch({ type: 'NEW_GAME', mode, playerSide });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  return { state, selectSquare, newGame, undo };
}
