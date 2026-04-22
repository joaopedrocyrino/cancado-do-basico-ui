import type { ReactNode } from 'react';
import type { AccentColor, TrendDir } from './types';
import './FinanceDashboard.css';

export interface StatCardProps {
  label: string;
  value: string;
  trend?: { value: string; dir: TrendDir };
  accent?: AccentColor;
  icon?: ReactNode;
}

const TREND_ARROW: Record<TrendDir, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

export function StatCard({ label, value, trend, accent = 'blue', icon }: StatCardProps) {
  return (
    <div className={`fd-stat-card fd-stat-card--${accent}`}>
      <div className="fd-stat-header">
        <span className="fd-stat-label">{label}</span>
        {icon && <span className="fd-stat-icon">{icon}</span>}
      </div>
      <div className="fd-stat-value">{value}</div>
      {trend && (
        <div className={`fd-stat-trend fd-stat-trend--${trend.dir}`}>
          <span className="fd-stat-trend-arrow">{TREND_ARROW[trend.dir]}</span>
          {trend.value}
        </div>
      )}
    </div>
  );
}
