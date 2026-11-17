"use client";

/**
 * Hero: the MILLOCOLOR sign gets painted by a spray gun.
 *
 * Same idea as the original hero (a 3D gun sweeping over the name, about two and a half passes per word),
 * rebuilt so the paint is real:
 *  - the letters are solid, bevelled 3D forms in the sign's own typeface;
 *  - they start as matte grey primer; a coverage mask records exactly where spray has landed, and a shader
 *    turns only those places into glossy blue/red enamel;
 *  - the spray is simulated: atomised droplets leave the nozzle in a flat fan, fly on their own (so they trail
 *    naturally when the gun moves) and land on the letter face, leaving a faint overspray mist;
 *  - paint appears where the droplets arrive, a fraction of a second after they leave the gun;
 *  - studio light reflects off the wet paint.
 */

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial, PerspectiveCamera, useGLTF, useProgress } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Bloom, ChromaticAberration, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, BloomEffect, ToneMappingMode, type EffectComposer as PPComposer } from 'postprocessing';
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import * as THREE from 'three';
import gsap from 'gsap';
import TypewriterText from './TypewriterText';
import HeroLoader, { HERO_SECTION_CLASS } from './HeroLoader';
import { generateContactLinks } from '../../../data/contact';

/** The real logo letterforms, traced from public/images/logo_en.png (see scripts/trace-wordmark.md). */
const WORDMARK_URL = '/models/millocolor-wordmark.svg';
const MODEL_URL = '/models/spray_gun.opt.glb';
const LETTER_H = 0.714; // letter height in scene units (the rest of the scene is tuned to this)

const BLUE = '#2c4ea2'; // sampled from public/images/logo_en.png
const RED = '#ed1c24';  // sampled from public/images/logo_en.png
const PRIMER = '#b4b8c1';

const DEPTH = 0.15; // letter thickness
const BEVEL = 0.028;

/** Gun model: nozzle (air cap) position in model space; the model faces -x with the cup on +y. */
const NOZZLE = new THREE.Vector3(-1.46, 2.58, 0);
const GUN_HEIGHT = 1.5; // in text units (cap height of the letters is ~0.71)

interface Run {
  pt: number;      // time along the painter's path (seconds)
  active: number;  // 1 while the gun is on stage
  x: number;       // where the spray is aimed (set from the path each frame)
  y: number;
  rate: number;    // trigger 0..1
  word: number;    // 0 = MILLO, 1 = COLOR
  lv0: number;     // the wet coat levelling out on MILLO / COLOR
  lv1: number;
  finish: number;
  sweep: number;   // gloss sweep across the finished sign
}

/* ------------------------------------------------------------------------------------------------ */
/* The painter's path                                                                                */
/*                                                                                                  */
/* How a sprayer actually moves: the arm is already travelling before the trigger is pulled, each   */
/* stroke runs parallel to the surface at a steady speed, the trigger is pulled as the fan reaches  */
/* the edge of the work and released as it leaves, and the gun swings round just past the edge to  */
/* come back one row lower. Three full coats per word. The path is a chain of cubic Hermite         */
/* segments, so position and velocity are continuous everywhere (no jumps, no sudden stops).        */
/* ------------------------------------------------------------------------------------------------ */
interface Seg {
  t0: number; T: number;
  x0: number; y0: number; vx0: number; vy0: number;
  x1: number; y1: number; vx1: number; vy1: number;
  word: number;
  trig: number;   // 1 = a stroke over the work (trigger pulled, with a short squeeze/release at the ends)
  ramp: number;   // squeeze/release length as a fraction of the stroke
}
interface Path { segs: Seg[]; total: number; end0: number; end1: number }
interface PathSample { x: number; y: number; vx: number; vy: number; rate: number; word: number }

function buildPath(minX: number, maxX: number, split: number, capMid: number, capH: number): Path {
  const v = 3.5;      // stroke speed (text units/s; ~0.5 m/s at sign scale, a real sprayer's pace)
  const m = 0.14;     // the stroke starts/ends this far beyond the edge of the word
  const rows = [0.08, -0.08, 0].map((k) => capMid + k * capH);
  const segs: Seg[] = [];
  let t = 0;
  let cur = { x: minX - 2.6, y: capMid + 1.7 * capH, vx: 0.85 * v, vy: -0.55 * v };
  const to = (x: number, y: number, vx: number, vy: number, T: number, word: number, trig = 0, ramp = 0) => {
    segs.push({ t0: t, T, x0: cur.x, y0: cur.y, vx0: cur.vx, vy0: cur.vy, x1: x, y1: y, vx1: vx, vy1: vy, word, trig, ramp });
    t += T;
    cur = { x, y, vx, vy };
  };
  const coats = (a: number, b: number, word: number, overR: number, mR: number) => {
    const xa = a - m, xb = b + mR;
    const len = xb - xa, Tp = len / v, ramp = Math.min(0.25, 0.12 / len);
    const turnL = (4 * 0.24) / v, turnR = (4 * overR) / v; // a Hermite turn overshoots by T*v/4
    to(xb, rows[0], v, 0, Tp, word, 1, ramp);
    to(xb, rows[1], -v, 0, turnR, word);
    to(xa, rows[1], -v, 0, Tp, word, 1, ramp);
    to(xa, rows[2], v, 0, turnL, word);
    to(xb, rows[2], v, 0, Tp, word, 1, ramp);
  };
  // the arm swings in from the upper left and is already at stroke speed when it reaches the M
  to(minX - m, rows[0], v, 0, 0.95, 0);
  coats(minX, split, 0, 0.26, m);
  const end0 = t;
  // trigger released past the O: ease to a stop, a breath while the colour changes, wind back and go again
  const D = 0.36;
  to(cur.x + D, cur.y + 0.1 * capH, 0, 0, (2 * D) / v, 0);
  to(cur.x - 0.02, cur.y + 0.02 * capH, 0, 0, 0.16, 1);
  to(split - m, rows[0], v, 0, 0.72, 1);
  // the right end of COLOR sits at the edge of the frame: shorter overshoot so the gun stays in view
  coats(split, maxX, 1, 0.1, -0.05);
  const end1 = t;
  to(maxX + 2.9, capMid + 1.5 * capH, 0.8 * v, 0.55 * v, 0.95, 1);
  return { segs, total: t, end0, end1 };
}

function samplePath(path: Path, time: number, out: PathSample) {
  const { segs } = path;
  let i = 0;
  while (i < segs.length - 1 && time >= segs[i].t0 + segs[i].T) i++;
  const g = segs[i];
  const s = THREE.MathUtils.clamp((time - g.t0) / g.T, 0, 1);
  const s2 = s * s, s3 = s2 * s;
  const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
  const d00 = 6 * s2 - 6 * s, d10 = 3 * s2 - 4 * s + 1, d01 = -6 * s2 + 6 * s, d11 = 3 * s2 - 2 * s;
  out.x = h00 * g.x0 + h10 * g.T * g.vx0 + h01 * g.x1 + h11 * g.T * g.vx1;
  out.y = h00 * g.y0 + h10 * g.T * g.vy0 + h01 * g.y1 + h11 * g.T * g.vy1;
  out.vx = (d00 * g.x0 + d10 * g.T * g.vx0 + d01 * g.x1 + d11 * g.T * g.vx1) / g.T;
  out.vy = (d00 * g.y0 + d10 * g.T * g.vy0 + d01 * g.y1 + d11 * g.T * g.vy1) / g.T;
  out.word = g.word;
  if (g.trig) {
    const k = THREE.MathUtils.smoothstep(s, 0, g.ramp) * (1 - THREE.MathUtils.smoothstep(s, 1 - g.ramp, 1));
    out.rate = k;
  } else out.rate = 0;
  return out;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const gauss = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 0.9;

/* ------------------------------------------------------------------------------------------------ */
/* Spray: atomised droplets and overspray mist, rendered as soft points                             */
/* ------------------------------------------------------------------------------------------------ */
const sprayVert = /* glsl */ `
  attribute float aAlpha; attribute float aSize; attribute float aTone;
  uniform float uScale;
  varying float vAlpha; varying float vTone;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    vAlpha = aAlpha;
    vTone = aTone;
    gl_Position = projectionMatrix * mv;
  }
`;
const sprayFrag = /* glsl */ `
  uniform vec3 uBlue; uniform vec3 uRed; uniform float uSoft;
  varying float vAlpha; varying float vTone;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // droplets: small discs with a soft rim; mist: a wide gaussian puff
    float a = mix(1.0 - smoothstep(0.55, 1.0, d), exp(-d * d * 3.2) * (1.0 - smoothstep(0.85, 1.0, d)), uSoft) * vAlpha;
    if (a < 0.004) discard;
    vec3 c = mix(uBlue, uRed, vTone);
    // droplets catch the studio light a little
    c = mix(c, vec3(1.0), (1.0 - uSoft) * 0.08 * (1.0 - d));
    gl_FragColor = vec4(c, a);
  }
`;

/* The atomised cloud: a soft, turbulent fan volume from the air cap to the surface. */
const fanVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vP; varying float vAlong;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vP = position;
    vAlong = 1.0 - uv.y;
    gl_Position = projectionMatrix * mv;
  }
`;
const fanFrag = /* glsl */ `
  uniform float uTime; uniform float uAmt; uniform float uTone; uniform vec3 uBlue; uniform vec3 uRed;
  varying vec3 vN; varying vec3 vV; varying vec3 vP; varying float vAlong;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p){ float a = 0.5, s = 0.0; for(int i=0;i<4;i++){ s += a*noise(p); p *= 2.03; a *= 0.5; } return s; }
  void main() {
    // silhouette edges fade to nothing, so it reads as a volume of mist rather than a solid shape
    float facing = abs(dot(normalize(vN), normalize(vV)));
    float body = smoothstep(0.05, 0.95, facing); body *= body;
    float a = vAlong;
    // a dense, narrow jet right at the air cap that blooms open and thins out; gone where it meets the paint
    float dens = smoothstep(0.0, 0.04, a) * (1.0 / (0.3 + 2.4 * a)) * (1.0 - smoothstep(0.78, 1.0, a));
    vec2 xs = vP.xy / (0.06 + a);           // cross-section coordinates, continuous (no seam)
    vec2 q = vec2(xs.x * 2.2 + xs.y * 0.8, a * 7.0 - uTime * 8.5);
    float n = fbm(q);
    float n2 = fbm(q * 2.3 + vec2(5.2, -uTime * 4.0));
    float turb = 0.35 + 1.1 * n * (0.55 + 0.7 * n2);
    float alpha = body * dens * turb * 0.34 * uAmt;
    vec3 c = mix(uBlue, uRed, uTone);
    c = mix(c, vec3(1.0), 0.1 + 0.2 * (1.0 - smoothstep(0.0, 0.25, a)));
    gl_FragColor = vec4(c, alpha);
  }
`;

const DROP_N = 5200;   // droplet pool (ring buffer)
const MIST_N = 700;    // overspray pool
const SPRAY_DIST = 0.74; // nozzle to surface, text units (about one letter height)
const FLIGHT = 0.075;  // how long droplets take to arrive, so paint shows up when they land

/* ------------------------------------------------------------------------------------------------ */
/* Studio shaders                                                                                    */
/* ------------------------------------------------------------------------------------------------ */
const wallVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const wallFrag = /* glsl */ `
  uniform vec3 uTint; uniform float uGlow; varying vec2 vUv;
  void main() {
    vec2 c = vUv - vec2(0.5, 0.52);
    float r = length(c * vec2(1.0, 1.55));
    vec3 base = mix(vec3(0.030, 0.033, 0.040), vec3(0.006, 0.007, 0.009), smoothstep(0.0, 0.75, r));
    float pool = exp(-r * r * 9.0);
    vec3 col = base + vec3(0.042, 0.044, 0.050) * pool + uTint * pool * uGlow * 0.07;
    col *= 0.55 + 0.45 * smoothstep(0.0, 0.5, vUv.y + 0.15);
    col = mix(vec3(0.0015, 0.0017, 0.002), col, smoothstep(0.19, 0.5, vUv.y));
    gl_FragColor = vec4(col, 1.0);
  }
`;
const softFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uPower; varying vec2 vUv;
  void main() {
    vec2 q = abs(vUv - 0.5) * 2.0;
    float edge = (1.0 - smoothstep(0.55, 1.0, q.x)) * (1.0 - smoothstep(0.2, 1.0, q.y));
    float core = (1.0 - smoothstep(0.75, 0.98, q.x)) * (1.0 - smoothstep(0.3, 0.55, q.y));
    vec3 c = uColor * (edge * 0.35 + core * 1.0) * uPower;
    gl_FragColor = vec4(c, max(edge, core));
  }
`;
const shaftVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const shaftFrag = /* glsl */ `
  uniform float uTime; uniform float uSeed; uniform float uStrength; uniform vec3 uTint; varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
  void main() {
    float edge = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
    float fall = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.1, vUv.y);
    float n = noise(vec2(vUv.x * 3.0 + uSeed, vUv.y * 2.0 - uTime * 0.05)) * 0.7 + noise(vec2(vUv.x * 8.0 - uSeed, vUv.y * 5.0 + uTime * 0.08)) * 0.3;
    float a = pow(edge, 1.6) * fall * (0.35 + n) * uStrength;
    gl_FragColor = vec4(mix(vec3(0.62, 0.70, 0.95), uTint, 0.35) * a, a);
  }
`;
const dustVert = /* glsl */ `
  attribute vec4 aSeed; uniform float uTime; uniform float uScale; varying float vA;
  void main() {
    vec3 p = position;
    float t = uTime * (0.05 + aSeed.x * 0.08);
    p.x += sin(t * 2.0 + aSeed.y * 6.2831) * 0.35;
    p.y += mod(t * 0.9 + aSeed.z * 4.0, 4.0) - 2.0;
    p.z += cos(t * 1.7 + aSeed.w * 6.2831) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = max(1.0, (0.02 + aSeed.x * 0.03) * uScale / -mv.z);
    vA = (0.25 + 0.75 * aSeed.w) * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed.x) + aSeed.y * 40.0));
    gl_Position = projectionMatrix * mv;
  }
`;
const dustFrag = /* glsl */ `
  uniform vec3 uTint; varying float vA;
  void main() { float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA * 0.32; gl_FragColor = vec4(mix(vec3(0.75, 0.82, 1.0), uTint, 0.4), a); }
`;

/* ------------------------------------------------------------------------------------------------ */
/* Wordmark: the logo outlines, extruded and bevelled                                                */
/* ------------------------------------------------------------------------------------------------ */
function useWordmark() {
  const svg = useLoader(SVGLoader, WORDMARK_URL);
  return useMemo(() => {
    // letter height in the SVG's own units, measured from the traced paths
    const pts = svg.paths.flatMap((p) => SVGLoader.createShapes(p)).flatMap((sh) => sh.getPoints());
    let minY = Infinity, maxY = -Infinity;
    for (const p of pts) { if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; }
    const s = LETTER_H / (maxY - minY);

    const parts = svg.paths.map((path) => {
      const g = new THREE.ExtrudeGeometry(SVGLoader.createShapes(path), {
        depth: DEPTH / s,
        bevelEnabled: true,
        bevelThickness: BEVEL / s,
        bevelSize: (BEVEL * 0.8) / s,
        bevelSegments: 6,
        curveSegments: 20,
      });
      g.scale(s, s, s);
      g.rotateX(Math.PI); // SVG is y-down; a rotation (not a mirror) keeps the faces facing out
      g.translate(0, 0, DEPTH);
      g.computeBoundingBox();
      return g;
    });
    const millo = parts[0].boundingBox!.clone();
    const color = parts[1].boundingBox!.clone();
    const merged = mergeGeometries(parts)!;
    merged.computeBoundingBox();
    const bb = merged.boundingBox!.clone();
    merged.translate(-bb.min.x, -bb.min.y, 0);
    merged.computeBoundingBox();
    const split = (millo.max.x + color.min.x) / 2 - bb.min.x;
    parts.forEach((g) => g.dispose());
    return { geometry: merged, box: merged.boundingBox!, split };
  }, [svg]);
}

/* ------------------------------------------------------------------------------------------------ */
/* The scene                                                                                         */
/* ------------------------------------------------------------------------------------------------ */
function Stage({ runId, onReady, onDone, reduceMotion, lite, play }: {
  runId: number;
  onReady: () => void;
  onDone: () => void;
  reduceMotion: boolean;
  lite: boolean;
  play: boolean;
}) {
  const { viewport, size, gl, scene, camera } = useThree();
  const gltf = useGLTF(MODEL_URL);
  const wordmark = useWordmark();
  const debugRect = useMemo(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('heroDebug'), []);

  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const gunRoot = useRef<THREE.Group>(null);
  const dropPts = useRef<THREE.Points>(null);
  const fanMesh = useRef<THREE.Mesh>(null);
  const fanAmt = useRef(0);
  const gunScale = useRef<THREE.Group>(null);
  const mistPts = useRef<THREE.Points>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const floor = useRef<THREE.Mesh>(null);
  const wall = useRef<THREE.Mesh>(null);
  const bars = useRef<THREE.Group>(null);
  const shafts = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const bloom = useRef<BloomEffect | null>(null);
  const composer = useRef<PPComposer | null>(null);
  const tint = useMemo(() => new THREE.Color('#9fb2ff'), []);
  const tintTarget = useMemo(() => new THREE.Color(), []);

  const run = useRef<Run>({ pt: 0, active: 0, x: 0, y: 0, rate: 0, word: 0, lv0: 0, lv1: 0, finish: 0, sweep: 0 });
  const path = useRef<Path | null>(null);
  const sample = useMemo<PathSample>(() => ({ x: 0, y: 0, vx: 0, vy: 0, rate: 0, word: 0 }), []);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const readyFired = useRef(false);
  const [measured, setMeasured] = useState(false);
  const geo = useRef({ minX: 0, maxX: 1, minY: 0, maxY: 1, split: 0.5, ok: false });

  /* ---- coverage mask (canvas -> texture) --------------------------------------------------- */
  const cover = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2560;
    canvas.height = 384;
    const g = canvas.getContext('2d')!;
    g.fillStyle = '#000';
    g.fillRect(0, 0, canvas.width, canvas.height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.NoColorSpace;

    // Spray-fan footprint: soft gaussian across the stroke, flat-topped along the fan, feathered ends.
    const BW = 64, BH = 160;
    const brush = document.createElement('canvas');
    brush.width = BW;
    brush.height = BH;
    const b = brush.getContext('2d')!;
    const img = b.createImageData(BW, BH);
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const u = ((x + 0.5) / BW) * 2 - 1;
        const v = ((y + 0.5) / BH) * 2 - 1;
        const f = Math.exp(-4.5 * u * u) * Math.exp(-Math.pow(Math.abs(v) / 0.72, 6));
        const i = (y * BW + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
        img.data[i + 3] = Math.round(f * 255);
      }
    }
    b.putImageData(img, 0, 0);
    return { canvas, g, tex, brush };
  }, []);

  /* ---- paint material ---------------------------------------------------------------------- */
  const uniforms = useMemo(() => ({
    uCover: { value: cover.tex },
    uBox: { value: new THREE.Vector4(0, 0, 1, 1) },
    uSplit: { value: 0.5 },
    uBlue: { value: new THREE.Color(BLUE) },
    uRed: { value: new THREE.Color(RED) },
    uPrimer: { value: new THREE.Color(PRIMER) },
  }), [cover.tex]);

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.9, metalness: 0.0, envMapIntensity: 0.75, clearcoat: 1, clearcoatRoughness: 0.14, fog: false });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vObj;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj = position;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vObj;
          uniform sampler2D uCover; uniform vec4 uBox; uniform float uSplit;
          uniform vec3 uBlue; uniform vec3 uRed; uniform vec3 uPrimer;
          float gCov;`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          vec2 puv = vec2((vObj.x - uBox.x) / uBox.z, (vObj.y - uBox.y) / uBox.w);
          gCov = texture2D(uCover, puv).r;
          vec3 paintCol = vObj.x < uSplit ? uBlue : uRed;
          diffuseColor.rgb = mix(uPrimer, paintCol, smoothstep(0.0, 1.0, gCov));`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
          roughnessFactor = mix(0.93, 0.32, smoothstep(0.15, 1.0, gCov));`)
        .replace('#include <lights_physical_fragment>', THREE.ShaderChunk.lights_physical_fragment
          .replace('material.clearcoat = clearcoat;', 'material.clearcoat = clearcoat * smoothstep(0.4, 1.0, gCov);'));
    };
    m.customProgramCacheKey = () => 'millo-paint-v2';
    return m;
  }, [uniforms]);

  /* ---- studio ------------------------------------------------------------------------------- */
  const wallMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: wallVert, fragmentShader: wallFrag,
    uniforms: { uTint: { value: new THREE.Color('#9fb2ff') }, uGlow: { value: 0 } },
  }), []);
  const shaftMats = useMemo(() => [0, 1, 2].map((i) => new THREE.ShaderMaterial({
    vertexShader: shaftVert, fragmentShader: shaftFrag,
    uniforms: { uTime: { value: 0 }, uSeed: { value: i * 3.7 }, uStrength: { value: [0.16, 0.1, 0.13][i] }, uTint: { value: new THREE.Color('#9fb2ff') } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  })), []);
  const softMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: wallVert, fragmentShader: softFrag,
    uniforms: { uColor: { value: new THREE.Color(1, 1.04, 1.12) }, uPower: { value: 1.15 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), []);
  const dustData = useMemo(() => {
    const N = lite ? 70 : 140;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = rand(-9, 9);
      pos[i * 3 + 1] = rand(-3, 4);
      pos[i * 3 + 2] = rand(-6, 4);
      seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVert, fragmentShader: dustFrag,
      uniforms: { uTime: { value: 0 }, uScale: { value: 600 }, uTint: { value: new THREE.Color('#9fb2ff') } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return { geom, mat };
  }, [lite]);

  const fanGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(1, 1, 40, 24, true);
    g.translate(0, -0.5, 0); // apex at the origin, base at y = -1
    g.rotateX(Math.PI / 2);  // base at z = -1
    return g;
  }, []);
  const fanMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: fanVert,
    fragmentShader: fanFrag,
    uniforms: {
      uTime: { value: 0 }, uAmt: { value: 0 }, uTone: { value: 0 },
      uBlue: { value: new THREE.Color(BLUE).lerp(new THREE.Color('#6f8fe6'), 0.25) },
      uRed: { value: new THREE.Color(RED).lerp(new THREE.Color('#ff6a6a'), 0.12) },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  /* ---- spray fx: two particle pools simulated on the CPU in the sign's own coordinates ---------- */
  const spray = useMemo(() => {
    const pool = (n: number, soft: number) => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geom.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(n), 1));
      geom.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(n), 1));
      geom.setAttribute('aTone', new THREE.BufferAttribute(new Float32Array(n), 1));
      const mat = new THREE.ShaderMaterial({
        vertexShader: sprayVert,
        fragmentShader: sprayFrag,
        uniforms: {
          uScale: { value: 400 }, uSoft: { value: soft },
          uBlue: { value: new THREE.Color(BLUE).lerp(new THREE.Color('#6f8fe6'), 0.25) },
          uRed: { value: new THREE.Color(RED).lerp(new THREE.Color('#ff6a6a'), 0.12) },
        },
        transparent: true,
        depthWrite: false,
      });
      return {
        n, geom, mat,
        vel: new Float32Array(n * 3),
        age: new Float32Array(n),
        life: new Float32Array(n),   // 0 = free
        base: new Float32Array(n),   // base opacity
        size0: new Float32Array(n),
        size1: new Float32Array(n),
        drag: new Float32Array(n),
        head: 0,
      };
    };
    return { drops: pool(DROP_N, 0), mist: pool(MIST_N, 1), carry: 0, mistCarry: 0 };
  }, []);

  /* ---- geometry is known as soon as the wordmark has loaded ---------------------------------- */
  useLayoutEffect(() => {
    const bb = wordmark.box;
    geo.current = { minX: bb.min.x, maxX: bb.max.x, minY: bb.min.y, maxY: bb.max.y, split: wordmark.split, ok: true };
    uniforms.uBox.value.set(bb.min.x, bb.min.y, bb.max.x - bb.min.x, bb.max.y - bb.min.y);
    uniforms.uSplit.value = wordmark.split;
    setMeasured(true);
  }, [wordmark, uniforms]);

  /* ---- compile every shader while the loader is still up, then report ready ------------------- */
  const framesSinceCompile = useRef(-1);
  useEffect(() => {
    if (!measured) return;
    let cancelled = false;
    const done = () => { if (!cancelled) framesSinceCompile.current = 0; };
    gl.compileAsync(scene, camera).then(done, done);
    return () => { cancelled = true; };
  }, [measured, gl, scene, camera]);

  /* ---- coverage helpers --------------------------------------------------------------------- */
  const toCanvas = useCallback((x: number, y: number) => {
    const g = geo.current;
    return [
      ((x - g.minX) / (g.maxX - g.minX)) * cover.canvas.width,
      (1 - (y - g.minY) / (g.maxY - g.minY)) * cover.canvas.height,
    ] as const;
  }, [cover.canvas]);

  const clearCover = useCallback(() => {
    cover.g.fillStyle = '#000';
    cover.g.fillRect(0, 0, cover.canvas.width, cover.canvas.height);
    cover.tex.needsUpdate = true;
  }, [cover]);

  const fillCover = useCallback(() => {
    cover.g.fillStyle = '#fff';
    cover.g.fillRect(0, 0, cover.canvas.width, cover.canvas.height);
    cover.tex.needsUpdate = true;
  }, [cover]);

  /* ---- the choreography: one timeline drives the painter's path, then the finish -------------- */
  useEffect(() => {
    if (!measured) return;
    tl.current?.kill();
    const r = run.current;
    Object.assign(r, { pt: 0, active: 0, rate: 0, word: 0, lv0: 0, lv1: 0, finish: 0, sweep: 0 });
    if (!play) { clearCover(); return; }

    if (reduceMotion) {
      fillCover();
      r.finish = 1; r.sweep = 1;
      onDone();
      return;
    }
    clearCover();

    const g = geo.current;
    const capH = g.maxY - g.minY;
    const P = buildPath(g.minX, g.maxX, g.split, (g.minY + g.maxY) / 2, capH);
    path.current = P;

    const t = gsap.timeline({ onComplete: onDone });
    tl.current = t;
    if (debugRect) Object.assign(window, { __heroTL: t, __heroRun: r, __heroPath: P, __heroCover: cover.canvas, __heroGun: gunRoot.current });

    t.set(r, { active: 1 }, 0);
    t.to(r, { pt: P.total, duration: P.total, ease: 'none' }, 0);
    t.set(r, { active: 0 }, P.total);
    // each word's wet film levels out once its last coat is on
    t.to(r, { lv0: 1, duration: 0.8, ease: 'sine.inOut' }, P.end0 + 0.1);
    t.to(r, { lv1: 1, duration: 0.8, ease: 'sine.inOut' }, P.end1 + 0.1);
    t.to(r, { finish: 1, duration: 0.6, ease: 'power1.inOut' }, P.end1 + 0.5);
    // a highlight travels across the wet clear-coat once the sign is finished
    t.to(r, { sweep: 1, duration: 1.6, ease: 'power2.inOut' }, P.end1 + 0.55);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, reduceMotion, measured, play]);

  useEffect(() => () => { tl.current?.kill(); }, []);

  /* ---- per-frame update --------------------------------------------------------------------- */
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const tmp = useMemo(() => ({
    d: new THREE.Vector3(), n: new THREE.Vector3(), hit: new THREE.Vector3(),
    right: new THREE.Vector3(), up: new THREE.Vector3(), X: new THREE.Vector3(),
    Y: new THREE.Vector3(), Z: new THREE.Vector3(), m: new THREE.Matrix4(), q: new THREE.Quaternion(),
    cam: new THREE.Vector3(), view: new THREE.Vector3(), off: new THREE.Vector3(),
  }), []);
  const prev = useRef({ x: 0, y: 0, ok: false });
  const clock = useRef(0);
  // where the gun was aiming over the last moments: paint is laid down when the droplets get there
  const hist = useRef<{ t: number; x: number; y: number; rate: number; word: number }[]>([]);
  const hand = useRef({ vx: 0, vy: 0, init: false });
  useEffect(() => {
    hist.current = [];
    prev.current.ok = false;
    hand.current.init = false;
    for (const p of [spray.drops, spray.mist]) { p.life.fill(0); (p.geom.attributes.aAlpha as THREE.BufferAttribute).array.fill(0); }
  }, [runId, spray]);

  useFrame((state, dt0) => {
    const dt = Math.min(dt0, 0.05);
    clock.current += dt;
    const t = clock.current;
    const g = geo.current;
    const grp = group.current;
    if (!grp || !g.ok) return;
    if (debugRect) {
      const v = new THREE.Vector3();
      let x0 = 1, x1 = -1, y0 = 1, y1 = -1;
      for (const [x, y] of [[g.minX, g.minY], [g.maxX, g.minY], [g.minX, g.maxY], [g.maxX, g.maxY]]) {
        v.set(x, y, DEPTH + BEVEL);
        inner.current?.localToWorld(v);
        v.project(state.camera);
        x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
      }
      (window as unknown as { __heroRect: unknown }).__heroRect = {
        left: (x0 + 1) / 2, right: (x1 + 1) / 2, top: (1 - y1) / 2, bottom: (1 - y0) / 2,
      };
    }
    // a couple of real frames after compilation, then the loader may hand over
    if (framesSinceCompile.current >= 0 && !readyFired.current) {
      framesSinceCompile.current += 1;
      if (framesSinceCompile.current > 2) { readyFired.current = true; onReady(); }
    }

    // fit the text to the viewport, whatever its shape (one line, always)
    const textW = g.maxX - g.minX;
    const fit = Math.min((viewport.width * (viewport.width < viewport.height ? 0.94 : 0.9)) / textW, (viewport.height * 0.62) / (g.maxY - g.minY));
    grp.scale.setScalar(fit);
    const portrait = viewport.width < viewport.height;
    const cy = viewport.height * (portrait ? 0.17 : 0.12);
    grp.position.set(0, cy + Math.sin(t * 0.8) * 0.02 * fit, 0);
    // everything inside is in the text's own coordinates; this centres the word on the group's origin
    inner.current?.position.set(-(g.minX + g.maxX) / 2, -(g.minY + g.maxY) / 2, 0);
    // studio layout follows the sign
    const halfH = ((g.maxY - g.minY) * fit) / 2;

    // camera: looking slightly down onto the sign and its reflection; drifts with the pointer on desktop
    const cam = state.camera;
    cam.layers.enable(1);
    const px = lite ? 0 : state.pointer.x;
    const py = lite ? 0 : state.pointer.y;
    const camY = cy + halfH * 2.6;
    cam.position.x += (px * 0.6 - cam.position.x) * 0.04;
    cam.position.y += (camY + py * 0.35 - cam.position.y) * 0.04;
    cam.lookAt(0, cy - halfH * 0.9, 0);
    const floorY = cy - halfH - (g.maxY - g.minY) * fit * 0.04;
    floor.current?.position.set(0, floorY, 2); // spans z -10 (wall) .. +14 (camera)
    if (wall.current) {
      wall.current.position.set(0, floorY + 9, -10);
    }
    if (bars.current) {
      // one large overhead softbox on the back wall
      const sb = bars.current.children[0];
      sb.position.set(0, cy + halfH * 3.4, -9.6);
      sb.scale.set(viewport.width * 1.25, halfH * 1.1, 1);
    }
    shafts.current?.position.set(0, floorY, 0);

    // idle light sweep across the glossy letters
    if (keyLight.current) keyLight.current.position.set(Math.sin(t * 0.45) * 7, 4, 8);

    const r = run.current;
    const capMid = (g.minY + g.maxY) / 2;
    const capH = g.maxY - g.minY;
    const zTop = DEPTH + BEVEL + 0.004; // the letters' front face

    // -- the painter's hand: path position + a faint physiological tremor and a slow body sway --
    const smp = path.current && r.active > 0.5 ? samplePath(path.current, r.pt, sample) : null;
    if (smp) { r.x = smp.x; r.y = smp.y; r.rate = smp.rate; r.word = smp.word; } else { r.rate = 0; }
    const tremX = (Math.sin(t * 9.1) * 0.6 + Math.sin(t * 13.7 + 1.1) * 0.4) * capH * 0.0022;
    const tremY = (Math.sin(t * 8.3 + 2.0) * 0.6 + Math.sin(t * 12.9) * 0.4) * capH * 0.0026;
    const hx = r.x + tremX + Math.sin(t * 0.9 + 1.3) * capH * 0.004;
    const hy = r.y + tremY + Math.sin(t * 0.7) * capH * 0.006;

    // hand velocity, lightly smoothed: the wrist follows the arm
    const hd = hand.current;
    const vxT = smp ? smp.vx : 0, vyT = smp ? smp.vy : 0;
    if (!hd.init) { hd.vx = vxT; hd.vy = vyT; hd.init = true; }
    const kv = 1 - Math.exp(-dt * 10);
    hd.vx += (vxT - hd.vx) * kv;
    hd.vy += (vyT - hd.vy) * kv;

    // -- gun pose --
    // Aimed relative to the camera's line of sight to the spot being painted, then turned towards profile so
    // the nozzle reads clearly; measuring from the sight line keeps the gun's body in frame at both ends of
    // the word. The wrist trails the stroke a little and flicks round at each turn, like a real sprayer.
    grp.updateMatrixWorld();
    inner.current?.worldToLocal(tmp.cam.copy(state.camera.position));
    const view = tmp.view.set(hx, hy, zTop).sub(tmp.cam).normalize();
    const u = THREE.MathUtils.clamp((hx - g.minX) / (g.maxX - g.minX), 0, 1);
    const yaw = THREE.MathUtils.lerp(-0.62, -0.06, u * u * (3 - 2 * u));
    const lean = THREE.MathUtils.clamp(-hd.vx * 0.022, -0.085, 0.085);
    const pitch = THREE.MathUtils.clamp(-hd.vy * 0.03, -0.06, 0.06);
    const d = tmp.d.copy(view).add(tmp.off.set(yaw + lean, -0.12 + pitch, 0)).normalize();
    const nozzle = tmp.n.set(hx - d.x * SPRAY_DIST, hy - d.y * SPRAY_DIST, zTop - d.z * SPRAY_DIST);

    const root = gunRoot.current;
    if (root) {
      // a slight roll with the stroke direction (the forearm rotates as it sweeps)
      tmp.right.crossVectors(d, up).normalize();
      tmp.Y.copy(up).addScaledVector(tmp.right, THREE.MathUtils.clamp(hd.vx * 0.012, -0.05, 0.05));
      tmp.Y.addScaledVector(d, -tmp.Y.dot(d)).normalize();
      tmp.X.copy(d).multiplyScalar(-1);
      tmp.Z.crossVectors(tmp.X, tmp.Y);
      tmp.m.makeBasis(tmp.X, tmp.Y, tmp.Z);
      root.quaternion.setFromRotationMatrix(tmp.m);
      root.position.copy(nozzle);
      root.visible = r.active > 0.5;
      // phones: the sign is small on screen, so the gun is shown a little larger to stay legible
      gunScale.current?.scale.setScalar((GUN_HEIGHT / 5) * (portrait ? 1.25 : 1));
    }

    const gunOn = !!root?.visible;
    const rateNow = gunOn ? r.rate : 0;
    const color = r.word === 0 ? BLUE : RED;

    // -- paint lands on the coverage mask where the droplets arrive (FLIGHT seconds after they left) --
    // Even wet band under the fan; each coat deposits ~67% (1 - e^-1.1), three coats build to full.
    // Paint is kept to the word being sprayed (masking tape between the two colours).
    const W = cover.canvas.width, H = cover.canvas.height;
    const sx = W / (g.maxX - g.minX);
    const splitPx = (g.split - g.minX) * sx;
    const H0 = hist.current;
    H0.push({ t, x: hx, y: hy, rate: rateNow, word: r.word });
    const due = t - FLIGHT;
    while (H0.length > 2 && H0[1].t <= due) H0.shift();
    if (H0.length && H0[0].t <= due) {
      const a0 = H0[0], a1 = H0[1] ?? H0[0];
      const k = a1.t > a0.t ? THREE.MathUtils.clamp((due - a0.t) / (a1.t - a0.t), 0, 1) : 0;
      const px = a0.x + (a1.x - a0.x) * k, py = a0.y + (a1.y - a0.y) * k, pr = a0.rate + (a1.rate - a0.rate) * k;
      if (prev.current.ok && pr > 0.01) {
        const sy = H / capH;
        const fanW = capH * 0.42 * sx;   // across the stroke
        const fanH = capH * 1.5 * sy;    // along the fan: taller than the letters, so no streaks top or bottom
        const step = fanW * 0.1;
        const x0 = (prev.current.x - g.minX) * sx, y0 = (1 - (prev.current.y - g.minY) / capH) * H;
        const x1 = (px - g.minX) * sx, y1 = (1 - (py - g.minY) / capH) * H;
        const dist = Math.hypot(x1 - x0, y1 - y0);
        const n = Math.max(1, Math.ceil(dist / step));
        const alpha = (1 - Math.exp((-1.1 * (dist / n)) / (fanW * 0.42))) * pr;
        const gx = cover.g;
        gx.save();
        gx.beginPath();
        if (a0.word === 0) gx.rect(0, 0, splitPx, H); else gx.rect(splitPx, 0, W - splitPx, H);
        gx.clip();
        gx.globalAlpha = Math.min(1, alpha);
        for (let i = 1; i <= n; i++) {
          const f = i / n;
          gx.drawImage(cover.brush, x0 + (x1 - x0) * f - fanW / 2, y0 + (y1 - y0) * f - fanH / 2, fanW, fanH);
        }
        gx.restore();
        cover.tex.needsUpdate = true;
      }
      prev.current.x = px; prev.current.y = py; prev.current.ok = true;
    }

    // the wet film levels out over each finished word, then over the whole sign
    const level = (k: number, x0: number, x1: number) => {
      if (k <= 0 || k >= 1) return;
      cover.g.fillStyle = `rgba(255,255,255,${Math.min(1, 0.09 * dt * 60 * k)})`;
      cover.g.fillRect(x0, 0, x1 - x0, H);
      cover.tex.needsUpdate = true;
    };
    level(r.lv0, 0, splitPx);
    level(r.lv1, splitPx, W);
    if (r.finish > 0 && r.finish < 1.0001) level(Math.min(0.999, r.finish), 0, W);

    // -- spray --
    // Fan axes: a real air cap makes a flat fan, tall across the stroke direction (vertical here).
    tmp.right.crossVectors(d, up).normalize();
    tmp.up.crossVectors(tmp.right, d).normalize();
    const tone = r.word === 0 ? 0 : 1;

    // the atomised cloud: a soft, turbulent fan from the air cap to the surface
    const fan = fanMesh.current;
    if (fan) {
      fanAmt.current += ((rateNow > 0.01 ? rateNow : 0) - fanAmt.current) * (1 - Math.exp(-dt * 18));
      fan.visible = fanAmt.current > 0.01;
      if (fan.visible) {
        tmp.Z.copy(d).multiplyScalar(-1);
        tmp.m.makeBasis(tmp.right, tmp.up, tmp.Z);
        fan.quaternion.setFromRotationMatrix(tmp.m);
        fan.position.copy(nozzle);
        fan.scale.set(capH * 0.15, capH * 0.6, SPRAY_DIST * 1.005);
        fanMat.uniforms.uTime.value = t;
        fanMat.uniforms.uAmt.value = fanAmt.current;
        fanMat.uniforms.uTone.value += (tone - fanMat.uniforms.uTone.value) * (1 - Math.exp(-dt * 30));
      }
    }

    const drops = spray.drops, mist = spray.mist;
    const spawnMist = (x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, s0: number, s1: number, a: number, drag: number) => {
      const j = mist.head; mist.head = (mist.head + 1) % mist.n;
      const P = mist.geom.attributes.position.array as Float32Array;
      P[j * 3] = x; P[j * 3 + 1] = y; P[j * 3 + 2] = z;
      mist.vel[j * 3] = vx; mist.vel[j * 3 + 1] = vy; mist.vel[j * 3 + 2] = vz;
      mist.age[j] = 0; mist.life[j] = life; mist.size0[j] = s0; mist.size1[j] = s1; mist.base[j] = a; mist.drag[j] = drag;
      (mist.geom.attributes.aTone.array as Float32Array)[j] = tone;
    };

    if (rateNow > 0.01 && !reduceMotion) {
      // droplets: tens of thousands per second while the trigger is pulled, most of them very fine
      spray.carry += rateNow * (lite ? 14000 : 34000) * dt;
      const P = drops.geom.attributes.position.array as Float32Array;
      const T = drops.geom.attributes.aTone.array as Float32Array;
      while (spray.carry >= 1) {
        spray.carry -= 1;
        const j = drops.head; drops.head = (drops.head + 1) % drops.n;
        // flat fan: wide along the air-cap axis, thin across it
        const gu = gauss() * 0.42, gr = gauss() * 0.1;
        let vx = d.x + tmp.up.x * gu + tmp.right.x * gr;
        let vy = d.y + tmp.up.y * gu + tmp.right.y * gr;
        let vz = d.z + tmp.up.z * gu + tmp.right.z * gr;
        const inv = 1 / Math.hypot(vx, vy, vz);
        const sp = rand(8.5, 11.5);
        vx *= inv * sp; vy *= inv * sp; vz *= inv * sp;
        // emitted from the air cap, spread over this frame so a moving gun leaves no gaps
        const back = Math.random() * dt * 0.3;
        P[j * 3] = nozzle.x + vx * back; P[j * 3 + 1] = nozzle.y + vy * back; P[j * 3 + 2] = nozzle.z + vz * back;
        drops.vel[j * 3] = vx; drops.vel[j * 3 + 1] = vy; drops.vel[j * 3 + 2] = vz;
        drops.age[j] = 0; drops.life[j] = 0.3;
        const big = Math.random() < 0.08; // a few coarser droplets catch the light
        drops.size0[j] = big ? rand(0.004, 0.006) : rand(0.0022, 0.0036);
        drops.size1[j] = big ? rand(0.007, 0.011) : rand(0.0042, 0.0075);
        drops.base[j] = big ? rand(0.55, 0.9) : rand(0.3, 0.6);
        drops.drag[j] = rand(0.8, 2.2);
        T[j] = tone;
      }
      // a few slow puffs hang around the fan's edges (what you see drifting around a real gun)
      spray.mistCarry += rateNow * (lite ? 50 : 110) * dt;
      while (spray.mistCarry >= 1) {
        spray.mistCarry -= 1;
        const along = rand(0.2, 1.0) * SPRAY_DIST, gu = gauss() * 0.5 * along, gr = gauss() * 0.16 * along;
        spawnMist(
          nozzle.x + d.x * along + tmp.up.x * gu + tmp.right.x * gr,
          nozzle.y + d.y * along + tmp.up.y * gu + tmp.right.y * gr,
          Math.max(zTop + 0.01, nozzle.z + d.z * along + tmp.up.z * gu + tmp.right.z * gr),
          d.x * 0.4 + gauss() * 0.06, d.y * 0.4 + gauss() * 0.06 + 0.03, d.z * 0.4,
          rand(0.35, 0.6), 0.05 + 0.1 * along, 0.12 + 0.22 * along, rand(0.05, 0.08), 3.0,
        );
      }
    }

    // advance droplets; when they reach the letter face they're gone, and some become overspray
    // that rolls outwards along the surface from where the fan hits
    {
      const P = drops.geom.attributes.position.array as Float32Array;
      const A = drops.geom.attributes.aAlpha.array as Float32Array;
      const S = drops.geom.attributes.aSize.array as Float32Array;
      const bounceP = lite ? 0.006 : 0.009;
      for (let j = 0; j < drops.n; j++) {
        if (drops.life[j] <= 0) { A[j] = 0; continue; }
        const i3 = j * 3;
        const dr = Math.exp(-drops.drag[j] * dt);
        drops.vel[i3] *= dr; drops.vel[i3 + 1] = drops.vel[i3 + 1] * dr - 0.4 * dt; drops.vel[i3 + 2] *= dr;
        P[i3] += drops.vel[i3] * dt; P[i3 + 1] += drops.vel[i3 + 1] * dt; P[i3 + 2] += drops.vel[i3 + 2] * dt;
        drops.age[j] += dt;
        if (P[i3 + 2] <= zTop || drops.age[j] >= drops.life[j]) {
          if (P[i3 + 2] <= zTop && Math.random() < bounceP) {
            const ox = P[i3] - hx, oy = P[i3 + 1] - hy;
            const ol = Math.hypot(ox, oy) + 1e-4;
            const sp = rand(0.25, 0.6);
            spawnMist(P[i3], P[i3 + 1], zTop + 0.012, (ox / ol) * sp, (oy / ol) * sp * 0.6 + 0.04, rand(0.03, 0.12),
              rand(0.5, 0.95), rand(0.05, 0.08), rand(0.2, 0.34), rand(0.02, 0.035), 2.4);
          }
          drops.life[j] = 0; A[j] = 0; continue;
        }
        const a = drops.age[j];
        const k = Math.min(1, a / 0.045);               // atomising: tiny and faint at the cap, fuller further out
        S[j] = drops.size0[j] + (drops.size1[j] - drops.size0[j]) * k;
        A[j] = drops.base[j] * Math.min(1, a / 0.01) * (0.4 + 0.6 * k);
      }
      drops.geom.attributes.position.needsUpdate = true;
      drops.geom.attributes.aAlpha.needsUpdate = true;
      drops.geom.attributes.aSize.needsUpdate = true;
      drops.geom.attributes.aTone.needsUpdate = true;
    }
    {
      const P = mist.geom.attributes.position.array as Float32Array;
      const A = mist.geom.attributes.aAlpha.array as Float32Array;
      const S = mist.geom.attributes.aSize.array as Float32Array;
      for (let j = 0; j < mist.n; j++) {
        if (mist.life[j] <= 0) { A[j] = 0; continue; }
        const i3 = j * 3;
        const dr = Math.exp(-mist.drag[j] * dt);
        mist.vel[i3] *= dr; mist.vel[i3 + 1] = mist.vel[i3 + 1] * dr + 0.02 * dt; mist.vel[i3 + 2] *= dr;
        P[i3] += mist.vel[i3] * dt; P[i3 + 1] += mist.vel[i3 + 1] * dt; P[i3 + 2] = Math.max(zTop + 0.005, P[i3 + 2] + mist.vel[i3 + 2] * dt);
        mist.age[j] += dt;
        const f = mist.age[j] / mist.life[j];
        if (f >= 1) { mist.life[j] = 0; A[j] = 0; continue; }
        S[j] = mist.size0[j] + (mist.size1[j] - mist.size0[j]) * Math.sqrt(f);
        A[j] = mist.base[j] * Math.min(1, f * 6) * (1 - f) * (1 - f);
      }
      mist.geom.attributes.position.needsUpdate = true;
      mist.geom.attributes.aAlpha.needsUpdate = true;
      mist.geom.attributes.aSize.needsUpdate = true;
      mist.geom.attributes.aTone.needsUpdate = true;
    }
    const pointScale = (size.height / (2 * Math.tan((30 * Math.PI) / 360))) * fit;
    drops.mat.uniforms.uScale.value = pointScale;
    mist.mat.uniforms.uScale.value = pointScale;
    const spraying = rateNow > 0.02;

    // -- studio: the room takes on the colour being sprayed --
    const sprayK = spraying ? r.rate : 0;
    tintTarget.set(sprayK > 0 ? color : (r.finish > 0.5 ? '#c7b8d8' : '#9fb2ff'));
    tint.lerp(tintTarget, 1 - Math.exp(-dt * 3));
    const camD = size.height / (2 * Math.tan((30 * Math.PI) / 360));
    wallMat.uniforms.uTint.value.copy(tint);
    wallMat.uniforms.uGlow.value += ((0.25 + 0.35 * sprayK) - wallMat.uniforms.uGlow.value) * (1 - Math.exp(-dt * 4));
    softMat.uniforms.uColor.value.setRGB(1, 1.04, 1.12).lerp(tint, 0.15 + 0.35 * sprayK);
    for (const m of shaftMats) { m.uniforms.uTime.value = t; m.uniforms.uTint.value.copy(tint); }
    dustData.mat.uniforms.uTime.value = t;
    dustData.mat.uniforms.uScale.value = camD;
    dustData.mat.uniforms.uTint.value.copy(tint);

    // -- key light: idle drift, then one gloss sweep across the finished sign --
    if (keyLight.current) {
      const idle = Math.sin(t * 0.35) * 5;
      const sweepX = -10 + 20 * r.sweep;
      const inSweep = r.sweep > 0 && r.sweep < 1;
      keyLight.current.position.set(inSweep ? sweepX : idle, 4, 8);
      keyLight.current.intensity = 1.6 + (inSweep ? Math.sin(r.sweep * Math.PI) * 2.2 : 0);
    }
    if (!bloom.current && composer.current) {
      for (const pass of composer.current.passes as unknown as { effects?: unknown[] }[]) {
        const found = pass.effects?.find((e) => e instanceof BloomEffect) as BloomEffect | undefined;
        if (found) { bloom.current = found; break; }
      }
    }
    if (bloom.current) bloom.current.intensity = (lite ? 0.55 : 0.75) + 0.15 * sprayK + (r.sweep > 0 && r.sweep < 1 ? Math.sin(r.sweep * Math.PI) * 0.35 : 0);
  });

  /* ---- gun model ---------------------------------------------------------------------------- */
  const gun = useMemo(() => {
    const c = gltf.scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.metalness = 0.55;
        mat.roughness = 0.32;
        mat.fog = false;
        m.material = mat;
      }
    });
    c.position.copy(NOZZLE).multiplyScalar(-1);
    return c;
  }, [gltf.scene]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 2.5, 14]} near={0.1} far={80} />
      <color attach="background" args={['#050608']} />
      <fog attach="fog" args={['#050608', 13, 22]} />
      <ambientLight intensity={0.18} />
      <directionalLight ref={keyLight} position={[0, 4, 8]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-6, -2, 4]} intensity={0.5} color="#9fb2ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.6} position={[-4, 3, 6]} scale={[9, 2.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.0} position={[5, -1, 5]} scale={[2.5, 6, 1]} color="#a9bbff" />
        <Lightformer form="rect" intensity={1.6} position={[0, 6, -3]} scale={[12, 2, 1]} color="#ffe0dc" />
        <Lightformer form="rect" intensity={2.4} position={[-7, 1, -6]} scale={[0.6, 8, 1]} color="#dfe6ff" />
        <Lightformer form="rect" intensity={2.4} position={[7, 1, -6]} scale={[0.6, 8, 1]} color="#dfe6ff" />
      </Environment>

      {/* studio: backdrop, softbox strips, light shafts, dust, mirror floor */}
      <mesh ref={wall} material={wallMat} renderOrder={-2}>
        <planeGeometry args={[80, 30]} />
      </mesh>
      <group ref={bars}>
        {/* layer 1: seen by the main camera, not by the floor's reflection camera */}
        <mesh material={softMat} renderOrder={-1} layers={1}><planeGeometry args={[1, 1]} /></mesh>
      </group>
      <group ref={shafts}>
        <mesh material={shaftMats[0]} position={[-3.2, 4.6, -6]} rotation={[0, 0, -0.32]}><planeGeometry args={[2.6, 12]} /></mesh>
        <mesh material={shaftMats[1]} position={[0.6, 4.8, -7]} rotation={[0, 0, -0.26]}><planeGeometry args={[1.6, 12]} /></mesh>
        <mesh material={shaftMats[2]} position={[4.4, 4.4, -6.5]} rotation={[0, 0, -0.36]}><planeGeometry args={[2.2, 12]} /></mesh>
      </group>
      <points ref={dust} geometry={dustData.geom} material={dustData.mat} frustumCulled={false} />
      <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <planeGeometry args={[60, 24]} />
        <MeshReflectorMaterial
          resolution={lite ? 256 : 1024}
          blur={lite ? [60, 20] : [180, 40]}
          mixBlur={0.6}
          mixStrength={lite ? 40 : 55}
          mixContrast={1}
          mirror={0.9}
          depthScale={0}
          roughness={1}
          metalness={0.6}
          color="#0b0c10"
          depthWrite={false}
        />
      </mesh>

      <group ref={group}>
        <group ref={inner}>
        <mesh geometry={wordmark.geometry} material={material} />

        <group ref={gunRoot} visible={false}>
          <group ref={gunScale} scale={GUN_HEIGHT / 5}>
            <primitive object={gun} />
          </group>
        </group>

        <mesh ref={fanMesh} geometry={fanGeo} material={fanMat} visible={false} renderOrder={4} frustumCulled={false} />
        <points ref={mistPts} geometry={spray.mist.geom} material={spray.mist.mat} frustumCulled={false} renderOrder={5} />
        <points ref={dropPts} geometry={spray.drops.geom} material={spray.drops.mat} frustumCulled={false} renderOrder={6} />
        </group>
      </group>

      <EffectComposer ref={composer} multisampling={lite ? 0 : 4} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.82} luminanceSmoothing={0.25} radius={0.72} />
        <ChromaticAberration offset={new THREE.Vector2(lite ? 0 : 0.0005, lite ? 0 : 0.0005)} radialModulation modulationOffset={0.35} />
        <Vignette offset={0.22} darkness={0.78} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Static wordmark: used when WebGL isn't available                                                  */
/* ------------------------------------------------------------------------------------------------ */
function StaticMark() {
  return (
    <div className="absolute left-1/2 top-[41%] z-10 w-[94vw] -translate-x-1/2 -translate-y-1/2 sm:w-[90vw]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={WORDMARK_URL} alt="Millocolor" className="block h-auto w-full" />
    </div>
  );
}

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------------------------------------ */
/* Hero section                                                                                      */
/* ------------------------------------------------------------------------------------------------ */
export default function HeroScene() {
  const t = useTranslations('hero');
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [lite, setLite] = useState(false);
  const [visible, setVisible] = useState(true);
  const [play, setPlay] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useProgress();

  useEffect(() => {
    setMounted(true);
    setSupported(webglOk());
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setLite(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    const el = sectionRef.current;
    if (!el) return;
    // stop rendering while the hero is scrolled out of view
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  // let the loader finish fading before the gun comes in
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setPlay(true), 700);
    return () => window.clearTimeout(id);
  }, [ready]);
  const onDone = useCallback(() => setDone(true), []);
  const replay = () => { setDone(false); setRunId((n) => n + 1); };

  return (
    <section ref={sectionRef} data-hero-section className={HERO_SECTION_CLASS}>
      {/* the sign itself is drawn in 3D; this is the page title for screen readers and search */}
      <h1 className="sr-only">Millocolor</h1>
      <HeroLoader visible={!ready && supported} progress={progress * 0.85 + (ready ? 15 : 0)} />

      {mounted && supported && (
        <Canvas
          className="!absolute inset-0 z-[2]"
          style={{ pointerEvents: 'none' }}
          dpr={lite ? [1, 1.5] : [1, 2]}
          frameloop={visible ? 'always' : 'never'}
          gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false }}
        >
          <Suspense fallback={null}>
            <Stage runId={runId} onReady={onReady} onDone={onDone} reduceMotion={reduce} lite={lite} play={play} />
          </Suspense>
        </Canvas>
      )}
      {mounted && !supported && <StaticMark />}

      {/* the gloss floor falls off into darkness; keeps the tagline legible */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2] h-[46%] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(5,6,8,0) 0%, rgba(5,6,8,0.55) 45%, rgba(5,6,8,0.92) 100%)' }}
      />

      {/* tagline + actions */}
      <div className="absolute inset-x-0 bottom-0 z-[3] flex flex-col items-center px-4 pb-[7%] sm:pb-[6%] pointer-events-none">
        <h2
          className={`font-montserrat font-bold text-white text-center transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            Spray Like a{' '}
            <TypewriterText strings={['Champion', 'Pro']} colors={['#7d97ee', '#e2565f']} className="inline-block font-montserrat" />
          </span>
        </h2>
        <div
          className={`mt-7 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row pointer-events-auto transition-all duration-700 delay-300 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        >
          <a
            href={generateContactLinks.whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center bg-[#ecebe6] px-8 text-[0.95rem] font-semibold text-[#121316] transition-colors hover:bg-white"
          >
            {t('ctaWhatsapp')}
          </a>
          <a
            href={generateContactLinks.phone()}
            className="inline-flex h-14 items-center justify-center border border-white/40 px-8 text-[0.95rem] font-semibold text-[#ecebe6] transition-colors hover:border-white hover:bg-white/10"
          >
            {t('ctaCall')}
          </a>
        </div>
      </div>

      {done && ready && !reduce && (
        <button
          type="button"
          onClick={replay}
          className="absolute right-5 top-24 z-[3] text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white sm:right-10"
        >
          {t('replay')}
        </button>
      )}
    </section>
  );
}

useGLTF.preload(MODEL_URL);
useLoader.preload(SVGLoader, WORDMARK_URL);
