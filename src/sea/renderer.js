import { bellOf } from "./sea.js";
import { clamp, hash3, smoothstep } from "./math.js";

/* Draws the Sea as a grid of cells on white:
     1. a faint cell grid
     2. a water field stirred by pulses, clicks and the cursor, drawn as wisps
     3. jellyfish rasterised cell by cell: tinted, translucent bells with a
        ruffled rim and four inner rings, over glyph-traced tentacles
   In "alpha" mode every cell instead shows its alpha as a number 0–255. */

const TINTS = [
  [217, 119, 87], // coral
  [132, 94, 214], // violet
  [38, 146, 160], // teal
  [214, 84, 128], // rose
  [60, 64, 80], // ink
];
const LEVELS = 24; // quantised alphas, so fillStyle strings are prebuilt

// Sparse glyphs where the bell is thin and clear, dense ones at its rim.
const RAMP = ".:;+=tSX8#";
const EDGE = ".'`,";
const RINGS = "o@0%";
const FRILL = "S%&~";
const WISP = "·-~";

const NONE = 0;
const TENTACLE = 1;
const ARM = 2;
const EDGE_CELL = 3;
const BELL = 4;
const RING = 5;

const SUBSAMPLES = [0.25, 0.3, 0.75, 0.3, 0.25, 0.72, 0.75, 0.72];
const FLOOR = 0.04; // resting alpha of empty cells in alpha mode
const RING_SPEED = 260; // px per second, click ripples
const RING_LIFE = 1.3;

/* Glyph for a strand segment by its direction (screen y points down). */
function strandGlyph(dx, dy) {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ay > ax * 2.2) return "|";
  if (ax > ay * 2.2) return "-";
  return dx * dy > 0 ? "\\" : "/";
}

export class SeaRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.bg = document.createElement("canvas");
    this.mode = "glyph";
    this.fontFamily = '"IBM Plex Mono", monospace';
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.cw = 9;
    this.ch = 13;
    this.cols = 0;
    this.rows = 0;
    this.rings = [];
    // styles[tint][level] → "rgba(...)"
    this.styles = TINTS.map(([r, g, b]) => {
      const list = [];
      for (let l = 0; l < LEVELS; l++) {
        list.push(`rgba(${r},${g},${b},${(l / (LEVELS - 1)).toFixed(3)})`);
      }
      return list;
    });
    this.allocate(0, 0);
  }

  allocate(cols, rows) {
    const n = cols * rows;
    this.val = new Float32Array(n);
    this.flag = new Uint8Array(n);
    this.tint = new Uint8Array(n);
    this.key = new Uint32Array(n);
    this.glyph = new Array(n).fill("");
    this.energy = new Float32Array(n);
    this.energyTmp = new Float32Array(n);
    this.cols = cols;
    this.rows = rows;
  }

  setFontFamily(family) {
    if (family) this.fontFamily = family;
  }

  setMode(mode) {
    this.mode = mode;
    if (this.width) this.resize(this.width, this.height, this.dpr);
  }

  resize(width, height, dpr) {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    if (this.mode === "alpha") {
      this.cw = this.ch = 18; // square cells wide enough for three digits
    } else {
      this.cw = clamp(Math.round(width / 150), 7, 11);
      this.ch = Math.round(this.cw * 1.45);
    }
    this.allocate(Math.ceil(width / this.cw), Math.ceil(height / this.ch));
    this.canvas.width = this.bg.width = Math.round(width * dpr);
    this.canvas.height = this.bg.height = Math.round(height * dpr);
    this.paintBackground();
  }

  paintBackground() {
    const g = this.bg.getContext("2d");
    const { width: W, height: H, dpr, cw, ch } = this;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, W * dpr, H * dpr);
    if (this.mode === "alpha") return; // cells draw their own squares
    g.strokeStyle = "rgba(0,0,0,0.05)";
    g.lineWidth = 1;
    g.beginPath();
    for (let c = 0; c <= this.cols; c++) {
      const x = Math.round(c * cw * dpr) + 0.5;
      g.moveTo(x, 0);
      g.lineTo(x, H * dpr);
    }
    for (let r = 0; r <= this.rows; r++) {
      const y = Math.round(r * ch * dpr) + 0.5;
      g.moveTo(0, y);
      g.lineTo(W * dpr, y);
    }
    g.stroke();
  }

  render(sea, dt) {
    if (!this.cols) return;
    const { ctx, dpr } = this;
    const t = sea.time;

    this.val.fill(0);
    this.flag.fill(NONE);
    // Far jellies first, so nearer ones paint over them.
    const order = sea.jellies.map((j, id) => ({ j, id }));
    order.sort((a, b) => a.j.depth - b.j.depth);
    for (const { j, id } of order) {
      for (const s of j.strands) this.rasterStrand(j, s);
      this.rasterBell(j, id, t);
    }
    this.stir(sea, dt);
    this.diffuse(dt);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (this.mode === "alpha") this.drawAlpha();
    else this.drawGlyphs(t);
  }

  // ── jellies → cells ───────────────────────────────────────────────

  put(i, flag, v, tint, glyph) {
    if (flag < this.flag[i] || (flag === this.flag[i] && v < this.val[i])) {
      return;
    }
    this.flag[i] = flag;
    this.val[i] = v;
    this.tint[i] = tint;
    this.glyph[i] = glyph;
  }

  rasterStrand(j, s) {
    const { cols, rows, cw, ch } = this;
    const { pts } = s;
    const n = pts.length / 2;
    const pale = 0.55 + 0.45 * j.depth;
    const tint = j.tint % TINTS.length;
    for (let k = 0; k < n - 1; k++) {
      const x0 = pts[k * 2];
      const y0 = pts[k * 2 + 1];
      const dx = pts[k * 2 + 2] - x0;
      const dy = pts[k * 2 + 3] - y0;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (cw * 0.5)));
      const f = k / (n - 1); // 0 at the bell, 1 at the tip
      for (let q = 0; q < steps; q++) {
        const x = x0 + (dx * q) / steps;
        const y = y0 + (dy * q) / steps;
        const c = Math.floor(x / cw);
        const r = Math.floor(y / ch);
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        const i = r * cols + c;
        if (s.arm) {
          // Frilly oral arms: a dense core with a ruffle that wanders sideways.
          const key = (hash3(k, q, j.seed) * 4294967296) >>> 0;
          this.put(
            i,
            ARM,
            (0.6 - 0.25 * f) * pale,
            tint,
            FRILL[key % FRILL.length]
          );
          const side = Math.sin(k * 1.3 + s.wave) > 0 ? 1 : -1;
          if (c + side >= 0 && c + side < cols) {
            this.put(i + side, TENTACLE, 0.3 * pale, tint, "~");
          }
        } else {
          const glyph = f > 0.8 ? (q % 2 ? "." : ":") : strandGlyph(dx, dy);
          this.put(i, TENTACLE, (0.75 - 0.55 * f) * pale, tint, glyph);
        }
      }
    }
  }

  rasterBell(j, id, t) {
    const { cols, rows, cw, ch, val, flag, tint, key, glyph } = this;
    const b = bellOf(j);
    const reach = Math.max(b.W, b.H) * 1.15;
    const c0 = Math.max(0, Math.floor((j.x - reach) / cw));
    const c1 = Math.min(cols - 1, Math.floor((j.x + reach) / cw));
    const r0 = Math.max(0, Math.floor((j.y - reach) / ch));
    const r1 = Math.min(rows - 1, Math.floor((j.y + reach) / ch));
    const pale = 0.55 + 0.45 * j.depth;
    const ti = j.tint % TINTS.length;

    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        let hits = 0;
        let shade = 0;
        let ring = 0;
        let across = 0;
        let along = 0;
        for (let k = 0; k < SUBSAMPLES.length; k += 2) {
          const dx = col * cw + SUBSAMPLES[k] * cw - j.x;
          const dy = row * ch + SUBSAMPLES[k + 1] * ch - j.y;
          across = dx * b.px + dy * b.py;
          along = dx * b.ux + dy * b.uy;
          const u = across / b.W;
          const v = along / b.H;
          // Dome over a concave underside, with a margin that ripples.
          const ruffle = v < 0.3 ? 0.06 * Math.sin(u * 11 + t * 4 + j.seed) : 0;
          const e = u * u + v * v + ruffle;
          const under = 0.28 * (1 - u * u) - 0.08;
          if (e > 1 || v < under) continue;
          hits++;
          // Clear in the middle, denser toward the rim and the underside.
          shade +=
            0.24 +
            0.45 * smoothstep(0.55, 1, e) +
            0.25 * smoothstep(0.18, 0, v - under) +
            0.12 * j.squeeze -
            (v > 0.55 && u < -0.1 ? 0.08 : 0); // highlight on the crown
          // Four horseshoe gonads around the centre of the bell.
          const gx = u;
          const gy = v - 0.42;
          const rho = Math.hypot(gx, gy * 1.2);
          if (
            Math.abs(rho - 0.26) < 0.09 &&
            Math.cos(4 * Math.atan2(gy, gx)) > 0.2
          ) {
            ring++;
          }
        }
        if (!hits) continue;
        const i = row * cols + col;
        const cov = hits / 4;
        const v = clamp((shade / hits) * pale, 0, 1);
        const fl = cov < 0.5 ? EDGE_CELL : ring >= 2 ? RING : BELL;
        // A soft edge never erases a (farther) bell already drawn here.
        if (fl === EDGE_CELL && flag[i] >= BELL) continue;
        flag[i] = fl;
        val[i] = fl === RING ? Math.max(v, 0.55 * pale) : v;
        tint[i] = ti;
        // Texture key in the bell's own frame, so it travels and turns with it.
        key[i] =
          (hash3(Math.round(across / cw), Math.round(along / ch), id) *
            4294967296) >>>
          0;
        glyph[i] = "";
      }
    }
  }

  // ── water field ───────────────────────────────────────────────────

  stamp(x, y, radius, amount) {
    const { cols, rows, cw, ch, energy } = this;
    const c0 = Math.floor(x / cw);
    const r0 = Math.floor(y / ch);
    for (let r = r0 - radius; r <= r0 + radius; r++) {
      for (let c = c0 - radius; c <= c0 + radius; c++) {
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        const d = Math.hypot(c - c0, (r - r0) * 1.4);
        if (d > radius + 0.5) continue;
        const i = r * cols + c;
        energy[i] = Math.min(1.5, energy[i] + amount * (1 - d / (radius + 1)));
      }
    }
  }

  stir(sea, dt) {
    // Each pulse fires a short jet of water out of the bell.
    for (const jet of sea.jets) {
      for (let k = 1; k <= 4; k++) {
        const d = jet.r * 0.45 * k;
        this.stamp(jet.x + jet.dx * d, jet.y + jet.dy * d, 1, 0.7 - k * 0.1);
      }
    }
    sea.jets.length = 0;
    if (sea.pointer.active) this.stamp(sea.pointer.x, sea.pointer.y, 1, 4 * dt);

    for (const g of sea.gusts) this.rings.push({ x: g.x, y: g.y, age: 0 });
    sea.gusts.length = 0;
    this.rings = this.rings.filter((ring) => (ring.age += dt) < RING_LIFE);
    for (const ring of this.rings) this.stampRing(ring);
  }

  stampRing({ x, y, age }) {
    const { cols, rows, cw, ch, energy } = this;
    const radius = age * RING_SPEED;
    const amount = 0.5 * (1 - age / RING_LIFE);
    const c0 = Math.max(0, Math.floor((x - radius - cw) / cw));
    const c1 = Math.min(cols - 1, Math.floor((x + radius + cw) / cw));
    const r0 = Math.max(0, Math.floor((y - radius - ch) / ch));
    const r1 = Math.min(rows - 1, Math.floor((y + radius + ch) / ch));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const d = Math.hypot((c + 0.5) * cw - x, (r + 0.5) * ch - y);
        if (Math.abs(d - radius) < cw * 0.9) {
          const i = r * cols + c;
          energy[i] = Math.min(1.5, energy[i] + amount);
        }
      }
    }
  }

  /* Blur + decay, so the water's wisps spread out and fade. */
  diffuse(dt) {
    const { cols, rows, energy, energyTmp: tmp } = this;
    const decay = Math.exp(-dt * 1.3);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const e = energy[i];
        const l = c > 0 ? energy[i - 1] : e;
        const rt = c < cols - 1 ? energy[i + 1] : e;
        const u = r > 0 ? energy[i - cols] : e;
        const d = r < rows - 1 ? energy[i + cols] : e;
        tmp[i] = (e * 4 + l + rt + u + d) * 0.125 * decay;
      }
    }
    this.energy = tmp;
    this.energyTmp = energy;
  }

  // ── drawing ───────────────────────────────────────────────────────

  style(tint, a) {
    return this.styles[tint][
      clamp(Math.round(a * (LEVELS - 1)), 0, LEVELS - 1)
    ];
  }

  drawGlyphs(t) {
    const { ctx, cols, rows, cw, ch, val, flag, tint, key, glyph, energy } =
      this;
    ctx.font = `500 ${Math.round(ch * 0.74)}px ${this.fontFamily}`;
    const INK = TINTS.length - 1;
    const n = cols * rows;
    for (let i = 0; i < n; i++) {
      const fl = flag[i];
      const x = (i % cols) * cw;
      const y = ((i / cols) | 0) * ch;
      const mx = x + cw / 2;
      const my = y + ch / 2 + 1;
      const v = val[i];
      const ti = tint[i];

      if (fl === BELL || fl === RING) {
        const k = key[i];
        // Translucent: a light tinted block, then a glyph.
        ctx.fillStyle = this.style(ti, v * 0.85);
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
        const roll = hash3(k, Math.floor(t * 2 + (k % 997) / 97), 7);
        let g;
        if (fl === RING) g = RINGS[(k >>> 8) % RINGS.length];
        else {
          const jitter = ((k >>> 4) % 3) - 1;
          g =
            RAMP[
              clamp(Math.floor(v * RAMP.length) + jitter, 0, RAMP.length - 1)
            ];
        }
        if (roll < 0.05) ctx.fillStyle = "#ffffff";
        else if (fl === RING || v > 0.5)
          ctx.fillStyle = "rgba(255,255,255,0.8)";
        else ctx.fillStyle = this.style(ti, 0.9);
        ctx.fillText(g, mx, my);
      } else if (fl === EDGE_CELL) {
        ctx.fillStyle = this.style(ti, 0.35 + v * 0.4);
        ctx.fillText(EDGE[(key[i] >>> 8) % EDGE.length], mx, my);
      } else if (fl === ARM) {
        ctx.fillStyle = this.style(ti, v * 0.35);
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
        ctx.fillStyle = this.style(ti, 0.95);
        ctx.fillText(glyph[i], mx, my);
      } else if (fl === TENTACLE) {
        ctx.fillStyle = this.style(ti, clamp(v + 0.15, 0, 1));
        ctx.fillText(glyph[i], mx, my);
      } else {
        const e = energy[i];
        if (e < 0.06) continue;
        ctx.fillStyle = this.style(INK, clamp(e * 0.8, 0, 0.55));
        ctx.fillText(WISP[e > 0.55 ? 2 : e > 0.28 ? 1 : 0], mx, my);
      }
    }
  }

  drawAlpha() {
    const { ctx, cols, rows, cw, ch, val, flag, tint, energy } = this;
    const size = cw - 1;
    ctx.font = `500 ${Math.floor((size * 0.9) / 1.8)}px ${this.fontFamily}`;
    const INK = TINTS.length - 1;
    const n = cols * rows;
    for (let i = 0; i < n; i++) {
      const body = flag[i] ? val[i] : 0;
      const wisp = clamp(energy[i] * 0.5, 0, 0.3);
      const a = clamp(FLOOR + Math.max(body, wisp), 0, 1);
      const x = (i % cols) * cw;
      const y = ((i / cols) | 0) * ch;
      ctx.fillStyle = this.style(flag[i] ? tint[i] : INK, a);
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = a > 0.5 ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.45)";
      ctx.fillText(Math.round(a * 255), x + size / 2, y + size / 2 + 0.5);
    }
  }
}
