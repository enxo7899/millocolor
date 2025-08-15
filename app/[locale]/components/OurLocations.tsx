"use client";

type NodeSpec = {
  id: string;
  label: string;
  x: number; // 0..1 relative
  y: number; // 0..1 relative
  highlight?: boolean;
};

// Stylised placement (not literal geo) chosen for best composition
const NODES: NodeSpec[] = [
  { id: "hq", label: "HQ (Tirana–Durrës Highway)", x: 0.28, y: 0.62, highlight: true },
  { id: "tirana", label: "Tirana", x: 0.36, y: 0.58 },
  { id: "elbasan", label: "Elbasan", x: 0.48, y: 0.68 },
  { id: "pristina", label: "Pristina, Kosovo", x: 0.86, y: 0.18 },
];

function xy(w: number, h: number, p: NodeSpec) {
  return { cx: p.x * w, cy: p.y * h };
}

function Curve({ a, b, id, idx }: { a: NodeSpec; b: NodeSpec; id: string; idx: number }) {
  const w = 820,
    h = 420;
  const A = xy(w, h, a);
  const B = xy(w, h, b);
  // elevated quadratic control for an elegant arc
  const midX = (A.cx + B.cx) / 2;
  const midY = (A.cy + B.cy) / 2 - (70 + idx * 12);
  const d = `M ${A.cx} ${A.cy} Q ${midX} ${midY} ${B.cx} ${B.cy}`;
  const dash = 12;
  const dur = 3.2 + idx * 0.35;
  return (
    <g>
      <path d={d} fill="none" stroke="#1d2a4d" strokeOpacity={0.45} strokeWidth={7} />
      <path
        d={d}
        fill="none"
        stroke="url(#route)"
        strokeWidth={2.8}
        strokeDasharray={`${dash} ${dash}`}
        style={{ animation: `dash ${dur}s linear ${idx * 0.2}s infinite` }}
      />
    </g>
  );
}

function Node({ spec, idx }: { spec: NodeSpec; idx: number }) {
  const w = 820,
    h = 420;
  const { cx, cy } = xy(w, h, spec);
  return (
    <g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={18}
        fill="url(#halo)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, scale: [1, 1.15, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
      />
      <circle cx={cx} cy={cy} r={7} fill={spec.highlight ? "#C73834" : "#314485"} stroke="#fff" strokeWidth={2} />
      <text x={cx + 12} y={cy - 10} fill="#fff" fontSize={14} fontWeight={700} stroke="#0b0f1a" strokeWidth={3} paintOrder="stroke">
        {spec.label}
      </text>
    </g>
  );
}

export default function OurLocations() {
  const w = 820;
  const h = 420;
  const hq = NODES[0];

  return (
    <section className="relative py-16 md:py-20 z-10">
      {/* Aurora / glow background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-[#314485] via-[#5b73c8] to-[#C73834]" style={{ animation: 'aur 6s ease-in-out infinite' }} />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-[#C73834] via-[#9a4a66] to-[#314485]" style={{ animation: 'aur 7s ease-in-out infinite' }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-[#314485]">Our</span> <span className="text-[#C73834]">Locations</span>
          </h2>
          <p className="text-white/70 mt-2">A connected network across the region – responsive and always on the move</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black/60 overflow-hidden shadow-xl">
          <div className="relative">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[360px] md:h-[420px]">
              <defs>
                <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#314485" />
                  <stop offset="100%" stopColor="#C73834" />
                </linearGradient>
                <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Layered techy grid */}
              <rect x="0" y="0" width={w} height={h} fill="#0b1120" />
              <g opacity={0.08} stroke="#ffffff">
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`v${i}`} x1={(i * w) / 18} y1={0} x2={(i * w) / 18} y2={h} />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={(i * h) / 12} x2={w} y2={(i * h) / 12} />
                ))}
              </g>
              {/* soft glows under nodes */}
              <g>
                {NODES.map((p) => {
                  const { cx, cy } = xy(w, h, p);
                  return <circle key={`glow-${p.id}`} cx={cx} cy={cy} r={70} fill={p.highlight ? "#C73834" : "#314485"} opacity={0.08} />;
                })}
              </g>

              {/* animated connections */}
              {NODES.filter((n) => n.id !== "hq").map((n, i) => (
                <Curve key={`c-${n.id}`} a={hq} b={n} id={`c-${n.id}`} idx={i} />
              ))}

              {/* nodes */}
              {NODES.map((n, i) => (
                <Node key={`n-${n.id}`} spec={n} idx={i} />
              ))}
            </svg>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {NODES.map((p) => (
            <div key={`card-${p.id}`} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors">
              <svg width="56" height="28" viewBox="0 0 56 28" className="shrink-0" aria-hidden>
                <defs>
                  <linearGradient id={`car-${p.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#314485" />
                    <stop offset="100%" stopColor="#5b73c8" />
                  </linearGradient>
                </defs>
                <rect x="6" y="12" width="36" height="10" rx="3" fill={`url(#car-${p.id})`} />
                <path d="M12 12 L18 6 H34 L40 12 Z" fill="#4f66a4" />
                <circle cx="18" cy="22" r="4" fill="#1f2937" />
                <circle cx="36" cy="22" r="4" fill="#1f2937" />
              </svg>
              <div>
                <div className="text-white font-semibold leading-tight">{p.label}</div>
                <div className="text-white/60 text-sm">Service car</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes dash { to { stroke-dashoffset: -24; } }
        @keyframes pulse { 0%,100% { opacity: .3; transform: scale(1); } 50% { opacity: .6; transform: scale(1.15); } }
        @keyframes aur { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(10px, -8px, 0) scale(1.06); } }
      `}</style>
    </section>
  );
}

"use client";

import { motion } from 'framer-motion';

type GeoPoint = { id: string; name: string; lat: number; lon: number; highlight?: boolean };

const points: GeoPoint[] = [
  { id: 'hq', name: 'HQ (Tirana–Durrës Highway)', lat: 41.35, lon: 19.60, highlight: true },
  { id: 'tirana', name: 'Tirana', lat: 41.3275, lon: 19.8191 },
  { id: 'elbasan', name: 'Elbasan', lat: 41.1102, lon: 20.083 },
  { id: 'pristina', name: 'Pristina, Kosovo', lat: 42.6629, lon: 21.1655 },
];

// Simple equirectangular projection tightly framing the Balkans
const bbox = { minLon: 18.8, maxLon: 22.2, minLat: 40.6, maxLat: 43.1 };
function project(lon: number, lat: number, w: number, h: number) {
  const x = ((lon - bbox.minLon) / (bbox.maxLon - bbox.minLon)) * w;
  const y = (1 - (lat - bbox.minLat) / (bbox.maxLat - bbox.minLat)) * h;
  return { x, y };
}

function CurvedLink({ from, to, w, h, idx }: { from: GeoPoint; to: GeoPoint; w: number; h: number; idx: number }) {
  const a = project(from.lon, from.lat, w, h);
  const b = project(to.lon, to.lat, w, h);
  const ctrlLift = 60 + idx * 8;
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2 - ctrlLift; // elegant arc
  const d = `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
  const dash = 10;
  const dur = 2.8 + idx * 0.3;
  return (
    <g>
      <path d={d} fill="none" stroke="#1d2a4d" strokeOpacity={0.35} strokeWidth={6} />
      <path
        d={d}
        fill="none"
        strokeWidth={2.5}
        stroke="url(#grad)"
        strokeDasharray={`${dash} ${dash}`}
        style={{ animation: `dashmove ${dur}s linear ${idx * 0.2}s infinite` }}
      />
    </g>
  );
}

export default function OurLocations() {
  const w = 820; // internal svg size
  const h = 420;
  const hq = points[0];
  // stylized map (no external images)

  return (
    <section className="py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-[#314485]">Our</span> <span className="text-[#C73834]">Locations</span>
          </h2>
          <p className="text-white/70 mt-2">Focused on the Balkans – HQ near the Tirana–Durrës highway, plus Tirana, Elbasan and Pristina</p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[360px] md:h-[420px]">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#314485" />
                  <stop offset="100%" stopColor="#C73834" />
                </linearGradient>
                <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* layered background */}
              <rect x="0" y="0" width={w} height={h} fill="#0b1120" />
              <g opacity="0.08">
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`v${i}`} x1={(i * w) / 18} y1={0} x2={(i * w) / 18} y2={h} stroke="#ffffff" strokeWidth="1" />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={(i * h) / 12} x2={w} y2={(i * h) / 12} stroke="#ffffff" strokeWidth="1" />
                ))}
              </g>
              {/* soft region glows around each location to suggest geography */}
              <g>
                {points.map((p, i) => {
                  const { x, y } = project(p.lon, p.lat, w, h);
                  const c = p.highlight ? '#C73834' : '#314485';
                  return <circle key={`rg-${p.id}`} cx={x} cy={y} r={60} fill={c} opacity={0.08} />;
                })}
              </g>

              {points.filter(p => p.id !== 'hq').map((p, i) => (
                <CurvedLink key={`ln-${p.id}`} from={hq} to={p} w={w} h={h} idx={i} />
              ))}

              {points.map(p => {
                const { x, y } = project(p.lon, p.lat, w, h);
                return (
                  <g key={p.id}>
                    {p.highlight && <circle cx={x} cy={y} r={16} fill="url(#halo)" />}
                    <circle cx={x} cy={y} r={6} fill={p.highlight ? '#C73834' : '#314485'} stroke="#fff" strokeWidth={2} />
                    <text x={x + 10} y={y - 10} fill="#fff" fontSize={14} fontWeight={700} stroke="#0b0f1a" strokeWidth={3} paintOrder="stroke">
                      {p.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Cars per location */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          {points.map(p => (
            <div key={`car-${p.id}`} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <svg width="56" height="28" viewBox="0 0 56 28" className="shrink-0" aria-hidden>
                <rect x="6" y="12" width="36" height="10" rx="3" fill="#314485" />
                <path d="M12 12 L18 6 H34 L40 12 Z" fill="#4f66a4" />
                <circle cx="18" cy="22" r="4" fill="#1f2937" />
                <circle cx="36" cy="22" r="4" fill="#1f2937" />
              </svg>
              <div>
                <div className="text-white font-semibold leading-tight">{p.name}</div>
                <div className="text-white/60 text-sm">Service car</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes dashmove { to { stroke-dashoffset: -16; } }
      `}</style>
    </section>
  );
}

