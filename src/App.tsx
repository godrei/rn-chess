import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from 'react-native';
import Board from './components/Board';
import GameStatusBar from './components/GameStatusBar';
import { useChessGame, type GameMode, type Side } from './hooks/useChessGame';

type ModalStep = 'mode' | 'side' | null;

export default function App() {
  const { state, selectSquare, newGame, undo } = useChessGame();
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [pendingMode, setPendingMode] = useState<GameMode>('two-player');

  const isGameInProgress = state.status === 'playing' || state.status === 'check';

  const handleNewGamePress = () => {
    if (isGameInProgress) {
      Alert.alert('New Game', 'Abandon current game and start a new one?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start New', style: 'destructive', onPress: () => setModalStep('mode') },
      ]);
    } else {
      setModalStep('mode');
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setPendingMode(mode);
    if (mode === 'two-player') {
      newGame(mode, 'w');
      setModalStep(null);
    } else {
      setModalStep('side');
    }
  };

  const handleSideSelect = (side: Side) => {
    newGame(pendingMode, side);
    setModalStep(null);
  };

  const canUndo = state.mode === 'two-player' && state.status !== 'checkmate';

  return (
    <SafeAreaView style={styles.safe}>
      <RNStatusBar barStyle="light-content" backgroundColor="#302e2b" />
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>♛ rn-chess</Text>
        </View>

        <GameStatusBar state={state} />

        <View style={styles.boardWrapper}>
          <Board
            fen={state.fen}
            selectedSquare={state.selectedSquare}
            legalTargets={state.legalTargets}
            onSquarePress={selectSquare}
          />
        </View>

        <View style={styles.controls}>
          {canUndo && (
            <TouchableOpacity style={styles.btn} onPress={undo}>
              <Text style={styles.btnText}>↩ Undo</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleNewGamePress}>
            <Text style={[styles.btnText, styles.btnPrimaryText]}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Game Modal — Mode Selection */}
      <Modal visible={modalStep === 'mode'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Game Mode</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleModeSelect('two-player')}>
              <Text style={styles.modalBtnText}>👥  2 Players (Pass & Play)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleModeSelect('vs-cpu')}>
              <Text style={styles.modalBtnText}>🤖  vs CPU</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalStep(null)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Game Modal — Side Selection */}
      <Modal visible={modalStep === 'side'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Play as…</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleSideSelect('w')}>
              <Text style={styles.modalBtnText}>♔  White (goes first)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleSideSelect('b')}>
              <Text style={styles.modalBtnText}>♚  Black</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalStep(null)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#302e2b',
  },
  root: {
    flex: 1,
    backgroundColor: '#302e2b',
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
  },
  btnPrimary: {
    backgroundColor: '#769656',
    borderColor: '#769656',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnPrimaryText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: 300,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
    color: '#302e2b',
  },
  modalBtn: {
    backgroundColor: '#769656',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelBtn: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#888',
    fontSize: 15,
  },
});
