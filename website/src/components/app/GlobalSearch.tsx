import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { search, type SearchResult } from "../../data/searchIndex";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = search(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function selectResult(result: SearchResult) {
    navigate(result.path);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectResult(results[activeIndex]);
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md hidden sm:block">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 focus-within:border-accent/40 transition-colors">
        <LuSearch size={15} className="text-text-muted shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search resources, findings, pipelines..."
          role="combobox"
          aria-expanded={open}
          aria-controls="global-search-results"
          className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/60 outline-none"
        />
        <kbd className="hidden md:inline text-[10px] text-text-muted/60 border border-white/10 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>

      {open && query.trim() && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 right-0 mt-2 rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden max-h-96 overflow-y-auto z-50"
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-muted text-center">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            results.map((result, index) => (
              <button
                key={`${result.category}-${result.id}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => selectResult(result)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === activeIndex ? "bg-white/5" : ""
                }`}
              >
                <result.icon size={15} className="text-accent-2 shrink-0" aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-text truncate">{result.label}</span>
                  <span className="block text-xs text-text-muted truncate">{result.sublabel}</span>
                </span>
                <span className="text-[10px] text-text-muted shrink-0 uppercase tracking-wide">{result.category}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
