import { getFlagUrl } from "@/data/flagMap";

interface TeamFlagProps {
  country: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeMap: Record<NonNullable<TeamFlagProps["size"]>, { img: 40 | 80 | 160; className: string }> = {
  sm: { img: 40, className: "w-6 h-4" },
  md: { img: 80, className: "w-10 h-7" },
  lg: { img: 160, className: "w-16 h-11" },
  xl: { img: 160, className: "w-24 h-16" },
  "2xl": { img: 160, className: "w-32 h-20" },
};

export default function TeamFlag({ country, size = "md", className = "" }: TeamFlagProps) {
  const { img, className: sizeClass } = sizeMap[size];
  const url = getFlagUrl(country, img);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={`${country} flag`}
      loading="lazy"
      className={`inline-block object-cover rounded-[3px] border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-transform duration-200 ${sizeClass} ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}