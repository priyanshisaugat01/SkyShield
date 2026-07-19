import { useMemo, useState, type ReactNode } from "react";
import { LuSearch, LuArrowUpDown, LuArrowUp, LuArrowDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import GlassCard from "../ui/GlassCard";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: string[];
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  filters?: DataTableFilter[];
  getFilterValue?: (row: T, filterKey: string) => string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  initialFilters?: Record<string, string>;
}

type SortDirection = "asc" | "desc" | null;

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  searchPlaceholder = "Search...",
  searchFn,
  filters = [],
  getFilterValue,
  pageSize = 8,
  onRowClick,
  initialFilters,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => initialFilters ?? {});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data;

    if (query.trim() && searchFn) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((row) => searchFn(row, q));
    }

    for (const filter of filters) {
      const value = activeFilters[filter.key];
      if (value && value !== "All" && getFilterValue) {
        rows = rows.filter((row) => getFilterValue(row, filter.key) === value);
      }
    }

    return rows;
  }, [data, query, activeFilters, filters, searchFn, getFilterValue]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDirection) return filtered;
    const column = columns.find((c) => c.key === sortKey);
    if (!column?.sortValue) return filtered;

    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDirection === "asc" ? av - bv : bv - av;
      }
      return sortDirection === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [filtered, sortKey, sortDirection, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
      setSortDirection(null);
    }
    setPage(1);
  }

  return (
    <GlassCard hover={false} className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-white/10">
        {searchFn && (
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 flex-1 max-w-sm">
            <LuSearch size={14} className="text-text-muted shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/60 outline-none"
            />
          </div>
        )}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={activeFilters[filter.key] ?? "All"}
            onChange={(e) => {
              setActiveFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
              setPage(1);
            }}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-text-muted outline-none focus:border-accent/50"
          >
            <option value="All">{filter.label}: All</option>
            {filter.options.map((option) => (
              <option key={option} value={option} className="bg-card text-text">
                {option}
              </option>
            ))}
          </select>
        ))}
        <span className="sm:ml-auto text-xs text-text-muted">
          {sorted.length} {sorted.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap ${col.className ?? ""}`}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 hover:text-text transition-colors"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDirection === "asc" ? (
                          <LuArrowUp size={12} aria-hidden="true" />
                        ) : (
                          <LuArrowDown size={12} aria-hidden="true" />
                        )
                      ) : (
                        <LuArrowUpDown size={12} className="opacity-40" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginated.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`hover:bg-white/[0.02] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 text-text-muted ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-text-muted text-sm">
                  No results match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-text-muted">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <LuChevronLeft size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <LuChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
