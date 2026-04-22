import type { Meta, StoryObj } from '@storybook/react';
import { Agenda } from './Agenda';
import type { AgendaEvent } from './types';
import { ThemeProvider } from '../../context/ThemeContext';

const meta: Meta<typeof Agenda> = {
  title: 'Components/Agenda',
  component: Agenda,
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <ThemeProvider>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Agenda>;

const COLORS = [
  '#2563eb', '#7c3aed', '#059669', '#d97706',
  '#dc2626', '#0891b2', '#db2777', '#65a30d',
];

const NAMES = ['Alice Martin', 'Bob Santos', 'Clara Lima', 'David Rocha', 'Eva Pereira'];
const STATUSES = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];

function seed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mockFetch(start: Date, end: Date): Promise<AgendaEvent[]> {
  const events: AgendaEvent[] = [];
  const cursor = new Date(start);
  let id = seed(start.toISOString());

  while (cursor <= end) {
    const dayOfWeek = cursor.getDay();
    // Fewer events on weekends
    const count = dayOfWeek === 0 || dayOfWeek === 6
      ? Math.floor(seed(String(id)) % 2)
      : 2 + (seed(String(id + 1)) % 4);

    for (let i = 0; i < count; i++) {
      id++;
      const h = 8 + (seed(String(id)) % 10); // 08:00–17:00
      const m = [0, 15, 30, 45][seed(String(id + 2)) % 4];
      const dur = [30, 45, 60, 90][seed(String(id + 3)) % 4];
      const nameIdx = seed(String(id + 4)) % NAMES.length;
      const colorIdx = nameIdx % COLORS.length;
      const statusIdx = seed(String(id + 5)) % STATUSES.length;

      const scheduledAt = new Date(cursor);
      scheduledAt.setHours(h, m, 0, 0);

      events.push({
        id: String(id),
        title: NAMES[nameIdx],
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: dur,
        color: COLORS[colorIdx],
        status: STATUSES[statusIdx],
        subtitle: `Room ${(seed(String(id + 6)) % 5) + 1}`,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return Promise.resolve(events);
}

export const Default: Story = {
  render: () => (
    <Agenda
      fetchEvents={mockFetch}
      onEventClick={ev => alert(`Clicked: ${ev.title}`)}
      onSlotClick={(date, time) => alert(`Slot: ${date} ${time}`)}
      onAddClick={() => alert('Add event')}
    />
  ),
};

export const MonthView: Story = {
  render: () => (
    <Agenda
      fetchEvents={mockFetch}
      defaultView="month"
      onEventClick={ev => alert(`Clicked: ${ev.title}`)}
      onAddClick={() => alert('Add event')}
    />
  ),
};

export const DayView: Story = {
  render: () => (
    <Agenda
      fetchEvents={mockFetch}
      defaultView="day"
      onEventClick={ev => alert(`Clicked: ${ev.title}`)}
      onSlotClick={(date, time) => alert(`Slot: ${date} ${time}`)}
    />
  ),
};

export const WithFilterSlot: Story = {
  render: () => (
    <Agenda
      fetchEvents={mockFetch}
      defaultView="week"
      filterSlot={
        <select
          style={{
            height: 31,
            padding: '0 28px 0 12px',
            borderRadius: 20,
            border: '1px solid rgba(120,120,128,0.2)',
            background: 'rgba(120,120,128,0.1)',
            fontSize: '0.8rem',
            fontWeight: 500,
            appearance: 'none',
          }}
        >
          <option value="">All professionals</option>
          {NAMES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      }
      onEventClick={ev => alert(`Clicked: ${ev.title}`)}
    />
  ),
};

export const PortugueseLocale: Story = {
  render: () => (
    <Agenda
      fetchEvents={mockFetch}
      locale="pt-BR"
      labels={{
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        more: (n: number) => `+${n} mais`,
      }}
      onEventClick={ev => alert(`Clicou: ${ev.title}`)}
    />
  ),
};
