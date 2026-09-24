import { useMemo, useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';

/**
 * DataTable
 * props:
 *  - columns: [{ key, label, align?, render?(row) }]
 *  - rows: array of objects
 *  - emptyMessage: string
 */
export default function DataTable({ columns, rows, emptyMessage = 'No records match the current filters.' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="overflow-x-auto rounded-card border border-ink-200 bg-surface shadow-card">
      <table className="w-full min-w-[560px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-ink-200 bg-canvas">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500 ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.sortable === false ? (
                  col.label
                ) : (
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-ink-700"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
                    ) : (
                      <ArrowUpDown size={11} className="opacity-40" />
                    )}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-400">
                <div className="flex flex-col items-center gap-2">
                  <Inbox size={22} className="text-ink-300" />
                  <span className="text-[12.5px]">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-ink-100 last:border-0 hover:bg-canvas">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-2.5 tabular text-ink-700 ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
