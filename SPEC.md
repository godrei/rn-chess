# rn-chess — Specification

## 1. Objective

Build a cross-platform (iOS + Android) chess application using plain React Native (CLI, no Expo). The app lets two players play locally on one device (pass-and-play) or lets one player challenge a built-in CPU opponent. Game state persists across app restarts.

**Target users:** Casual chess players who want a quick game on their phone.

---

## 2. Core Features & Acceptance Criteria

### Board & Pieces
- Classic 8×8 board with alternating light/dark squares
- Standard piece set rendered as Unicode glyphs (♙♟♖♜ etc.) inside styled `<Text>` components — no image assets required
- Board orientation: White always at the bottom

### Move Mechanics
- Tap a piece to select it; valid destination squares highlight
- Tap a highlighted square to move; invalid taps are ignored
- All legal chess moves enforced by `chess.js` (castling, en passant, promotion)
- Pawn promotion auto-promotes to Queen (no dialog needed for MVP)

### Game Modes
- **2-Player (Pass & Play):** Two humans take turns on the same device
- **vs CPU:** Player chooses a side (White or Black); the other side is controlled by a JavaScript minimax engine with alpha-beta pruning (depth 3, configurable)

### Game State
- Detect and display: Check, Checkmate, Stalemate, Draw (50-move rule / threefold repetition via chess.js)
- In-game status bar shows whose turn it is and any check/end condition
- **New Game** button resets the board; prompts confirmation if game is in progress
- Game state (FEN + mode + player side) saved to `AsyncStorage` on every move and restored on launch

### UI / Navigation
- Single-screen app: board + status bar + action buttons (New Game, possibly Undo in pass-and-play mode)
- Undo (single half-move back) available in pass-and-play mode only

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React Native CLI (TypeScript template) |
| Chess logic | `chess.js` v1 |
| Persistence | `@react-native-async-storage/async-storage` |
| CPU AI | Custom JS minimax + alpha-beta (no native modules) |
| State management | React `useState` / `useReducer` (no Redux) |
| Styling | `StyleSheet` (no third-party UI lib) |

---

## 4. Project Structure

```
rn-chess/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── Board.tsx          # renders 8×8 grid
│   │   ├── Square.tsx         # single square + piece glyph
│   │   └── StatusBar.tsx      # turn/check/end status
│   ├── engine/
│   │   └── ai.ts              # minimax + alpha-beta AI
│   ├── hooks/
│   │   └── useChessGame.ts    # game state, move handling, persistence
│   ├── utils/
│   │   └── storage.ts         # AsyncStorage helpers
│   └── App.tsx
├── SPEC.md
└── package.json
```

---

## 5. Code Style

- TypeScript strict mode
- Functional components + hooks only
- No `any` types
- File names: PascalCase for components, camelCase for hooks/utils
- No comments unless the "why" is non-obvious

---

## 6. Testing Strategy

- Unit tests for `ai.ts` (minimax returns a legal move, doesn't crash on terminal positions)
- Unit tests for `useChessGame` reducer logic (move application, undo, new game)
- Jest + `@testing-library/react-native`
- No E2E tests for MVP

---

## 7. Boundaries

| Always | Ask first | Never |
|---|---|---|
| Enforce all chess rules via chess.js | Add online/multiplayer | Add ads or analytics |
| Auto-save on every move | Add sound effects | Remove type safety |
| Confirm before "New Game" if in progress | Add piece animation | Use Expo or third-party UI kits |
| AI plays only when it's the CPU's turn | Add difficulty settings beyond depth | Fetch anything from the network |

---

## 8. GitHub

- Repo: `rn-chess` (public) under `krisztian.godrei`
- Initial commit: project scaffold + this spec
