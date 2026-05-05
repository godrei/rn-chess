# rn-chess

A React Native chess app for iOS and Android. Play against a friend on the same device or challenge a built-in CPU opponent.

## Features

- **2-player pass-and-play** — take turns on one device
- **vs CPU** — minimax engine with alpha-beta pruning (depth 3) and piece-square table evaluation
- Full rule enforcement via [chess.js](https://github.com/jhlywa/chess.js): castling, en passant, pawn promotion (auto-queen)
- Check, checkmate, stalemate, and draw detection
- Move highlighting — tap a piece to see legal destination squares
- Undo (pass-and-play mode only)
- Game state persists across app restarts via AsyncStorage

## Prerequisites

Follow the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment) for your platform before proceeding.

## Getting started

**Install dependencies**

```sh
yarn install
```

**iOS — install CocoaPods (first time or after native dep changes)**

```sh
bundle install
bundle exec pod install
```

## Running the app

Start the Metro bundler in one terminal:

```sh
yarn start
```

Then in a second terminal:

```sh
# iOS
yarn ios

# Android
yarn android
```

You can also open `ios/rn_chess.xcodeproj` in Xcode or the `android/` folder in Android Studio and run from there.

## Running tests

```sh
yarn test
```

13 unit tests covering the AI engine and core game logic.

## Project structure

```
src/
├── components/
│   ├── Board.tsx          # 8×8 board with rank/file labels
│   ├── Square.tsx         # single square, piece glyph, move highlights
│   └── GameStatusBar.tsx  # turn / check / end-state display
├── engine/
│   └── ai.ts              # minimax + alpha-beta AI
├── hooks/
│   └── useChessGame.ts    # game state, move handling, persistence
├── utils/
│   └── storage.ts         # AsyncStorage helpers
└── App.tsx                # main screen + New Game modal
```

## Troubleshooting

See the [React Native troubleshooting docs](https://reactnative.dev/docs/troubleshooting) for build issues.

For Metro cache problems:

```sh
yarn start --reset-cache
```
