import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMenu, LuChevronDown, LuLogOut, LuSettings } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import GlobalSearch from "../components/app/GlobalSearch";
import NotificationsDropdown from "../components/app/NotificationsDropdown";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-bg/80 backdrop-blur-xl px-4 sm:px-6 py-3.5">
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden text-text-muted hover:text-text p-1"
        aria-label="Open navigation"
      >
        <LuMenu size={20} aria-hidden="true" />
      </button>

      <GlobalSearch />

      <div className="flex-1 sm:flex-none" />

      <NotificationsDropdown />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
          aria-expanded={menuOpen}
        >
          <span className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {initials(user?.name ?? "SkyShield User")}
          </span>
          <span className="hidden sm:block text-left">
            <span className="block text-sm font-medium text-text leading-tight">{user?.name ?? "Demo User"}</span>
            <span className="block text-xs text-text-muted leading-tight">{user?.role ?? "Security Engineer"}</span>
          </span>
          <LuChevronDown size={14} className="hidden sm:block text-text-muted" aria-hidden="true" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
            <Link
              to="/app/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-white/5 transition-colors"
            >
              <LuSettings size={15} aria-hidden="true" />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-white/5 transition-colors"
            >
              <LuLogOut size={15} aria-hidden="true" />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
