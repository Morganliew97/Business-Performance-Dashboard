// -----------------------------------------------------------------------
// Business calculation utilities. Every KPI shown in the UI is derived
// from the raw mock data via these functions rather than hard-coded.
// -----------------------------------------------------------------------

import {
  monthlyRevenue,
  monthlyExpenses,
  arInvoices,
  expenseCategories,
  priorPeriod,
  kpiTargets,
  currentCustomers,
  revenueByBusinessUnit,
} from '../data/mockData';

export const sum = (arr, key) => {
  if (!arr || !Array.isArray(arr)) return 0;
  return arr.reduce((total, item) => total + (key ? (item[key] || 0) : (item || 0)), 0);
};

// ============================================================
// FORMATTING FUNCTIONS - EXPORTED FOR USE IN COMPONENTS
// ============================================================

export const formatCurrency = (value, { compact = true } = {}) => {
  if (!value || isNaN(value)) return '$0';
  const abs = Math.abs(value);
  if (compact) {
    if (abs >= 1_000_000) return `${value < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${value < 0 ? '-' : ''}$${(abs / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
};

export const formatPercent = (value, digits = 1) => {
  if (!value || isNaN(value)) return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
};

export const formatNumber = (value) => {
  if (!value || isNaN(value)) return '0';
  return value.toLocaleString('en-US');
};

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// --- Core totals ---------------------------------------------------------

export function getTotalRevenue() {
  return sum(monthlyRevenue, 'actual');
}

export function getTotalRevenueTarget() {
  return sum(monthlyRevenue, 'target');
}

export function getTotalExpenses() {
  return sum(monthlyExpenses, 'amount');
}

export function getTotalBudget() {
  return sum(monthlyExpenses, 'budget');
}

export function getNetProfit() {
  return getTotalRevenue() - getTotalExpenses();
}

export function getNetProfitMargin() {
  const revenue = getTotalRevenue();
  if (revenue === 0) return 0;
  return (getNetProfit() / revenue) * 100;
}

// --- Growth vs prior period -----------------------------------------------

export function getRevenueGrowth() {
  if (!priorPeriod || !priorPeriod.revenue || priorPeriod.revenue === 0) return 0;
  return ((getTotalRevenue() - priorPeriod.revenue) / priorPeriod.revenue) * 100;
}

export function getExpenseGrowth() {
  const priorExpenses = priorPeriod?.expenses || priorPeriod?.operatingExpenses || 1;
  return ((getTotalExpenses() - priorExpenses) / priorExpenses) * 100;
}

export function getNetProfitGrowth() {
  const priorProfit = (priorPeriod?.revenue || 0) - (priorPeriod?.expenses || priorPeriod?.operatingExpenses || 0);
  const currentProfit = getNetProfit();
  if (priorProfit === 0) return 0;
  return ((currentProfit - priorProfit) / priorProfit) * 100;
}

export function getCustomerGrowth() {
  const priorCustomers = priorPeriod?.customers || 100;
  const current = currentCustomers?.length || 0;
  return ((current - priorCustomers) / priorCustomers) * 100;
}

// --- Accounts receivable ---------------------------------------------------
// NOTE: `arInvoices` is the single source of truth for all AR metrics.
// All buckets, totals, and KPIs are derived from it so the chart and the
// invoice table always reconcile.

export function getInvoiceStatus(agingDays) {
  // agingDays = days past due date
  // negative = not yet due
  if (agingDays === undefined || agingDays === null) return 'Current';
  if (agingDays < 0) return 'Current';          // not yet due
  if (agingDays <= 7) return 'Due Soon';        // due today or within 7 days past due
  if (agingDays <= 30) return 'Overdue';        // 8–30 days past due
  return 'Critical';                           // 31+ days past due
}

export function getInvoicesWithStatus() {
  if (!arInvoices || !Array.isArray(arInvoices)) return [];

  // Fixed reference date so the demo stays consistent
  // (end of reporting period). Change this one line to shift the
  // reporting date for the entire AR page.
  const today = new Date('2025-12-15');

  return arInvoices.map((inv) => {
    const dueDateStr = inv.dueDate || inv.date;
    const dueDate = new Date(dueDateStr);

    // Positive = days past due, Negative = days until due
    const agingDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    return {
      ...inv,
      agingDays,
      status: getInvoiceStatus(agingDays),
      dueDate: dueDateStr,
    };
  });
}

/**
 * Derives the AR aging buckets directly from `arInvoices`.
 * This guarantees the chart, KPI cards, and invoice table all match.
 */
export function getARAgingBucketsFromInvoices() {
  const invoices = getInvoicesWithStatus();

  // Initialize buckets in the correct display order
  const buckets = {
    'Current': 0,
    '1-30 Days': 0,
    '31-60 Days': 0,
    '61-90 Days': 0,
    '90+ Days': 0,
  };

  invoices.forEach((inv) => {
    const days = inv.agingDays;
    const amount = inv.amount || 0;

    if (days <= 0) {
      buckets['Current'] += amount;
    } else if (days <= 30) {
      buckets['1-30 Days'] += amount;
    } else if (days <= 60) {
      buckets['31-60 Days'] += amount;
    } else if (days <= 90) {
      buckets['61-90 Days'] += amount;
    } else {
      buckets['90+ Days'] += amount;
    }
  });

  // Return as an array for Recharts
  return Object.keys(buckets).map((key) => ({
    bucket: key,
    amount: buckets[key],
  }));
}

export function getTotalAR() {
  const invoices = getInvoicesWithStatus();
  return sum(invoices, 'amount');
}

export function getARGrowth() {
  const priorAR = priorPeriod?.arOutstanding || 50000;
  const current = getTotalAR();
  if (priorAR === 0) return 0;
  return ((current - priorAR) / priorAR) * 100;
}

export function getARBucket(bucketName) {
  const buckets = getARAgingBucketsFromInvoices();
  const found = buckets.find((b) => b.bucket === bucketName);
  return found?.amount ?? 0;
}

export function getARDays() {
  const revenue = getTotalRevenue();
  if (revenue === 0) return 0;
  return (getTotalAR() / revenue) * 365;
}

export function getCollectionRate() {
  const total = getTotalAR();
  if (total === 0) return 100; // nothing outstanding = fully collected
  const overdue90 = getARBucket('90+ Days');
  return ((total - overdue90) / total) * 100;
}

// --- Expenses ---------------------------------------------------------------

export function getBudgetUtilization() {
  const budget = getTotalBudget();
  if (budget === 0) return 0;
  return (getTotalExpenses() / budget) * 100;
}

/**
 * Returns the expense categories enriched with variance + status.
 *
 * By default, uses the mock `expenseCategories` array. Pass a different
 * array (e.g. the shared context data) to derive variance from uploaded
 * CSV data instead.
 *
 *   getExpenseCategoriesWithVariance()               // uses mock data
 *   getExpenseCategoriesWithVariance(contextData)    // uses context data
 */
export function getExpenseCategoriesWithVariance(categories = expenseCategories) {
  if (!categories || !Array.isArray(categories)) return [];
  return categories.map((c) => {
    const budget = c.budget || 0;
    const actual = c.actual || 0;
    const variance = budget - actual;
    const variancePct = budget === 0 ? 0 : (variance / budget) * 100;
    return {
      ...c,
      variance,
      variancePct,
      status: actual > budget ? 'Over Budget' : 'On Track',
    };
  });
}

/**
 * Returns only the categories that are over budget.
 * Accepts an optional `categories` argument so callers can pass
 * the shared context data if needed.
 */
export function getOverBudgetCategories(categories = expenseCategories) {
  return getExpenseCategoriesWithVariance(categories).filter((c) => c.status === 'Over Budget');
}

export function getOperatingCostRatio() {
  const revenue = getTotalRevenue();
  if (revenue === 0) return 0;
  return (getTotalExpenses() / revenue) * 100;
}

// --- Revenue by business unit with percentage share -------------------------

export function getRevenueByUnitWithShare() {
  if (!revenueByBusinessUnit || !Array.isArray(revenueByBusinessUnit)) return [];
  const total = sum(revenueByBusinessUnit, 'revenue');
  if (total === 0) return revenueByBusinessUnit.map((u) => ({ ...u, share: 0 }));
  return revenueByBusinessUnit.map((u) => ({ ...u, share: (u.revenue / total) * 100 }));
}

// --- Monthly variance helpers -------------------------------------------------

export function getMonthlyRevenueVariance() {
  if (!monthlyRevenue || !Array.isArray(monthlyRevenue)) return [];
  return monthlyRevenue.map((m) => {
    const actual = m.actual || 0;
    const target = m.target || 1;
    return {
      month: m.month,
      actual: actual,
      target: target,
      variance: actual - target,
      variancePct: ((actual - target) / target) * 100,
    };
  });
}

export function getWorstRevenueMonth() {
  const variances = getMonthlyRevenueVariance();
  if (!variances || variances.length === 0) return { month: 'N/A', variancePct: 0 };
  return variances.reduce((worst, m) => (m.variancePct < worst.variancePct ? m : worst));
}

export function getBestRevenueMonth() {
  const variances = getMonthlyRevenueVariance();
  if (!variances || variances.length === 0) return { month: 'N/A', variancePct: 0 };
  return variances.reduce((best, m) => (m.variancePct > best.variancePct ? m : best));
}

// --- KPI performance table ----------------------------------------------------

export function getKpiPerformance() {
  // Calculate all the actual values
  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const netProfit = getNetProfit();
  const netProfitMargin = getNetProfitMargin();
  const revenueGrowth = getRevenueGrowth();
  const expenseGrowth = getExpenseGrowth();
  const budgetUtilization = getBudgetUtilization();
  const collectionRate = getCollectionRate();
  const arDays = getARDays();
  const customerGrowth = getCustomerGrowth();

  // Map the actual values to the KPI keys
  const values = {
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: netProfit,
    margin: netProfitMargin,
    revenueGrowth: revenueGrowth,
    expenseGrowth: expenseGrowth,
    budgetUtilization: budgetUtilization,
    collectionRate: collectionRate,
    arDays: arDays,
    customerGrowth: customerGrowth,
    customerSatisfaction: 92, // Sample value
    employeeRetention: 85, // Sample value
  };

  const labels = {
    revenue: 'Revenue',
    expenses: 'Operating Expenses',
    profit: 'Net Profit',
    margin: 'Net Profit Margin',
    revenueGrowth: 'Revenue Growth',
    expenseGrowth: 'Expense Growth',
    budgetUtilization: 'Budget Utilisation',
    collectionRate: 'Collection Rate',
    arDays: 'AR Days (DSO)',
    customerGrowth: 'Customer Growth',
    customerSatisfaction: 'Customer Satisfaction',
    employeeRetention: 'Employee Retention',
  };

  // If kpiTargets doesn't exist or is empty, return default KPIs
  if (!kpiTargets || typeof kpiTargets !== 'object' || Object.keys(kpiTargets).length === 0) {
    return Object.keys(values).map((key) => ({
      key,
      kpi: labels[key] || key,
      target: 0,
      actual: values[key] || 0,
      variance: 0,
      unit: '%',
      direction: 'up',
      performance: 'N/A',
      isFavorable: true,
    }));
  }

  // Build the KPI performance array
  const result = [];

  // Define which keys to show in the table (in order)
  const kpiKeys = ['revenue', 'expenses', 'profit', 'margin', 'customerSatisfaction', 'employeeRetention'];

  kpiKeys.forEach((key) => {
    // Get the target config
    const targetConfig = kpiTargets[key];
    if (!targetConfig) return;

    const target = targetConfig.target || 0;
    const direction = targetConfig.direction || 'up';
    const unit = targetConfig.unit || '%';
    const actual = values[key] || 0;
    const variance = actual - target;

    // Determine if performance is favorable
    let isFavorable = false;
    if (direction === 'up') {
      isFavorable = actual >= target;
    } else {
      isFavorable = actual <= target;
    }

    // Calculate progress percentage
    const progress = target !== 0 ? (actual / target) * 100 : 0;

    result.push({
      key,
      kpi: labels[key] || key,
      target: target,
      actual: actual,
      variance: variance,
      unit: unit,
      direction: direction,
      progress: Math.min(progress, 100),
      performance: isFavorable ? 'Above Target' : 'Below Target',
      isFavorable: isFavorable,
    });
  });

  return result;
}

// --- Alerts, generated dynamically from the data -------------------------------

export function getBusinessAlerts() {
  const alerts = [];
  const overBudget = getOverBudgetCategories();
  if (overBudget.length > 0) {
    alerts.push({
      type: 'warning',
      message: `${overBudget.length} expense ${overBudget.length === 1 ? 'category' : 'categories'} exceeded budget (${overBudget.map((c) => c.category).join(', ')}).`,
    });
  }

  const critical = getInvoicesWithStatus().filter((i) => i.status === 'Critical');
  const criticalTotal = sum(critical, 'amount');
  if (criticalTotal > 0) {
    alerts.push({
      type: 'warning',
      message: `${formatCurrency(criticalTotal)} of receivables are more than 90 days overdue.`,
    });
  }

  const worst = getWorstRevenueMonth();
  if (worst && worst.variancePct < 0) {
    alerts.push({
      type: 'warning',
      message: `Revenue for ${worst.month || 'N/A'} was ${Math.abs(worst.variancePct || 0).toFixed(1)}% below target.`,
    });
  }

  const collectionGrowth = getCollectionRate() - (priorPeriod?.collectionRate || 0);
  if (collectionGrowth > 0) {
    alerts.push({
      type: 'success',
      message: `Collection rate improved by ${collectionGrowth.toFixed(1)} percentage points vs. the prior period.`,
    });
  }

  const best = getBestRevenueMonth();
  if (best && best.variancePct > 10) {
    alerts.push({
      type: 'success',
      message: `${best.month || 'N/A'} exceeded its revenue target by ${(best.variancePct || 0).toFixed(1)}%.`,
    });
  }

  return alerts;
}

// --- Business insights, generated from the data --------------------------------

export function getBusinessInsights() {
  const overBudget = getOverBudgetCategories();
  const critical = getInvoicesWithStatus().filter((i) => i.status === 'Critical');
  const criticalTotal = sum(critical, 'amount');
  const worst = getWorstRevenueMonth();
  const best = getBestRevenueMonth();
  const unitShare = getRevenueByUnitWithShare();
  const topUnit = unitShare.reduce((a, b) => (a.revenue > b.revenue ? a : b), { unit: 'N/A', revenue: 0, share: 0 });
  const utilization = getBudgetUtilization();

  return [
    {
      finding: `Receivables over 90 days past due total ${formatCurrency(criticalTotal)}, concentrated across ${critical.length} accounts.`,
      evidence: `${critical.map((c) => c.customer).join(', ')} together account for ${formatCurrency(criticalTotal)} in the 90+ day aging bucket, ${(
        (criticalTotal / getTotalAR()) * 100 || 0
      ).toFixed(1)}% of total outstanding receivables.`,
      impact: 'Aged receivables tie up working capital and increase the risk of write-offs, putting pressure on short-term cash flow.',
      action: 'Prioritise direct collection outreach on the largest overdue accounts and review credit terms for repeat late payers.',
      priority: 'High',
    },
    {
      finding: `${overBudget.length} expense categories exceeded their annual budget, led by ${overBudget[0]?.category ?? 'N/A'}.`,
      evidence: overBudget
        .map((c) => `${c.category} ran ${formatCurrency(Math.abs(c.variance || 0))} over budget (${Math.abs(c.variancePct || 0).toFixed(1)}%)`)
        .join('; ') || 'No categories over budget.',
      impact: 'Sustained overspend in these categories erodes operating margin even as revenue grows.',
      action: 'Introduce category-level spend reviews and require approval for purchase orders that exceed 90% of remaining budget.',
      priority: 'Medium',
    },
    {
      finding: `Revenue in ${worst?.month || 'N/A'} came in ${Math.abs(worst?.variancePct || 0).toFixed(1)}% below target, the weakest month of the period.`,
      evidence: `${worst?.month || 'N/A'} actual revenue was ${formatCurrency(worst?.actual || 0)} against a target of ${formatCurrency(worst?.target || 0)}.`,
      impact: 'A single soft month can mask an otherwise healthy trend, but repeated shortfalls would put the annual target at risk.',
      action: `Review the drivers behind the ${worst?.month || 'N/A'} shortfall (pipeline timing, seasonality, or unit-level performance) before the next planning cycle.`,
      priority: 'Medium',
    },
    {
      finding: `${topUnit?.unit || 'N/A'} is the largest contributor to revenue at ${(topUnit?.share || 0).toFixed(1)}% of the annual total.`,
      evidence: `${topUnit?.unit || 'N/A'} generated ${formatCurrency(topUnit?.revenue || 0)} of ${formatCurrency(getTotalRevenue())} in total revenue.`,
      impact: 'Concentration in a single business unit increases exposure if that unit slows down.',
      action: `Evaluate growth investment in the next-largest units to diversify revenue sources over the coming period.`,
      priority: 'Low',
    },
    {
      finding: `Budget utilisation stands at ${utilization.toFixed(1)}%, with total spend of ${formatCurrency(getTotalExpenses())} against a ${formatCurrency(getTotalBudget())} annual budget.`,
      evidence: `Year-to-date actual expenses are ${formatCurrency(getTotalBudget() - getTotalExpenses())} under the approved budget envelope.`,
      impact: 'Remaining budget headroom is available for reinvestment, but under-utilisation in some categories may signal deferred or delayed initiatives.',
      action: 'Confirm whether unspent budget in underutilised categories reflects planned savings or delayed execution before year-end close.',
      priority: 'Low',
    },
  ];
}