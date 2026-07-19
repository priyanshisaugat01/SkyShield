import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { LuX } from "react-icons/lu";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ToastProvider } from "../context/ToastContext";
import ToastViewport from "../components/ui/ToastViewport";

export default function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ToastProvider>
    <div className="min-h-screen bg-bg">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-bg-secondary/40">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-bg-secondary border-r border-white/10 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="absolute top-6 right-4 text-text-muted hover:text-text"
                aria-label="Close navigation"
              >
                <LuX size={20} aria-hidden="true" />
              </button>
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
    </ToastProvider>
  );
}
