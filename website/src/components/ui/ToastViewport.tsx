import { AnimatePresence, motion } from "motion/react";
import { LuCircleCheck, LuInfo, LuTriangleAlert, LuCircleX, LuX } from "react-icons/lu";
import { useToast, type ToastTone } from "../../context/ToastContext";

const TONE_ICON: Record<ToastTone, typeof LuCircleCheck> = {
  success: LuCircleCheck,
  info: LuInfo,
  warning: LuTriangleAlert,
  danger: LuCircleX,
};

const TONE_COLOR: Record<ToastTone, string> = {
  success: "text-accent-2",
  info: "text-accent",
  warning: "text-amber-400",
  danger: "text-danger",
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[min(360px,calc(100vw-2.5rem))]">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = TONE_ICON[toast.tone];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="liquid-glass rounded-xl px-4 py-3.5 flex items-start gap-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
              role="status"
            >
              <Icon size={17} className={`shrink-0 mt-0.5 ${TONE_COLOR[toast.tone]}`} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{toast.title}</p>
                {toast.description && <p className="mt-0.5 text-xs text-text-muted">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-text-muted hover:text-text transition-colors"
                aria-label="Dismiss notification"
              >
                <LuX size={14} aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
