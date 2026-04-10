/**
 * @typedef {{row: number, col: number, player: 1 | 2}} Piece
 */

/**
 * @typedef {Map<string, Piece>} BoardMap
 */

const BOARD_SIZE = 15;
const CELL_SIZE = 40;
const PADDING = 30;

/**
 * Creates the chessboard canvas and returns context
 * @param {HTMLCanvasElement} canvas
 * @returns {{ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement}}
 */
export function createBoard(canvas) {
  const size = CELL_SIZE * (BOARD_SIZE - 1) + PADDING * 2;
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d');

  // Draw wood background
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(0, 0, size, size);

  drawBoardLines(ctx, size);
  drawStarPoints(ctx, size);

  return { ctx, canvas };
}

/**
 * Draws the grid lines on the board
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size
 */
function drawBoardLines(ctx, size) {
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 1;

  for (let i = 0; i < BOARD_SIZE; i++) {
    const pos = PADDING + i * CELL_SIZE;

    ctx.beginPath();
    ctx.moveTo(pos, PADDING);
    ctx.lineTo(pos, size - PADDING);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(PADDING, pos);
    ctx.lineTo(size - PADDING, pos);
    ctx.stroke();
  }
}

/**
 * Draws the star points (handicap points) on the board
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size
 */
function drawStarPoints(ctx, size) {
  ctx.fillStyle = '#8B4513';
  const starPositions = [3, 7, 11];

  for (const row of starPositions) {
    for (const col of starPositions) {
      const x = PADDING + col * CELL_SIZE;
      const y = PADDING + row * CELL_SIZE;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Converts pixel coordinates to board position
 * @param {number} x
 * @param {number} y
 * @returns {{row: number, col: number} | null}
 */
export function pixelToBoard(x, y) {
  const col = Math.round((x - PADDING) / CELL_SIZE);
  const row = Math.round((y - PADDING) / CELL_SIZE);

  if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
    return { row, col };
  }
  return null;
}

/**
 * Converts board position to pixel coordinates
 * @param {number} row
 * @param {number} col
 * @returns {{x: number, y: number}}
 */
export function boardToPixel(row, col) {
  return {
    x: PADDING + col * CELL_SIZE,
    y: PADDING + row * CELL_SIZE,
  };
}

/**
 * Draws a piece on the board
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} row
 * @param {number} col
 * @param {1 | 2} player
 */
export function drawPiece(ctx, row, col, player) {
  const { x, y } = boardToPixel(row, col);
  const radius = CELL_SIZE * 0.4;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);

  const gradient = ctx.createRadialGradient(
    x - radius * 0.3, y - radius * 0.3, 0,
    x, y, radius
  );

  if (player === 1) {
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(1, '#CCCCCC');
  } else {
    gradient.addColorStop(0, '#4A4A4A');
    gradient.addColorStop(1, '#1A1A1A');
  }

  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = player === 1 ? '#999999' : '#333333';
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * Gets the board key for a position
 * @param {number} row
 * @param {number} col
 * @returns {string}
 */
export function getBoardKey(row, col) {
  return `${row},${col}`;
}

export { BOARD_SIZE, CELL_SIZE, PADDING };
