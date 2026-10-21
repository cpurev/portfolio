import { SeaRenderer } from "./renderer.js";
import { Sea } from "./sea.js";

const STEP = 1 / 60;
const MAX_STEPS = 4;

/* Wires Sea + SeaRenderer to a canvas: fixed-timestep loop, resize,
   pointer input, pausing when hidden, and prefers-reduced-motion. */
export class SeaEngine {
  constructor(canvas, { mode = "glyph" } = {}) {
    this.canvas = canvas;
    this.sea = new Sea();
    this.renderer = new SeaRenderer(canvas);
    this.renderer.mode = mode;
    this.renderer.setFontFamily(getComputedStyle(canvas).fontFamily);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.raf = 0;
    this.last = 0;
    this.acc = 0;
    this.visible = true;
    this.disposed = false;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(canvas);

    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("pointermove", this.onPointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", this.onPointerDown, {
      passive: true,
    });
    document.documentElement.addEventListener(
      "pointerleave",
      this.onPointerLeave
    );
    window.addEventListener("blur", this.onPointerLeave);

    this.resize();
    // Canvas text can't trigger a webfont load; redraw once the face is in.
    document.fonts?.load(`500 16px ${this.renderer.fontFamily}`).then(() => {
      if (!this.disposed && this.reducedMotion.matches) this.drawStill();
    });
    this.schedule();
  }

  setMode(mode) {
    this.renderer.setMode(mode);
    if (this.reducedMotion.matches) this.drawStill();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    document.documentElement.removeEventListener(
      "pointerleave",
      this.onPointerLeave
    );
    window.removeEventListener("blur", this.onPointerLeave);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.sea.resize(rect.width, rect.height);
    this.renderer.resize(rect.width, rect.height, dpr);
    if (this.reducedMotion.matches) this.drawStill();
  }

  schedule() {
    cancelAnimationFrame(this.raf);
    const hidden = !this.visible || document.hidden;
    if (this.disposed || hidden || this.reducedMotion.matches) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  frame = (now) => {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.acc += dt;
    let steps = 0;
    while (this.acc >= STEP && steps < MAX_STEPS) {
      this.sea.step(STEP);
      this.acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;
    this.renderer.render(this.sea, dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  /* Reduced motion: let the sea settle, then show a single frame. */
  drawStill() {
    if (this.sea.time < 4) {
      for (let i = 0; i < 240; i++) {
        this.sea.step(STEP);
        this.renderer.render(this.sea, STEP);
      }
    }
    this.renderer.render(this.sea, STEP);
  }

  onMotionPreference = () => {
    if (this.reducedMotion.matches) {
      cancelAnimationFrame(this.raf);
      this.drawStill();
    } else {
      this.schedule();
    }
  };

  onVisibility = () => this.schedule();

  toLocal(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {
      x,
      y,
      inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
    };
  }

  onPointerMove = (e) => {
    const { x, y, inside } = this.toLocal(e);
    const p = this.sea.pointer;
    p.x = x;
    p.y = y;
    p.active = inside && e.pointerType !== "touch";
  };

  onPointerDown = (e) => {
    const { x, y, inside } = this.toLocal(e);
    if (inside && !this.reducedMotion.matches) this.sea.gust(x, y);
  };

  onPointerLeave = () => {
    this.sea.pointer.active = false;
  };
}
