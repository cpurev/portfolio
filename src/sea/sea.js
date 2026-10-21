import {
  TAU,
  angleDiff,
  clamp,
  noise,
  rand,
  smoothstep,
  wind,
} from "./math.js";

/* The simulation, in CSS pixels. Rendering lives in renderer.js.

   A jellyfish is a bell plus strands. The bell pulses — a quick squeeze,
   then a slow relax — and each squeeze shoves it along its heading, so it
   swims in little surges and tilts and twirls as it steers. Strands are
   verlet ropes pinned to the bell rim: they trail, sway and curl on their
   own, which is where most of the fine detail comes from. */

const JELLY_COUNT = 5;
const MIN_RADIUS = 32; // px, bell half-width
const MAX_RADIUS = 62;
const THRUST = 240; // px/s gained over one full squeeze
const SINK = 9; // px/s² — jellies slowly sink between pulses
const DRAG = 1.1;
const WANDER = 0.06; // how quickly each jelly's preferred heading drifts
const CURRENT = 0.35; // how much the shared current carries everything
const STRAND_GRAVITY = 45; // px/s²
const GUST_RANGE = 320;

/* Pulse shape over one period: quick contraction, slow relaxation. */
const squeezeAt = (p) =>
  p < 0.22 ? smoothstep(0, 0.22, p) : 1 - smoothstep(0.22, 1, p);

/* Bell geometry for the current pulse: half-width, height, and axes. */
export function bellOf(j) {
  const s = j.squeeze;
  return {
    W: j.r * (1 - 0.2 * s),
    H: j.r * 0.85 * (1 + 0.22 * s),
    ux: Math.sin(j.angle), // "up" out of the bell's crown
    uy: -Math.cos(j.angle),
    px: Math.cos(j.angle), // across the bell
    py: Math.sin(j.angle),
  };
}

/* Where a strand is pinned: tentacles on the rim, arms under the centre. */
function anchorOf(j, s, b, out) {
  const across = s.u * b.W * 0.92;
  const along = s.arm ? b.H * 0.12 : -b.H * 0.04;
  out.x = j.x + b.px * across + b.ux * along;
  out.y = j.y + b.py * across + b.uy * along;
  return out;
}

const makeStrand = (j, u, nodes, seg, arm) => {
  const pts = new Float32Array(nodes * 2);
  for (let k = 0; k < nodes; k++) {
    pts[k * 2] = j.x + u * j.r * 0.9;
    pts[k * 2 + 1] = j.y + k * seg;
  }
  return {
    u,
    pts,
    prev: pts.slice(),
    seg,
    arm,
    wave: rand(0, TAU),
    freq: rand(0.8, 1.3),
  };
};

const makeJelly = (i, width, height) => {
  const r = rand(MIN_RADIUS, MAX_RADIUS);
  const j = {
    x: ((i + rand(0.2, 0.8)) / JELLY_COUNT) * width,
    y: rand(0.2, 0.85) * height,
    r,
    angle: rand(-0.4, 0.4),
    spin: 0,
    vx: 0,
    vy: 0,
    phase: rand(0, 1),
    period: rand(1.9, 2.9),
    squeeze: 0,
    startle: 0,
    seed: i * 71.3 + rand(0, 100),
    // Far jellies are smaller-feeling, paler and slower: a little parallax.
    depth: rand(0.6, 1),
    tint: i,
    strands: [],
  };
  const tentacles = Math.round(rand(6, 10));
  const seg = r * rand(0.16, 0.22);
  for (let k = 0; k < tentacles; k++) {
    const u = (k / (tentacles - 1)) * 2 - 1 + rand(-0.05, 0.05);
    j.strands.push(makeStrand(j, u, Math.round(rand(16, 24)), seg, false));
  }
  for (let k = 0; k < 4; k++) {
    const u = (k / 3) * 2 - 1;
    j.strands.push(
      makeStrand(j, u * 0.3, Math.round(rand(8, 11)), seg * 1.1, true)
    );
  }
  return j;
};

export class Sea {
  constructor() {
    this.jellies = [];
    this.time = 0;
    this.width = 0;
    this.height = 0;
    this.pointer = { x: 0, y: 0, active: false };
    this.jets = []; // water pushed out by each pulse, for the renderer
    this.gusts = [];
    this.flow = { x: 0, y: 0 };
    this.anchor = { x: 0, y: 0 };
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    if (this.jellies.length) return;
    for (let i = 0; i < JELLY_COUNT; i++) {
      this.jellies.push(makeJelly(i, width, height));
    }
  }

  step(dt) {
    const t = (this.time += dt);
    for (const j of this.jellies) this.swim(j, t, dt);
    for (const j of this.jellies) this.trail(j, t, dt);
  }

  swim(j, t, dt) {
    const { flow, pointer, width, height } = this;

    // Pulse. A startled jelly pulses faster for a while.
    const before = j.squeeze;
    j.phase = (j.phase + (dt / j.period) * (1 + j.startle * 1.8)) % 1;
    j.squeeze = squeezeAt(j.phase);
    j.startle *= Math.exp(-dt * 0.7);
    const ds = j.squeeze - before;
    const b = bellOf(j);
    if (ds > 0) {
      const push = THRUST * ds * (0.6 + 0.4 * j.depth);
      j.vx += b.ux * push;
      j.vy += b.uy * push;
      // Each squeeze also nudges the spin a little: the wobble of a real swimmer.
      j.spin += (noise(t * 0.7, j.seed + 9) - 0.5) * ds * 6;
      if (before < 0.02) {
        this.jets.push({
          x: j.x - b.ux * b.H * 0.2,
          y: j.y - b.uy * b.H * 0.2,
          dx: -b.ux,
          dy: -b.uy,
          r: j.r,
        });
      }
    }
    j.vy += SINK * dt;
    const drag = Math.exp(-DRAG * dt);
    j.vx *= drag;
    j.vy *= drag;

    // Steering: a wandering preferred heading, mostly upward…
    let target = (noise(t * WANDER, j.seed) - 0.5) * 2.6;
    // …away from the side walls…
    if (j.x < j.r * 2) target += 0.8;
    else if (j.x > width - j.r * 2) target -= 0.8;
    // …and away from the cursor, pulsing faster when it gets close.
    if (pointer.active) {
      const dx = j.x - pointer.x;
      const dy = j.y - pointer.y;
      const d = Math.hypot(dx, dy) || 1;
      const reach = j.r * 4;
      if (d < reach) {
        const away = Math.atan2(dx, -dy);
        target += angleDiff(target, away) * (1 - d / reach);
        j.startle = Math.max(j.startle, (1 - d / reach) * 0.6);
      }
    }
    // Personal space.
    for (const o of this.jellies) {
      if (o === j) continue;
      const dx = j.x - o.x;
      const dy = j.y - o.y;
      const d = Math.hypot(dx, dy) || 1;
      const min = (j.r + o.r) * 1.6;
      if (d < min) {
        const push = ((min - d) / min) * 30 * dt;
        j.vx += (dx / d) * push;
        j.vy += (dy / d) * push;
      }
    }
    j.spin += (angleDiff(j.angle, target) * 1.4 - j.spin * 1.6) * dt;
    j.angle += j.spin * dt;

    wind(j.x, j.y, t, flow);
    j.x += (j.vx + flow.x * CURRENT) * dt;
    j.y += (j.vy + flow.y * CURRENT) * dt;
    const ox = j.x;
    const oy = j.y;

    // Leave through the top, come back from below (and side to side).
    const m = j.r * 5; // room for the tentacles
    if (j.y < -m) j.y = height + m;
    else if (j.y > height + m) j.y = -m;
    if (j.x < -m) j.x = width + m;
    else if (j.x > width + m) j.x = -m;
    const jumpX = j.x - ox;
    const jumpY = j.y - oy;
    if (jumpX || jumpY) {
      for (const s of j.strands) {
        for (let k = 0; k < s.pts.length; k += 2) {
          s.pts[k] += jumpX;
          s.prev[k] += jumpX;
          s.pts[k + 1] += jumpY;
          s.prev[k + 1] += jumpY;
        }
      }
    }
  }

  /* Verlet strands: inertia, gravity, a travelling sway, length constraints. */
  trail(j, t, dt) {
    const b = bellOf(j);
    const dt2 = dt * dt;
    for (const s of j.strands) {
      const { pts, prev, seg } = s;
      const n = pts.length / 2;
      const a = anchorOf(j, s, b, this.anchor);
      pts[0] = prev[0] = a.x;
      pts[1] = prev[1] = a.y;
      // Arms ripple slowly and widely; tentacles flick faster near the tip.
      const freq = (s.arm ? 1.4 : 2.2) * s.freq;
      const amp = s.arm ? 420 : 560;
      for (let k = 1; k < n; k++) {
        const x = k * 2;
        const y = x + 1;
        const vx = (pts[x] - prev[x]) * 0.95;
        const vy = (pts[y] - prev[y]) * 0.95;
        prev[x] = pts[x];
        prev[y] = pts[y];
        const sway = Math.sin(t * freq - k * 0.38 + s.wave) * amp * (k / n);
        pts[x] += vx + b.px * sway * dt2;
        pts[y] += vy + (STRAND_GRAVITY + b.py * sway) * dt2;
      }
      for (let iter = 0; iter < 3; iter++) {
        for (let k = 1; k < n; k++) {
          const x = k * 2;
          const dx = pts[x] - pts[x - 2];
          const dy = pts[x + 1] - pts[x - 1];
          const d = Math.hypot(dx, dy) || 1;
          const diff = (d - seg) / d;
          if (k === 1) {
            pts[x] -= dx * diff;
            pts[x + 1] -= dy * diff;
          } else {
            pts[x] -= dx * diff * 0.5;
            pts[x + 1] -= dy * diff * 0.5;
            pts[x - 2] += dx * diff * 0.5;
            pts[x - 1] += dy * diff * 0.5;
          }
        }
      }
    }
  }

  /* A click: push nearby jellies away and startle them into pulsing. */
  gust(x, y) {
    this.gusts.push({ x, y });
    for (const j of this.jellies) {
      const dx = j.x - x;
      const dy = j.y - y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > GUST_RANGE) continue;
      const f = 1 - d / GUST_RANGE;
      j.vx += (dx / d) * f * 90;
      j.vy += (dy / d) * f * 90;
      j.spin += (Math.random() - 0.5) * f * 4;
      j.startle = clamp(j.startle + f, 0, 1);
    }
  }
}
