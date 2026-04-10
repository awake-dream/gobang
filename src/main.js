import { createBoard, pixelToBoard, drawPiece } from './board.js';
import { placePiece, resetGame, getState, addStateListener } from './game.js';

/** @type {HTMLCanvasElement | null} */
const canvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById('board'));

/** @type {CanvasRenderingContext2D | null} */
let ctx = null;

/** @type {boolean} */
let isInitialized = false;

if (canvas) {
  const result = createBoard(canvas);
  ctx = result.ctx;
  isInitialized = true;

  canvas.addEventListener('click', handleClick);

  addStateListener(updateDisplay);
  updateDisplay(getState());
}

/**
 * Handles click events on the canvas
 * @param {MouseEvent} event
 */
function handleClick(event) {
  if (!isInitialized || !ctx) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const pos = pixelToBoard(x, y);
  if (!pos) return;

  const result = placePiece(pos.row, pos.col);
  if (result.success && result.player) {
    drawPiece(ctx, pos.row, pos.col, result.player);
  }
}

/**
 * Updates the display based on game state
 * @param {import('./game.js').GameState} state
 */
function updateDisplay(state) {
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restart');

  if (statusEl) {
    if (state.status === 'won') {
      const winner = state.winner === 1 ? '白方' : '黑方';
      statusEl.textContent = `${winner}获胜！`;
    } else if (state.status === 'draw') {
      statusEl.textContent = '平局！';
    } else {
      const player = state.currentPlayer === 1 ? '白方' : '黑方';
      statusEl.textContent = `${player}回合`;
    }
  }

  if (restartBtn) {
    restartBtn.style.display = state.status !== 'playing' ? 'inline-block' : 'none';
  }
}

/** @type {HTMLButtonElement | null} */
const restartBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById('restart'));

if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    if (ctx && canvas) {
      const result = createBoard(canvas);
      ctx = result.ctx;
      resetGame();
    }
  });
}
