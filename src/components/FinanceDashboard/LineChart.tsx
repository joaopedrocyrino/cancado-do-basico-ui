import { useEffect, useId, useRef } from 'react';
import type { DataPoint } from './types';
import './FinanceDashboard.css';

export interface LineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  formatValue?: (v: number) => string;
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0][0]} ${pts[0][1]}`];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d.push(`C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`);
  }
  return d.join(' ');
}

const W = 300;
const H = 140;
const PAD = { top: 14, right: 12, bottom: 28, left: 8 };

export function LineChart({ data, title, color = 'var(--color-blue)' }: LineChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const gradId = `fd-lg-${useId().replace(/:/g, '')}`;

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pts: [number, number][] = data.map((d, i) => [
    PAD.left + (i / Math.max(data.length - 1, 1)) * chartW,
    PAD.top + chartH - ((d.value - min) / range) * chartH,
  ]);

  const linePath = smoothPath(pts);
  const areaPath = pts.length
    ? `${linePath} L ${pts[pts.length - 1][0]} ${PAD.top + chartH} L ${pts[0][0]} ${PAD.top + chartH} Z`
    : '';

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    el.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.strokeDashoffset = '0';
      });
    });
  }, [data]);

  return (
    <div className="fd-chart-card">
      {title && <div className="fd-chart-title">{title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="fd-chart-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

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

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={color} />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={pts[i][0]}
            y={H - 7}
            textAnchor="middle"
            fontSize="8"
            fill="var(--label-tertiary)"
            fontFamily="inherit"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
