import type { AgendaEvent, AgendaLabels } from './types';
import { sameDay, eventDate, eventTimeStr, eventTimeMin, getMonthGrid, fmtDate } from './utils';

interface Props {
  refDate: Date;
  events: AgendaEvent[];
  locale: string;
  maxChips?: number;
  labels: Pick<AgendaLabels, 'more'>;
  onDayClick?: (dateStr: string) => void;
  onEventClick?: (event: AgendaEvent) => void;
  onMoreClick?: (dateStr: string) => void;
}

export function MonthView({
  refDate, events, locale, maxChips = 3, labels,
  onDayClick, onEventClick, onMoreClick,
}: Props) {
  const grid = getMonthGrid(refDate.getFullYear(), refDate.getMonth());
  const today = new Date();
  const weeks = Array.from({ length: 6 }, (_, w) => grid.slice(w * 7, w * 7 + 7));
  const dayAbbrs = Array.from({ length: 7 }, (_, i) =>
    new Date(2023, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }),
  );

  function eventsForDay(day: Date): AgendaEvent[] {
    return events
      .filter(ev => sameDay(eventDate(ev), day))
      .sort((a, b) => eventTimeMin(a) - eventTimeMin(b));
  }

  return (
    <div className="cal-month">
      <div className="cal-dow-header">
        {dayAbbrs.map(abbr => (
          <div key={abbr} className="cal-dow-label">{abbr}</div>
        ))}
      </div>
      <div className="cal-month-weeks">
        {weeks.map((week, wi) => (
          <div key={wi} className="cal-month-week">
            {week.map((day, di) => {
              const outside = day.getMonth() !== refDate.getMonth();
              const isToday = sameDay(day, today);
              const dayEvents = eventsForDay(day);
              const shown = dayEvents.slice(0, maxChips);
              const overflow = dayEvents.length - shown.length;

              return (
                <div
                  key={di}
                  className={[
                    'cal-month-cell',
                    outside ? 'outside' : '',
                    isToday ? 'is-today' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => onDayClick?.(fmtDate(day))}
                >
                  <span className="cal-day-num">{day.getDate()}</span>
                  {shown.map(ev => (
                    <span
                      key={ev.id}
                      className="cal-chip"
                      data-event-status={ev.status}
                      style={ev.color ? { backgroundColor: ev.color } : undefined}
                      onClick={e => { e.stopPropagation(); onEventClick?.(ev); }}
                    >
                      {eventTimeStr(ev)} {ev.title}
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span
                      className="cal-chip-more"
                      onClick={e => { e.stopPropagation(); onMoreClick?.(fmtDate(day)); }}
                    >
                      {labels.more ? labels.more(overflow) : `+${overflow} more`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
