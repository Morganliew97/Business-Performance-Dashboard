// src/pages/Expenses.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { Wallet, Gauge, TriangleAlert, TrendingDown, AlertTriangle } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import FilterBar from '../components/FilterBar';
import {
  getExpenseGrowth,
  getExpenseCategoriesWithVariance,
  formatCurrency,
} from '../utils/calculations';
import { useFilters } from '../context/FilterContext';
import { useData } from '../context/DataContext';

const CATEGORY_COLORS = [
  '#2451CC', '#0E8A5F', '#B4720B', '#C7351F', '#7C3AED', '#94A3B8', '#64748B'
];

const MISMATCH_THRESHOLD_PCT = 1;

export default function Expenses() {
  const { month, setMonth, monthOptions, reset } = useFilters();

  const {
    expenseCategories = [],
    monthlyExpenses = [],
    monthlyCategoryExpenses = [],
  } = useData();

  const categories = getExpenseCategoriesWithVariance(expenseCategories);
  const overBudget = categories.filter((c) => c.status === 'Over Budget');

  // Annual totals from two independent sources
  const categoryActualTotal = categories.reduce((s, c) => s + Number(c.actual || 0), 0);
  const categoryBudgetTotal = categories.reduce((s, c) => s + Number(c.budget || 0), 0);

  const monthlyActualTotal = monthlyExpenses.reduce((s, m) => s + Number(m.amount || 0), 0);
  const monthlyBudgetTotal = monthlyExpenses.reduce((s, m) => s + Number(m.budget || 0), 0);

  // Mismatch detection
  const actualDiff = categoryActualTotal - monthlyActualTotal;
  const budgetDiff = categoryBudgetTotal - monthlyBudgetTotal;
  const actualDiffPct = monthlyActualTotal > 0 ? (Math.abs(actualDiff) / monthlyActualTotal) * 100 : 0;
  const budgetDiffPct = monthlyBudgetTotal > 0 ? (Math.abs(budgetDiff) / monthlyBudgetTotal) * 100 : 0;
  const hasActualMismatch = actualDiffPct > MISMATCH_THRESHOLD_PCT;
  const hasBudgetMismatch = budgetDiffPct > MISMATCH_THRESHOLD_PCT;
  const hasMismatch = hasActualMismatch || hasBudgetMismatch;

  // KPI values — from category totals
  const totalActual = categoryActualTotal;
  const totalBudget = categoryBudgetTotal;
  const budgetUtilization = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
  const remainingBudget = totalBudget - totalActual;
  const remainingPct = totalBudget > 0 ? (remainingBudget / totalBudget) * 100 : 0;

  // Monthly chart data — filter tolerant of full/short names
  const isMonthFiltered = month !== 'All';
  const filteredMonthly = isMonthFiltered
    ? monthlyExpenses.filter(
        (m) => String(m.month).slice(0, 3).toLowerCase() === String(month).slice(0, 3).toLowerCase()
      )
    : monthlyExpenses;

  const selectedMonthShort = isMonthFiltered ? filteredMonthly[0]?.month : null;
  const selectedMonthRow = isMonthFiltered ? filteredMonthly[0] : null;

  // ---------------------------------------------------------------------
  // Category-level breakdown for the selected month.
  // Uses the real `monthlyCategoryExpenses` data when available; falls
  // back to the annual table if a month is selected but no monthly rows
  // exist for it (defensive — shouldn't happen with the current data).
  // ---------------------------------------------------------------------
  const monthCategoryRows = (() => {
    if (!isMonthFiltered || !selectedMonthShort) return null;

    const rows = monthlyCategoryExpenses.filter(
      (r) => String(r.month).toLowerCase() === String(selectedMonthShort).toLowerCase()
    );
    if (rows.length === 0) return null;

    // Enrich with variance + status like the annual table
    return rows.map((r) => {
      const budget = Number(r.budget || 0);
      const actual = Number(r.actual || 0);
      const variance = budget - actual;
      return {
        ...r,
        budget,
        actual,
        variance,
        variancePct: budget === 0 ? 0 : (variance / budget) * 100,
        status: actual > budget ? 'Over Budget' : 'On Track',
      };
    }).sort((a, b) => b.actual - a.actual);
  })();

  // Pie chart data — annual by default, month-specific when filtered
  const pieSource = monthCategoryRows ?? [...categories].sort((a, b) => b.actual - a.actual);
  const topPie = pieSource.slice(0, 6);
  const restPie = pieSource.slice(6);
  const restValue = restPie.reduce((s, c) => s + Number(c.actual || 0), 0);

  const pieData = restValue > 0
    ? [...topPie, { category: 'Others', actual: restValue }]
    : topPie;

  const othersList = restPie;

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'budget', label: 'Budget', align: 'right', render: (r) => formatCurrency(r.budget, { compact: false }) },
    { key: 'actual', label: 'Actual', align: 'right', render: (r) => formatCurrency(r.actual, { compact: false }) },
    {
      key: 'variance', label: 'Variance', align: 'right',
      render: (r) => (
        <span className={r.variance < 0 ? 'font-medium text-negative' : 'font-medium text-positive'}>
          {r.variance < 0 ? '-' : '+'}{formatCurrency(Math.abs(r.variance), { compact: false })}
        </span>
      ),
    },
    { key: 'status', label: 'Status', align: 'right', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Mismatch warning banner */}
      {hasMismatch && (
        <div className="flex items-start gap-2.5 rounded-md border border-amber-300 bg-amber-50 px-3.5 py-3 text-[12.5px] text-amber-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">Category totals and monthly totals don't match.</p>
            <p className="leading-relaxed">
              The <span className="font-medium">Expense Categories</span> tab and the{' '}
              <span className="font-medium">Monthly Expenses</span> tab disagree. The KPI cards
              and category breakdown use the category figures; the monthly bar chart uses the
              monthly figures.
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {hasActualMismatch && (
                <li>
                  <span className="font-medium">Actual</span>: categories say{' '}
                  {formatCurrency(categoryActualTotal, { compact: false })} but monthly says{' '}
                  {formatCurrency(monthlyActualTotal, { compact: false })} —{' '}
                  <span className={actualDiff > 0 ? 'text-negative' : 'text-positive'}>
                    {actualDiff > 0 ? '+' : '-'}{formatCurrency(Math.abs(actualDiff), { compact: false })} ({actualDiffPct.toFixed(1)}%)
                  </span>
                </li>
              )}
              {hasBudgetMismatch && (
                <li>
                  <span className="font-medium">Budget</span>: categories say{' '}
                  {formatCurrency(categoryBudgetTotal, { compact: false })} but monthly says{' '}
                  {formatCurrency(monthlyBudgetTotal, { compact: false })} —{' '}
                  <span className={budgetDiff > 0 ? 'text-negative' : 'text-positive'}>
                    {budgetDiff > 0 ? '+' : '-'}{formatCurrency(Math.abs(budgetDiff), { compact: false })} ({budgetDiffPct.toFixed(1)}%)
                  </span>
                </li>
              )}
            </ul>
            <p className="pt-1 text-[11.5px] text-amber-700">
              Fix by uploading matching data in Data Management, or use Reset on either tab to restore defaults.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Total Expenses" value={formatCurrency(totalActual)} change={getExpenseGrowth()} positiveIsGood={false} icon={Wallet} />
        <KPICard label="Budget Utilisation" value={`${budgetUtilization.toFixed(1)}%`} changeLabel="of annual budget" change={budgetUtilization - 100} positiveIsGood={false} icon={Gauge} />
        <KPICard label="Categories Over Budget" value={String(overBudget.length)} changeLabel={`of ${categories.length} categories`} change={overBudget.length} positiveIsGood={false} icon={TriangleAlert} />
        <KPICard label="Remaining Budget" value={formatCurrency(remainingBudget)} changeLabel="unspent vs annual budget" change={remainingPct} icon={TrendingDown} />
      </div>

      <FilterBar
        filters={[{ key: 'month', label: 'Month', value: month, options: monthOptions, onChange: setMonth }]}
        onReset={reset}
      />

      {/* Monthly Bar Chart */}
      <ChartCard
        title="Expense Performance"
        subtitle={isMonthFiltered ? `Budget vs actual for ${selectedMonthRow?.month || month}` : 'Actual expenses compared to budget by month'}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredMonthly} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#EEF1F5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
            <Tooltip formatter={(v, name) => [formatCurrency(v, { compact: false }), name]} contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#E2E8F0' }} />
            <Legend formatter={(value) => <span className="text-[11.5px] text-ink-600">{value}</span>} iconType="circle" iconSize={8} />
            <Bar dataKey="budget" name="Budget" fill="#FDBA74" radius={[3, 3, 0, 0]} maxBarSize={isMonthFiltered ? 60 : 22} />
            <Bar dataKey="amount" name="Actual" fill="#2451CC" radius={[3, 3, 0, 0]} maxBarSize={isMonthFiltered ? 60 : 22} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Category Breakdown + Table */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Pie Chart */}
        <ChartCard
          title="Expense Category Breakdown"
          subtitle={isMonthFiltered
            ? `Category share for ${selectedMonthRow?.month || month}`
            : 'Top categories by actual spend'}
          className="xl:col-span-1"
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pieData} dataKey="actual" nameKey="category" cx="50%" cy="42%" innerRadius={55} outerRadius={90} paddingAngle={3}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={`cell-${entry.category}`} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name, props) => [`${formatCurrency(v, { compact: false })} (${(props.payload.percent * 100).toFixed(1)}%)`, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#E2E8F0' }}
              />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          {othersList.length > 0 && (
            <p className="mt-3 text-[11px] text-ink-500 leading-relaxed px-1">
              <span className="font-medium text-ink-600">Others includes:</span>{' '}
              {othersList.map((c) => c.category).join(', ')}
            </p>
          )}
        </ChartCard>

        {/* Table — annual or month */}
        <ChartCard
          title={isMonthFiltered
            ? `${selectedMonthRow?.month || month} — Budget vs Actual by Category`
            : 'Budget vs Actual by Category'}
          subtitle={isMonthFiltered
            ? 'Categories in red exceeded their budget for this month'
            : 'Annual figures — categories in red exceeded their annual budget'}
          className="xl:col-span-2"
        >
          <DataTable
            columns={columns}
            rows={isMonthFiltered ? (monthCategoryRows || []) : categories}
            emptyMessage={
              isMonthFiltered
                ? `No monthly category data available for ${month}.`
                : 'No categories match.'
            }
          />
        </ChartCard>
      </div>
    </div>
  );
}