import { useCountUp, useInViewOnce } from "@/hooks/useCountUp";

export function CountUp({ end, duration = 1600, suffix = "", prefix = "", decimals = 0, className }: {
  end: number; duration?: number; suffix?: string; prefix?: string; decimals?: number; className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const v = useCountUp(end, duration, inView);
  const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return <span ref={ref} className={className}>{prefix}{formatted}{suffix}</span>;
}
