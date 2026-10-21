import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg animate-fade-up flex-col rounded-t-3xl bg-frost-50 shadow-cozy sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-frost-200 px-6 py-4">
          <h2 className="text-xl text-ink-900">{title}</h2>
          <button onClick={onClose} className="btn-ghost -mr-2 px-2 py-1 text-lg" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer && <div className="flex justify-end gap-2 border-t border-frost-200 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
