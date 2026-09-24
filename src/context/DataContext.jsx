// src/context/DataContext.jsx
// ---------------------------------------------------------------------------
// Shared data store for the app.
//
// Holds the four "editable" data arrays that power the dashboard:
//   - expenseCategories        (annual budget vs. actual per category)
//   - businessRecords          (monthly revenue / expense records)
//   - monthlyExpenses          (12-month expense timeline: amount + budget)
//   - monthlyCategoryExpenses  (192 rows: 16 categories × 12 months)
//
// Any page that reads from these arrays via `useData()` will instantly
// re-render when the Data Management page uploads a new CSV. Values are
// persisted to localStorage so uploads survive a page refresh.
//
// Reset functions restore the original values from `mockData.js` and
// clear the corresponding localStorage key.
// ---------------------------------------------------------------------------

import { createContext, useContext, useEffect, useState } from 'react';
import {
  expenseCategories as defaultExpenseCategories,
  businessRecords as defaultBusinessRecords,
  monthlyExpenses as defaultMonthlyExpenses,
  monthlyCategoryExpenses as defaultMonthlyCategoryExpenses,
} from '../data/mockData';

// localStorage keys — namespaced so they don't collide with other apps
const LS_KEYS = {
  expenseCategories: 'meridian.expenseCategories',
  businessRecords: 'meridian.businessRecords',
  monthlyExpenses: 'meridian.monthlyExpenses',
  monthlyCategoryExpenses: 'meridian.monthlyCategoryExpenses',
};

// ---------------------------------------------------------------------------
// Safe localStorage helpers (never throw — SSR / private mode / quota safe)
// ---------------------------------------------------------------------------
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded, private mode, or storage disabled — fail silently
  }
}

function clearStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Context + provider
// ---------------------------------------------------------------------------
const DataContext = createContext(null);

export function DataProvider({ children }) {
  // --- Initial state: read from localStorage, fall back to mock data ---
  const [expenseCategories, setExpenseCategoriesState] = useState(() =>
    loadFromStorage(LS_KEYS.expenseCategories, defaultExpenseCategories)
  );

  const [businessRecords, setBusinessRecordsState] = useState(() =>
    loadFromStorage(LS_KEYS.businessRecords, defaultBusinessRecords)
  );

  const [monthlyExpenses, setMonthlyExpensesState] = useState(() =>
    loadFromStorage(LS_KEYS.monthlyExpenses, defaultMonthlyExpenses)
  );

  const [monthlyCategoryExpenses, setMonthlyCategoryExpensesState] = useState(() =>
    loadFromStorage(LS_KEYS.monthlyCategoryExpenses, defaultMonthlyCategoryExpenses)
  );

  // --- Persist to localStorage whenever any array changes ---
  useEffect(() => {
    saveToStorage(LS_KEYS.expenseCategories, expenseCategories);
  }, [expenseCategories]);

  useEffect(() => {
    saveToStorage(LS_KEYS.businessRecords, businessRecords);
  }, [businessRecords]);

  useEffect(() => {
    saveToStorage(LS_KEYS.monthlyExpenses, monthlyExpenses);
  }, [monthlyExpenses]);

  useEffect(() => {
    saveToStorage(LS_KEYS.monthlyCategoryExpenses, monthlyCategoryExpenses);
  }, [monthlyCategoryExpenses]);

  // --- Setters ---
  const setExpenseCategories = (value) => setExpenseCategoriesState(value);
  const setBusinessRecords = (value) => setBusinessRecordsState(value);
  const setMonthlyExpenses = (value) => setMonthlyExpensesState(value);
  const setMonthlyCategoryExpenses = (value) => setMonthlyCategoryExpensesState(value);

  // --- Resetters (restore defaults and clear localStorage) ---
  const resetExpenseCategories = () => {
    setExpenseCategoriesState(defaultExpenseCategories);
    clearStorage(LS_KEYS.expenseCategories);
  };

  const resetBusinessRecords = () => {
    setBusinessRecordsState(defaultBusinessRecords);
    clearStorage(LS_KEYS.businessRecords);
  };

  const resetMonthlyExpenses = () => {
    setMonthlyExpensesState(defaultMonthlyExpenses);
    clearStorage(LS_KEYS.monthlyExpenses);
  };

  const resetMonthlyCategoryExpenses = () => {
    setMonthlyCategoryExpensesState(defaultMonthlyCategoryExpenses);
    clearStorage(LS_KEYS.monthlyCategoryExpenses);
  };

  // --- Everything exposed to consumers ---
  const value = {
    // Data
    expenseCategories,
    businessRecords,
    monthlyExpenses,
    monthlyCategoryExpenses,
    // Setters
    setExpenseCategories,
    setBusinessRecords,
    setMonthlyExpenses,
    setMonthlyCategoryExpenses,
    // Resetters
    resetExpenseCategories,
    resetBusinessRecords,
    resetMonthlyExpenses,
    resetMonthlyCategoryExpenses,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ---------------------------------------------------------------------------
// Consumer hook — throws a helpful error if used outside the provider
// ---------------------------------------------------------------------------
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used inside <DataProvider>');
  }
  return ctx;
}