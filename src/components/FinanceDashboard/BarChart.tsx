import type { DataPoint } from './types';
import './FinanceDashboard.css';

export interface BarChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
}

const W = 300;
const H = 160;
const PAD = { top: 16, right: 8, bottom: 28, left: 8 };

export function BarChart({ data, title, color = 'var(--color-blue)' }: BarChartProps) {
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const max = Math.max(...data.map(d => d.value)) || 1;
  const barSlot = chartW / (data.length || 1);
  const gap = barSlot * 0.3;
  const bw = barSlot - gap;
  const rx = Math.min(4, bw / 2);

  return (
    <div className="fd-chart-card">
      {title && <div className="fd-chart-title">{title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="fd-chart-svg"
        aria-hidden="true"
      >
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map(t => {
          const y = PAD.top + t * chartH;
          return (
            <line
              key={t}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="rgba(120,120,128,0.12)"
              strokeWidth="1"
            />
          );
        })}

        {data.map((d, i) => {
          const barH = Math.max((d.value / max) * chartH, 2);
          const x = PAD.left + i * barSlot + gap / 2;
          const y = PAD.top + chartH - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={bw}
                height={barH}
                rx={rx}
                ry={rx}
                fill={color}
                opacity="0.8"
                className="fd-bar-rect"
                style={{ animationDelay: `${i * 0.05}s` } as React.CSSProperties}
              />
              <text
                x={x + bw / 2}
                y={H - 7}
                textAnchor="middle"
                fontSize="8"
                fill="var(--label-tertiary)"
                fontFamily="inherit"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
