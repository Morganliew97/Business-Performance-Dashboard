import { TriangleAlert, CircleCheck } from 'lucide-react';

export default function AlertCard({ type = 'warning', message }) {
  const isWarning = type === 'warning';
  return (
    <div
      className={[
        'flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-[13px]',
        isWarning ? 'border-caution-100 bg-caution-100/60 text-ink-800' : 'border-positive-100 bg-positive-100/60 text-ink-800',
      ].join(' ')}
    >
      {isWarning ? (
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-caution" />
      ) : (
        <CircleCheck size={16} className="mt-0.5 shrink-0 text-positive" />
      )}
      <span>{message}</span>
    </div>
  );
}
