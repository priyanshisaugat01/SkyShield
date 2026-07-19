import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuShieldAlert, LuActivity } from "react-icons/lu";
import { findings } from "../../data/mock/findings";
import { cloudwatchAlarms } from "../../data/mock/dashboardOps";

interface NotificationItem {
  id: string;
  icon: typeof LuShieldAlert;
  title: string;
  detail: string;
  time: string;
  path: string;
}

const notifications: NotificationItem[] = [
  ...findings
    .filter((f) => f.severity === "Critical")
    .slice(0, 3)
    .map((f) => ({ id: f.id, icon: LuShieldAlert, title: f.title, detail: f.resource, time: f.discovered, path: "/app/findings" })),
  ...cloudwatchAlarms
    .filter((a) => a.status === "ALARM")
    .map((a) => ({ id: a.name, icon: LuActivity, title: `CloudWatch alarm: ${a.name}`, detail: "Threshold breached", time: "12m ago", path: "/app/ec2" })),
];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.length);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle() {
    setOpen((v) => !v);
    if (!open) setUnread(0);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative text-text-muted hover:text-text transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <LuBell size={18} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-danger" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-text">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-muted text-center">You're all caught up.</p>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                >
                  <item.icon size={15} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-text truncate">{item.title}</span>
                    <span className="block text-xs text-text-muted truncate">{item.detail}</span>
                  </span>
                  <span className="text-[10px] text-text-muted shrink-0">{item.time}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
