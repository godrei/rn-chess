import React from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { Chess, type Square as ChessSquare } from 'chess.js';
import Square from './Square';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

interface Props {
  fen: string;
  selectedSquare: ChessSquare | null;
  legalTargets: ChessSquare[];
  onSquarePress: (square: ChessSquare) => void;
}

export default function Board({ fen, selectedSquare, legalTargets, onSquarePress }: Props) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width, 420);
  const squareSize = boardSize / 8;

  const chess = new Chess(fen);

  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      {RANKS.map((rank, ri) => (
        <View key={rank} style={styles.row}>
          {FILES.map((file, fi) => {
            const sq = `${file}${rank}` as ChessSquare;
            const piece = chess.get(sq) || null;
            const isLight = (ri + fi) % 2 === 0;
            return (
              <Square
                key={sq}
                square={sq}
                piece={piece}
                isLight={isLight}
                isSelected={selectedSquare === sq}
                isLegalTarget={legalTargets.includes(sq)}
                onPress={onSquarePress}
                size={squareSize}
              />
            );
          })}
        </View>
      ))}
      {/* Rank labels */}
      {RANKS.map((rank, ri) => (
        <Text
          key={`rl${rank}`}
          style={[styles.rankLabel, { top: ri * squareSize + squareSize * 0.05, fontSize: squareSize * 0.22 }]}
        >
          {rank}
        </Text>
      ))}
      {/* File labels */}
      {FILES.map((file, fi) => (
        <Text
          key={`fl${file}`}
          style={[styles.fileLabel, { left: fi * squareSize + squareSize * 0.75, fontSize: squareSize * 0.22 }]}
        >
          {file}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  rankLabel: {
    position: 'absolute',
    left: 2,
    color: 'rgba(0,0,0,0.45)',
    fontWeight: 'bold',
  },
  fileLabel: {
    position: 'absolute',
    bottom: 2,
    color: 'rgba(0,0,0,0.45)',
    fontWeight: 'bold',
  },
});
