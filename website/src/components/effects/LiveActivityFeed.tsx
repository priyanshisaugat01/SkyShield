import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EVENT_POOL, SEVERITY_COLOR, type LiveEvent } from "../../data/liveActivityEvents";

const VISIBLE_COUNT = 6;
const TICK_MS = 3200;

function randomEvent(existingIds: Set<string>): LiveEvent {
  const source = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
  let id = `${source.resource}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  while (existingIds.has(id)) {
    id = `${source.resource}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  return { ...source, id };
}

function seedEvents(): LiveEvent[] {
  const events: LiveEvent[] = [];
  const ids = new Set<string>();
  for (let i = 0; i < VISIBLE_COUNT; i++) {
    const event = randomEvent(ids);
    ids.add(event.id);
    events.push(event);
  }
  return events;
}

export default function LiveActivityFeed() {
  const prefersReducedMotion = useReducedMotion();
  const [events, setEvents] = useState<LiveEvent[]>(seedEvents);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setEvents((current) => {
        const ids = new Set(current.map((e) => e.id));
        const next = randomEvent(ids);
        return [next, ...current].slice(0, VISIBLE_COUNT);
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="divide-y divide-white/5">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-3 px-4 sm:px-5 py-3 text-sm"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: SEVERITY_COLOR[event.severity] }}
              aria-hidden="true"
            />
            <span className="flex-1 min-w-0 text-text truncate">{event.message}</span>
            <span className="hidden sm:inline text-text-muted text-xs shrink-0">{event.resource}</span>
            <span className="text-text-muted text-xs w-14 text-right shrink-0">now</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
