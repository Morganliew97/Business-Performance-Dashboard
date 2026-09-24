// src/utils/calculations.test.js
import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  sum,
  getTotalRevenue,
  getTotalBudget,
  getTotalExpenses,
  getNetProfit,
  getNetProfitMargin,
  getRevenueGrowth,
  getCollectionRate,
  getARDays,
  getARAgingBucketsFromInvoices,
  getInvoicesWithStatus,
  getARBucket,
  getTotalAR,
  getExpenseCategoriesWithVariance,
} from './calculations';

// -----------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------
describe('formatCurrency', () => {
  it('formats millions with 2 decimals', () => {
    expect(formatCurrency(2_810_000)).toBe('$2.81M');
  });

  it('formats thousands with 0 decimals', () => {
    expect(formatCurrency(15_500)).toBe('$16K');
  });

  it('formats small values as plain dollars', () => {
    expect(formatCurrency(450)).toBe('$450');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('handles undefined gracefully', () => {
    expect(formatCurrency(undefined)).toBe('$0');
  });

  it('handles NaN gracefully', () => {
    expect(formatCurrency(NaN)).toBe('$0');
  });
});

describe('formatPercent', () => {
  it('prefixes positive values with +', () => {
    expect(formatPercent(8.2)).toBe('+8.2%');
  });

  it('keeps the minus sign for negative values', () => {
    expect(formatPercent(-3.5)).toBe('-3.5%');
  });
});

// -----------------------------------------------------------------------
// Sum helper
// -----------------------------------------------------------------------
describe('sum', () => {
  it('adds numbers in an array', () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  it('adds a specific key from an array of objects', () => {
    expect(sum([{ v: 10 }, { v: 20 }], 'v')).toBe(30);
  });

  it('returns 0 for an empty array', () => {
    expect(sum([])).toBe(0);
  });

  it('returns 0 for a non-array input', () => {
    expect(sum(null)).toBe(0);
    expect(sum(undefined)).toBe(0);
  });
});

// -----------------------------------------------------------------------
// Total revenue / expenses
// -----------------------------------------------------------------------
describe('getTotalRevenue', () => {
  it('returns a positive number', () => {
    expect(getTotalRevenue()).toBeGreaterThan(0);
  });

  it('returns a finite number', () => {
    expect(Number.isFinite(getTotalRevenue())).toBe(true);
  });
});

describe('getTotalBudget and getTotalExpenses', () => {
  it('both return positive numbers', () => {
    expect(getTotalBudget()).toBeGreaterThan(0);
    expect(getTotalExpenses()).toBeGreaterThan(0);
  });

  it('expenses are within 50% of budget', () => {
    const budget = getTotalBudget();
    const expenses = getTotalExpenses();
    const ratio = expenses / budget;
    expect(ratio).toBeGreaterThan(0.5);
    expect(ratio).toBeLessThan(1.5);
  });
});

// -----------------------------------------------------------------------
// Net profit
// -----------------------------------------------------------------------
describe('getNetProfit and getNetProfitMargin', () => {
  it('net profit equals revenue minus expenses', () => {
    const revenue = getTotalRevenue();
    const expenses = getTotalExpenses();
    expect(getNetProfit()).toBeCloseTo(revenue - expenses, 2);
  });

  it('net profit margin is a percentage between -100 and 100', () => {
    const margin = getNetProfitMargin();
    expect(margin).toBeGreaterThan(-100);
    expect(margin).toBeLessThan(100);
  });
});

// -----------------------------------------------------------------------
// Growth
// -----------------------------------------------------------------------
describe('getRevenueGrowth', () => {
  it('returns a finite number', () => {
    const growth = getRevenueGrowth();
    expect(Number.isFinite(growth)).toBe(true);
  });
});

// -----------------------------------------------------------------------
// Collection rate — regression test for the bug we fixed
// -----------------------------------------------------------------------
describe('getCollectionRate', () => {
  it('never exceeds 100%', () => {
    expect(getCollectionRate()).toBeLessThanOrEqual(100);
  });

  it('is not negative', () => {
    expect(getCollectionRate()).toBeGreaterThanOrEqual(0);
  });
});

// -----------------------------------------------------------------------
// AR Days — sanity bounds
// -----------------------------------------------------------------------
describe('getARDays', () => {
  it('returns a finite, non-negative number', () => {
    const days = getARDays();
    expect(Number.isFinite(days)).toBe(true);
    expect(days).toBeGreaterThanOrEqual(0);
  });
});

// -----------------------------------------------------------------------
// AR aging buckets — invariants
// -----------------------------------------------------------------------
describe('getARAgingBucketsFromInvoices', () => {
  it('returns exactly 5 buckets in the correct order', () => {
    const buckets = getARAgingBucketsFromInvoices();
    expect(buckets).toHaveLength(5);
    expect(buckets.map((b) => b.bucket)).toEqual([
      'Current',
      '1-30 Days',
      '31-60 Days',
      '61-90 Days',
      '90+ Days',
    ]);
  });

  it('every bucket has a non-negative amount', () => {
    const buckets = getARAgingBucketsFromInvoices();
    buckets.forEach((b) => {
      expect(b.amount).toBeGreaterThanOrEqual(0);
    });
  });

  it('bucket totals add up to getTotalAR', () => {
    const buckets = getARAgingBucketsFromInvoices();
    const bucketSum = buckets.reduce((s, b) => s + b.amount, 0);
    expect(bucketSum).toBeCloseTo(getTotalAR(), 2);
  });
});

describe('getInvoicesWithStatus', () => {
  it('every invoice has agingDays, status, and dueDate', () => {
    const invoices = getInvoicesWithStatus();
    expect(invoices.length).toBeGreaterThan(0);
    invoices.forEach((inv) => {
      expect(typeof inv.agingDays).toBe('number');
      expect(typeof inv.status).toBe('string');
      expect(typeof inv.dueDate).toBe('string');
    });
  });

  it('status values are from the known set', () => {
    const allowed = new Set(['Current', 'Due Soon', 'Overdue', 'Critical']);
    getInvoicesWithStatus().forEach((inv) => {
      expect(allowed.has(inv.status)).toBe(true);
    });
  });
});

describe('getARBucket', () => {
  it('returns a number for every known bucket', () => {
    ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'].forEach((name) => {
      const v = getARBucket(name);
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(0);
    });
  });

  it('returns 0 for an unknown bucket', () => {
    expect(getARBucket('Nonexistent')).toBe(0);
  });
});

// -----------------------------------------------------------------------
// Expense categories — variance + status
// -----------------------------------------------------------------------
describe('getExpenseCategoriesWithVariance', () => {
  it('adds variance, variancePct, and status to each category', () => {
    const enriched = getExpenseCategoriesWithVariance();
    expect(enriched.length).toBeGreaterThan(0);
    enriched.forEach((c) => {
      expect(typeof c.variance).toBe('number');
      expect(typeof c.variancePct).toBe('number');
      expect(['Over Budget', 'On Track']).toContain(c.status);
    });
  });

  it('variance equals budget minus actual', () => {
    const enriched = getExpenseCategoriesWithVariance();
    enriched.forEach((c) => {
      expect(c.variance).toBeCloseTo(c.budget - c.actual, 2);
    });
  });

  it('status is "Over Budget" when actual > budget', () => {
    const enriched = getExpenseCategoriesWithVariance();
    enriched.forEach((c) => {
      if (c.actual > c.budget) {
        expect(c.status).toBe('Over Budget');
      } else {
        expect(c.status).toBe('On Track');
      }
    });
  });

  it('uses default mock data when called with no argument', () => {
    const enriched = getExpenseCategoriesWithVariance();
    expect(enriched.length).toBeGreaterThan(0);
  });

  it('returns an empty array for null input', () => {
    expect(getExpenseCategoriesWithVariance(null)).toEqual([]);
  });

  it('returns an empty array for non-array input', () => {
    expect(getExpenseCategoriesWithVariance('not an array')).toEqual([]);
    expect(getExpenseCategoriesWithVariance(42)).toEqual([]);
  });
});