import { SlidersHorizontal, RotateCcw } from 'lucide-react';

/**
 * FilterBar
 * props:
 *  - filters: [{ key, label, value, options: string[], onChange(value) }]
 *  - onReset: optional () => void
 */
export default function FilterBar({ filters, onReset }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-ink-200 bg-surface p-3 shadow-card">
      <div className="flex items-center gap-1.5 pr-1 text-ink-500">
        <SlidersHorizontal size={14} />
        <span className="text-[12px] font-medium">Filters</span>
      </div>
      {filters.map((f) => (
        <label key={f.key} className="flex items-center gap-1.5">
          <span className="text-[11.5px] text-ink-500">{f.label}</span>
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="rounded-md border border-ink-200 bg-canvas px-2 py-1.5 text-[12.5px] text-ink-700 focus:border-accent-500"
          >
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      ))}
      {onReset && (
        <button
          onClick={onReset}
          className="ml-auto flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-ink-500 hover:bg-ink-100"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      )}
    </div>
  );
}
