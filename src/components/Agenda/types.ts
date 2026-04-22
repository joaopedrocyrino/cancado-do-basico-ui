export type CalView = 'month' | 'week' | 'day';

export interface AgendaEvent {
  id: string;
  /** Primary label shown in the event block / chip */
  title: string;
  /** ISO 8601 string (local or UTC) */
  scheduledAt: string;
  durationMinutes: number;
  /** Background colour for the event block. Defaults to var(--color-blue). */
  color?: string;
  /**
   * Optional status string applied as `data-event-status` — enables
   * the built-in CSS status-border colour scheme.
   *
   * Known values: scheduled | confirmed | in_progress | completed | cancelled | no_show
   */
  status?: string;
  /** Second line shown inside the block when it is tall enough */
  subtitle?: string;
}

export interface AgendaLabels {
  today?: string;
  month?: string;
  week?: string;
  day?: string;
  more?: (n: number) => string;
}

export const SLOT_H = 64;
export const START_H = 0;
export const END_H = 24;
export const HOURS = Array.from({ length: END_H - START_H }, (_, i) => START_H + i);
