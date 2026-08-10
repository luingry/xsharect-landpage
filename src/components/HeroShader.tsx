import { useEffect, useRef } from "react";
import "./HeroShader.css";

const vertexSource = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
const fragmentSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  float bands(vec2 p, float time) {
    return sin(p.x * 2.25 + time * .24) * .52 + sin(p.x * 5.1 - p.y * 1.9 - time * .16) * .28 + sin((p.x + p.y) * 3.35 + time * .11) * .2;
  }
  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float wave = bands(p, u_time);
    float strata = smoothstep(.14, .88, .5 + .5 * sin(wave * 5.1 + p.y * 4.3));
    float veil = smoothstep(1.45, -.15, length(p - vec2(.42, -.18)));
    vec3 tone = mix(vec3(.102, .091, .071), vec3(.43, .19, .075), strata * veil * .30);
    tone += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - .5) * .012;
    gl_FragColor = vec4(tone, .90);
  }
`;

type Resources = {
  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  program: WebGLProgram;
  vertex: WebGLShader;
  fragment: WebGLShader;
};

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let frame = 0;
    let last = 0;
    let active = !document.hidden;
    let visible = true;
    let disposed = false;
    let resources: Resources | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let render: ((now: number) => void) | undefined;

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const release = () => {
      if (!resources) return;
      const { gl, buffer, program, vertex, fragment } = resources;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      resources = undefined;
    };
    const start = () => {
      stop();
      resizeObserver?.disconnect();
      release();
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      if (!gl) return;
      const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) {
        vertex && gl.deleteShader(vertex);
        fragment && gl.deleteShader(fragment);
        return;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        return;
      }
      const buffer = gl.createBuffer();
      const position = gl.getAttribLocation(program, "a_position");
      const resolution = gl.getUniformLocation(program, "u_resolution");
      const time = gl.getUniformLocation(program, "u_time");
      if (!buffer || position < 0 || !resolution || !time) {
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        buffer && gl.deleteBuffer(buffer);
        return;
      }
      resources = { gl, buffer, program, vertex, fragment };
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        canvas.width = Math.min(
          1600,
          Math.max(1, Math.floor(rect.width * dpr)),
        );
        canvas.height = Math.min(
          900,
          Math.max(1, Math.floor(rect.height * dpr)),
        );
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      render = (now) => {
        if (disposed || !active || !visible || document.hidden || !resources)
          return;
        frame = requestAnimationFrame(render!);
        if (now - last < 33) return;
        last = now;
        gl.useProgram(program);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, now * 0.001);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      if (active && visible) frame = requestAnimationFrame(render);
    };
    const updateActivity = () => {
      active = !document.hidden;
      if (active && visible && !frame && render)
        frame = requestAnimationFrame(render);
      if (!active) stop();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
    };
    const onContextRestored = () => {
      if (!disposed) start();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && active && !frame && render)
          frame = requestAnimationFrame(render);
        if (!visible) stop();
      },
      { threshold: 0.08 },
    );

    start();
    observer.observe(canvas);
    document.addEventListener("visibilitychange", updateActivity);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resizeObserver?.disconnect();
      release();
      document.removeEventListener("visibilitychange", updateActivity);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-shader" aria-hidden="true" />;
}
