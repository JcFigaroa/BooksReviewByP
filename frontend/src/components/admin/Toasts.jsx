const tones = {
  success: "border-pine-100 bg-pine-50 text-pine-700",
  error: "border-berry-100 bg-berry-50 text-berry-700",
};

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex animate-fade-up items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-cozy ${tones[t.tone]}`}
        >
          <span aria-hidden>{t.tone === "success" ? "❄" : "☕"}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
