import type { RefObject } from 'react';
import type { AgendaEvent, AgendaLabels } from './types';
import { SLOT_H, START_H, END_H, HOURS } from './types';
import {
  sameDay, eventDate, eventTimeStr, eventTimeMin,
  getViewDays, computeOverlapLayout, fmtDate, pad,
} from './utils';

interface Props {
  refDate: Date;
  colCount: number;
  events: AgendaEvent[];
  nowTop: number;
  weekBodyRef: RefObject<HTMLDivElement>;
  locale: string;
  labels: Pick<AgendaLabels, 'more'>;
  onSlotClick?: (dateStr: string, time: string) => void;
  onEventClick?: (event: AgendaEvent) => void;
  onDayClick?: (dateStr: string) => void;
}

export function WeekView({
  refDate, colCount, events, nowTop, weekBodyRef,
  locale, labels, onSlotClick, onEventClick, onDayClick,
}: Props) {
  const days = getViewDays(refDate, colCount);
  const today = new Date();
  const todayInView = days.some(d => sameDay(d, today));
  const isMobile = colCount <= 3;
  const timeColW = colCount === 7 ? 52 : 40;
  const weekGridCols = `${timeColW}px repeat(${colCount}, 1fr)`;
  const dayAbbrs = Array.from({ length: 7 }, (_, i) =>
    new Date(2023, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }),
  );

  function eventsForDay(day: Date): AgendaEvent[] {
    return events
      .filter(ev => sameDay(eventDate(ev), day))
      .sort((a, b) => eventTimeMin(a) - eventTimeMin(b));
  }

  function handleColClick(day: Date, e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('.cal-event-block')) return;
    if (!onSlotClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const mins = START_H * 60 + (y / SLOT_H) * 60;
    const h = Math.min(Math.floor(mins / 60), END_H - 1);
    const m = Math.min(Math.round((mins % 60) / 15) * 15, 45);
    onSlotClick(fmtDate(day), `${pad(h)}:${pad(m)}`);
  }

  return (
    <div className="cal-week">
      <div className="cal-week-col-header" style={{ gridTemplateColumns: weekGridCols }}>
        <div />
        {days.map((day, i) => (
          <div
            key={i}
            className={`cal-week-day-head${sameDay(day, today) ? ' is-today' : ''}`}
          >
            <div className="cal-week-day-name">{dayAbbrs[day.getDay()]}</div>
            <div className="cal-week-day-num">{day.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="cal-week-body" ref={weekBodyRef}>
        <div
          className="cal-week-body-inner"
          style={{ gridTemplateColumns: weekGridCols, height: `${(END_H - START_H) * SLOT_H}px` }}
        >
          <div className="cal-time-col">
            {HOURS.map(h => (
              <div key={h} className="cal-time-cell">{pad(h)}:00</div>
            ))}
          </div>

          {days.map((day, i) => {
            const dayEvents = eventsForDay(day);
            const layout = computeOverlapLayout(dayEvents);

            const visibleEvents = isMobile
              ? dayEvents.filter(ev => (layout.get(ev.id)?.col ?? 0) < 2)
              : dayEvents;
            const hiddenEvents = isMobile
              ? dayEvents.filter(ev => (layout.get(ev.id)?.col ?? 0) >= 2)
              : [];
            const firstHidden = hiddenEvents.length > 0 ? hiddenEvents[0] : null;

            return (
              <div
                key={i}
                className="cal-week-day-col"
                onClick={e => handleColClick(day, e)}
              >
                {HOURS.map(h => <div key={h} className="cal-hour-row" />)}

                {visibleEvents.map(ev => {
                  const topPx = (eventTimeMin(ev) - START_H * 60) / 60 * SLOT_H;
                  const hPx = Math.max(ev.durationMinutes / 60 * SLOT_H, 22);
                  const { col, totalCols } = layout.get(ev.id) ?? { col: 0, totalCols: 1 };
                  const effectiveCols = isMobile ? Math.min(totalCols, 2) : totalCols;
                  const colW = `calc((100% - 6px) / ${effectiveCols})`;
                  const leftPx = `calc(${colW} * ${col} + 3px)`;
                  const width = `calc(${colW} - 2px)`;

                  return (
                    <div
                      key={ev.id}
                      className="cal-event-block"
                      data-event-status={ev.status}
                      style={{
                        top: `${topPx}px`,
                        height: `${hPx}px`,
                        left: leftPx,
                        width,
                        right: 'auto',
                        ...(ev.color ? { backgroundColor: ev.color } : {}),
                      }}
                      onClick={e => { e.stopPropagation(); onEventClick?.(ev); }}
                    >
                      <div className="cal-event-title">{ev.title}</div>
                      {hPx > 32 && <div className="cal-event-time">{eventTimeStr(ev)}</div>}
                      {ev.subtitle && hPx > 44 && (
                        <div className="cal-event-pro">{ev.subtitle}</div>
                      )}
                    </div>
                  );
                })}

                {firstHidden && (
                  <div
                    className="cal-week-more-badge"
                    style={{ top: `${(eventTimeMin(firstHidden) - START_H * 60) / 60 * SLOT_H}px` }}
                    onClick={e => { e.stopPropagation(); onDayClick?.(fmtDate(day)); }}
                  >
                    {labels.more ? labels.more(hiddenEvents.length) : `+${hiddenEvents.length}`}
                  </div>
                )}
              </div>
            );
          })}

          {todayInView && nowTop >= 0 && (
            <div className="cal-now-line" style={{ top: `${nowTop}px`, left: `${timeColW}px` }}>
              <div className="cal-now-dot" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
