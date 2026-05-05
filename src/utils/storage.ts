import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVE_KEY = '@rn_chess_state';

export interface SavedState {
  fen: string;
  mode: 'two-player' | 'vs-cpu';
  playerSide: 'w' | 'b';
}

export async function saveGameState(state: SavedState): Promise<void> {
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export async function loadGameState(): Promise<SavedState | null> {
  const raw = await AsyncStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as SavedState;
}

export async function clearGameState(): Promise<void> {
  await AsyncStorage.removeItem(SAVE_KEY);
}
