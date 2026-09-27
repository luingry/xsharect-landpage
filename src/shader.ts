// Liquid hero background: domain-warped fbm rendered at low resolution
// (the CSS blur hides the upscale), pointer-reactive, paused off-screen.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uEnergy;
uniform float uDim;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.055;

  // pointer lens: a soft bulge that pushes the liquid around the cursor
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec2 d = p - m;
  float lens = exp(-dot(d, d) * 5.0) * uEnergy;
  p -= d * lens * 0.45;

  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p * 1.6 + 3.2 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.6 + 3.2 * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(p * 1.2 + 3.6 * r);

  vec3 ink    = vec3(0.043, 0.039, 0.035);
  vec3 umber  = vec3(0.20, 0.085, 0.05);
  vec3 terra  = vec3(0.878, 0.439, 0.247);
  vec3 amber  = vec3(0.94, 0.64, 0.41);
  vec3 plum   = vec3(0.24, 0.07, 0.10);

  vec3 col = mix(ink, umber, smoothstep(0.15, 0.75, f));
  col = mix(col, plum, smoothstep(0.35, 0.9, length(q)) * 0.55);
  col = mix(col, terra, smoothstep(0.55, 0.95, r.x * f * 1.6) * 0.85);
  col = mix(col, amber, smoothstep(0.78, 1.0, f * r.y * 1.9) * 0.6);
  col += terra * lens * 0.18;

  // keep the left (copy side) and bottom calmer
  float calm = smoothstep(0.0, 0.75, uv.x) * 0.55 + 0.45;
  col *= mix(0.55, 1.0, calm) * (0.35 + 0.65 * smoothstep(0.0, 0.5, uv.y));
  col = mix(ink, col, uDim);
  gl_FragColor = vec4(col, 1.0);
}
`;

export class LiquidShader {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private visible = true;
  private start = performance.now();
  private mouse = { x: 0.7, y: 0.55, tx: 0.7, ty: 0.55, e: 0, te: 0 };
  dim = 1;

  static create(canvas: HTMLCanvasElement, opts: { scale?: number; still?: boolean; interactive?: boolean } = {}) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return null;
    return new LiquidShader(canvas, gl, opts);
  }

  private constructor(
    private canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    private opts: { scale?: number; still?: boolean; interactive?: boolean },
  ) {
    this.gl = gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    this.prog = gl.createProgram()!;
    gl.attachShader(this.prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(this.prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(this.prog);
    gl.useProgram(this.prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uRes", "uTime", "uMouse", "uEnergy", "uDim"]) this.u[n] = gl.getUniformLocation(this.prog, n);

    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible && !opts.still) this.loop();
    }).observe(canvas);

    if (opts.interactive) {
      const host = canvas.parentElement!;
      host.addEventListener("pointermove", (ev) => {
        const r = canvas.getBoundingClientRect();
        this.mouse.tx = (ev.clientX - r.left) / r.width;
        this.mouse.ty = 1 - (ev.clientY - r.top) / r.height;
        this.mouse.te = 1;
      });
      host.addEventListener("pointerleave", () => (this.mouse.te = 0));
    }
    opts.still ? this.frame() : this.loop();
  }

  private resize() {
    const s = this.opts.scale ?? 0.4;
    const w = Math.max(1, Math.round(this.canvas.clientWidth * s));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * s));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
      if (this.opts.still) this.frame();
    }
  }

  private frame() {
    const { gl, u, mouse: m } = this;
    m.x += (m.tx - m.x) * 0.045;
    m.y += (m.ty - m.y) * 0.045;
    m.e += (m.te - m.e) * 0.03;
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, this.opts.still ? 40 : (performance.now() - this.start) / 1000 + 40);
    gl.uniform2f(u.uMouse, m.x, m.y);
    gl.uniform1f(u.uEnergy, m.e);
    gl.uniform1f(u.uDim, this.dim);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private loop = () => {
    cancelAnimationFrame(this.raf);
    if (!this.visible) return;
    this.frame();
    this.raf = requestAnimationFrame(this.loop);
  };
}
