import StatusBadge from './StatusBadge';

export default function InsightCard({ finding, evidence, impact, action, priority }) {
  return (
    <div className="rounded-card border border-ink-200 bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[14px] font-semibold leading-snug text-ink-900">{finding}</h3>
        <StatusBadge status={priority} />
      </div>
      <dl className="space-y-2.5 text-[12.5px]">
        <div>
          <dt className="font-medium text-ink-500">Evidence</dt>
          <dd className="mt-0.5 text-ink-700">{evidence}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink-500">Business impact</dt>
          <dd className="mt-0.5 text-ink-700">{impact}</dd>
        </div>
        <div className="rounded-md bg-accent-100 px-3 py-2">
          <dt className="font-medium text-accent-600">Recommended action</dt>
          <dd className="mt-0.5 text-ink-900">{action}</dd>
        </div>
      </dl>
    </div>
  );
}
