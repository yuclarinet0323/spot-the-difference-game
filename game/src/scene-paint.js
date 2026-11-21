// Painters for the three Twin Views scenes. Each painter draws one picture
// panel (600x520) twice over: `isChanged` false paints the original, true
// paints the version carrying that scene's differences. Everything is drawn
// with canvas shapes only - no images, no fonts, no network - and the small
// `timeSeconds` wobble (drifting clouds, twinkling stars) is cosmetic only:
// difference locations never move.

import { pickSeededPoints } from './random.js';

function fillCircle(ctx, x, y, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillEllipse(ctx, x, y, radiusX, radiusY, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}

function fillRect(ctx, x, y, width, height, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
}

function fillRoundRect(ctx, x, y, width, height, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function strokeLine(ctx, points, width, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]);
  ctx.stroke();
}

function drawCloud(ctx, x, y, scale, fill) {
  fillEllipse(ctx, x, y, 34 * scale, 17 * scale, fill);
  fillEllipse(ctx, x - 22 * scale, y + 5 * scale, 22 * scale, 12 * scale, fill);
  fillEllipse(ctx, x + 24 * scale, y + 5 * scale, 24 * scale, 13 * scale, fill);
  fillEllipse(ctx, x + 2 * scale, y - 10 * scale, 20 * scale, 13 * scale, fill);
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

function drawHeart(ctx, x, y, size, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.9);
  ctx.bezierCurveTo(x - size * 1.3, y, x - size * 0.7, y - size, x, y - size * 0.25);
  ctx.bezierCurveTo(x + size * 0.7, y - size, x + size * 1.3, y, x, y + size * 0.9);
  ctx.fill();
}

function drawBird(ctx, x, y, scale, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.4 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

// ---------------------------------------------------------------- seaside

function paintSeasideCafe(ctx, isChanged, timeSeconds) {
  const sky = ctx.createLinearGradient(0, 0, 0, 215);
  sky.addColorStop(0, '#7ec8f2');
  sky.addColorStop(1, '#cdeffd');
  fillRect(ctx, 0, 0, 600, 215, sky);
  fillRect(ctx, 0, 215, 600, 120, '#3d9bc4');
  fillRect(ctx, 0, 262, 600, 10, '#57b3d6');
  fillRect(ctx, 0, 305, 600, 8, '#57b3d6');
  fillRect(ctx, 0, 335, 600, 185, '#f4d488');
  fillEllipse(ctx, 90, 345, 120, 10, '#eed07a');
  fillEllipse(ctx, 470, 352, 140, 10, '#eed07a');

  // Sun, top right. Difference: sunglasses on the changed panel.
  fillCircle(ctx, 498, 66, 30, '#ffd94d');
  fillCircle(ctx, 498, 66, 36, 'rgba(255,217,77,0.25)');
  fillCircle(ctx, 488, 60, 3.4, '#2b2118');
  fillCircle(ctx, 508, 60, 3.4, '#2b2118');
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(498, 68, 13, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();
  if (isChanged) {
    fillRoundRect(ctx, 474, 50, 20, 13, 5, '#20242e');
    fillRoundRect(ctx, 502, 50, 20, 13, 5, '#20242e');
    fillRect(ctx, 492, 54, 12, 4, '#20242e');
  }

  // Clouds. Difference: the left-hand cloud is gone on the changed panel.
  const drift = Math.sin(timeSeconds * 0.4) * 4;
  if (!isChanged) drawCloud(ctx, 118 + drift, 58, 1.05, '#ffffff');
  drawCloud(ctx, 292 - drift, 42, 0.8, '#ffffff');
  drawCloud(ctx, 196 + drift, 116, 0.62, '#fdfefe');
  drawBird(ctx, 356, 92, 1, '#33566b');
  drawBird(ctx, 388, 108, 0.8, '#33566b');

  // Sailboat on the left. Difference: sail colour white -> teal.
  strokeLine(ctx, [[96, 236], [96, 300]], 4, '#7a4a21');
  ctx.fillStyle = isChanged ? '#1fb6a6' : '#ffffff';
  ctx.beginPath();
  ctx.moveTo(96, 240);
  ctx.lineTo(96, 292);
  ctx.lineTo(58, 292);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = isChanged ? '#ffffff' : '#ef6f6c';
  ctx.beginPath();
  ctx.moveTo(100, 246);
  ctx.lineTo(100, 292);
  ctx.lineTo(130, 292);
  ctx.closePath();
  ctx.fill();
  fillRoundRect(ctx, 52, 298, 92, 14, 6, '#a05a2c');
  fillRect(ctx, 52, 298, 92, 5, '#c47a3d');

  // A second, distant boat that never changes.
  fillRoundRect(ctx, 486, 282, 56, 9, 4, '#7a4a21');
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.moveTo(512, 244);
  ctx.lineTo(512, 280);
  ctx.lineTo(488, 280);
  ctx.closePath();
  ctx.fill();

  // Ice-cream cart in the middle of the sand.
  fillRoundRect(ctx, 246, 392, 104, 62, 8, '#ef6f6c');
  fillRect(ctx, 246, 392, 104, 14, '#d9534f');
  fillCircle(ctx, 268, 462, 12, '#2b2118');
  fillCircle(ctx, 330, 462, 12, '#2b2118');
  fillCircle(ctx, 268, 462, 5, '#cfd6dd');
  fillCircle(ctx, 330, 462, 5, '#cfd6dd');
  strokeLine(ctx, [[298, 392], [298, 372]], 5, '#a05a2c');
  // Cone and scoops. Difference: top scoop strawberry -> mint.
  ctx.fillStyle = '#e0a458';
  ctx.beginPath();
  ctx.moveTo(284, 356);
  ctx.lineTo(312, 356);
  ctx.lineTo(298, 390);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, 298, 374, 15, '#7a4a21');
  fillCircle(ctx, 298, 356, 14, '#ffd1e8');
  fillCircle(ctx, 298, 348, 13, isChanged ? '#8fe3b0' : '#ff8fb5');
  fillCircle(ctx, 298, 332, 4, '#d93b3b');

  // Beach umbrella and table on the right. Difference: canopy red -> yellow.
  strokeLine(ctx, [[485, 372], [485, 452]], 5, '#7a4a21');
  ctx.fillStyle = isChanged ? '#f2b134' : '#ef6f6c';
  ctx.beginPath();
  ctx.moveTo(424, 378);
  ctx.quadraticCurveTo(485, 322, 546, 378);
  ctx.quadraticCurveTo(515, 364, 485, 378);
  ctx.quadraticCurveTo(455, 364, 424, 378);
  ctx.closePath();
  ctx.fill();
  fillEllipse(ctx, 485, 452, 34, 8, '#ffffff');
  fillRect(ctx, 481, 452, 8, 22, '#7a4a21');
  fillCircle(ctx, 472, 444, 7, '#ff8fb5');
  fillCircle(ctx, 500, 444, 7, '#8fe3ff');

  // The cafe cat, sitting by the umbrella pole. Difference: red cap.
  fillEllipse(ctx, 428, 452, 24, 18, '#5b5f6b');
  fillCircle(ctx, 428, 424, 16, '#6d717e');
  fillEllipse(ctx, 414, 410, 6, 9, '#6d717e');
  fillEllipse(ctx, 442, 410, 6, 9, '#6d717e');
  fillCircle(ctx, 422, 422, 2.8, '#ffffff');
  fillCircle(ctx, 434, 422, 2.8, '#ffffff');
  fillEllipse(ctx, 428, 430, 4, 2.6, '#ff9fb0');
  strokeLine(ctx, [[450, 462], [470, 452], [468, 438]], 6, '#5b5f6b');
  if (!isChanged) {
    ctx.fillStyle = '#d93b3b';
    ctx.beginPath();
    ctx.arc(428, 414, 13, Math.PI, Math.PI * 2);
    ctx.fill();
    fillRect(ctx, 412, 412, 32, 4, '#b02a2a');
  }

  // Starfish on the sand. Difference: it is gone on the changed panel.
  if (!isChanged) drawStarShape(ctx, 176, 462, 17, '#ff8c42');
  fillCircle(ctx, 96, 486, 10, '#ef6f6c');
  fillEllipse(ctx, 96, 478, 13, 6, '#ef6f6c');
  drawStarShape(ctx, 540, 486, 10, '#f6ead2');
  fillEllipse(ctx, 330, 492, 26, 7, '#e8c56d');
}

// ---------------------------------------------------------------- forest

function paintForestCabin(ctx, isChanged, timeSeconds) {
  const sky = ctx.createLinearGradient(0, 0, 0, 330);
  sky.addColorStop(0, '#3c4470');
  sky.addColorStop(1, '#8a6a8e');
  fillRect(ctx, 0, 0, 600, 330, sky);
  fillRect(ctx, 0, 330, 600, 190, '#5d7a43');
  fillEllipse(ctx, 300, 356, 320, 22, '#54703c');

  // Moon, top right. Difference: crescent -> full.
  fillCircle(ctx, 516, 58, 24, '#f6ead2');
  if (!isChanged) fillCircle(ctx, 504, 50, 21, '#464e79');
  fillCircle(ctx, 508, 66, 3, '#e3d3ae');
  fillCircle(ctx, 526, 48, 2.4, '#e3d3ae');

  // Back row of pine trees.
  for (const treeX of [24, 150, 470, 556]) {
    fillRect(ctx, treeX + 12, 210, 10, 60, '#5a3d22');
    ctx.fillStyle = '#2e5941';
    ctx.beginPath();
    ctx.moveTo(treeX - 12, 218);
    ctx.lineTo(treeX + 17, 140);
    ctx.lineTo(treeX + 46, 218);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(treeX - 6, 168);
    ctx.lineTo(treeX + 17, 104);
    ctx.lineTo(treeX + 40, 168);
    ctx.closePath();
    ctx.fill();
  }

  // Cabin body and roof.
  fillRoundRect(ctx, 176, 268, 248, 168, 8, '#9c6b40');
  fillRect(ctx, 176, 300, 248, 10, '#8a5a33');
  fillRect(ctx, 176, 344, 248, 10, '#8a5a33');
  fillRect(ctx, 176, 388, 248, 10, '#8a5a33');
  ctx.fillStyle = '#6e4525';
  ctx.beginPath();
  ctx.moveTo(150, 276);
  ctx.lineTo(300, 176);
  ctx.lineTo(450, 276);
  ctx.closePath();
  ctx.fill();
  fillRect(ctx, 392, 168, 30, 58, '#8a5a33');

  // Chimney smoke. Difference: round puffs -> hearts.
  if (isChanged) {
    drawHeart(ctx, 414, 128, 11, '#f3d9e8');
    drawHeart(ctx, 428, 100, 13, '#f3d9e8');
    drawHeart(ctx, 442, 68, 15, '#f6e3ef');
  } else {
    fillCircle(ctx, 414, 130, 10, '#e8e4da');
    fillCircle(ctx, 428, 102, 13, '#efece4');
    fillCircle(ctx, 444, 70, 16, '#f6f3ec');
  }

  // Window with curtains. Difference: curtain colour blue -> green.
  fillRoundRect(ctx, 192, 240, 76, 76, 6, '#ffe9a8');
  fillRect(ctx, 228, 240, 4, 76, '#7a4a21');
  fillRect(ctx, 192, 274, 76, 4, '#7a4a21');
  const curtain = isChanged ? '#3f9e63' : '#4a7fd9';
  fillRect(ctx, 192, 240, 16, 76, curtain);
  fillRect(ctx, 252, 240, 16, 76, curtain);
  fillCircle(ctx, 216, 292, 7, '#5b5f6b');
  fillEllipse(ctx, 216, 288, 4, 5, '#5b5f6b');

  // Door and porch.
  fillRoundRect(ctx, 316, 300, 62, 136, 8, '#6e4525');
  fillCircle(ctx, 366, 372, 4, '#f2b134');
  fillRect(ctx, 160, 436, 280, 12, '#7a4a21');

  // Porch lantern. Difference: lit warm -> dark and unlit.
  strokeLine(ctx, [[372, 286], [372, 296]], 3, '#2b2118');
  if (isChanged) {
    fillRoundRect(ctx, 362, 296, 20, 26, 5, '#4a4f5c');
    fillRect(ctx, 366, 302, 12, 14, '#2e323d');
  } else {
    fillCircle(ctx, 372, 309, 20, 'rgba(255,190,80,0.35)');
    fillRoundRect(ctx, 362, 296, 20, 26, 5, '#2b2118');
    fillRect(ctx, 366, 302, 12, 14, '#ffbe50');
  }

  // Owl on the left tree branch. Difference: awake -> asleep.
  strokeLine(ctx, [[18, 128], [118, 116]], 8, '#5a3d22');
  fillEllipse(ctx, 92, 112, 19, 24, '#8a6a48');
  fillCircle(ctx, 92, 92, 15, '#a37f56');
  fillEllipse(ctx, 80, 84, 4, 6, '#8a6a48');
  fillEllipse(ctx, 104, 84, 4, 6, '#8a6a48');
  if (isChanged) {
    strokeLine(ctx, [[84, 94], [90, 94]], 2.4, '#2b2118');
    strokeLine(ctx, [[94, 94], [100, 94]], 2.4, '#2b2118');
    ctx.fillStyle = '#f6ead2';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('z', 112, 84);
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('Z', 122, 70);
  } else {
    fillCircle(ctx, 86, 92, 3.4, '#2b2118');
    fillCircle(ctx, 98, 92, 3.4, '#2b2118');
  }
  fillEllipse(ctx, 92, 100, 3.4, 2.4, '#f2b134');

  // Pumpkins on the step. Difference: two pumpkins -> one.
  drawPumpkin(ctx, 272, 446, 21);
  if (!isChanged) drawPumpkin(ctx, 308, 450, 16);
  drawPumpkin(ctx, 428, 452, 13);

  // Mushroom cluster, bottom left. Difference: spots on the big cap.
  fillRect(ctx, 86, 462, 10, 20, '#f6ead2');
  ctx.fillStyle = '#d9534f';
  ctx.beginPath();
  ctx.arc(91, 464, 22, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  if (!isChanged) {
    fillCircle(ctx, 80, 452, 4, '#ffffff');
    fillCircle(ctx, 96, 446, 3.2, '#ffffff');
    fillCircle(ctx, 104, 456, 2.6, '#ffffff');
  }
  fillRect(ctx, 122, 474, 7, 12, '#f6ead2');
  ctx.fillStyle = '#e07a5f';
  ctx.beginPath();
  ctx.arc(125, 476, 13, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // Falling leaves and grass tufts, same on both panels.
  const leafSwing = Math.sin(timeSeconds * 0.8) * 5;
  drawLeaf(ctx, 150 + leafSwing, 210, '#e8913a');
  drawLeaf(ctx, 486 - leafSwing, 250, '#d96f32');
  drawLeaf(ctx, 60 + leafSwing, 330, '#e8b13a');
  for (const grassX of [36, 210, 470, 548]) {
    strokeLine(ctx, [[grassX, 500], [grassX - 5, 482]], 3, '#476636');
    strokeLine(ctx, [[grassX + 8, 500], [grassX + 10, 480]], 3, '#476636');
  }
}

function drawPumpkin(ctx, x, y, radius) {
  fillEllipse(ctx, x, y, radius, radius * 0.82, '#e8913a');
  fillEllipse(ctx, x, y, radius * 0.55, radius * 0.82, '#dd7f2c');
  fillRect(ctx, x - 3, y - radius - 6, 6, 8, '#476636');
}

function drawLeaf(ctx, x, y, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, 10, 5, 0.7, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- festival

const FESTIVAL_STARS = pickSeededPoints(7, 42, 600, 230, 18);

function paintLanternFestival(ctx, isChanged, timeSeconds) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#141a38');
  sky.addColorStop(1, '#2c2a55');
  fillRect(ctx, 0, 0, 600, 470, sky);
  fillRect(ctx, 0, 470, 600, 50, '#232038');
  fillRect(ctx, 0, 462, 600, 8, '#35305a');

  for (const star of FESTIVAL_STARS) {
    const twinkle = 0.55 + 0.45 * Math.sin(timeSeconds * 2 + star.phase);
    ctx.globalAlpha = twinkle;
    fillCircle(ctx, star.x, star.y, 1.7 * star.size, '#f6ead2');
  }
  ctx.globalAlpha = 1;

  // The bright star that can vanish. Difference: present -> gone.
  if (!isChanged) {
    drawStarShape(ctx, 522, 178, 11, '#ffe066');
    fillCircle(ctx, 522, 178, 3, '#fff6cf');
  }
  fillCircle(ctx, 556, 52, 17, '#f6ead2');
  fillCircle(ctx, 548, 46, 14, '#1a2044');

  // Big firework, top left. Difference: magenta burst -> gold burst.
  const burst = isChanged ? '#f2b134' : '#ff6fb5';
  const burstAlt = isChanged ? '#ffd94d' : '#ff9fd0';
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const inner = 12;
    const outer = 34 + (index % 3) * 7;
    strokeLine(ctx, [
      [108 + Math.cos(angle) * inner, 78 + Math.sin(angle) * inner],
      [108 + Math.cos(angle) * outer, 78 + Math.sin(angle) * outer],
    ], 3.4, index % 2 === 0 ? burst : burstAlt);
  }
  fillCircle(ctx, 108, 78, 5, '#ffffff');
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2 + 0.4;
    strokeLine(ctx, [
      [228 + Math.cos(angle) * 6, 52 + Math.sin(angle) * 6],
      [228 + Math.cos(angle) * 20, 52 + Math.sin(angle) * 20],
    ], 2.6, '#8fe3ff');
  }

  // String of lanterns across the top.
  ctx.strokeStyle = '#0e1126';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 84);
  ctx.quadraticCurveTo(300, 148, 600, 84);
  ctx.stroke();
  const lanternXs = [52, 128, 208, 300, 392, 472, 548];
  const lanternColours = ['#ef6f6c', '#f2b134', '#ff8fb5', '#ef6f6c', '#8fe3ff', '#f2b134', '#ff8fb5'];
  lanternXs.forEach((lanternX, index) => {
    const lanternY = 104 + Math.sin((lanternX / 600) * Math.PI) * 22 - (index % 2) * 4;
    drawHangingLantern(ctx, lanternX, lanternY, lanternColours[index], index === 3, isChanged);
  });

  paintGoldfishStall(ctx, isChanged);
  paintBannerStall(ctx, isChanged);
  paintMaskStall(ctx, isChanged);

  // Cotton-candy cart in front of the mask stall. Difference: flavour colour.
  fillRoundRect(ctx, 392, 462, 76, 34, 6, '#7a4a21');
  fillCircle(ctx, 404, 502, 9, '#2b2118');
  fillCircle(ctx, 456, 502, 9, '#2b2118');
  strokeLine(ctx, [[430, 462], [430, 440]], 4, '#e8e4da');
  const floss = isChanged ? '#8fc9ff' : '#ff9fd0';
  fillCircle(ctx, 416, 428, 15, floss);
  fillCircle(ctx, 434, 420, 18, floss);
  fillCircle(ctx, 448, 430, 13, floss);

  // Festival drum, far right. Difference: centre stripe present -> gone.
  fillEllipse(ctx, 540, 452, 26, 30, '#d9534f');
  fillEllipse(ctx, 540, 424, 26, 9, '#f6ead2');
  fillEllipse(ctx, 540, 480, 26, 9, '#e8dcc2');
  if (!isChanged) fillRect(ctx, 515, 446, 50, 10, '#f2b134');
  strokeLine(ctx, [[508, 420], [492, 396]], 4, '#e0a458');
  fillCircle(ctx, 490, 394, 5, '#d93b3b');
}

function drawHangingLantern(ctx, x, y, colour, isTarget, isChanged) {
  strokeLine(ctx, [[x, y - 16], [x, y - 6]], 2.4, '#0e1126');
  fillEllipse(ctx, x, y + 8, 15, 17, colour);
  fillRect(ctx, x - 6, y - 11, 12, 4, '#f2b134');
  fillRect(ctx, x - 6, y + 24, 12, 4, '#f2b134');
  if (isTarget && isChanged) {
    strokeLine(ctx, [[x - 13, y + 2], [x + 13, y + 2]], 2.6, '#ffffff');
    strokeLine(ctx, [[x - 14, y + 9], [x + 14, y + 9]], 2.6, '#ffffff');
    strokeLine(ctx, [[x - 13, y + 16], [x + 13, y + 16]], 2.6, '#ffffff');
  } else if (isTarget) {
    fillCircle(ctx, x - 5, y + 4, 2.4, '#ffffff');
    fillCircle(ctx, x + 5, y + 9, 2.4, '#ffffff');
    fillCircle(ctx, x, y + 15, 2.4, '#ffffff');
  }
}

function paintGoldfishStall(ctx, isChanged) {
  fillRect(ctx, 66, 268, 10, 200, '#7a4a21');
  fillRect(ctx, 224, 268, 10, 200, '#7a4a21');
  ctx.fillStyle = '#d9534f';
  ctx.beginPath();
  ctx.moveTo(52, 272);
  ctx.lineTo(248, 272);
  ctx.lineTo(228, 238);
  ctx.lineTo(72, 238);
  ctx.closePath();
  ctx.fill();
  fillRect(ctx, 52, 268, 196, 8, '#b02a2a');
  // Glass tank with goldfish. Difference: three fish -> two fish.
  fillRoundRect(ctx, 92, 348, 116, 92, 10, '#aee6f5');
  fillRoundRect(ctx, 92, 348, 116, 92, 10, 'rgba(174,230,245,0.55)');
  fillRect(ctx, 92, 420, 116, 20, '#7ec8f2');
  drawGoldfish(ctx, 124, 382, 1, false);
  drawGoldfish(ctx, 152, 414, 0.85, true);
  if (!isChanged) drawGoldfish(ctx, 182, 396, 0.9, false);
  fillEllipse(ctx, 118, 330, 26, 14, '#3f9e63');
  fillEllipse(ctx, 182, 330, 26, 14, '#3f9e63');
}

function drawGoldfish(ctx, x, y, scale, flipped) {
  const direction = flipped ? -1 : 1;
  fillEllipse(ctx, x, y, 13 * scale, 8 * scale, '#ff8c42');
  ctx.fillStyle = '#f2762e';
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale * direction, y);
  ctx.lineTo(x - 22 * scale * direction, y - 8 * scale);
  ctx.lineTo(x - 22 * scale * direction, y + 8 * scale);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, x + 7 * scale * direction, y - 2, 1.8, '#2b2118');
}

function paintBannerStall(ctx, isChanged) {
  fillRect(ctx, 262, 268, 10, 200, '#7a4a21');
  fillRect(ctx, 388, 268, 10, 200, '#7a4a21');
  ctx.fillStyle = '#4a7fd9';
  ctx.beginPath();
  ctx.moveTo(248, 272);
  ctx.lineTo(402, 272);
  ctx.lineTo(382, 238);
  ctx.lineTo(268, 238);
  ctx.closePath();
  ctx.fill();
  // Banner hanging under the awning. Difference: emblem circle -> star.
  fillRoundRect(ctx, 282, 282, 86, 44, 6, '#f6ead2');
  if (isChanged) {
    drawStarShape(ctx, 322, 304, 14, '#d9534f');
  } else {
    fillCircle(ctx, 322, 304, 12, '#d9534f');
    fillCircle(ctx, 322, 304, 6, '#f6ead2');
  }
  fillRect(ctx, 340, 296, 20, 5, '#8a8f9c');
  fillRect(ctx, 340, 308, 20, 5, '#8a8f9c');
  // Lantern-shaped sweets counter.
  fillRoundRect(ctx, 276, 392, 100, 62, 8, '#9c6b40');
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      fillCircle(ctx, 294 + col * 22, 410 + row * 22, 7, ['#ff8fb5', '#ffd94d', '#8fe3b0', '#8fe3ff'][(row * 4 + col) % 4]);
    }
  }
  fillEllipse(ctx, 326, 372, 30, 12, '#ef6f6c');
}

function paintMaskStall(ctx, isChanged) {
  fillRect(ctx, 420, 268, 10, 200, '#7a4a21');
  fillRect(ctx, 566, 268, 10, 200, '#7a4a21');
  ctx.fillStyle = '#3f9e63';
  ctx.beginPath();
  ctx.moveTo(406, 272);
  ctx.lineTo(580, 272);
  ctx.lineTo(560, 238);
  ctx.lineTo(426, 238);
  ctx.closePath();
  ctx.fill();
  fillRoundRect(ctx, 438, 288, 112, 92, 8, '#5a3d22');
  // Fox mask in the middle. Difference: both eyes open -> one wink.
  fillEllipse(ctx, 472, 330, 24, 27, '#f6ead2');
  fillEllipse(ctx, 454, 308, 7, 11, '#f6ead2');
  fillEllipse(ctx, 490, 308, 7, 11, '#f6ead2');
  fillEllipse(ctx, 454, 308, 3.4, 6, '#ff8fb5');
  fillEllipse(ctx, 490, 308, 3.4, 6, '#ff8fb5');
  fillCircle(ctx, 463, 328, 3.4, '#2b2118');
  if (isChanged) {
    strokeLine(ctx, [[477, 328], [485, 328]], 2.6, '#2b2118');
  } else {
    fillCircle(ctx, 481, 328, 3.4, '#2b2118');
  }
  fillEllipse(ctx, 472, 342, 4, 3, '#d9534f');
  // Two plain masks beside it never change.
  fillEllipse(ctx, 516, 322, 13, 16, '#ffd94d');
  fillCircle(ctx, 511, 320, 2.2, '#2b2118');
  fillCircle(ctx, 521, 320, 2.2, '#2b2118');
  fillEllipse(ctx, 450, 366, 11, 13, '#8fe3ff');
  fillRoundRect(ctx, 500, 356, 44, 30, 5, '#9c6b40');
}

// ---------------------------------------------------------------- entry

export function paintScene(ctx, sceneId, isChanged, timeSeconds) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 520);
  ctx.clip();
  if (sceneId === 'forest-cabin') paintForestCabin(ctx, isChanged, timeSeconds);
  else if (sceneId === 'lantern-festival') paintLanternFestival(ctx, isChanged, timeSeconds);
  else paintSeasideCafe(ctx, isChanged, timeSeconds);
  ctx.restore();
}
