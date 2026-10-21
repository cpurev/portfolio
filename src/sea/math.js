export const TAU = Math.PI * 2;

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

export const rand = (lo, hi) => lo + Math.random() * (hi - lo);

export function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/* Integer hash → [0, 1). Deterministic, so per-cell textures stay stable. */
export function hash3(x, y, z) {
  let h =
    Math.imul(x | 0, 374761393) ^
    Math.imul(y | 0, 668265263) ^
    Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const ease = (t) => t * t * (3 - 2 * t);

/* Smooth value noise in [0, 1). */
export function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = ease(x - xi);
  const v = ease(y - yi);
  const a = hash3(xi, yi, 0);
  const b = hash3(xi + 1, yi, 0);
  const c = hash3(xi, yi + 1, 0);
  const d = hash3(xi + 1, yi + 1, 0);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/* Three octaves of noise, roughly [0, 0.875]. */
export function fbm(x, y) {
  return (
    noise(x, y) * 0.5 +
    noise(x * 2.1, y * 2.1) * 0.25 +
    noise(x * 4.3, y * 4.3) * 0.125
  );
}

const K1 = 1 / 340;
const K2 = 1 / 260;
const K3 = 1 / 210;
const WIND_SCALE = 2600;

/* Divergence-free wind: the curl of a slowly drifting stream function
   ψ = sin(A)·cos(B) + 0.6·sin(C). With no sources or sinks it swirls the
   jellyfish around without herding them all into one corner. */
export function wind(x, y, t, out) {
  const A = x * K1 + t * 0.05;
  const B = y * K2 - t * 0.04;
  const C = (x - y) * K3 + t * 0.08;
  // u = ∂ψ/∂y, v = −∂ψ/∂x
  out.x =
    (-K2 * Math.sin(A) * Math.sin(B) - 0.6 * K3 * Math.cos(C)) * WIND_SCALE;
  out.y =
    -(K1 * Math.cos(A) * Math.cos(B) + 0.6 * K3 * Math.cos(C)) * WIND_SCALE;
  return out;
}

/** Shortest signed angle from a to b, in (−π, π]. */
export function angleDiff(a, b) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}
