import { BOARD_SIZE, getBoardKey } from './board.js';

/**
 * @typedef {1 | 2} Player
 */

/**
 * @typedef {'playing' | 'won' | 'draw'} GameStatus
 */

/**
 * @typedef {{row: number, col: number, player: Player}} Piece
 */

/**
 * @typedef {{status: GameStatus, winner: Player | null, currentPlayer: Player, board: Map<string, Piece>, moveCount: number}} GameState
 */

/**
 * @typedef {Function} StateListener
 * @param {GameState} state
 */

/** @type {GameState} */
let state = {
  status: 'playing',
  winner: null,
  currentPlayer: 1,
  board: new Map(),
  moveCount: 0,
};

/** @type {StateListener[]} */
const listeners = [];

/**
 * Adds a listener for state changes
 * @param {StateListener} listener
 */
export function addStateListener(listener) {
  listeners.push(listener);
}

/**
 * Notifies all listeners of state change
 */
function notifyListeners() {
  for (const listener of listeners) {
    listener({ ...state, board: new Map(state.board) });
  }
}

/**
 * Places a piece at the given position
 * @param {number} row
 * @param {number} col
 * @returns {{success: boolean, reason?: string}}
 */
export function placePiece(row, col) {
  if (state.status !== 'playing') {
    return { success: false, reason: 'Game is not in playing state' };
  }

  const key = getBoardKey(row, col);
  if (state.board.has(key)) {
    return { success: false, reason: 'Position already occupied' };
  }

  const piece = { row, col, player: state.currentPlayer };
  state.board.set(key, piece);
  state.moveCount++;

  if (checkWin(row, col, state.currentPlayer)) {
    state.status = 'won';
    state.winner = state.currentPlayer;
  } else if (state.moveCount >= BOARD_SIZE * BOARD_SIZE) {
    state.status = 'draw';
  } else {
    state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
  }

  notifyListeners();
  return { success: true };
}

/**
 * Checks if the current player has won at the given position
 * @param {number} row
 * @param {number} col
 * @param {Player} player
 * @returns {boolean}
 */
function checkWin(row, col, player) {
  const directions = [
    [[0, 1], [0, -1]],   // horizontal
    [[1, 0], [-1, 0]],   // vertical
    [[1, 1], [-1, -1]], // diagonal \
    [[1, -1], [-1, 1]], // diagonal /
  ];

  for (const [dir1, dir2] of directions) {
    let count = 1;
    count += countInDirection(row, col, player, dir1[0], dir1[1]);
    count += countInDirection(row, col, player, dir2[0], dir2[1]);

    if (count >= 5) {
      return true;
    }
  }

  return false;
}

/**
 * Counts consecutive pieces in a direction
 * @param {number} row
 * @param {number} col
 * @param {Player} player
 * @param {number} dRow
 * @param {number} dCol
 * @returns {number}
 */
function countInDirection(row, col, player, dRow, dCol) {
  let count = 0;
  let r = row + dRow;
  let c = col + dCol;

  while (
    r >= 0 && r < BOARD_SIZE &&
    c >= 0 && c < BOARD_SIZE
  ) {
    const key = getBoardKey(r, c);
    const piece = state.board.get(key);
    if (!piece || piece.player !== player) {
      break;
    }
    count++;
    r += dRow;
    c += dCol;
  }

  return count;
}

/**
 * Resets the game to initial state
 */
export function resetGame() {
  state = {
    status: 'playing',
    winner: null,
    currentPlayer: 1,
    board: new Map(),
    moveCount: 0,
  };
  notifyListeners();
}

/**
 * Gets the current game state
 * @returns {GameState}
 */
export function getState() {
  return { ...state, board: new Map(state.board) };
}

/**
 * Gets the current player
 * @returns {Player}
 */
export function getCurrentPlayer() {
  return state.currentPlayer;
}
