import type { AgendaEvent } from './types';
import { SLOT_H, START_H, END_H } from './types';

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fmtYearMonth(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function eventDate(ev: AgendaEvent): Date {
  return new Date(ev.scheduledAt);
}

export function eventTimeStr(ev: AgendaEvent): string {
  const d = eventDate(ev);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function eventTimeMin(ev: AgendaEvent): number {
  const d = eventDate(ev);
  return d.getHours() * 60 + d.getMinutes();
}

export function calcNowTop(): number {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  if (h < START_H || h >= END_H) return -1;
  return (h - START_H + m / 60) * SLOT_H;
}

export function getMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const grid: Date[] = [];
  for (let i = first.getDay() - 1; i >= 0; i--) {
    grid.push(new Date(year, month, -i));
  }
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) grid.push(new Date(year, month, d));
  while (grid.length < 42) {
    const next = new Date(grid[grid.length - 1]);
    next.setDate(next.getDate() + 1);
    grid.push(next);
  }
  return grid;
}

export function getWeekDays(ref: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ref);
    d.setDate(ref.getDate() - ref.getDay() + i);
    return d;
  });
}

export function getViewDays(ref: Date, count: number): Date[] {
  if (count === 7) return getWeekDays(ref);
  const offset = Math.floor(count / 2);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(ref);
    d.setDate(ref.getDate() - offset + i);
    return d;
  });
}

export function computeOverlapLayout(
  events: AgendaEvent[],
): Map<string, { col: number; totalCols: number }> {
  const sorted = [...events].sort((a, b) => eventTimeMin(a) - eventTimeMin(b));
  const columnEndTimes: number[] = [];
  const evCols = new Map<string, number>();

  for (const ev of sorted) {
    const start = eventTimeMin(ev);
    const end = start + ev.durationMinutes;
    let col = -1;
    for (let i = 0; i < columnEndTimes.length; i++) {
      if (columnEndTimes[i] <= start) {
        col = i;
        break;
      }
    }
    if (col === -1) {
      col = columnEndTimes.length;
      columnEndTimes.push(end);
    } else {
      columnEndTimes[col] = end;
    }
    evCols.set(ev.id, col);
  }

  const result = new Map<string, { col: number; totalCols: number }>();
  for (const ev of sorted) {
    const start = eventTimeMin(ev);
    const end = start + ev.durationMinutes;
    const col = evCols.get(ev.id) ?? 0;
    let maxCol = col;
    for (const other of sorted) {
      if (other.id === ev.id) continue;
      const os = eventTimeMin(other);
      const oe = os + other.durationMinutes;
      if (start < oe && end > os) {
        maxCol = Math.max(maxCol, evCols.get(other.id) ?? 0);
      }
    }
    result.set(ev.id, { col, totalCols: maxCol + 1 });
  }
  return result;
}

/** Format period title for the calendar header */
export function fmtPeriodTitle(ref: Date, colCount: number, locale: string): string {
  if (colCount === 0 || colCount === 7 && ref.getDay() === 0) {
    // Month view or full week — check if it's month view (colCount 0 sentinel)
  }
  if (colCount <= 1) {
    // Day view
    return ref.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (colCount === 7) {
    // Week view
    const days = getWeekDays(ref);
    const start = days[0];
    const end = days[6];
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString(locale, { month: 'long' })} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString(locale, { month: 'short' })} ${start.getDate()} – ${end.toLocaleDateString(locale, { month: 'short' })} ${end.getDate()}, ${end.getFullYear()}`;
  }
  // Month view (colCount = -1 sentinel or any non-week)
  return ref.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}
