// src/utils/notifications.js
// ---------------------------------------------------------------------------
// Builds the bell-icon notifications from the same mock data that powers
// the dashboard. Every notification reflects a real number, invoice, or
// budget overage in the app — nothing is hard-coded.
//
// Each notification includes a `route` so clicking it navigates the user
// to the page where they can act on it.
//
// IMPORTANT: These routes must match the paths defined in App.jsx.
// If you rename a route there, update it here too.
// ---------------------------------------------------------------------------

import {
  getInvoicesWithStatus,
  getTotalAR,
  getARBucket,
  getOverBudgetCategories,
  getWorstRevenueMonth,
  formatCurrency,
} from './calculations';

export function getNotifications() {
  const notifications = [];
  const invoices = getInvoicesWithStatus();

  // ---------------------------------------------------------------
  // 1. Critical invoices (31+ days past due) — highest priority
  // ---------------------------------------------------------------
  const critical = invoices.filter((i) => i.status === 'Critical');
  if (critical.length > 0) {
    const total = critical.reduce((s, i) => s + i.amount, 0);
    const ids = critical.map((i) => i.id).join(', ');
    notifications.push({
      id: 'critical-invoices',
      text: `${critical.length} invoice${critical.length > 1 ? 's' : ''} critically overdue (${formatCurrency(total)})`,
      detail: ids,
      time: 'Just now',
      tone: 'negative',
      route: '/receivable',
    });
  }

  // ---------------------------------------------------------------
  // 2. Overdue invoices (8–30 days past due)
  // ---------------------------------------------------------------
  const overdue = invoices.filter((i) => i.status === 'Overdue');
  if (overdue.length > 0) {
    const total = overdue.reduce((s, i) => s + i.amount, 0);
    const ids = overdue.map((i) => i.id).join(', ');
    notifications.push({
      id: 'overdue-invoices',
      text: `${overdue.length} invoice${overdue.length > 1 ? 's' : ''} overdue (${formatCurrency(total)})`,
      detail: ids,
      time: 'Just now',
      tone: 'negative',
      route: '/receivable',
    });
  }

  // ---------------------------------------------------------------
  // 3. Due soon (1–7 days past due)
  // ---------------------------------------------------------------
  const dueSoon = invoices.filter((i) => i.status === 'Due Soon');
  if (dueSoon.length > 0) {
    const ids = dueSoon.map((i) => i.id).join(', ');
    notifications.push({
      id: 'due-soon',
      text: `${dueSoon.length} invoice${dueSoon.length > 1 ? 's' : ''} due soon`,
      detail: ids,
      time: 'Just now',
      tone: 'warning',
      route: '/receivable',
    });
  }

  // ---------------------------------------------------------------
  // 4. Over-budget expense categories
  // ---------------------------------------------------------------
  const overBudget = getOverBudgetCategories();
  if (overBudget.length > 0) {
    const biggest = overBudget.reduce(
      (a, b) => (Math.abs(a.variance) > Math.abs(b.variance) ? a : b),
      overBudget[0]
    );
    notifications.push({
      id: 'over-budget',
      text: `${overBudget.length} expense categor${overBudget.length > 1 ? 'ies' : 'y'} over budget`,
      detail: `Largest: ${biggest.category} (${formatCurrency(Math.abs(biggest.variance))} over)`,
      time: 'Just now',
      tone: 'warning',
      route: '/expenses',
    });
  }

  // ---------------------------------------------------------------
  // 5. Worst revenue month vs. target
  // ---------------------------------------------------------------
  const worst = getWorstRevenueMonth();
  if (worst && worst.variancePct < 0) {
    notifications.push({
      id: 'worst-revenue',
      text: `${worst.month} revenue ${Math.abs(worst.variancePct).toFixed(1)}% below target`,
      detail: `Actual ${formatCurrency(worst.actual)} vs target ${formatCurrency(worst.target)}`,
      time: 'Just now',
      tone: 'warning',
      route: '/revenue',
    });
  }

  // ---------------------------------------------------------------
  // 6. Positive: strong AR position (nothing 90+ overdue)
  // ---------------------------------------------------------------
  const overdue90 = getARBucket('90+ Days');
  if (overdue90 === 0 && getTotalAR() > 0) {
    notifications.push({
      id: 'ar-healthy',
      text: 'No receivables over 90 days past due',
      detail: `${formatCurrency(getTotalAR())} outstanding, all within collectible range`,
      time: 'Just now',
      tone: 'positive',
      route: '/receivable',
    });
  }

  // ---------------------------------------------------------------
  // Fallback: if nothing to report, show a friendly message
  // ---------------------------------------------------------------
  if (notifications.length === 0) {
    notifications.push({
      id: 'all-clear',
      text: 'All clear — no alerts at this time',
      detail: 'Dashboard metrics are within expected ranges.',
      time: 'Just now',
      tone: 'positive',
      route: '/',
    });
  }

  return notifications;
}