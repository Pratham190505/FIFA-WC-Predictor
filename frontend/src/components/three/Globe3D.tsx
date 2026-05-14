import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "@tanstack/react-router";
import { getFlagUrl } from "@/data/flagMap";

export type GlobeTeam = {
  name: string;
  short: string;
  flag: string;
  lat: number;
  lon: number;
};

export const GLOBE_TEAMS: GlobeTeam[] = [
  { name: "Brazil", short: "BRA", flag: "🇧🇷", lat: -14.2, lon: -51.9 },
  { name: "Argentina", short: "ARG", flag: "🇦🇷", lat: -38.4, lon: -63.6 },
  { name: "France", short: "FRA", flag: "🇫🇷", lat: 46.2, lon: 2.2 },
  { name: "Germany", short: "GER", flag: "🇩🇪", lat: 51.2, lon: 10.4 },
  { name: "Spain", short: "ESP", flag: "🇪🇸", lat: 40.5, lon: -3.7 },
  { name: "England", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", lat: 52.4, lon: -1.9 },
  { name: "Portugal", short: "POR", flag: "🇵🇹", lat: 39.4, lon: -8.2 },
  { name: "Netherlands", short: "NED", flag: "🇳🇱", lat: 52.1, lon: 5.3 },
  { name: "Japan", short: "JPN", flag: "🇯🇵", lat: 36.2, lon: 138.3 },
  { name: "South Korea", short: "KOR", flag: "🇰🇷", lat: 35.9, lon: 127.8 },
  { name: "USA", short: "USA", flag: "🇺🇸", lat: 37.1, lon: -95.7 },
  { name: "Mexico", short: "MEX", flag: "🇲🇽", lat: 23.6, lon: -102.5 },
  { name: "Morocco", short: "MAR", flag: "🇲🇦", lat: 31.8, lon: -7.1 },
  { name: "Senegal", short: "SEN", flag: "🇸🇳", lat: 14.5, lon: -14.5 },
  { name: "Australia", short: "AUS", flag: "🇦🇺", lat: -25.3, lon: 133.8 },
  { name: "Croatia", short: "CRO", flag: "🇭🇷", lat: 45.1, lon: 15.2 },
];

const RADIUS = 2.2;

function latLongToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function Globe3D() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <GlobeSVGFallback />;
  return <Globe3DCanvas />;
}

function Globe3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelLayerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mount = mountRef.current;
    const labelLayer = labelLayerRef.current;
    if (!mount || !labelLayer) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Globe
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.2;
    scene.add(globeGroup);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x041454, emissive: 0x020b2e, shininess: 40 }),
    );
    globeGroup.add(sphere);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.001, 36, 24),
      new THREE.MeshBasicMaterial({ color: 0x1a3a8a, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    globeGroup.add(wire);

    // Dark pentagon "patches" — small dark triangles scattered to evoke a football
    const patchGeom = new THREE.IcosahedronGeometry(RADIUS * 1.006, 1);
    const patchMat = new THREE.MeshBasicMaterial({ color: 0x010820, transparent: true, opacity: 0.85 });
    const positionsAttr = patchGeom.getAttribute("position");
    // sample every Nth face and place a small disc
    for (let i = 0; i < positionsAttr.count; i += 9) {
      const v = new THREE.Vector3(
        positionsAttr.getX(i),
        positionsAttr.getY(i),
        positionsAttr.getZ(i),
      ).normalize().multiplyScalar(RADIUS * 1.008);
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(0.28, 5),
        patchMat,
      );
      disc.position.copy(v);
      disc.lookAt(0, 0, 0);
      disc.rotateY(Math.PI);
      globeGroup.add(disc);
    }
    patchGeom.dispose();

    // Atmosphere ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS * 1.18, 0.012, 16, 128),
      new THREE.MeshBasicMaterial({ color: 0x7b2fff, transparent: true, opacity: 0.35 }),
    );
    ring.rotation.x = Math.PI / 2 + 0.25;
    scene.add(ring);

    // Lights
    scene.add(new THREE.AmbientLight(0x1a3a8a, 0.6));
    const point = new THREE.PointLight(0xffffff, 1.2, 100);
    point.position.set(5, 5, 5);
    scene.add(point);
    const rim = new THREE.PointLight(0xc850c0, 0.5, 50);
    rim.position.set(-5, -3, -5);
    scene.add(rim);

    // Markers
    const markers: { team: GlobeTeam; mesh: THREE.Mesh; pos: THREE.Vector3; label: HTMLDivElement }[] = [];
    const markerGeom = new THREE.SphereGeometry(0.045, 12, 12);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    for (const team of GLOBE_TEAMS) {
      const pos = latLongToVector3(team.lat, team.lon, RADIUS);
      const m = new THREE.Mesh(markerGeom, markerMat.clone());
      m.position.copy(pos);
      globeGroup.add(m);

      // pin line
      const dir = pos.clone().normalize();
      const lineGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.18, 6);
      const line = new THREE.Mesh(lineGeom, new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 }));
      line.position.copy(pos.clone().add(dir.clone().multiplyScalar(0.09)));
      line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      globeGroup.add(line);

      // HTML label
      const label = document.createElement("div");
      label.className = "globe-label";
      label.dataset.short = team.short;
      const flagUrl = getFlagUrl(team.name, 40);
      label.innerHTML = `${flagUrl ? `<img class="g-flag-img" src="${flagUrl}" alt="${team.name}" />` : `<span class="g-flag">${team.flag}</span>`}<span class="g-short">${team.short}</span><span class="g-tip">${team.name}</span>`;
      label.addEventListener("click", () => navigate({ to: "/teams" }));
      labelLayer.appendChild(label);

      markers.push({ team, mesh: m, pos, label });
    }

    // Drag to rotate
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velY = 0;
    let velX = 0;
    const dom = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      dom.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      velY = dx * 0.005;
      velX = dy * 0.005;
      globeGroup.rotation.y += velY;
      globeGroup.rotation.x = THREE.MathUtils.clamp(globeGroup.rotation.x + velX, -1, 1);
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => {
      isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.002, 4, 9);
    };
    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    dom.addEventListener("pointercancel", onUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    const tmp = new THREE.Vector3();
    const tick = () => {
      if (!isDragging) {
        globeGroup.rotation.y += 0.002;
        velY *= 0.95;
        velX *= 0.95;
      }
      ring.rotation.z -= 0.001;

      // project labels
      for (const mk of markers) {
        tmp.copy(mk.pos).applyMatrix4(globeGroup.matrixWorld);
        const projected = tmp.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        // hide if behind globe (compare world position vs camera dir)
        const camDir = new THREE.Vector3().subVectors(camera.position, tmp).normalize();
        const surfaceNormal = tmp.clone().normalize();
        const facing = camDir.dot(surfaceNormal) > 0.05;
        mk.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        mk.label.style.opacity = facing ? "1" : "0";
        mk.label.style.pointerEvents = facing ? "auto" : "none";
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointercancel", onUp);
      dom.removeEventListener("wheel", onWheel);
      markers.forEach((m) => {
        m.label.remove();
        (m.mesh.material as THREE.Material).dispose();
      });
      markerGeom.dispose();
      sphere.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [navigate]);

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0" />
      <div ref={labelLayerRef} className="absolute inset-0 pointer-events-none" />
      <style>{`
        .globe-label {
          position: absolute; top: 0; left: 0;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 3px 8px; border-radius: 999px;
          background: rgba(2, 11, 46, 0.7);
          border: 1px solid rgba(0, 240, 255, 0.35);
          backdrop-filter: blur(6px);
          font-family: var(--font-mono);
          font-size: 10px; color: #f0f4ff; letter-spacing: 0.08em;
          cursor: pointer; transition: all .25s ease;
          animation: glb-pulse 2.6s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .globe-label .g-flag { font-size: 12px; }
        .globe-label .g-flag-img { width: 16px; height: 11px; object-fit: cover; border-radius: 2px; border: 1px solid rgba(255,255,255,0.15); }
        .globe-label .g-tip {
          position: absolute; left: 50%; top: -22px; transform: translateX(-50%) scale(.9);
          opacity: 0; pointer-events: none; white-space: nowrap;
          background: #020B2E; border: 1px solid rgba(255,255,255,.15);
          padding: 2px 6px; border-radius: 4px; font-size: 10px;
          transition: opacity .2s ease;
        }
        .globe-label:hover { transform: translate(-50%, -50%) scale(1.18) !important; border-color: #00f0ff; box-shadow: 0 0 16px rgba(0,240,255,.5); }
        .globe-label:hover .g-tip { opacity: 1; }
        @keyframes glb-pulse {
          0%,100% { box-shadow: 0 0 0 rgba(0,240,255,0); }
          50% { box-shadow: 0 0 12px rgba(0,240,255,.45); }
        }
      `}</style>
    </div>
  );
}

function GlobeSVGFallback() {
  // Equirectangular projection of marker lat/long onto a circle-ish SVG world map
  const project = (lat: number, lon: number) => ({
    x: ((lon + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 50" className="w-full h-auto opacity-90">
        <defs>
          <radialGradient id="gfb" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0A2070" />
            <stop offset="100%" stopColor="#020B2E" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="25" rx="48" ry="22" fill="url(#gfb)" stroke="#1A3A8A" strokeWidth="0.3" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={2 + i * 12} y1="3" x2={2 + i * 12} y2="47" stroke="#1A3A8A" strokeWidth="0.1" opacity="0.4" />
        ))}
        {GLOBE_TEAMS.map((t) => {
          const p = project(t.lat, t.lon);
          return (
            <g key={t.short}>
              <circle cx={p.x} cy={p.y / 2 + 12.5} r="0.7" fill="#00f0ff">
                <animate attributeName="r" values="0.7;1.2;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={p.x + 1.5} y={p.y / 2 + 13} fontSize="2" fill="#f0f4ff" fontFamily="monospace">{t.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}