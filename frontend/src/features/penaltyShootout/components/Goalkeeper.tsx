import { motion } from "framer-motion";
import type { Direction } from "../types/shootout.types";
import { difficultyDiveSettings } from "../utils/aiLogic";
import { useShootoutStore } from "../store/shootoutStore";
import { directionToX } from "../utils/shotPhysics";

export function Goalkeeper({ dive }: { dive: Direction | null }) {
  const difficulty = useShootoutStore((state) => state.difficulty);
  const settings = difficultyDiveSettings[difficulty];

  return (
    <motion.div
      className="absolute left-1/2 top-19 z-20 -translate-x-1/2"
      animate={{
        x: directionToX(dive) * 0.72,
        y: dive ? -14 : 0,
        rotate: dive === "left" ? -34 : dive === "right" ? 34 : 0,
        scaleX: dive === "center" ? 1.08 : 1,
      }}
      transition={
        dive
          ? { type: "spring", stiffness: settings.stiffness, damping: 17, delay: settings.delay }
          : { duration: 0.2 }
      }
    >
      {/* Ground shadow */}
      <div className="absolute left-1/2 top-full h-5 w-24 -translate-x-1/2 rounded-full bg-black/40 blur-md" />

      <svg
        width="110"
        height="210"
        viewBox="0 0 110 210"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.5))" }}
      >
        <defs>
          {/* Skin */}
          <linearGradient id="gk-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDDBB4" />
            <stop offset="100%" stopColor="#E8A870" />
          </linearGradient>
          {/* Jersey — bright orange keeper kit */}
          <linearGradient id="gk-jersey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="60%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          {/* Shorts */}
          <linearGradient id="gk-short" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          {/* Gloves */}
          <linearGradient id="gk-glove" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          {/* Legs */}
          <linearGradient id="gk-leg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDDBB4" />
            <stop offset="100%" stopColor="#D4956B" />
          </linearGradient>
          {/* Socks */}
          <linearGradient id="gk-sock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          {/* Boots */}
          <linearGradient id="gk-boot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          {/* Hair */}
          <linearGradient id="gk-hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D2B1F" />
            <stop offset="100%" stopColor="#1C1207" />
          </linearGradient>
        </defs>

        {/* ─── BOOTS ─── */}
        <rect x="18" y="186" width="30" height="16" rx="7" fill="url(#gk-boot)" />
        <rect x="62" y="186" width="30" height="16" rx="7" fill="url(#gk-boot)" />
        {/* boot highlight stripe */}
        <rect x="20" y="189" width="14" height="3" rx="1.5" fill="#475569" opacity="0.8" />
        <rect x="64" y="189" width="14" height="3" rx="1.5" fill="#475569" opacity="0.8" />

        {/* ─── SOCKS ─── */}
        <rect x="22" y="155" width="22" height="34" rx="5" fill="url(#gk-sock)" />
        <rect x="66" y="155" width="22" height="34" rx="5" fill="url(#gk-sock)" />
        {/* sock stripe */}
        <rect x="22" y="162" width="22" height="4" rx="0" fill="#FED7AA" opacity="0.55" />
        <rect x="66" y="162" width="22" height="4" rx="0" fill="#FED7AA" opacity="0.55" />

        {/* ─── THIGHS ─── */}
        <path d="M26 117 Q20 142 22 158 L44 158 Q46 142 46 117 Z" fill="url(#gk-leg)" />
        <path d="M64 117 Q64 142 66 158 L88 158 Q88 142 80 117 Z" fill="url(#gk-leg)" />

        {/* ─── SHORTS ─── */}
        <path d="M18 98 L92 98 L96 125 L68 125 L55 105 L42 125 L14 125 Z" fill="url(#gk-short)" />
        {/* shorts trim */}
        <rect x="18" y="98" width="74" height="5" rx="2" fill="#F97316" opacity="0.4" />

        {/* ─── JERSEY BODY ─── */}
        <path
          d="M14 58 L14 100 Q14 106 28 106 L82 106 Q96 106 96 100 L96 58 Q82 50 68 48 L55 51 L42 48 Q28 50 14 58 Z"
          fill="url(#gk-jersey)"
        />
        {/* jersey chest panel */}
        <rect x="43" y="62" width="24" height="28" rx="3" fill="#FDBA74" opacity="0.18" />
        {/* number */}
        <text
          x="55"
          y="82"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          fill="white"
          opacity="0.92"
        >
          01
        </text>
        {/* collar */}
        <path
          d="M43 49 Q55 56 67 49 L64 60 Q55 65 46 60 Z"
          fill="#C2410C"
        />

        {/* ─── LEFT ARM ─── */}
        <path
          d="M14 58 Q2 63 -4 78 L-8 108 Q-9 120 0 123 L10 123 Q16 120 18 108 L22 78 Z"
          fill="url(#gk-jersey)"
        />
        {/* left forearm */}
        <path
          d="M0 123 Q-5 138 -4 155 L8 157 Q14 142 10 123 Z"
          fill="url(#gk-leg)"
        />

        {/* ─── RIGHT ARM ─── */}
        <path
          d="M96 58 Q108 63 114 78 L118 108 Q119 120 110 123 L100 123 Q94 120 92 108 L88 78 Z"
          fill="url(#gk-jersey)"
        />
        {/* right forearm */}
        <path
          d="M110 123 Q115 138 114 155 L102 157 Q96 142 100 123 Z"
          fill="url(#gk-leg)"
        />

        {/* ─── GLOVES ─── */}
        {/* Left glove */}
        <rect x="-14" y="152" width="26" height="18" rx="7" fill="url(#gk-glove)" stroke="#94A3B8" strokeWidth="0.8" />
        {/* thumb */}
        <rect x="-20" y="154" width="10" height="13" rx="5" fill="url(#gk-glove)" stroke="#94A3B8" strokeWidth="0.8" />
        {/* finger seams */}
        <line x1="-5" y1="153" x2="-6" y2="169" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="2" y1="152" x2="1" y2="169" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="8" y1="153" x2="7" y2="169" stroke="#CBD5E1" strokeWidth="1.2" />
        {/* grip stripe */}
        <rect x="-14" y="160" width="26" height="4" rx="2" fill="#F97316" opacity="0.75" />

        {/* Right glove */}
        <rect x="98" y="152" width="26" height="18" rx="7" fill="url(#gk-glove)" stroke="#94A3B8" strokeWidth="0.8" />
        {/* thumb */}
        <rect x="120" y="154" width="10" height="13" rx="5" fill="url(#gk-glove)" stroke="#94A3B8" strokeWidth="0.8" />
        {/* finger seams */}
        <line x1="106" y1="153" x2="107" y2="169" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="113" y1="152" x2="114" y2="169" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="119" y1="153" x2="118" y2="169" stroke="#CBD5E1" strokeWidth="1.2" />
        {/* grip stripe */}
        <rect x="98" y="160" width="26" height="4" rx="2" fill="#F97316" opacity="0.75" />

        {/* ─── NECK ─── */}
        <rect x="47" y="34" width="16" height="16" rx="5" fill="url(#gk-skin)" />

        {/* ─── HEAD ─── */}
        <ellipse cx="55" cy="22" rx="26" ry="28" fill="url(#gk-skin)" />

        {/* ─── HAIR ─── */}
        <path
          d="M31 16 Q33 -4 55 -7 Q77 -4 79 16 Q70 4 55 2 Q40 4 31 16 Z"
          fill="url(#gk-hair)"
        />
        {/* sideburns */}
        <path d="M31 16 Q28 24 30 30 Q32 22 34 18 Z" fill="url(#gk-hair)" />
        <path d="M79 16 Q82 24 80 30 Q78 22 76 18 Z" fill="url(#gk-hair)" />

        {/* ─── EARS ─── */}
        <ellipse cx="30" cy="24" rx="5" ry="7" fill="#E8A870" />
        <ellipse cx="80" cy="24" rx="5" ry="7" fill="#E8A870" />
        <ellipse cx="30" cy="24" rx="3" ry="4.5" fill="#D4956B" />
        <ellipse cx="80" cy="24" rx="3" ry="4.5" fill="#D4956B" />

        {/* ─── EYEBROWS ─── */}
        <path d="M39 14 Q46 11 52 13" fill="none" stroke="#4B2C0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 13 Q64 11 71 14" fill="none" stroke="#4B2C0B" strokeWidth="2" strokeLinecap="round" />

        {/* ─── EYES ─── */}
        <ellipse cx="46" cy="21" rx="6" ry="5" fill="white" />
        <ellipse cx="64" cy="21" rx="6" ry="5" fill="white" />
        <circle cx="47" cy="22" r="3.5" fill="#3D2B1F" />
        <circle cx="65" cy="22" r="3.5" fill="#3D2B1F" />
        <circle cx="47" cy="21" r="1.8" fill="#0F172A" />
        <circle cx="65" cy="21" r="1.8" fill="#0F172A" />
        {/* eye shine */}
        <circle cx="49" cy="20" r="1.2" fill="white" />
        <circle cx="67" cy="20" r="1.2" fill="white" />

        {/* ─── NOSE ─── */}
        <path d="M52 28 Q55 33 58 28" fill="none" stroke="#C17B52" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="50" cy="31" rx="2" ry="1.5" fill="#D4956B" />
        <ellipse cx="60" cy="31" rx="2" ry="1.5" fill="#D4956B" />

        {/* ─── MOUTH ─── */}
        <path d="M46 38 Q55 44 64 38" fill="none" stroke="#9B4A2A" strokeWidth="1.5" strokeLinecap="round" />

        {/* ─── CAPTAIN ARMBAND (left arm accent) ─── */}
        <rect x="14" y="92" width="8" height="14" rx="2" fill="#FBBF24" opacity="0.9" />
        <text x="18" y="102" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fontWeight="700" fill="#78350F">C</text>
      </svg>
    </motion.div>
  );
}