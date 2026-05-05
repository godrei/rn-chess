import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { GameState } from '../hooks/useChessGame';
import { Chess } from 'chess.js';

interface Props {
  state: GameState;
}

export default function GameStatusBar({ state }: Props) {
  const { fen, status, winner, mode, playerSide, cpuThinking } = state;
  const chess = new Chess(fen);
  const turn = chess.turn();

  let message = '';
  let subtext = '';
  let highlight = false;

  if (status === 'checkmate') {
    const winnerLabel = winner === 'w' ? 'White' : 'Black';
    message = `Checkmate — ${winnerLabel} wins!`;
    highlight = true;
  } else if (status === 'stalemate') {
    message = 'Stalemate — Draw!';
    highlight = true;
  } else if (status === 'draw') {
    message = 'Draw!';
    highlight = true;
  } else if (cpuThinking) {
    message = 'CPU is thinking…';
    subtext = '';
  } else if (status === 'check') {
    const inCheckLabel = turn === 'w' ? 'White' : 'Black';
    message = `${inCheckLabel}'s turn — Check!`;
    highlight = true;
  } else {
    if (mode === 'vs-cpu') {
      if (turn === playerSide) {
        message = 'Your turn';
      } else {
        message = 'CPU\'s turn';
      }
    } else {
      message = `${turn === 'w' ? 'White' : 'Black'}'s turn`;
    }
  }

  return (
    <View style={[styles.container, highlight && styles.highlighted]}>
      <Text style={[styles.message, highlight && styles.highlightedText]}>{message}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#302e2b',
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  highlighted: {
    backgroundColor: '#e05c00',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  highlightedText: {
    color: '#fff',
  },
  subtext: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 2,
  },
});
