import { useState, useRef, useEffect, useCallback } from 'react';
import type { AgendaEvent, AgendaLabels, CalView } from './types';
import { calcNowTop, fmtYearMonth, getViewDays } from './utils';
import { AgendaHeader } from './AgendaHeader';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import './Agenda.css';

export interface AgendaProps {
  /**
   * Called whenever the component needs events for a date range.
   * Implement caching on the consumer side if desired — the component
   * caches internally by month so it won't re-fetch already-loaded months.
   */
  fetchEvents: (start: Date, end: Date) => Promise<AgendaEvent[]>;

  /** Called when the user clicks an existing event */
  onEventClick?: (event: AgendaEvent) => void;

  /**
   * Called when the user clicks an empty time slot in the week/day view.
   * @param dateStr  YYYY-MM-DD
   * @param time     HH:mm (snapped to 15 min)
   */
  onSlotClick?: (dateStr: string, time: string) => void;

  /**
   * When provided, a floating action button (+) is rendered.
   * Useful for a global "create event" trigger in month view.
   */
  onAddClick?: () => void;

  /**
   * Increment this value to force the Agenda to clear its cache and
   * re-fetch all visible months. Useful after creating or deleting events.
   */
  refreshTrigger?: number;

  /** BCP 47 locale string used for date formatting. Defaults to the browser locale. */
  locale?: string;

  /** Initial calendar view. Defaults to 'week'. */
  defaultView?: CalView;

  /**
   * Render a custom filter control in the header controls row
   * (e.g. a professional selector dropdown).
   */
  filterSlot?: React.ReactNode;

  /** Override any of the default English UI labels */
  labels?: AgendaLabels;
}

const DEFAULT_LABELS: Required<AgendaLabels> = {
  today: 'Today',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  more: (n: number) => `+${n} more`,
};

export function Agenda({
  fetchEvents,
  onEventClick,
  onSlotClick,
  onAddClick,
  refreshTrigger,
  locale = navigator.language,
  defaultView = 'week',
  filterSlot,
  labels = {},
}: AgendaProps) {
  const mergedLabels: Required<AgendaLabels> = { ...DEFAULT_LABELS, ...labels };

  const [view, setView] = useState<CalView>(defaultView);
  const [refDate, setRefDate] = useState(() => new Date());
  const [loading, setLoading] = useState(false);
  const [nowTop, setNowTop] = useState(calcNowTop);

  // colCount: 7=week, 1=day, 0 means month (sentinel)
  const [colCount, setColCount] = useState(() =>
    view === 'month' ? 0 : view === 'day' ? 1 : window.innerWidth >= 640 ? 7 : 3,
  );

  // Event store — deduplicated by ID, cached by month key
  const eventsMapRef = useRef(new Map<string, AgendaEvent>());
  const loadedMonthsRef = useRef(new Set<string>());
  const [events, setEvents] = useState<AgendaEvent[]>([]);

  const weekBodyRef = useRef<HTMLDivElement>(null);

  // ── Helpers ──────────────────────────────────────────────────────────

  function getVisibleMonthKeys(date: Date, cv: CalView, cc: number): string[] {
    if (cv === 'month') {
      // Month grid may show up to 2 adjacent months
      const keys = new Set<string>();
      keys.add(fmtYearMonth(date));
      const prev = new Date(date.getFullYear(), date.getMonth(), 0);
      keys.add(fmtYearMonth(prev));
      const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      keys.add(fmtYearMonth(next));
      return [...keys];
    }
    if (cv === 'day') {
      return [fmtYearMonth(date)];
    }
    // Week: collect months of all visible days
    const days = getViewDays(date, cc);
    return [...new Set(days.map(d => fmtYearMonth(d)))];
  }

  const loadVisibleMonths = useCallback(
    async (date: Date, cv: CalView, cc: number) => {
      const monthKeys = getVisibleMonthKeys(date, cv, cc);
      const toFetch = monthKeys.filter(k => !loadedMonthsRef.current.has(k));
      if (toFetch.length === 0) return;

      setLoading(true);
      try {
        for (const key of toFetch) {
          const [y, m] = key.split('-').map(Number);
          const start = new Date(y, m - 1, 1, 0, 0, 0);
          const end = new Date(y, m, 0, 23, 59, 59);
          const fetched = await fetchEvents(start, end);
          fetched.forEach(ev => eventsMapRef.current.set(ev.id, ev));
          loadedMonthsRef.current.add(key);
        }
        setEvents([...eventsMapRef.current.values()]);
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents],
  );

  // ── Effects ───────────────────────────────────────────────────────────

  // Clear internal cache when the fetch function or refresh trigger changes
  useEffect(() => {
    eventsMapRef.current.clear();
    loadedMonthsRef.current.clear();
    setEvents([]);
  }, [fetchEvents, refreshTrigger]);

  useEffect(() => {
    loadVisibleMonths(refDate, view, colCount);
  }, [refDate, view, colCount, loadVisibleMonths, refreshTrigger]);

  // Scroll to current time on week/day view mount
  useEffect(() => {
    if (view !== 'month' && weekBodyRef.current && nowTop > 0) {
      const scrollTarget = Math.max(0, nowTop - 120);
      weekBodyRef.current.scrollTop = scrollTarget;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Update "now" indicator every minute
  useEffect(() => {
    const id = setInterval(() => setNowTop(calcNowTop()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Responsive colCount for week view
  useEffect(() => {
    if (view === 'month' || view === 'day') return;
    const update = () => setColCount(window.innerWidth >= 640 ? 7 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [view]);

  // ── Navigation ────────────────────────────────────────────────────────

  function navigate(direction: 1 | -1) {
    setRefDate(prev => {
      const next = new Date(prev);
      if (view === 'month') {
        next.setMonth(prev.getMonth() + direction);
      } else if (view === 'day') {
        next.setDate(prev.getDate() + direction);
      } else {
        next.setDate(prev.getDate() + colCount * direction);
      }
      return next;
    });
  }

  function goToDay(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    setRefDate(new Date(y, m - 1, d));
    setView('day');
    setColCount(1);
  }

  function handleViewChange(v: CalView) {
    setView(v);
    if (v === 'month') setColCount(0);
    else if (v === 'day') setColCount(1);
    else setColCount(window.innerWidth >= 640 ? 7 : 3);
  }

  // ── Render ────────────────────────────────────────────────────────────

  const effectiveColCount = view === 'month' ? 7 : colCount;

  return (
    <div className="cal-layout">
      <AgendaHeader
        refDate={refDate}
        colCount={effectiveColCount}
        view={view}
        loading={loading}
        locale={locale}
        labels={mergedLabels}
        filterSlot={filterSlot}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
        onToday={() => setRefDate(new Date())}
        onViewChange={handleViewChange}
      />

      {view === 'month' ? (
        <MonthView
          refDate={refDate}
          events={events}
          locale={locale}
          labels={mergedLabels}
          onDayClick={goToDay}
          onEventClick={onEventClick}
          onMoreClick={goToDay}
        />
      ) : (
        <WeekView
          refDate={refDate}
          colCount={colCount}
          events={events}
          nowTop={nowTop}
          weekBodyRef={weekBodyRef}
          locale={locale}
          labels={mergedLabels}
          onSlotClick={onSlotClick}
          onEventClick={onEventClick}
          onDayClick={goToDay}
        />
      )}

      {onAddClick && (
        <button
          type="button"
          className="cal-fab"
          onClick={onAddClick}
          aria-label={mergedLabels.today /* reuse prop; consumer should override if needed */}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
