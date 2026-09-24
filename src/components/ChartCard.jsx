export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`rounded-card border border-ink-200 bg-surface p-4 shadow-card ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13.5px] font-semibold text-ink-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[12px] text-ink-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
