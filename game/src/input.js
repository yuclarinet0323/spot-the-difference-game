// Mouse and keyboard input for Twin Views. Mouse clicks are translated from
// page coordinates into the game's fixed 1280x800 space, then routed: the
// hint button, the big overlay button, or one of the two picture panels.
// The keyboard drives a magnifier cursor with the arrow keys and checks the
// spot under it with Space or Enter, so the whole game is playable without
// a mouse (the crawl bot that visits entries plays exactly this way).

import {
  PANEL_HEIGHT,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_WIDTH,
  PANEL_Y,
  SCREEN_CLEAR,
  SCREEN_OVER,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './config.js';
import { HINT_BUTTON, PRIMARY_BUTTON } from './render.js';

export function createCursor() {
  return { x: PANEL_LEFT_X + PANEL_WIDTH / 2, y: PANEL_Y + PANEL_HEIGHT / 2, visible: false };
}

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

// Which panel a canvas point falls in: 0 for Picture A, 1 for Picture B,
// or -1 when the point is outside both pictures.
export function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return -1;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_WIDTH) return 0;
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_WIDTH) return 1;
  return -1;
}

export function toPanelPoint(x, y, panelSide) {
  const originX = panelSide === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
  return { x: x - originX, y: y - PANEL_Y };
}

export function toGamePoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * VIEW_WIDTH,
    y: ((clientY - rect.top) / rect.height) * VIEW_HEIGHT,
  };
}

// Route one activated point (a mouse click, or the magnifier position when
// Space/Enter is pressed). `actions` is the set of callbacks main.js wires
// to the game state and sounds.
export function activatePoint(state, point, actions) {
  if (state.screen === SCREEN_PLAY) {
    if (pointInRect(point.x, point.y, HINT_BUTTON)) {
      actions.useHint();
      return;
    }
    const panelSide = panelAt(point.x, point.y);
    if (panelSide !== -1) {
      const local = toPanelPoint(point.x, point.y, panelSide);
      actions.clickPanel(local.x, local.y, panelSide);
    }
    return;
  }
  if (state.screen === SCREEN_TITLE || state.screen === SCREEN_OVER || state.screen === SCREEN_WIN) {
    if (pointInRect(point.x, point.y, PRIMARY_BUTTON) || state.screen !== SCREEN_TITLE) actions.startGame();
    return;
  }
  if (state.screen === SCREEN_CLEAR) actions.advance();
}

const CURSOR_STEP = 16;
const CURSOR_FAST_STEP = 42;

export function moveCursor(cursor, key, fast) {
  const step = fast ? CURSOR_FAST_STEP : CURSOR_STEP;
  if (key === 'ArrowLeft') cursor.x -= step;
  if (key === 'ArrowRight') cursor.x += step;
  if (key === 'ArrowUp') cursor.y -= step;
  if (key === 'ArrowDown') cursor.y += step;
  cursor.x = Math.max(PANEL_LEFT_X + 8, Math.min(PANEL_RIGHT_X + PANEL_WIDTH - 8, cursor.x));
  cursor.y = Math.max(PANEL_Y + 8, Math.min(PANEL_Y + PANEL_HEIGHT - 8, cursor.y));
  cursor.visible = true;
}

export function attachInput(canvas, state, cursor, actions) {
  canvas.addEventListener('pointerdown', (event) => {
    actions.unlockAudio();
    const point = toGamePoint(canvas, event.clientX, event.clientY);
    cursor.x = point.x;
    cursor.y = point.y;
    activatePoint(state, point, actions);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(key)) event.preventDefault();
    actions.unlockAudio();
    if (key.startsWith('Arrow')) {
      if (state.screen === SCREEN_PLAY) moveCursor(cursor, key, event.shiftKey);
      return;
    }
    if (key === ' ' || key === 'Enter') {
      if (state.screen === SCREEN_PLAY) activatePoint(state, { x: cursor.x, y: cursor.y }, actions);
      else activatePoint(state, { x: PRIMARY_BUTTON.x + 4, y: PRIMARY_BUTTON.y + 4 }, actions);
      return;
    }
    if ((key === 'h' || key === 'H') && state.screen === SCREEN_PLAY) actions.useHint();
  });
}
