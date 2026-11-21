// Shared layout and tuning constants for Twin Views, a spot-the-difference game.
// The whole game is drawn on one 1280x800 canvas: a HUD strip on top, two picture
// panels side by side in the middle, and a message strip along the bottom.

export const VIEW_WIDTH = 1280;
export const VIEW_HEIGHT = 800;

export const HUD_TOP = 14;
export const HUD_HEIGHT = 78;

export const PANEL_Y = 108;
export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 520;
export const PANEL_LEFT_X = 26;
export const PANEL_RIGHT_X = 654;
export const PANEL_GAP = PANEL_RIGHT_X - (PANEL_LEFT_X + PANEL_WIDTH);

export const MESSAGE_Y = 648;
export const MESSAGE_HEIGHT = 132;

export const COLOURS = {
  pageTop: '#1d2440',
  pageBottom: '#0d1020',
  hudFill: '#f6ead2',
  hudInk: '#2b2118',
  hudAccent: '#d95d39',
  frameFill: '#fffaf0',
  gold: '#f2b134',
  foundRing: '#2fa84f',
  wrongMark: '#d93b3b',
  hintRing: '#ff7b00',
  timerGood: '#2fa84f',
  timerLow: '#d93b3b',
};

export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND = 5;
export const WRONG_CLICK_PENALTY_SECONDS = 5;
export const HINT_COST_POINTS = 50;
export const HINTS_PER_GAME = 3;
export const HINT_PULSE_SECONDS = 2.6;
export const WRONG_MARK_SECONDS = 0.9;

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';
