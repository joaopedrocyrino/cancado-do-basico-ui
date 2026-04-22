import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './ListPage.css';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SortOption<S> {
  value: string;
  label: string;
  sortBy: S;
  sortDir: 'ASC' | 'DESC';
}

export interface FilterChip {
  key: string;
  label: string;
}

export interface ListPageFetchParams<S> {
  search: string;
  sortBy: S;
  sortDir: 'ASC' | 'DESC';
  page: number;
  limit: number;
  filter?: Record<string, string>;
}

export interface ListPageResult<T> {
  data: T[];
  total: number;
}

export interface ListPageProps<T, S> {
  title: string;
  onAction?: () => void;
  searchPlaceholder?: string;
  sortOptions: SortOption<S>[];
  chips?: Record<string, FilterChip[]>;
  fetchFn: (params: ListPageFetchParams<S>) => Promise<ListPageResult<T>>;
  renderItem: (item: T) => ReactNode;
  emptyLabel?: string;
  refresh?: number;
  limit?: number;
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PTR_THRESHOLD = 62;
const PTR_MAX = 76;

export function ListPage<T, S>({
  title,
  onAction,
  searchPlaceholder = 'Search…',
  sortOptions,
  chips,
  fetchFn,
  renderItem,
  emptyLabel = 'No items found.',
  refresh,
  limit = 50,
}: ListPageProps<T, S>) {
  const defaultSort = sortOptions[0];

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption<S>>(defaultSort);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Array<[string, string]>>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    if (isRefreshing) return;
    if ((listRef.current?.scrollTop ?? 1) === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy <= 0) { touchStartY.current = null; setIsDragging(false); return; }
    setPullY(Math.min(dy * 0.42, PTR_MAX));
  }

  function handleTouchEnd() {
    if (touchStartY.current === null) return;
    touchStartY.current = null;
    setIsDragging(false);
    if (pullY >= PTR_THRESHOLD) {
      setIsRefreshing(true);
      setRefreshKey(v => v + 1);
      setTimeout(() => { setIsRefreshing(false); setPullY(0); }, 1400);
    } else {
      setPullY(0);
    }
  }

  // ── Data fetching ───────────────────────────────────────────────────────────

  const fetchRef = useRef(fetchFn);
  useLayoutEffect(() => { fetchRef.current = fetchFn; });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 350);
  }

  function handleSortChange(value: string) {
    const opt = sortOptions.find(o => o.value === value);
    if (opt) { setSort(opt); setPage(1); }
  }

  function handleFilterChange(key: string, filterValue: string) {
    const alreadyFiltered = activeFilters.find(f => f[0] === key && f[1] === filterValue);
    if (alreadyFiltered)
      setActiveFilters(af => af.filter(i => i[0] !== key));
    else
      setActiveFilters(af => [...af.filter(i => i[0] !== key), [key, filterValue]]);
    setPage(1);
  }

  useEffect(() => {
    let cancelled = false;
    const filter: Record<string, string> = {};
    if (activeFilters.length) {
      activeFilters.forEach(([k, v]) => { filter[k] = v; });
    }

    fetchRef.current({
      search,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
      page,
      limit,
      filter,
    })
      .then(result => {
        if (cancelled) return;
        setItems(result.data);
        setTotal(result.total);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [search, sort, page, activeFilters, refreshKey, refresh, limit]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="lp-page">

      <div className="lp-header">
        <h1 className="lp-title">{title}</h1>
        {loading && <span className="lp-loading-dot" aria-hidden="true" />}
      </div>

      <div className="lp-toolbar">
        <div className="lp-search-wrap">
          <svg className="lp-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            className="lp-search-input"
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
          />
          {searchInput && (
            <button
              className="lp-search-clear"
              onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
              aria-label="Clear"
            >
              ×
            </button>
          )}
        </div>

        {((chips && Object.keys(chips).length > 0) || sortOptions.length > 1) && (
          <div className="lp-filter-row">
            {chips && Object.keys(chips).length > 0 && (
              <div className="lp-chips" role="group" aria-label="Filter" ref={chipsRef}>
                {Object.entries(chips).map(([filterKey, groupChips], groupIdx) => (
                  <div key={filterKey} className="lp-chip-group">
                    {groupIdx > 0 && <span className="lp-chip-divider" aria-hidden="true" />}
                    {groupChips.map(chip => (
                      <button
                        key={chip.key}
                        className={`lp-chip${activeFilters.find(i => i[0] === filterKey && i[1] === chip.key) ? ' lp-chip--active' : ''}`}
                        onClick={() => handleFilterChange(filterKey, chip.key)}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {sortOptions.length > 1 && (
              <div className="lp-sort-wrap">
                <select
                  className="lp-sort-select"
                  value={sort.value}
                  onChange={e => handleSortChange(e.target.value)}
                  aria-label="Sort"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="lp-sort-chevron" aria-hidden="true"><ChevronDown /></span>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="lp-ptr"
        aria-hidden="true"
        style={{
          height: isRefreshing ? PTR_MAX : pullY,
          transition: isDragging ? 'none' : 'height 0.38s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {isRefreshing ? (
          <span className="lp-ptr-spinner">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeDasharray="36 12" />
            </svg>
          </span>
        ) : (
          <span
            className="lp-ptr-arrow"
            style={{
              opacity: Math.min(pullY / PTR_THRESHOLD, 1),
              transform: `rotate(${pullY >= PTR_THRESHOLD ? 180 : 0}deg)`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M4 11l6 6 6-6" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {loading ? (
        <div className="lp-empty"
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          …
        </div>
      ) : items.length === 0 ? (
        <div className="lp-empty"
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          {emptyLabel}
        </div>
      ) : (
        <div
          className="lp-list"
          ref={listRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map(item => renderItem(item))}

          {totalPages > 1 && (
            <div className="lp-pagination">
              <button
                className="lp-page-btn"
                onClick={() => setPage(p => p - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                  <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="lp-page-info">{page} / {totalPages}</span>
              <button
                className="lp-page-btn"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                  <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {onAction && (
        <button className="lp-fab" onClick={onAction} aria-label={`New ${title}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M11 3v16M3 11h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
