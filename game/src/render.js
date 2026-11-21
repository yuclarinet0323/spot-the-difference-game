// All drawing for Twin Views: the HUD strip (timer, score, the big REMAINING
// counter), the two picture panels with their found markers, the message
// strip, the keyboard magnifier, and the title / clear / time-up / victory
// cards. The scenes themselves are painted by scene-paint.js; this file is
// the frame and the feedback around them.

import {
  COLOURS,
  HUD_HEIGHT,
  HUD_TOP,
  MESSAGE_HEIGHT,
  MESSAGE_Y,
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
import { SCENES } from './scenes.js';
import { paintScene } from './scene-paint.js';
import { formatClock } from './game-state.js';

export const HINT_BUTTON = { x: 1092, y: 27, width: 160, height: 52 };
export const PRIMARY_BUTTON = { x: 440, y: 516, width: 400, height: 66 };

function fillRoundRect(ctx, x, y, width, height, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function drawText(ctx, text, x, y, font, fill, align = 'left') {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function drawStarShape(ctx, x, y, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let index = 0; index < 10; index += 1) {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    const length = index % 2 === 0 ? radius : radius * 0.45;
    const px = x + Math.cos(angle) * length;
    const py = y + Math.sin(angle) * length;
    if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawHud(ctx, state) {
  fillRoundRect(ctx, 14, HUD_TOP, VIEW_WIDTH - 28, HUD_HEIGHT, 16, COLOURS.hudFill);
  drawText(ctx, 'TWIN VIEWS', 34, 42, 'bold 27px sans-serif', COLOURS.hudInk);
  drawText(ctx, 'spot the difference', 34, 70, '15px sans-serif', '#7a6a52');

  const scene = state.currentScene();
  const hudTitle = scene.title.replace(/^Round \d+ - /, '');
  drawText(ctx, hudTitle, 252, 42, 'bold 20px sans-serif', COLOURS.hudInk);
  drawText(ctx, `Round ${state.roundIndex + 1} of ${SCENES.length}`, 252, 70, '15px sans-serif', '#7a6a52');

  // The remaining counter: the biggest, loudest number on the screen.
  const remaining = state.remainingCount();
  fillRoundRect(ctx, 512, 25, 188, 56, 12, remaining <= 2 && state.screen === SCREEN_PLAY ? COLOURS.wrongMark : '#2b2118');
  drawText(ctx, `REMAINING  ${remaining}`, 606, 54, 'bold 25px sans-serif', '#ffffff', 'center');

  const found = state.foundIds.size;
  const total = scene.differences.length;
  drawText(ctx, `Found ${found} / ${total}`, 724, 42, 'bold 19px sans-serif', COLOURS.hudInk);
  drawText(ctx, `Misses ${state.totalMisses}`, 724, 70, '15px sans-serif', '#7a6a52');

  // Timer bar and clock.
  const fraction = Math.max(0, state.timeLeft / scene.timeLimitSeconds);
  fillRoundRect(ctx, 838, 30, 130, 14, 7, '#d8cbb0');
  fillRoundRect(ctx, 838, 30, Math.max(14, 130 * fraction), 14, 7, state.timeLeft <= 15 ? COLOURS.timerLow : COLOURS.timerGood);
  drawText(ctx, formatClock(state.timeLeft), 903, 64, 'bold 21px sans-serif', state.timeLeft <= 15 ? COLOURS.timerLow : COLOURS.hudInk, 'center');

  drawText(ctx, `Score ${state.score}`, 1080, 53, 'bold 20px sans-serif', COLOURS.hudInk, 'right');

  // Hint button.
  const hintEnabled = state.screen === SCREEN_PLAY && state.hintsLeft > 0;
  fillRoundRect(ctx, HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.width, HINT_BUTTON.height, 12, hintEnabled ? COLOURS.gold : '#cbbd9d');
  drawText(ctx, `HINT  x${state.hintsLeft}`, HINT_BUTTON.x + HINT_BUTTON.width / 2, HINT_BUTTON.y + 20, 'bold 18px sans-serif', '#2b2118', 'center');
  drawText(ctx, '-50 points', HINT_BUTTON.x + HINT_BUTTON.width / 2, HINT_BUTTON.y + 40, '12px sans-serif', '#6b5a3e', 'center');
}

function drawPanel(ctx, state, panelX, isChanged, timeSeconds) {
  fillRoundRect(ctx, panelX - 6, PANEL_Y - 6, PANEL_WIDTH + 12, PANEL_HEIGHT + 12, 14, COLOURS.frameFill);
  ctx.save();
  ctx.translate(panelX, PANEL_Y);
  paintScene(ctx, state.currentScene().id, isChanged, timeSeconds);
  ctx.restore();

  // Panel tag.
  fillRoundRect(ctx, panelX + 12, PANEL_Y + 10, 118, 26, 8, 'rgba(20,22,38,0.78)');
  drawText(ctx, isChanged ? 'PICTURE B' : 'PICTURE A', panelX + 71, PANEL_Y + 24, 'bold 14px sans-serif', '#ffffff', 'center');
}

function drawFoundMarkers(ctx, state, panelX, timeSeconds) {
  const scene = state.currentScene();
  scene.differences.forEach((difference, index) => {
    if (!state.isFound(difference.id)) return;
    const x = panelX + difference.x;
    const y = PANEL_Y + difference.y;
    const pulse = 1 + Math.sin(timeSeconds * 4) * 0.04;
    const radius = (difference.radius + 7) * pulse;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = COLOURS.foundRing;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    const badgeX = x + radius * 0.72;
    const badgeY = y - radius * 0.72;
    ctx.fillStyle = COLOURS.foundRing;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 11, 0, Math.PI * 2);
    ctx.fill();
    drawText(ctx, String(index + 1), badgeX, badgeY + 1, 'bold 13px sans-serif', '#ffffff', 'center');
  });
}

function drawHintPulse(ctx, state, panelX, timeSeconds) {
  if (!state.hintId || state.hintTimer <= 0) return;
  const difference = state.currentScene().differences.find((entry) => entry.id === state.hintId);
  if (!difference) return;
  const x = panelX + difference.x;
  const y = PANEL_Y + difference.y;
  for (let ring = 0; ring < 3; ring += 1) {
    const phase = (timeSeconds * 0.9 + ring / 3) % 1;
    ctx.strokeStyle = `rgba(255,123,0,${1 - phase})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, difference.radius + 4 + phase * 34, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawWrongMarks(ctx, state, panelX, panelSide) {
  for (const mark of state.wrongMarks) {
    if (mark.panel !== panelSide) continue;
    const x = panelX + mark.x;
    const y = PANEL_Y + mark.y;
    const size = 13;
    ctx.strokeStyle = COLOURS.wrongMark;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
  }
}

export function drawMagnifier(ctx, cursor) {
  if (!cursor.visible) return;
  ctx.strokeStyle = COLOURS.gold;
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 21, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cursor.x + 15, cursor.y + 15);
  ctx.lineTo(cursor.x + 27, cursor.y + 27);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(43,33,24,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cursor.x - 9, cursor.y);
  ctx.lineTo(cursor.x + 9, cursor.y);
  ctx.moveTo(cursor.x, cursor.y - 9);
  ctx.lineTo(cursor.x, cursor.y + 9);
  ctx.stroke();
}

function drawMessageBar(ctx, state) {
  fillRoundRect(ctx, 26, MESSAGE_Y, VIEW_WIDTH - 52, MESSAGE_HEIGHT - 16, 14, '#232946');
  drawText(ctx, state.message, VIEW_WIDTH / 2, MESSAGE_Y + 34, 'bold 21px sans-serif', '#f6ead2', 'center');
  drawText(
    ctx,
    'Click a difference in either picture  -  Arrow keys move the magnifier, Space checks the spot  -  H uses a hint  -  A wrong click costs 5 seconds',
    VIEW_WIDTH / 2, MESSAGE_Y + 72, '15px sans-serif', '#aab3d6', 'center',
  );
  // Round progress dots.
  SCENES.forEach((scene, index) => {
    const x = VIEW_WIDTH / 2 - (SCENES.length - 1) * 22 + index * 44;
    const done = index < state.roundIndex || state.screen === SCREEN_WIN;
    const active = index === state.roundIndex && state.screen !== SCREEN_WIN;
    ctx.fillStyle = done ? COLOURS.foundRing : active ? COLOURS.gold : '#4a5178';
    ctx.beginPath();
    ctx.arc(x, MESSAGE_Y + 100, 9, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawOverlayCard(ctx, heading, headingColour, lines, buttonLabel) {
  ctx.fillStyle = 'rgba(11,13,26,0.66)';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  fillRoundRect(ctx, 300, 196, 680, 388, 22, '#f6ead2');
  drawText(ctx, heading, VIEW_WIDTH / 2, 262, 'bold 44px sans-serif', headingColour, 'center');
  lines.forEach((line, index) => {
    drawText(ctx, line.text, VIEW_WIDTH / 2, 322 + index * 34, line.bold ? 'bold 21px sans-serif' : '19px sans-serif', '#2b2118', 'center');
  });
  fillRoundRect(ctx, PRIMARY_BUTTON.x, PRIMARY_BUTTON.y, PRIMARY_BUTTON.width, PRIMARY_BUTTON.height, 14, COLOURS.hudAccent);
  drawText(ctx, buttonLabel, VIEW_WIDTH / 2, PRIMARY_BUTTON.y + PRIMARY_BUTTON.height / 2 + 1, 'bold 24px sans-serif', '#ffffff', 'center');
}

function drawTitleOverlay(ctx, state) {
  drawOverlayCard(ctx, 'TWIN VIEWS', COLOURS.hudAccent, [
    { text: 'Two pictures. A handful of sneaky changes.', bold: true },
    { text: 'Click every difference before the clock runs out.' },
    { text: '3 rounds - 22 differences - faster eyes earn time bonuses.' },
    { text: 'Wrong clicks cost 5 seconds. Hints cost 50 points.' },
  ], 'START  (Enter)');
}

function drawClearOverlay(ctx, state) {
  const result = state.roundResults[state.roundResults.length - 1];
  drawOverlayCard(ctx, 'ROUND CLEAR!', '#2fa84f', [
    { text: result ? result.sceneTitle : '', bold: true },
    { text: result ? `Time left ${result.timeLeft}s  -  time bonus +${result.bonus}` : '' },
    { text: result ? `Misses this round: ${result.misses}` : '' },
    { text: `Score so far: ${state.score}` },
  ], 'NEXT PICTURE  (Enter)');
}

function drawOverOverlay(ctx, state) {
  drawOverlayCard(ctx, 'TIME UP!', COLOURS.wrongMark, [
    { text: state.currentScene().title, bold: true },
    { text: `${state.remainingCount()} differences were still hiding.` },
    { text: `Found ${state.totalFound} in total  -  Score ${state.score}` },
    { text: 'Sharpen those eyes and go again!' },
  ], 'TRY AGAIN  (Enter)');
}

function drawWinOverlay(ctx, state) {
  ctx.fillStyle = 'rgba(11,13,26,0.66)';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  fillRoundRect(ctx, 300, 176, 680, 428, 22, '#f6ead2');
  drawText(ctx, 'YOU FOUND THEM ALL!', VIEW_WIDTH / 2, 238, 'bold 40px sans-serif', '#2fa84f', 'center');
  const stars = state.starRating();
  for (let index = 0; index < 3; index += 1) {
    drawStarShape(ctx, 590 + index * 50, 288, 20, index < stars ? COLOURS.gold : '#d8cbb0');
  }
  drawText(ctx, `Final score  ${state.score}`, VIEW_WIDTH / 2, 340, 'bold 26px sans-serif', '#2b2118', 'center');
  state.roundResults.forEach((result, index) => {
    drawText(
      ctx,
      `${result.sceneTitle}  -  misses ${result.misses}, bonus +${result.bonus}`,
      VIEW_WIDTH / 2, 382 + index * 30, '17px sans-serif', '#5a4c38', 'center',
    );
  });
  drawText(ctx, `Total misses ${state.totalMisses}  -  hints left ${state.hintsLeft}`, VIEW_WIDTH / 2, 486, '17px sans-serif', '#5a4c38', 'center');
  fillRoundRect(ctx, PRIMARY_BUTTON.x, PRIMARY_BUTTON.y, PRIMARY_BUTTON.width, PRIMARY_BUTTON.height, 14, COLOURS.hudAccent);
  drawText(ctx, 'PLAY AGAIN  (Enter)', VIEW_WIDTH / 2, PRIMARY_BUTTON.y + PRIMARY_BUTTON.height / 2 + 1, 'bold 24px sans-serif', '#ffffff', 'center');
}

export function drawGame(ctx, state, cursor, timeSeconds) {
  const background = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  background.addColorStop(0, COLOURS.pageTop);
  background.addColorStop(1, COLOURS.pageBottom);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  drawHud(ctx, state);
  drawPanel(ctx, state, PANEL_LEFT_X, false, timeSeconds);
  drawPanel(ctx, state, PANEL_RIGHT_X, true, timeSeconds);
  drawFoundMarkers(ctx, state, PANEL_LEFT_X, timeSeconds);
  drawFoundMarkers(ctx, state, PANEL_RIGHT_X, timeSeconds);
  drawHintPulse(ctx, state, PANEL_LEFT_X, timeSeconds);
  drawHintPulse(ctx, state, PANEL_RIGHT_X, timeSeconds);
  drawWrongMarks(ctx, state, PANEL_LEFT_X, 0);
  drawWrongMarks(ctx, state, PANEL_RIGHT_X, 1);
  drawMessageBar(ctx, state);

  if (state.screen === SCREEN_PLAY) drawMagnifier(ctx, cursor);
  if (state.screen === SCREEN_TITLE) drawTitleOverlay(ctx, state);
  if (state.screen === SCREEN_CLEAR) drawClearOverlay(ctx, state);
  if (state.screen === SCREEN_OVER) drawOverOverlay(ctx, state);
  if (state.screen === SCREEN_WIN) drawWinOverlay(ctx, state);
}
