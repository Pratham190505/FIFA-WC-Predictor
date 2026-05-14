import { useEffect, useRef, useState } from "react";

type Star = {
  top: number;
  left: number;
  size: number;
  delay: number;
};

type Drifter = {
  id: number;
  top: number;
  left: number;
  scale: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
};

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 35,
    left: 55 + Math.random() * 42,
    size: Math.random() * 1.6 + 0.6,
    delay: Math.random() * 4,
  }));
}

function generateDrifters(count: number): Drifter[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 90,
    left: Math.random() * 90,
    scale: 0.6 + Math.random() * 0.8,
    duration: 40 + Math.random() * 40,
    delay: -Math.random() * 40,
    dx: (Math.random() - 0.5) * 80,
    dy: (Math.random() - 0.5) * 60,
  }));
}

/**
 * Deep navy site-wide background layer.
 * - Fixed, behind everything (z: -50), pointer-events: none.
 * - Radial vignette + drifting player silhouettes + star cluster.
 * Does not modify any existing color tokens; layered ON TOP of body bg.
 */
export function DeepNavyBackground() {
  const [isClient, setIsClient] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [players, setPlayers] = useState<Drifter[]>([]);

  // Generate all random layout values once on the client to avoid SSR/client mismatches.
  useEffect(() => {
    setIsClient(true);
    setStars(generateStars(60));
    setPlayers(generateDrifters(8));
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #041454 0%, #020B2E 55%, #010820 100%)",
      }}
    >
      {/* Subtle pitch grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Football pitch markings overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="white"
        strokeWidth="2"
      >
        {/* center line */}
        <line x1="800" y1="0" x2="800" y2="900" />
        {/* center circle */}
        <circle cx="800" cy="450" r="110" />
        <circle cx="800" cy="450" r="4" fill="white" />
        {/* left penalty area */}
        <rect x="0" y="250" width="220" height="400" />
        <rect x="0" y="350" width="80" height="200" />
        <circle cx="150" cy="450" r="60" />
        {/* right penalty area */}
        <rect x="1380" y="250" width="220" height="400" />
        <rect x="1520" y="350" width="80" height="200" />
        <circle cx="1450" cy="450" r="60" />
        {/* outer touchlines */}
        <rect x="20" y="40" width="1560" height="820" />
      </svg>
      {/* Stadium floodlight flares */}
      <div
        className="absolute -top-40 left-1/4 w-150 h-150 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
      />
      <div
        className="absolute -top-40 right-1/4 w-150 h-150 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
      />
      {/* Star cluster top-right */}
      <div className="absolute inset-0">
        {isClient &&
          stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: 0.7,
                boxShadow: "0 0 4px rgba(255,255,255,0.6)",
                animation: `dn-twinkle 3.5s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
      </div>
      {/* Drifting football & player silhouettes */}
      {isClient &&
        players.map((p, i) =>
          i % 2 === 0 ? <FootballSilhouette key={p.id} {...p} /> : <PlayerSilhouette key={p.id} {...p} />,
        )}
      <style>{`
        @keyframes dn-twinkle { 0%,100%{opacity:.7} 50%{opacity:.25} }
        @keyframes dn-drift-${0} { 0%{transform:translate(0,0)} 100%{transform:translate(var(--dx),var(--dy))} }
        @keyframes dn-spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}

function FootballSilhouette({ top, left, scale, duration, delay, dx, dy }: {
  top: number; left: number; scale: number; duration: number; delay: number; dx: number; dy: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
  }, [dx, dy]);
  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        opacity: 0.07,
        transform: `scale(${scale})`,
        animation: `dn-drift-0 ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
    >
      <div style={{ animation: `dn-spin ${20 + duration / 4}s linear infinite` }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="1.2">
          <circle cx="24" cy="24" r="22" fill="white" fillOpacity="0.15" />
          <polygon points="24,12 31,17 28,25 20,25 17,17" fill="white" fillOpacity="0.5" />
          <line x1="24" y1="2" x2="24" y2="12" />
          <line x1="31" y1="17" x2="42" y2="14" />
          <line x1="28" y1="25" x2="36" y2="34" />
          <line x1="20" y1="25" x2="12" y2="34" />
          <line x1="17" y1="17" x2="6" y2="14" />
        </svg>
      </div>
    </div>
  );
}

function PlayerSilhouette({
  top,
  left,
  scale,
  duration,
  delay,
  dx,
  dy,
}: {
  top: number;
  left: number;
  scale: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
  }, [dx, dy]);
  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        opacity: 0.06,
        transform: `scale(${scale})`,
        animation: `dn-drift-0 ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
    >
      <svg width="40" height="64" viewBox="0 0 40 64" fill="white">
        <circle cx="20" cy="8" r="6" />
        <rect x="18" y="14" width="4" height="22" rx="1" />
        <line x1="20" y1="18" x2="6" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="18" x2="34" y2="26" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="36" x2="10" y2="58" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="36" x2="30" y2="58" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}