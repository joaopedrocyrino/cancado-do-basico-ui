import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './StatCard';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';
import { FinanceSummaryBar } from './FinanceSummaryBar';
import { RecentTransactions } from './RecentTransactions';
import type { Transaction } from './types';

const meta: Meta = {
  title: 'Components/FinanceDashboard',
  parameters: { layout: 'padded' },
};

export default meta;

const REVENUE_LINE = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5800 },
  { label: 'Mar', value: 4900 },
  { label: 'Apr', value: 7200 },
  { label: 'May', value: 6100 },
  { label: 'Jun', value: 8400 },
];

const REVENUE_BAR = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5800 },
  { label: 'Mar', value: 4900 },
  { label: 'Apr', value: 7200 },
  { label: 'May', value: 6100 },
  { label: 'Jun', value: 8400 },
];

const DONUT_SEGMENTS = [
  { label: 'Consultations', value: 42, color: 'var(--color-blue)' },
  { label: 'Procedures',    value: 31, color: 'var(--color-purple)' },
  { label: 'Follow-ups',    value: 18, color: 'var(--color-teal)' },
  { label: 'Other',         value: 9,  color: 'var(--color-gray)' },
];

const TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'João Silva — Orthodontic Session', category: 'Procedure', amount: 350,  date: '2026-04-16', status: 'paid' },
  { id: '2', description: 'Ana Costa — Initial Consultation', category: 'Consultation', amount: 180, date: '2026-04-15', status: 'paid' },
  { id: '3', description: 'Carlos Mendes — Follow-up',        category: 'Follow-up',    amount: 90,  date: '2026-04-15', status: 'pending' },
  { id: '4', description: 'Dental Supply Co — Materials',     category: 'Expense',      amount: -240, date: '2026-04-14', status: 'paid' },
  { id: '5', description: 'Beatriz Nunes — Cleaning',         category: 'Procedure',    amount: 120, date: '2026-04-13', status: 'overdue' },
  { id: '6', description: 'Pedro Alves — Root Canal',         category: 'Procedure',    amount: 680, date: '2026-04-12', status: 'cancelled' },
];

const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export const FullDashboard: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480, margin: '0 auto' }}>

      <FinanceSummaryBar
        period="April 2026"
        revenue={fmt(8400)}
        expenses={fmt(1240)}
        balance={fmt(7160)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <StatCard
          label="Monthly Revenue"
          value={fmt(8400)}
          trend={{ value: '12.3%', dir: 'up' }}
          accent="green"
        />
        <StatCard
          label="Pending"
          value={fmt(910)}
          trend={{ value: '3 invoices', dir: 'flat' }}
          accent="orange"
        />
        <StatCard
          label="Expenses"
          value={fmt(1240)}
          trend={{ value: '4.1%', dir: 'down' }}
          accent="red"
        />
        <StatCard
          label="Net Balance"
          value={fmt(7160)}
          trend={{ value: '18.7%', dir: 'up' }}
          accent="blue"
        />
      </div>

      <LineChart
        title="Revenue Trend"
        data={REVENUE_LINE}
        color="var(--color-blue)"
      />

      <BarChart
        title="Monthly Breakdown"
        data={REVENUE_BAR}
        color="var(--color-purple)"
      />

      <DonutChart
        title="Revenue by Category"
        segments={DONUT_SEGMENTS}
        centerValue={fmt(8400)}
        centerLabel="total"
      />

      <RecentTransactions
        transactions={TRANSACTIONS}
        onTransactionClick={t => alert(t.description)}
      />

    </div>
  ),
};

export const StatCards: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 600 }}>
      <StatCard label="Revenue"  value="$8,400" trend={{ value: '12%', dir: 'up' }}   accent="green"  />
      <StatCard label="Expenses" value="$1,240" trend={{ value: '4%',  dir: 'down' }} accent="red"    />
      <StatCard label="Pending"  value="$910"   trend={{ value: '—',   dir: 'flat' }} accent="orange" />
    </div>
  ),
};

export const Charts: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <LineChart title="Revenue Trend" data={REVENUE_LINE} />
      <BarChart  title="Monthly Breakdown" data={REVENUE_BAR} color="var(--color-purple)" />
      <DonutChart title="By Category" segments={DONUT_SEGMENTS} centerValue="$8,400" centerLabel="total" />
    </div>
  ),
};
