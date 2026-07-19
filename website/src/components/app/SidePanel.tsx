import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuX } from "react-icons/lu";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function SidePanel({ open, onClose, title, subtitle, children }: SidePanelProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-card border-l border-white/10 shadow-[-30px_0_80px_-40px_rgba(0,0,0,0.7)] flex flex-col"
          >
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/10">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-text truncate">{title}</h2>
                {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 text-text-muted hover:text-text transition-colors p-1"
                aria-label="Close panel"
              >
                <LuX size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
