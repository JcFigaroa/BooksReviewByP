// Deterministic flakes so the layout doesn't shift between renders.
const flakes = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 2 + (i % 4),
  duration: 14 + ((i * 7) % 16),
  delay: -((i * 3) % 20),
}));

export default function Snowfall() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-frost-100 via-frost-50 to-ember-50/60" />
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
