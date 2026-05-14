export function ParticleBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-neon-cyan/15 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full bg-neon-violet/20 blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />
      <div className="absolute -bottom-40 left-1/3 w-[420px] h-[420px] rounded-full bg-neon-gold/10 blur-3xl animate-blob" style={{ animationDelay: "-8s" }} />
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
    </div>
  );
}

export function GridOverlay() {
  return <div aria-hidden className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />;
}
