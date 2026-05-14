export function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }} aria-label="Loading">
      <span className="absolute inset-0 rounded-full border-2 border-neon-cyan/30" />
      <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan border-r-neon-violet animate-spin" />
      <span className="absolute inset-2 rounded-full bg-neon-cyan/30 animate-pulse" />
    </div>
  );
}
