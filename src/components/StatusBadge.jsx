const STYLES = {
  Current: 'bg-positive-100 text-positive',
  'Due Soon': 'bg-caution-100 text-caution',
  Overdue: 'bg-negative-100 text-negative',
  Critical: 'bg-negative text-white',
  'On Track': 'bg-positive-100 text-positive',
  'Over Budget': 'bg-negative-100 text-negative',
  'Above Target': 'bg-positive-100 text-positive',
  'Below Target': 'bg-negative-100 text-negative',
  High: 'bg-negative-100 text-negative',
  Medium: 'bg-caution-100 text-caution',
  Low: 'bg-ink-100 text-ink-500',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-ink-100 text-ink-500';
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${style}`}>
      {status}
    </span>
  );
}
