/** Song lantern markets V4: generated illustration plates, world-anchored lighting.
 * await loadBackdrops() before entering the game. No remote assets/dependencies.
 */
const TAU = Math.PI * 2;
const WORLD_WIDTH = 2700;
const WORLD_LEFT = -180;
const plates = [
  { file: 'imperial-market.png', curb: .732, sky: '#142d39', floor: '#726a63',
    lights: [[.025,.39],[.065,.386],[.221,.405],[.302,.409],[.438,.410],[.571,.404],[.879,.407],[.986,.409]],
    steam: [[.355,.505],[.963,.508],[.199,.536]] },
  { file: 'temple-riverside.png', curb: .688, sky: '#123846', floor: '#756d66',
    lights: [[.025,.220],[.235,.216],[.365,.409],[.451,.252],[.477,.258],[.605,.203],[.633,.242],[.901,.248],[.944,.26]],
    steam: [[.976,.562],[.485,.543]] },
  { file: 'plum-moon-garden.png', curb: .697, sky: '#203747', floor: '#858487',
    lights: [[.059,.245],[.083,.307],[.343,.342],[.367,.347],[.695,.435],[.753,.430],[.816,.426],[.904,.440],[.937,.441]],
    steam: [[.750,.535]] },
];
const images = new Array(3);
let loading = null;
let failed = null;
const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

export async function loadBackdrops() {
  if (images.every(Boolean) && images.length === 3 && images[0]) return { loaded: 3, worldWidth: WORLD_WIDTH };
  if (loading) return loading;
  failed = null;
  loading = Promise.all(plates.map((plate, index) => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => { images[index] = image; resolve(image); };
    image.onerror = () => reject(new Error(`灯市背景未能载入：${plate.file}`));
    image.src = new URL(`./assets/${plate.file}`, import.meta.url).href;
  }))).then(() => ({ loaded: 3, worldWidth: WORLD_WIDTH })).catch(error => {
    failed = error;
    loading = null;
    throw error;
  });
  return loading;
}

export function backdropStatus() {
  return { loaded: images.filter(Boolean).length, error: failed?.message || null, worldWidth: WORLD_WIDTH };
}

function oval(c, x, y, rx, ry, fill) {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = fill; c.fill();
}

/** Shared foreground/cutscene lantern API; warm silk, thin ink and bamboo ribs. */
export function lantern(c, x, y, scale = 1, color = '#ffc16a', time = 0) {
  c.save(); c.translate(x, y); c.rotate(Math.sin(time * 1.35 + x * .007) * .027); c.scale(scale, scale);
  c.lineWidth = 1.25; c.strokeStyle = '#584432';
  c.beginPath(); c.moveTo(0, -59); c.lineTo(0, -32); c.stroke();
  const halo = c.createRadialGradient(0, 0, 5, 0, 0, 60);
  halo.addColorStop(0, '#ffd18c42'); halo.addColorStop(1, '#ffd18c00');
  oval(c, 0, 0, 62, 68, halo);
  const body = c.createLinearGradient(-24, 0, 25, 0);
  body.addColorStop(0, '#a5532f'); body.addColorStop(.19, color); body.addColorStop(.48, '#fff1bc'); body.addColorStop(.8, color); body.addColorStop(1, '#b45c35');
  oval(c, 0, 0, 24, 33, body);
  c.strokeStyle = '#6e422bd0'; c.lineWidth = 1.4; c.stroke();
  c.lineWidth = .8; c.strokeStyle = '#aa693e9c';
  for (const rib of [6, 14, 21]) { c.beginPath(); c.ellipse(0, 0, rib, 31, 0, 0, TAU); c.stroke(); }
  for (const yy of [-23, 21]) { c.beginPath(); c.ellipse(0, yy, 16.5, 4.2, 0, 0, TAU); c.stroke(); }
  c.fillStyle = '#5f402c'; c.fillRect(-12, -34, 24, 4); c.fillRect(-12, 30, 24, 4);
  c.fillStyle = '#e4b975'; c.fillRect(-9, -32, 18, 1); c.fillRect(-9, 31, 18, 1);
  c.strokeStyle = '#deae62'; c.lineWidth = 1;
  for (let i = -4; i <= 4; i += 2) { c.beginPath(); c.moveTo(i, 34); c.quadraticCurveTo(i + Math.sin(time * 1.7) * 2, 45, i - Math.sin(time * 1.7) * 3, 56); c.stroke(); }
  c.fillStyle = '#845032'; c.fillRect(-5, 36, 10, 4);
  c.restore();
}

function glow(c, x, y, radius, alpha, cool = false) {
  const light = c.createRadialGradient(x, y, 1, x, y, radius);
  light.addColorStop(0, cool ? `rgba(174,242,226,${alpha})` : `rgba(255,197,116,${alpha})`);
  light.addColorStop(.35, cool ? `rgba(124,223,210,${alpha * .4})` : `rgba(250,157,83,${alpha * .4})`);
  light.addColorStop(1, 'rgba(250,185,104,0)');
  c.fillStyle = light; c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function drawSteam(c, x, y, time, index, scale) {
  c.save(); c.lineWidth = 1.6 * scale;
  for (let p = 0; p < 3; p++) {
    const phase = (time * .23 + p * .31 + index * .13) % 1;
    const rise = phase * 58 * scale;
    const sway = Math.sin(time * 1.2 + phase * 8 + p) * 5 * scale;
    c.strokeStyle = `rgba(240,221,189,${Math.sin(phase * Math.PI) * .20})`;
    c.beginPath(); c.moveTo(x + p * 5 * scale + sway, y - rise);
    c.bezierCurveTo(x - 7 * scale + sway, y - rise - 8 * scale, x + 10 * scale + sway, y - rise - 18 * scale, x + 2 * scale + sway, y - rise - 30 * scale);
    c.stroke();
  }
  c.restore();
}

function drawAmbient(c, { w, h, camera, time, ground, stage, top, artHeight, tileOffset, mirror }) {
  const plate = plates[stage];
  const sx = value => tileOffset + (mirror ? 1 - value : value) * WORLD_WIDTH - camera;
  c.save(); c.globalCompositeOperation = 'screen';
  plate.lights.forEach(([x, y], i) => {
    const px = sx(x); if (px < -100 || px > w + 100) return;
    glow(c, px, top + artHeight * y, 34 + Math.sin(time * .9 + i) * 2, .065 + Math.sin(time * 1.3 + i * 2.1) * .012);
  });
  c.restore();
  plate.steam.forEach(([x, y], i) => {
    const px = sx(x); if (px > -70 && px < w + 70) drawSteam(c, px, top + artHeight * y, time, i, 1.05);
  });
  // Fine, drifting embers stay above the playable floor and never cover faces.
  c.save();
  const count = stage === 2 ? 24 : 13;
  for (let i = 0; i < count; i++) {
    const worldX = (i * 211.371 + Math.sin(time * .2 + i) * 17) % WORLD_WIDTH;
    const x = tileOffset + worldX - camera;
    if (x < -20 || x > w + 20) continue;
    const y = ground - 155 - ((i * 43.83 + time * (stage === 2 ? 7 : 3)) % Math.min(450, ground - 120));
    const alpha = .12 + Math.sin(time * .8 + i) * .08;
    if (stage === 2) {
      c.save(); c.translate(x, y); c.rotate(time * .23 + i); oval(c, 0, 0, 2.8, 1.1, `rgba(255,204,209,${alpha + .2})`); c.restore();
    } else oval(c, x, y, 1.1, 1.5, `rgba(255,221,159,${alpha})`);
  }
  c.restore();
}

export function drawBackdrop(c, { width: w, height: h, camera = 0, stage = 0, time = 0, ground = h * .86 } = {}) {
  stage = Math.max(0, Math.min(2, Math.trunc(stage) || 0));
  camera = Number.isFinite(camera) ? camera : 0;
  time = reducedMotion ? 0 : Number(time) || 0;
  ground = Number.isFinite(ground) ? ground : h * .86;
  const plate = plates[stage];
  const sky = c.createLinearGradient(0, 0, 0, Math.max(1, ground));
  sky.addColorStop(0, plate.sky); sky.addColorStop(1, stage === 2 ? '#6b7681' : '#596265');
  c.fillStyle = sky; c.fillRect(0, 0, w, h);
  const image = images[stage];
  if (!image) {
    if (!loading && !failed) loadBackdrops().catch(() => {});
    c.fillStyle = plate.floor; c.fillRect(0, ground - 105, w, h - ground + 105);
    return;
  }
  const iw = image.naturalWidth || image.width, ih = image.naturalHeight || image.height;
  const artHeight = WORLD_WIDTH * ih / iw;
  const rearY = ground - 105;
  const curbPixel = Math.round(ih * plate.curb);
  const upperHeight = artHeight * curbPixel / ih;
  const top = rearY - upperHeight;
  const startTile = Math.floor((camera - WORLD_LEFT) / WORLD_WIDTH);
  const endTile = Math.floor((camera + w - WORLD_LEFT) / WORLD_WIDTH);
  for (let tile = startTile; tile <= endTile; tile++) {
    const tileOffset = WORLD_LEFT + tile * WORLD_WIDTH;
    const dx = tileOffset - camera;
    const mirror = Math.abs(tile % 2) === 1;
    c.save();
    if (mirror) { c.translate(dx + WORLD_WIDTH, 0); c.scale(-1, 1); } else c.translate(dx, 0);
    // Architecture keeps its natural aspect ratio. Only empty pavement stretches
    // vertically, so its rear edge and every gameplay foot share stable coordinates.
    c.drawImage(image, 0, 0, iw, curbPixel, 0, top, WORLD_WIDTH, upperHeight);
    c.drawImage(image, 0, curbPixel, iw, ih - curbPixel, 0, rearY, WORLD_WIDTH, Math.max(1, h - rearY));
    c.restore();
    drawAmbient(c, { w, h, camera, time, ground, stage, top, artHeight, tileOffset, mirror });
  }
  // A very light unified foot-plane shadow separates active actors from stalls.
  const lane = c.createLinearGradient(0, rearY, 0, h);
  lane.addColorStop(0, '#102d3010'); lane.addColorStop(.38, '#102d3000'); lane.addColorStop(1, '#10232b10');
  c.fillStyle = lane; c.fillRect(0, rearY, w, Math.max(1, h - rearY));
}
