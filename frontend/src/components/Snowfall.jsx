// Site-wide snowfall drawn above page content (but below the navbar, modals and toasts)
// and ignoring pointer events, so it never blocks clicks. Deterministic flakes so the layout doesn't shift between renders.
const flakes = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 3 + (i % 5),
  duration: 14 + ((i * 7) % 16),
  delay: -((i * 3) % 20),
}));

export default function Snowfall() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
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
