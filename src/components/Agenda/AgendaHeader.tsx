import type { CalView, AgendaLabels } from './types';
import { fmtPeriodTitle } from './utils';

interface Props {
  refDate: Date;
  colCount: number;
  view: CalView;
  loading: boolean;
  locale: string;
  labels: Required<Omit<AgendaLabels, 'more'>>;
  filterSlot?: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: CalView) => void;
}

export function AgendaHeader({
  refDate, colCount, view, loading, locale, labels,
  filterSlot, onPrev, onNext, onToday, onViewChange,
}: Props) {
  const title = view === 'month'
    ? fmtPeriodTitle(refDate, -1, locale)
    : fmtPeriodTitle(refDate, colCount, locale);

  return (
    <div className="cal-header">
      <div className="cal-header-row">
        <div className="cal-header-title-wrap">
          <h2 className="cal-header-title">{title}</h2>
          {loading && <span className="cal-loading-dot" aria-hidden />}
        </div>

        <div className="cal-header-nav">
          <button
            className="cal-icon-btn"
            onClick={onPrev}
            aria-label="Previous"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className="cal-today-btn"
            onClick={onToday}
            type="button"
          >
            {labels.today}
          </button>

          <button
            className="cal-icon-btn"
            onClick={onNext}
            aria-label="Next"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="cal-header-controls">
        {filterSlot && <div className="cal-filter-slot">{filterSlot}</div>}

        <div className="cal-view-switcher" style={{ marginLeft: filterSlot ? undefined : 'auto' }}>
          {(['month', 'week', 'day'] as CalView[]).map(v => (
            <button
              key={v}
              type="button"
              className={`cal-view-btn${view === v ? ' active' : ''}`}
              onClick={() => onViewChange(v)}
            >
              {labels[v]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
