// src/utils/kpiDefinitions.js
// ---------------------------------------------------------------------------
// Metadata for every KPI shown on the Performance page.
// Each entry describes HOW to compute, FORMAT, and EVALUATE the KPI.
// ---------------------------------------------------------------------------

import {
  getTotalRevenue,
  getTotalRevenueTarget,
  getTotalExpenses,
  getTotalBudget,
  getNetProfit,
  getNetProfitMargin,
  getRevenueGrowth,
  getExpenseGrowth,
  getBudgetUtilization,
  getCollectionRate,
  getARDays,
  getCustomerGrowth,
  getOperatingCostRatio,
  getTotalAR,
} from './calculations';

export const KPI_GROUPS = [
  { key: 'growth',        label: 'Growth',              description: 'Top-line momentum vs. prior period and targets' },
  { key: 'profitability', label: 'Profitability',       description: 'Bottom-line health and margin quality' },
  { key: 'efficiency',    label: 'Efficiency',          description: 'How well the business converts inputs into outputs' },
  { key: 'cash',          label: 'Cash & Receivables',  description: 'Working capital and collection performance' },
  { key: 'people',        label: 'People & Customers',  description: 'Retention and satisfaction metrics' },
];

const fmt = {
  currency: (v) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v.toFixed(0)}`;
  },
  percent: (v) => `${v.toFixed(1)}%`,
  days:    (v) => `${Math.round(v)} d`,
  number:  (v) => v.toLocaleString('en-US'),
  score:   (v) => `${Math.round(v)}`,
};

// direction:
//   'up'   → higher is better (target is a minimum)
//   'down' → lower is better  (target is a maximum)
export const KPI_DEFINITIONS = [
  // ---------------- Growth ----------------
  {
    key: 'revenue',
    label: 'Total Revenue',
    group: 'growth',
    unit: 'currency',
    direction: 'up',
    compute: () => getTotalRevenue(),
    target: () => getTotalRevenueTarget(),
    hint: 'Year-to-date revenue vs. the annual target.',
    to: '/revenue',
  },
  {
    key: 'revenueGrowth',
    label: 'Revenue Growth',
    group: 'growth',
    unit: 'percent',
    direction: 'up',
    compute: () => getRevenueGrowth(),
    target: () => 8.0,
    hint: 'Revenue growth compared to the same period last year.',
    to: '/revenue',
  },
  {
    key: 'customerGrowth',
    label: 'Customer Growth',
    group: 'growth',
    unit: 'percent',
    direction: 'up',
    compute: () => getCustomerGrowth(),
    target: () => 10.0,
    hint: 'Growth in active customer accounts vs. prior period.',
    to: '/insights',
  },

  // ---------------- Profitability ----------------
  {
    key: 'profit',
    label: 'Net Profit',
    group: 'profitability',
    unit: 'currency',
    direction: 'up',
    compute: () => getNetProfit(),
    target: () => 390000,
    hint: 'Revenue less operating expenses.',
    to: '/',
  },
  {
    key: 'margin',
    label: 'Net Profit Margin',
    group: 'profitability',
    unit: 'percent',
    direction: 'up',
    compute: () => getNetProfitMargin(),
    target: () => 15.0,
    hint: 'Net profit as a percentage of revenue.',
    to: '/',
  },

  // ---------------- Efficiency ----------------
  {
    key: 'expenses',
    label: 'Operating Expenses',
    group: 'efficiency',
    unit: 'currency',
    direction: 'down',
    compute: () => getTotalExpenses(),
    target: () => getTotalBudget(),
    hint: 'Total spend vs. approved budget. Lower is better.',
    to: '/expenses',
  },
  {
    key: 'expenseGrowth',
    label: 'Expense Growth',
    group: 'efficiency',
    unit: 'percent',
    direction: 'down',
    compute: () => getExpenseGrowth(),
    target: () => 5.0,
    hint: 'Expense growth year over year. Lower is better.',
    to: '/expenses',
  },
  {
    key: 'budgetUtilization',
    label: 'Budget Utilisation',
    group: 'efficiency',
    unit: 'percent',
    direction: 'down',
    compute: () => getBudgetUtilization(),
    target: () => 100.0,
    hint: 'Percentage of the annual budget consumed.',
    to: '/expenses',
  },
  {
    key: 'operatingCostRatio',
    label: 'Operating Cost Ratio',
    group: 'efficiency',
    unit: 'percent',
    direction: 'down',
    compute: () => getOperatingCostRatio(),
    target: () => 85.0,
    hint: 'Operating expenses as a % of revenue. Lower is better.',
    to: '/expenses',
  },

  // ---------------- Cash ----------------
  {
    key: 'collectionRate',
    label: 'Collection Rate',
    group: 'cash',
    unit: 'percent',
    direction: 'up',
    compute: () => getCollectionRate(),
    target: () => 95.0,
    hint: '% of receivables collected within terms.',
    to: '/receivable',
  },
  {
    key: 'arDays',
    label: 'AR Days (DSO)',
    group: 'cash',
    unit: 'days',
    direction: 'down',
    compute: () => getARDays(),
    target: () => 30,
    hint: 'Days Sales Outstanding — average days to collect. Lower is better.',
    to: '/receivable',
  },
  {
    key: 'totalAR',
    label: 'Outstanding Receivables',
    group: 'cash',
    unit: 'currency',
    direction: 'down',
    compute: () => getTotalAR(),
    target: () => 85000,
    hint: 'Total money owed by customers. Lower is better.',
    to: '/receivable',
  },

  // ---------------- People & Customers ----------------
  {
    key: 'customerSatisfaction',
    label: 'Customer Satisfaction',
    group: 'people',
    unit: 'score',
    direction: 'up',
    compute: () => 92,
    target: () => 90,
    hint: 'Aggregate satisfaction score from post-service surveys.',
  },
  {
    key: 'employeeRetention',
    label: 'Employee Retention',
    group: 'people',
    unit: 'percent',
    direction: 'up',
    compute: () => 85,
    target: () => 90,
    hint: 'Percentage of employees retained over the period.',
  },
];

export function formatKpi(value, unit) {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return (fmt[unit] || fmt.number)(value);
}

export function evaluateKpi(def, actual) {
  const target = def.target();
  const variance = actual - target;
  const isFavorable = def.direction === 'up' ? actual >= target : actual <= target;

  let progress = 0;
  if (target !== 0) {
    progress =
      def.direction === 'up'
        ? (actual / target) * 100
        : (target / Math.max(actual, 0.0001)) * 100;
  }
  progress = Math.max(0, Math.min(progress, 100));

  let status;
  if (isFavorable) {
    status = 'onTarget';
  } else {
    const deviation = Math.abs(variance) / (target || 1);
    status = deviation <= 0.05 ? 'atRisk' : 'offTrack';
  }

  return { target, variance, isFavorable, progress, status };
}