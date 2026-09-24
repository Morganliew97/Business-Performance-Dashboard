// src/components/PerformanceKpiCard.jsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatKpi } from '../utils/kpiDefinitions';

const STATUS_STYLES = {
  onTarget: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
    label: 'On Target',
  },
  atRisk: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    label: 'At Risk',
  },
  offTrack: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
    text: 'text-red-700',
    bar: 'bg-red-500',
    label: 'Off Track',
  },
};

export default function PerformanceKpiCard({ definition, actual, evaluation, to }) {
  const { target, variance, isFavorable, progress, status } = evaluation;
  const s = STATUS_STYLES[status];

  const TrendIcon =
    Math.abs(variance) < 0.0001 ? Minus : variance > 0 ? TrendingUp : TrendingDown;

  const targetDisplay = formatKpi(target, definition.unit);
  const varianceDisplay = formatKpi(Math.abs(variance), definition.unit);
  const sign = variance >= 0 ? '+' : '−';

  const content = (
    <div
      className={[
        'rounded-lg border p-4 transition-shadow',
        s.border,
        s.bg,
        to ? 'cursor-pointer hover:shadow-md' : 'shadow-sm',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-ink-600">{definition.label}</p>
          <p className="mt-1 text-[22px] font-semibold leading-tight text-ink-900">
            {formatKpi(actual, definition.unit)}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] font-semibold ${s.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between text-[11.5px]">
        <span className="text-ink-500">
          Target: <span className="font-medium text-ink-700">{targetDisplay}</span>
        </span>
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            isFavorable ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <TrendIcon size={12} />
          {sign}
          {varianceDisplay}
        </span>
      </div>

      {/* Progress bar — reflects distance to target in the favorable direction */}
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-2 text-[10.5px] leading-relaxed text-ink-500">{definition.hint}</p>
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return content;
}