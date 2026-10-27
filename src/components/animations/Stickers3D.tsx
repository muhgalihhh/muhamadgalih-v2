"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { MotionValue } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

// Chunky 3D "stickers" in the site's neo-brutalist language: flat toon colour,
// thick ink outline, hard offset shadow (.cartoon-border, but in 3D).
// Every model is built from primitives right here, no model files to load.

const INK = { light: "#0D0B1E", dark: "#F0EFFF" };

// Ink = back faces of the mesh pushed out along smoothed normals (inverted-hull outline)
const inkShader = {
  side: THREE.BackSide,
  vertexShader:
    "void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * 0.035, 1.0); }",
  fragmentShader: "uniform vec3 color;\nvoid main() {\n  gl_FragColor = vec4(color, 1.0);\n  #include <colorspace_fragment>\n}",
};

// Per canvas, since the ink colour depends on the surface behind it
function inkMaterials() {
  const uniforms = { color: { value: new THREE.Color(INK.light) } };
  return {
    uniforms,
    outline: new THREE.ShaderMaterial({ ...inkShader, uniforms }),
    // Same silhouette drawn first and without depth → always behind its sticker, like a CSS offset shadow
    shadow: new THREE.ShaderMaterial({ ...inkShader, uniforms, depthTest: false, depthWrite: false }),
  };
}
type Ink = ReturnType<typeof inkMaterials>;

// ── Models ──────────────────────────────────────────────────────────────────

type Part = { geo: THREE.BufferGeometry; hull: THREE.BufferGeometry; mat: THREE.Material; pos?: [number, number, number]; rot?: [number, number, number] };

function part(geo: THREE.BufferGeometry, color: string, pos?: Part["pos"], rot?: Part["rot"]): Part {
  // Hull needs welded vertices, otherwise hard edges split open when pushed out
  const h = geo.clone();
  h.deleteAttribute("normal");
  h.deleteAttribute("uv");
  const hull = mergeVertices(h);
  hull.computeVertexNormals();
  return { geo, hull, mat: new THREE.MeshToonMaterial({ color }), pos, rot };
}

const shape = (pts: number[][]) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));

function extrude(shapes: THREE.Shape[]) {
  const g = new THREE.ExtrudeGeometry(shapes, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2 });
  g.center();
  return g;
}

function star(points: number, rOut: number, rIn: number) {
  return extrude([
    shape(Array.from({ length: points * 2 }, (_, i) => {
      const r = i % 2 ? rIn : rOut;
      const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
      return [Math.cos(a) * r, Math.sin(a) * r];
    })),
  ]);
}

function gear(teeth: number, rOut: number, rIn: number, hole: number) {
  const w = Math.PI / teeth;
  const at = (a: number, r: number) => [Math.cos(a) * r, Math.sin(a) * r];
  const s = shape(Array.from({ length: teeth }, (_, i) => {
    const a = i * 2 * w;
    return [at(a - w * 0.55, rIn), at(a - w * 0.3, rOut), at(a + w * 0.3, rOut), at(a + w * 0.55, rIn)];
  }).flat());
  s.holes.push(new THREE.Path().absarc(0, 0, hole, 0, Math.PI * 2, true));
  return extrude([s]);
}

// Thin flat panel (paper), centred on z
function panel(pts: number[][]) {
  const g = new THREE.ExtrudeGeometry(shape(pts), { depth: 0.03, bevelEnabled: false });
  g.translate(0, 0, -0.015);
  return g;
}

const CHEVRON = [[0.28, 0.42], [0.4, 0.3], [0.1, 0], [0.4, -0.3], [0.28, -0.42], [-0.14, 0]];
const WING = [[1, 0], [-0.8, 0], [-0.95, 0.75]];
const BROWN = "#4A2C1D";

const PENCIL = [
  part(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 6), "#FFD166"),
  part(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 16), "#4CC9F0", [0, 0.62, 0]),
  part(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 16), "#FF6B9D", [0, 0.79, 0]),
  part(new THREE.ConeGeometry(0.16, 0.38, 6), "#FFFEF0", [0, -0.74, 0], [Math.PI, 0, 0]),
  part(new THREE.ConeGeometry(0.06, 0.14, 6), "#0D0B1E", [0, -0.86, 0], [Math.PI, 0, 0]),
];

// Classic mouse pointer, mirrored so it points up-right
const CURSOR = [
  part(extrude([shape([[0, 0], [0, -1], [-0.23, -0.77], [-0.4, -1.12], [-0.54, -1.05], [-0.37, -0.7], [-0.7, -0.7]])]), "#FF5757"),
];

const CODE = [
  part(
    extrude([
      shape(CHEVRON.map(([x, y]) => [x - 0.75, y])),
      shape([[-0.24, -0.45], [-0.08, -0.45], [0.24, 0.45], [0.08, 0.45]]),
      shape(CHEVRON.map(([x, y]) => [0.75 - x, y])),
    ]),
    "#06D6A0",
  ),
];

const MUG = [
  part(new THREE.CylinderGeometry(0.42, 0.36, 0.9, 28), "#FF5757"),
  part(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 28), BROWN, [0, 0.45, 0]),
  part(new THREE.TorusGeometry(0.22, 0.075, 12, 28), "#FF5757", [0.44, 0.02, 0]),
];

const GEAR_BIG = [part(gear(8, 0.62, 0.48, 0.16), "#4CC9F0")];
const GEAR_SMALL = [part(gear(6, 0.4, 0.3, 0.1), "#FFD166")];
const STAR = [part(star(5, 0.75, 0.34), "#FFD166")];
const SPARKLE = [part(star(4, 0.5, 0.14), "#FF6B9D")];

// Points along +x; wings fold up from the spine, keel hangs below it
const PLANE = [
  part(panel(WING).rotateX(Math.PI / 2 - 0.3), "#FFFEF0"),
  part(panel(WING).rotateX(-(Math.PI / 2 - 0.3)), "#FFFEF0"),
  part(panel([[1, 0], [-0.8, 0], [-0.8, -0.3]]), "#FFFEF0"),
];

const BRIEFCASE = [
  part(new RoundedBoxGeometry(1.3, 0.9, 0.4, 3, 0.08), "#845EF7"),
  part(new THREE.TorusGeometry(0.22, 0.06, 10, 20, Math.PI), "#0D0B1E", [0, 0.42, 0]),
  part(new THREE.BoxGeometry(0.24, 0.16, 0.08), "#FFD166", [0, 0.2, 0.22]),
];

// Mortarboard: board turned 45° so a corner points at you, tassel hanging off it
const GRAD_CAP = [
  part(new THREE.CylinderGeometry(0.42, 0.48, 0.38, 24), "#845EF7", [0, -0.24, 0]),
  part(new THREE.BoxGeometry(1.3, 0.08, 1.3), "#4CC9F0", undefined, [0, Math.PI / 4, 0]),
  part(new THREE.SphereGeometry(0.08, 12, 8), "#FFD166", [0, 0.06, 0]),
  part(new THREE.CylinderGeometry(0.045, 0.045, 0.45, 8), "#FFD166", [0.82, -0.22, 0]),
];

const MEDAL = [
  part(new THREE.BoxGeometry(0.22, 0.75, 0.04), "#4CC9F0", [-0.16, 0.72, -0.04], [0, 0, 0.35]),
  part(new THREE.BoxGeometry(0.22, 0.75, 0.04), "#845EF7", [0.16, 0.72, -0.04], [0, 0, -0.35]),
  part(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32), "#FFD166", undefined, [Math.PI / 2, 0, 0]),
  part(star(5, 0.3, 0.13), "#FF5757", [0, 0, 0.06]),
];

const PALETTE_BOARD = new THREE.Shape().absellipse(0, 0, 0.85, 0.62, 0, Math.PI * 2, false, 0);
PALETTE_BOARD.holes.push(new THREE.Path().absarc(-0.45, -0.2, 0.12, 0, Math.PI * 2, true));
const PALETTE = [
  part(extrude([PALETTE_BOARD]), "#FFD166"),
  ...([[0.35, 0.3, "#FF5757"], [0, 0.38, "#06D6A0"], [-0.35, 0.25, "#4CC9F0"], [0.55, -0.05, "#FF6B9D"], [0.3, -0.35, "#845EF7"]] as const).map(
    ([x, y, color]) => part(new THREE.SphereGeometry(0.13, 16, 12).scale(1, 1, 0.5), color, [x, y, 0.15]),
  ),
];

const ENVELOPE = [
  part(new THREE.BoxGeometry(1.4, 0.9, 0.12), "#FFFEF0"),
  part(panel([[-0.7, 0.45], [0.7, 0.45], [0, -0.08]]), "#FFFEF0", [0, 0, 0.075]),
  part(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 20), "#FF5757", [0, -0.04, 0.1], [Math.PI / 2, 0, 0]),
];

// ── Layouts ─────────────────────────────────────────────────────────────────

type Sticker = {
  parts: Part[];
  size: number; // in anchor half-sizes (the smaller side)
  at: [number, number, number]; // resting x/y in anchor half-sizes from the anchor centre (±1 = anchor edge)
  tilt: [number, number, number]; // resting pose
  drift: [number, number]; // how far it travels per unit of `progress`, same units as `at`
  turns: number; // full turns per unit of `progress`
  axis?: "x" | "y" | "z"; // what it turns around (default y)
  delay: number; // pop-in delay once the anchor shows up
};

// `pad` = how far the canvas overhangs its anchor on each side, as a fraction of the anchor size;
// big enough that drifting stickers aren't clipped.
// `rest` = the progress at which stickers sit exactly at `at`/`tilt`; they drift and turn around it.
// Default 0.6: a section spot's anchor is then in the upper middle of the screen, i.e. while you read the heading.
type SetDef = { pad: { x: number; y: number }; rest?: number; stickers: Sticker[] };

const SETS = {
  // Around the hero photo card, one per craft: pencil = illustration, cursor = UI/UX, </> = engineering
  hero: {
    pad: { x: 0.6, y: 0.4 },
    rest: 0,
    stickers: [
      { parts: PENCIL, size: 0.53, at: [1, 0.98, 0], tilt: [0.25, 0, -0.85], drift: [0.6, 1], turns: 0.75, delay: 0.3 },
      { parts: CURSOR, size: 0.59, at: [-1.1, -0.28, 0], tilt: [0.15, 0.3, 0], drift: [-0.9, 0.5], turns: -0.6, delay: 0.45 },
      { parts: CODE, size: 0.46, at: [1.1, -0.25, 0], tilt: [0.1, -0.35, 0.12], drift: [0.8, -0.1], turns: 1, delay: 0.6 },
    ],
  },
  // "Cups of coffee, uncounted"
  about: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [{ parts: MUG, size: 1.25, at: [0, 0.05, 0], tilt: [0.4, -0.9, 0.1], drift: [0, 0.7], turns: 0.35, delay: 0.2 }],
  },
  // Tools: two meshed gears turning against each other as you scroll
  tech: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [
      { parts: GEAR_BIG, size: 1, at: [-0.25, 0.34, 0], tilt: [0.35, 0.45, 0], drift: [0, 0.4], turns: 0.5, axis: "z", delay: 0.2 },
      { parts: GEAR_SMALL, size: 1, at: [0.42, -0.28, 0], tilt: [0.35, 0.45, 0], drift: [0, 0.4], turns: -0.75, axis: "z", delay: 0.35 },
    ],
  },
  // Selected works = the starred ones
  works: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [
      { parts: STAR, size: 1, at: [-0.1, 0, 0], tilt: [0.2, 0, 0.15], drift: [0, 0.4], turns: 1, delay: 0.2 },
      { parts: SPARKLE, size: 0.55, at: [0.7, 0.9, 0], tilt: [0.1, 0, 0], drift: [0, 0.8], turns: -1.5, delay: 0.4 },
    ],
  },
  // /about header: the three crafts again, as a loose cluster
  aboutHero: {
    pad: { x: 0.5, y: 0.5 },
    stickers: [
      { parts: PENCIL, size: 0.6, at: [0.45, 0.45, 0], tilt: [0.25, 0, -0.85], drift: [0.3, 0.6], turns: 0.5, delay: 0.3 },
      { parts: CURSOR, size: 0.66, at: [-0.45, 0, 0], tilt: [0.15, 0.3, 0], drift: [-0.3, 0.5], turns: -0.5, delay: 0.45 },
      { parts: CODE, size: 0.5, at: [0.35, -0.5, 0], tilt: [0.1, -0.35, 0.12], drift: [0.3, 0.3], turns: 0.75, delay: 0.6 },
    ],
  },
  experience: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [{ parts: BRIEFCASE, size: 0.95, at: [0, 0, 0], tilt: [0.3, -0.5, 0.08], drift: [0, 0.6], turns: 0.5, delay: 0.2 }],
  },
  education: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [{ parts: GRAD_CAP, size: 1.05, at: [0, 0.05, 0], tilt: [0.45, 0.3, -0.12], drift: [0, 0.6], turns: 0.5, delay: 0.2 }],
  },
  certificates: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [{ parts: MEDAL, size: 0.85, at: [0, -0.2, 0], tilt: [0.15, 0, 0.12], drift: [0, 0.6], turns: 0.5, delay: 0.2 }],
  },
  gallery: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [{ parts: PALETTE, size: 1.05, at: [0, 0, 0], tilt: [-0.5, 0.3, 0.2], drift: [0, 0.6], turns: 0.5, delay: 0.2 }],
  },
  mail: {
    pad: { x: 0.6, y: 0.6 },
    stickers: [{ parts: ENVELOPE, size: 1, at: [0, 0, 0], tilt: [0.2, -0.35, 0.12], drift: [0.15, 0.3], turns: 0.5, delay: 0.3 }],
  },
  // Splash: a star over the monogram that spins once while the yellow wipe bursts out of it
  splash: {
    pad: { x: 0.5, y: 0.5 },
    rest: 0,
    stickers: [{ parts: STAR, size: 1, at: [0, 0, 0], tilt: [0.2, 0, 0.15], drift: [0, 0], turns: 1, delay: 0 }],
  },
  // A paper plane crossing the contact section, with a barrel roll on the way
  contact: {
    pad: { x: 0, y: 0 },
    rest: 0,
    stickers: [{ parts: PLANE, size: 0.18, at: [0.35, -0.6, 0], tilt: [0.8, 0.3, 0.35], drift: [0.45, 1.1], turns: 1, axis: "x", delay: 0.2 }],
  },
} satisfies Record<string, SetDef>;

export type StickerSet = keyof typeof SETS;

// ── Rendering ───────────────────────────────────────────────────────────────

const pointer = { x: 0, y: 0 };

let webgl2: boolean | undefined;
function hasWebGL2() {
  if (webgl2 === undefined) {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    webgl2 = !!gl;
  }
  return webgl2;
}

function InkColor({ ink, color }: { ink: Ink; color: string }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    ink.uniforms.color.value.set(color);
    invalidate();
  }, [ink, color, invalidate]);
  return null;
}

type MeshProps = Omit<Props, "set" | "surface" | "onReady"> & { s: Sticker; pad: SetDef["pad"]; rest: number; ink: Ink };

function StickerMesh({ s, pad, rest, ink, progress, active, still, bounce }: MeshProps) {
  const root = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Group>(null!);
  const st = useRef({ scale: still ? 1 : 0, vel: 0, px: 0, py: 0, shownAt: -1 });
  const viewport = useThree((v) => v.viewport);

  // Hero card flipped → a springy kick
  useEffect(() => {
    if (st.current.scale > 0.5) st.current.vel += 6;
  }, [bounce]);

  useFrame((state, delta) => {
    const k = st.current;
    // half the anchor's size in world units
    const cx = viewport.width / (1 + 2 * pad.x) / 2;
    const cy = viewport.height / (1 + 2 * pad.y) / 2;
    const dt = Math.min(delta, 1 / 30);
    const t = still ? 0 : state.clock.elapsedTime;
    const p = still ? 0 : progress.get() - rest;

    if (still) k.scale = 1;
    else {
      // Underdamped spring: pops in `delay` after the anchor first shows up, with a little overshoot
      if (active && k.shownAt < 0) k.shownAt = t;
      const shown = k.shownAt >= 0 && t - k.shownAt > s.delay;
      k.vel += ((shown ? 1 : 0) - k.scale) * 160 * dt - k.vel * 10 * dt;
      k.scale += k.vel * dt;
      k.px += (pointer.x - k.px) * Math.min(1, dt * 3);
      k.py += (pointer.y - k.py) * Math.min(1, dt * 3);
    }

    root.current.scale.setScalar(Math.max(k.scale, 0) * Math.min(cx, cy) * s.size);
    root.current.position.set(
      (s.at[0] + s.drift[0] * p) * cx,
      (s.at[1] + s.drift[1] * p + Math.sin(t * 1.3 + s.delay * 10) * 0.04) * cy,
      s.at[2],
    );
    const turn = p * Math.PI * 2 * s.turns;
    const axis = s.axis ?? "y";
    spin.current.rotation.set(
      s.tilt[0] - k.py * 0.35 + (axis === "x" ? turn : 0),
      s.tilt[1] + k.px * 0.5 + Math.sin(t * 0.8 + s.delay * 7) * 0.15 + (axis === "y" ? turn : 0),
      s.tilt[2] + (axis === "z" ? turn : 0),
    );
    shadow.current.rotation.copy(spin.current.rotation);
  });

  return (
    <group ref={root}>
      <group ref={shadow} position={[0.09, -0.09, 0]}>
        {s.parts.map((pt, i) => (
          <mesh key={i} geometry={pt.hull} material={ink.shadow} position={pt.pos} rotation={pt.rot} renderOrder={-1} />
        ))}
      </group>
      <group ref={spin}>
        {s.parts.map((pt, i) => (
          <group key={i} position={pt.pos} rotation={pt.rot}>
            <mesh geometry={pt.geo} material={pt.mat} />
            <mesh geometry={pt.hull} material={ink.outline} />
          </group>
        ))}
      </group>
    </group>
  );
}

type Props = {
  set: StickerSet;
  progress: MotionValue<number>; // drives drift + turns, 0 → 1
  active: boolean; // anchor on screen: pop in, keep rendering; off-screen we stop rendering
  still: boolean; // prefers-reduced-motion
  bounce?: boolean; // toggle to make the stickers jump
  surface?: "light" | "dark"; // for sections whose colour ignores the theme
  onReady?: () => void; // WebGL is up and the stickers start popping in (or unavailable: nothing will show)
};

export default function Stickers3D({ set, surface, onReady, ...shared }: Props) {
  const { resolvedTheme } = useTheme();
  // Decorative only: no WebGL2 → render nothing instead of crashing the page
  const [supported] = useState(hasWebGL2);
  const ink = useMemo(() => inkMaterials(), []);

  useEffect(() => () => {
    ink.outline.dispose();
    ink.shadow.dispose();
  }, [ink]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!supported) onReady?.();
  }, [supported, onReady]);

  if (!supported) return null;

  const { pad, rest = 0.6, stickers }: SetDef = SETS[set];
  return (
    <div
      aria-hidden
      className="absolute z-20 pointer-events-none"
      style={{ inset: `${-pad.y * 100}% ${-pad.x * 100}%` }}
    >
      <Canvas
        // R3F sets pointer-events: auto inline on its own div, which would swallow clicks/hovers
        // meant for whatever sits underneath (the hero photo card flip, buttons)
        style={{ pointerEvents: "none" }}
        flat
        dpr={[1, 1.75]}
        frameloop={shared.active && !shared.still ? "always" : "demand"}
        camera={{ position: [0, 0, 12], fov: 30 }}
        onCreated={onReady}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[-4, 5, 6]} intensity={1.85} />
        <InkColor ink={ink} color={(surface ?? resolvedTheme) === "dark" ? INK.dark : INK.light} />
        {stickers.map((s: Sticker, i) => (
          <StickerMesh key={i} s={s} pad={pad} rest={rest} ink={ink} {...shared} />
        ))}
      </Canvas>
    </div>
  );
}
