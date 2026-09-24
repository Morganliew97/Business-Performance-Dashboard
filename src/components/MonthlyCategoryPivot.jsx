// src/components/MonthlyCategoryPivot.jsx
import { formatCurrency } from '../utils/calculations';

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Pivot table: rows = categories × {Budget, Actual}, columns = months.
 *
 * Props:
 *   rows        - array of { category, month, budget, actual }
 *   monthFilter - 'All' | 'Jan' | 'Feb' | ...
 */
export default function MonthlyCategoryPivot({ rows = [], monthFilter = 'All' }) {
  // Which months to show as columns
  const months = monthFilter === 'All'
    ? MONTH_ORDER
    : MONTH_ORDER.filter((m) => m.toLowerCase() === monthFilter.toLowerCase());

  // Unique categories, in the order they first appear in `rows`
  const categories = [];
  const seen = new Set();
  rows.forEach((r) => {
    if (!seen.has(r.category)) {
      seen.add(r.category);
      categories.push(r.category);
    }
  });

  // Build lookup: key = `${category}|${month}` -> { budget, actual }
  const lookup = new Map();
  rows.forEach((r) => {
    lookup.set(`${r.category}|${r.month}`, {
      budget: Number(r.budget) || 0,
      actual: Number(r.actual) || 0,
    });
  });

  // Column totals per month (budget, actual)
  const totals = {};
  months.forEach((m) => {
    totals[m] = { budget: 0, actual: 0 };
  });
  rows.forEach((r) => {
    if (totals[r.month]) {
      totals[r.month].budget += Number(r.budget) || 0;
      totals[r.month].actual += Number(r.actual) || 0;
    }
  });

  if (categories.length === 0) {
    return (
      <div className="rounded-md border border-ink-200 bg-surface px-6 py-10 text-center text-[13px] text-ink-500">
        No monthly category rows match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-ink-200 bg-surface shadow-card">
      <table className="min-w-full border-collapse text-[12.5px]">
        <thead>
          <tr className="bg-canvas text-ink-600">
            {/* Category + Metric (sticky left) */}
            <th
              className="sticky left-0 z-10 border-b border-r border-ink-200 bg-canvas px-3 py-2 text-left font-medium"
              style={{ minWidth: 200 }}
            >
              Category
            </th>
            <th className="border-b border-r border-ink-200 bg-canvas px-3 py-2 text-left font-medium" style={{ minWidth: 70 }}>
              {/* empty column for Budget/Actual label */}
            </th>
            {months.map((m) => (
              <th
                key={m}
                className="border-b border-r border-ink-200 px-3 py-2 text-right font-medium"
                style={{ minWidth: 110 }}
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, catIdx) => {
            const zebra = catIdx % 2 === 0 ? 'bg-surface' : 'bg-canvas/60';
            return (
              <>
                {/* Budget row */}
                <tr key={`${category}-budget`} className={`${zebra} border-b border-ink-100`}>
                  <td
                    rowSpan={2}
                    className={`sticky left-0 z-10 border-r border-ink-200 px-3 py-2 align-top font-medium text-ink-800 ${zebra}`}
                  >
                    {category}
                  </td>
                  <td className="border-r border-ink-200 px-3 py-1.5 text-[11.5px] font-medium text-ink-500">
                    Budget
                  </td>
                  {months.map((m) => {
                    const cell = lookup.get(`${category}|${m}`);
                    return (
                      <td key={m} className="border-r border-ink-100 px-3 py-1.5 text-right text-ink-700">
                        {cell ? formatCurrency(cell.budget, { compact: false }) : '—'}
                      </td>
                    );
                  })}
                </tr>
                {/* Actual row */}
                <tr key={`${category}-actual`} className={`${zebra} border-b border-ink-100`}>
                  <td className="border-r border-ink-200 px-3 py-1.5 text-[11.5px] font-medium text-ink-500">
                    Actual
                  </td>
                  {months.map((m) => {
                    const cell = lookup.get(`${category}|${m}`);
                    return (
                      <td key={m} className="border-r border-ink-100 px-3 py-1.5 text-right text-ink-700">
                        {cell ? formatCurrency(cell.actual, { compact: false }) : '—'}
                      </td>
                    );
                  })}
                </tr>
              </>
            );
          })}

          {/* Totals row */}
          <tr className="border-t-2 border-ink-300 bg-canvas">
            <td
              rowSpan={2}
              className="sticky left-0 z-10 border-r border-ink-200 bg-canvas px-3 py-2 align-top font-semibold text-ink-800"
            >
              Total
            </td>
            <td className="border-r border-ink-200 px-3 py-1.5 text-[11.5px] font-semibold text-ink-600">
              Budget
            </td>
            {months.map((m) => (
              <td key={m} className="border-r border-ink-100 px-3 py-1.5 text-right font-semibold text-ink-800">
                {formatCurrency(totals[m].budget, { compact: false })}
              </td>
            ))}
          </tr>
          <tr className="bg-canvas">
            <td className="border-r border-ink-200 px-3 py-1.5 text-[11.5px] font-semibold text-ink-600">
              Actual
            </td>
            {months.map((m) => (
              <td key={m} className="border-r border-ink-100 px-3 py-1.5 text-right font-semibold text-ink-800">
                {formatCurrency(totals[m].actual, { compact: false })}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}