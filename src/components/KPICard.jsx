// src/components/KPICard.jsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KPICard({ 
  label, 
  value, 
  change, 
  changeLabel = 'vs previous period', 
  positiveIsGood = true, 
  icon: Icon,
  to  // ← new prop
}) {
  const isUp = change >= 0;
  const isFavorable = positiveIsGood ? isUp : !isUp;

  const content = (
    <div className={`rounded-card border border-ink-200 bg-surface p-4 shadow-card transition ${to ? 'cursor-pointer hover:border-accent-300 hover:shadow-md' : ''}`}>
      <div className="flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-ink-500">{label}</p>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-100 text-ink-500">
            <Icon size={14} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="mt-2 tabular text-[24px] font-semibold leading-tight text-ink-900">{value}</p>
      {typeof change === 'number' && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={[
              'flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11.5px] font-semibold',
              isFavorable ? 'bg-positive-100 text-positive' : 'bg-negative-100 text-negative',
            ].join(' ')}
          >
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-[11.5px] text-ink-400">{changeLabel}</span>
        </div>
      )}
    </div>
  );

  // If "to" is provided, wrap with Link
  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}