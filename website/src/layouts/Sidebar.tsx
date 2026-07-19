import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";
import { appNavGroups } from "../data/appNav";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5">
        <NavLink to="/app" aria-label="SkyShield dashboard home">
          <Logo />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-6" aria-label="Dashboard">
        {appNavGroups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/app"}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent/15 text-text"
                          : "text-text-muted hover:text-text hover:bg-white/5"
                      }`
                    }
                  >
                    <item.icon size={16} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
