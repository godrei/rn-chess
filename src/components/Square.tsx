import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import type { Square as ChessSquare, PieceSymbol, Color } from 'chess.js';

const PIECE_GLYPHS: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

interface Piece {
  type: PieceSymbol;
  color: Color;
}

interface Props {
  square: ChessSquare;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  onPress: (square: ChessSquare) => void;
  size: number;
}

export default function Square({ square, piece, isLight, isSelected, isLegalTarget, onPress, size }: Props) {
  const bg = isSelected
    ? '#f6f669'
    : isLegalTarget
    ? isLight ? '#cdd16e' : '#aaa23a'
    : isLight
    ? '#f0d9b5'
    : '#b58863';

  const glyph = piece ? PIECE_GLYPHS[piece.color][piece.type] : null;

  return (
    <TouchableOpacity
      style={[styles.square, { width: size, height: size, backgroundColor: bg }]}
      onPress={() => onPress(square)}
      activeOpacity={0.85}
    >
      {isLegalTarget && !piece && (
        <View style={[styles.dot, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14 }]} />
      )}
      {isLegalTarget && piece && (
        <View style={[styles.captureRing, { width: size, height: size, borderRadius: size / 2, borderWidth: size * 0.1 }]} />
      )}
      {glyph && (
        <Text style={[styles.piece, { fontSize: size * 0.72 }]}>{glyph}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  piece: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    position: 'absolute',
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  captureRing: {
    position: 'absolute',
    borderColor: 'rgba(0,0,0,0.20)',
  },
});
