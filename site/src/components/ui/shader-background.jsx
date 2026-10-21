// 21st.dev · ShaderBackground "hero anim 1" (Shader Builder, estilo Silk), adaptado para JSX.
// Paleta e intensidade ajustadas para o fundo escuro do portfólio; cursor ativa o redemoinho.
import { useEffect, useRef } from "react";

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;
#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w
float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.0, 9.2); a *= 0.5; }
  return v;
}
vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n) col = mix(col, u_colors[i + 1], smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}
vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return palette(0.5 + 0.5 * sin(q.x + q.y));
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;
  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    float cursorDistance = length(cursorDelta);
    cursorMask = u_cursorPresence * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
    float cursorAngle = cursorMask * u_cursorStrength * 2.2;
    float cc = cos(cursorAngle), cs = sin(cursorAngle);
    p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
  }
  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  p += u_offset;
  if (u_drift > 0.0001) p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) p += u_warp * (vec2(fbm(p * u_detail + u_seed), fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur; float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else { col = shade(uv, p, u_time); }
  if (abs(u_contrast - 1.0) > 0.0001) col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_brightness) > 0.0001) col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_grain > 0.0001) col += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const PALETTE = ["#07080d", "#1b1f6e", "#3d46e8", "#b18cff", "#e9d9ff"].map(hex);
while (PALETTE.length < 8) PALETTE.push(PALETTE[PALETTE.length - 1]);

const U = {
  colorCount: 5, scale: 1.35, intensity: 0.55, paramA: 0.5, warp: 0.18, detail: 2.4,
  contrast: 1.0, brightness: -0.2, saturation: 1, hue: 0, vignette: 0.62, blur: 0.012,
  grain: 0.045, seed: 1, rotate: 0, offsetX: 0, offsetY: 0, drift: 0.12,
  cursorEnabled: true, cursorEffect: 2, cursorStrength: 0.65, cursorRadius: 0.46, timeScale: 0.28,
};

export function ShaderBackground({ className }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    gl.deleteShader(vs); gl.deleteShader(fs); gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const g = (n) => gl.getUniformLocation(program, n);
    const uni = { colors: g("u_colors"), scene: g("u_scene"), shape: g("u_shape"), surface: g("u_surface"), finish: g("u_finish"), transform: g("u_transform"), space: g("u_space"), cursor: g("u_cursor") };
    gl.uniform3fv(uni.colors, new Float32Array(PALETTE.flat()));
    gl.uniform4f(uni.shape, U.scale, U.intensity, U.paramA, U.warp);
    gl.uniform4f(uni.surface, U.detail, U.contrast, U.brightness, U.saturation);
    gl.uniform4f(uni.finish, U.hue, U.vignette, U.blur, U.grain);
    gl.uniform4f(uni.transform, U.seed, U.rotate, U.drift, 0);

    let tx = 0, ty = 0, tp = 0, mx = 0, my = 0, cp = 0, raf = 0, last = null, inView = true, disposed = false;
    let bounds = canvas.getBoundingClientRect();
    const start = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rw = Math.max(1, Math.round(bounds.width * dpr)), rh = Math.max(1, Math.round(bounds.height * dpr));
      const k = Math.min(1, Math.sqrt(1600000 / Math.max(1, rw * rh)));
      const w = Math.max(1, Math.round(rw * k)), h = Math.max(1, Math.round(rh * k));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const request = () => { if (!disposed && inView && raf === 0) raf = requestAnimationFrame(render); };
    const onMove = (e) => {
      bounds = canvas.getBoundingClientRect();
      const inside = e.clientX >= bounds.left && e.clientX <= bounds.right && e.clientY >= bounds.top && e.clientY <= bounds.bottom;
      if (!inside) { tp = 0; request(); return; }
      tx = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      ty = -(((e.clientY - bounds.top) / bounds.height) * 2 - 1);
      if (tp === 0 && cp < 0.01) { mx = tx; my = ty; }
      tp = 1; request();
    };
    const onLeave = () => { tp = 0; request(); };
    const layout = () => { bounds = canvas.getBoundingClientRect(); resize(); request(); };
    window.addEventListener("resize", layout);
    if (U.cursorEnabled) { window.addEventListener("pointermove", onMove, { passive: true }); document.documentElement.addEventListener("pointerleave", onLeave); }
    const ro = new ResizeObserver(layout); ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { inView = en?.isIntersecting ?? true; if (inView) request(); else if (raf) { cancelAnimationFrame(raf); raf = 0; last = null; } });
    io.observe(canvas);
    function render(now) {
      raf = 0;
      if (disposed || !inView) return;
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      const f = 1 - Math.exp(-12 * dt);
      mx += (tx - mx) * f; my += (ty - my) * f; cp += (tp - cp) * f;
      resize();
      const t = reduce ? 4 : ((now - start) / 1000) * U.timeScale;
      gl.uniform4f(uni.scene, canvas.width, canvas.height, t, U.colorCount);
      gl.uniform4f(uni.space, U.offsetX, U.offsetY, mx, my);
      gl.uniform4f(uni.cursor, U.cursorEnabled ? cp : 0, U.cursorEffect, U.cursorStrength, U.cursorRadius);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) request();
    }
    request();
    return () => {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteBuffer(buf); gl.deleteProgram(program);
    };
  }, []);
  return <canvas ref={canvasRef} className={className} style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true" />;
}
