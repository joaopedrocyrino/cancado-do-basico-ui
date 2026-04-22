import type { DonutSegment } from './types';
import './FinanceDashboard.css';

export interface DonutChartProps {
  segments: DonutSegment[];
  title?: string;
  centerLabel?: string;
  centerValue?: string;
}

const R = 40;
const CX = 56;
const CY = 56;
const STROKE_W = 13;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DonutChart({ segments, title, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  let cumPct = 0;
  const slices = segments.map(seg => {
    const pct = seg.value / total;
    const dash = pct * CIRCUMFERENCE;
    // offset = circumference * (1 - cumulative) so segments stack clockwise
    const offset = CIRCUMFERENCE * (1 - cumPct);
    cumPct += pct;
    return { ...seg, dash, offset };
  });

  return (
    <div className="fd-chart-card fd-donut-card">
      {title && <div className="fd-chart-title">{title}</div>}
      <div className="fd-donut-body">
        <svg viewBox={`0 0 ${CX * 2} ${CY * 2}`} className="fd-donut-svg" aria-hidden="true">
          {/* Track ring */}
          <circle
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke="var(--fill-tertiary)"
            strokeWidth={STROKE_W}
          />
          {/* Segments */}
          {slices.map((seg, i) => (
            <circle
              key={i}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE_W}
              strokeDasharray={`${seg.dash} ${CIRCUMFERENCE}`}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${CX} ${CY})`}
              className="fd-donut-seg"
              style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}
            />
          ))}
          {/* Center text */}
          {centerValue && (
            <text
              x={CX} y={CY + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="var(--label-primary)"
              fontFamily="inherit"
            >
              {centerValue}
            </text>
          )}
          {centerLabel && (
            <text
              x={CX} y={CY + 16}
              textAnchor="middle"
              fontSize="7"
              fill="var(--label-tertiary)"
              fontFamily="inherit"
            >
              {centerLabel}
            </text>
          )}
        </svg>

        <div className="fd-donut-legend">
          {segments.map((seg, i) => (
            <div key={i} className="fd-legend-row">
              <span className="fd-legend-dot" style={{ background: seg.color }} />
              <span className="fd-legend-label">{seg.label}</span>
              <span className="fd-legend-pct">
                {((seg.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
