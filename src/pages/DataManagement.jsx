// src/pages/DataManagement.jsx
import { useMemo, useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, Download, Search, RotateCcw } from 'lucide-react';
import DataTable from '../components/DataTable';
import MonthlyCategoryPivot from '../components/MonthlyCategoryPivot';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/calculations';

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------
const RECORD_COLUMNS = [
  { key: 'id', label: 'Record ID' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year', align: 'right' },
  { key: 'revenueActual', label: 'Revenue (Actual)', align: 'right', render: (r) => formatCurrency(Number(r.revenueActual), { compact: false }) },
  { key: 'revenueTarget', label: 'Revenue (Target)', align: 'right', render: (r) => formatCurrency(Number(r.revenueTarget), { compact: false }) },
  { key: 'expenseActual', label: 'Expense (Actual)', align: 'right', render: (r) => formatCurrency(Number(r.expenseActual), { compact: false }) },
  { key: 'expenseBudget', label: 'Expense (Budget)', align: 'right', render: (r) => formatCurrency(Number(r.expenseBudget), { compact: false }) },
];

const CATEGORY_ANNUAL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'budget', label: 'Budget', align: 'right', render: (r) => formatCurrency(Number(r.budget), { compact: false }) },
  { key: 'actual', label: 'Actual', align: 'right', render: (r) => formatCurrency(Number(r.actual), { compact: false }) },
  {
    key: 'status', label: 'Status', align: 'right',
    render: (r) => (
      <span className={Number(r.actual) > Number(r.budget) ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
        {Number(r.actual) > Number(r.budget) ? 'Over Budget' : 'On Track'}
      </span>
    ),
  },
];

// ---------------------------------------------------------------------------
// Expected CSV schemas (per active view)
// ---------------------------------------------------------------------------
const EXPECTED_COLUMNS = {
  records: ['id', 'month', 'year', 'revenueActual', 'revenueTarget', 'expenseActual', 'expenseBudget'],
  categoriesAnnual: ['id', 'category', 'type', 'budget', 'actual'],
  categoriesMonthly: ['category', 'month', 'budget', 'actual'],
};

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DataManagement() {
  const {
    businessRecords: records,
    expenseCategories: categories,
    monthlyCategoryExpenses,
    setBusinessRecords: setRecords,
    setExpenseCategories: setCategories,
    setMonthlyCategoryExpenses: setMonthlyCategoryExpenses,
    resetBusinessRecords,
    resetExpenseCategories,
    resetMonthlyCategoryExpenses,
  } = useData();

  // Top-level tab: 'records' | 'categories'
  const [activeTab, setActiveTab] = useState('records');

  // Sub-tab inside 'categories' tab: 'annual' | 'monthly'
  const [categoryView, setCategoryView] = useState('annual');

  // Month filter for the monthly category view
  const [monthFilter, setMonthFilter] = useState('All');

  const [search, setSearch] = useState('');
  const [importNote, setImportNote] = useState(null);
  const fileInputRef = useRef(null);

  // -------------------------------------------------------------------
  // Filtering
  // -------------------------------------------------------------------
  const filteredRecords = useMemo(() => {
    return records.filter((r) =>
      search.trim() === '' ||
      Object.values(r).some((v) => String(v).toLowerCase().includes(search.trim().toLowerCase()))
    );
  }, [records, search]);

  const filteredCategoriesAnnual = useMemo(() => {
    return categories.filter((c) =>
      search.trim() === '' ||
      String(c.category).toLowerCase().includes(search.trim().toLowerCase()) ||
      String(c.type).toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [categories, search]);

  const filteredCategoriesMonthly = useMemo(() => {
    let rows = monthlyCategoryExpenses;

    if (monthFilter !== 'All') {
      rows = rows.filter((r) => String(r.month).toLowerCase() === monthFilter.toLowerCase());
    }

    if (search.trim() !== '') {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) =>
        String(r.category).toLowerCase().includes(q) ||
        String(r.month).toLowerCase().includes(q)
      );
    }

    return rows;
  }, [monthlyCategoryExpenses, search, monthFilter]);

  // -------------------------------------------------------------------
  // Templates
  // -------------------------------------------------------------------
  const triggerDownload = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadRecordsTemplate = () => {
    const template = [
      { id: '', month: 'January', year: 2025, revenueActual: 75000, revenueTarget: 70000, expenseActual: 58000, expenseBudget: 60000 },
      { id: '', month: 'February', year: 2025, revenueActual: 62000, revenueTarget: 65000, expenseActual: 52000, expenseBudget: 54000 },
    ];
    triggerDownload(Papa.unparse(template), 'business-records-template.csv');
  };

  const downloadCategoriesAnnualTemplate = () => {
    const template = [
      { id: 1, category: 'Advertising', type: 'Operating', budget: 50000, actual: 48000 },
      { id: 2, category: 'Raw Materials', type: 'COGS', budget: 210000, actual: 215000 },
      { id: 3, category: 'Wages', type: 'Operating', budget: 830000, actual: 845000 },
    ];
    triggerDownload(Papa.unparse(template), 'expense-categories-annual-template.csv');
  };

  const downloadCategoriesMonthlyTemplate = () => {
    const template = [
      { category: 'Advertising', month: 'Jan', budget: 4989, actual: 4688 },
      { category: 'Advertising', month: 'Feb', budget: 4664, actual: 4384 },
      { category: 'Wages', month: 'Jan', budget: 66325, actual: 67692 },
      { category: 'Wages', month: 'Feb', budget: 62016, actual: 63293 },
    ];
    triggerDownload(Papa.unparse(template), 'expense-categories-monthly-template.csv');
  };

  const currentTemplate = () => {
    if (activeTab === 'records') return downloadRecordsTemplate();
    return categoryView === 'annual'
      ? downloadCategoriesAnnualTemplate()
      : downloadCategoriesMonthlyTemplate();
  };

  // -------------------------------------------------------------------
  // Upload
  // -------------------------------------------------------------------
  const handleUploadClick = () => fileInputRef.current?.click();

  const currentSchemaKey = () => {
    if (activeTab === 'records') return 'records';
    return categoryView === 'annual' ? 'categoriesAnnual' : 'categoriesMonthly';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportNote(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fields = results.meta?.fields || [];
        const expected = EXPECTED_COLUMNS[currentSchemaKey()];
        const missing = expected.filter((col) => !fields.includes(col));

        if (missing.length > 0) {
          setImportNote({
            tone: 'error',
            text: `Invalid CSV for this view. Missing column(s): ${missing.join(', ')}. Download the template for the correct format.`,
          });
          return;
        }

        // --- Business Records ---
        if (activeTab === 'records') {
          const imported = [];
          const skipped = [];
          results.data.forEach((row, i) => {
            const month = (row.month || '').trim();
            const year = Number(row.year);
            const revenueActual = Number(row.revenueActual);
            const revenueTarget = Number(row.revenueTarget);
            const expenseActual = Number(row.expenseActual);
            const expenseBudget = Number(row.expenseBudget);
            if (!month || !year || [revenueActual, revenueTarget, expenseActual, expenseBudget].some(isNaN)) {
              skipped.push(i + 2);
              return;
            }
            imported.push({
              id: row.id || `IMP-${String(records.length + imported.length + 1).padStart(3, '0')}`,
              month, year, revenueActual, revenueTarget, expenseActual, expenseBudget,
            });
          });
          if (imported.length === 0) {
            setImportNote({ tone: 'error', text: 'No valid rows found.' });
            return;
          }
          setRecords(imported);
          setImportNote({
            tone: skipped.length > 0 ? 'warning' : 'success',
            text: `Imported ${imported.length} business record(s).${skipped.length > 0 ? ` Skipped ${skipped.length} invalid row(s).` : ''}`,
          });
          return;
        }

        // --- Categories, Annual view ---
        if (activeTab === 'categories' && categoryView === 'annual') {
          const imported = [];
          const skipped = [];
          results.data.forEach((row, i) => {
            const category = (row.category || '').trim();
            const type = (row.type || '').trim() || 'Operating';
            const budget = Number(row.budget);
            const actual = Number(row.actual);
            if (!category || isNaN(budget) || isNaN(actual)) {
              skipped.push(i + 2);
              return;
            }
            imported.push({
              id: Number(row.id) || categories.length + imported.length + 1,
              category, type, budget, actual,
            });
          });
          if (imported.length === 0) {
            setImportNote({ tone: 'error', text: 'No valid rows found.' });
            return;
          }
          setCategories(imported);
          setImportNote({
            tone: skipped.length > 0 ? 'warning' : 'success',
            text: `Imported ${imported.length} categor${imported.length === 1 ? 'y' : 'ies'}.${skipped.length > 0 ? ` Skipped ${skipped.length} invalid row(s).` : ''}`,
          });
          return;
        }

        // --- Categories, Monthly view ---
        if (activeTab === 'categories' && categoryView === 'monthly') {
          const imported = [];
          const skipped = [];
          results.data.forEach((row, i) => {
            const category = (row.category || '').trim();
            const month = (row.month || '').trim();
            const budget = Number(row.budget);
            const actual = Number(row.actual);
            if (!category || !month || isNaN(budget) || isNaN(actual)) {
              skipped.push(i + 2);
              return;
            }
            imported.push({ category, month, budget, actual });
          });
          if (imported.length === 0) {
            setImportNote({ tone: 'error', text: 'No valid rows found.' });
            return;
          }
          setMonthlyCategoryExpenses(imported);
          setImportNote({
            tone: skipped.length > 0 ? 'warning' : 'success',
            text: `Imported ${imported.length} monthly categor${imported.length === 1 ? 'y row' : 'y rows'}.${skipped.length > 0 ? ` Skipped ${skipped.length} invalid row(s).` : ''}`,
          });
        }
      },
      error: () => setImportNote({ tone: 'error', text: 'Could not read that file.' }),
    });

    e.target.value = '';
  };

  // -------------------------------------------------------------------
  // Export
  // -------------------------------------------------------------------
  const handleExport = () => {
    let dataToExport, filename;
    if (activeTab === 'records') {
      dataToExport = filteredRecords;
      filename = 'business-records-export.csv';
    } else if (categoryView === 'annual') {
      dataToExport = filteredCategoriesAnnual;
      filename = 'expense-categories-annual-export.csv';
    } else {
      dataToExport = filteredCategoriesMonthly;
      filename = 'expense-categories-monthly-export.csv';
    }
    triggerDownload(Papa.unparse(dataToExport), filename);
  };

  // -------------------------------------------------------------------
  // Reset to defaults (respects the active view)
  // -------------------------------------------------------------------
  const handleResetToDefaults = () => {
    if (activeTab === 'records') {
      resetBusinessRecords();
      setImportNote({ tone: 'success', text: 'Business records reset to defaults.' });
    } else if (categoryView === 'annual') {
      resetExpenseCategories();
      setImportNote({ tone: 'success', text: 'Annual categories reset to defaults.' });
    } else {
      resetMonthlyCategoryExpenses();
      setImportNote({ tone: 'success', text: 'Monthly categories reset to defaults.' });
    }
  };

  // -------------------------------------------------------------------
  // Counts line
  // -------------------------------------------------------------------
  const currentCounts = (() => {
    if (activeTab === 'records') {
      return { filtered: filteredRecords.length, total: records.length, noun: 'records' };
    }
    if (categoryView === 'annual') {
      return { filtered: filteredCategoriesAnnual.length, total: categories.length, noun: 'categories' };
    }
    return { filtered: filteredCategoriesMonthly.length, total: monthlyCategoryExpenses.length, noun: 'monthly rows' };
  })();

  return (
    <div className="space-y-5">
      {/* Top-level tabs */}
      <div className="flex gap-2 border-b border-ink-200">
        {[
          { key: 'records', label: 'Business Records' },
          { key: 'categories', label: 'Expense Categories' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSearch(''); setImportNote(null); setMonthFilter('All'); }}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-ink-500 hover:text-ink-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tabs shown only on the categories tab */}
      {activeTab === 'categories' && (
        <div className="flex gap-2">
          {[
            { key: 'annual', label: 'Annual (per category)' },
            { key: 'monthly', label: 'Monthly (category × month)' },
          ].map((sub) => (
            <button
              key={sub.key}
              onClick={() => { setCategoryView(sub.key); setSearch(''); setImportNote(null); setMonthFilter('All'); }}
              className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                categoryView === sub.key
                  ? 'bg-accent-600 text-white'
                  : 'border border-ink-200 bg-surface text-ink-700 hover:bg-ink-100'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-ink-200 bg-surface px-3 py-2 shadow-card">
          <Search size={15} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === 'records' ? 'Search records by month…'
              : categoryView === 'annual' ? 'Search categories…'
              : 'Search categories or months…'
            }
            className="w-full bg-transparent text-[13px] text-ink-700 outline-none placeholder:text-ink-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month filter — only on the monthly category view */}
          {activeTab === 'categories' && categoryView === 'monthly' && (
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="rounded-md border border-ink-200 bg-surface px-3 py-2 text-[12.5px] font-medium text-ink-700 shadow-card outline-none"
            >
              <option value="All">All months</option>
              {MONTHS_SHORT.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}

          <button
            onClick={currentTemplate}
            className="flex items-center gap-1.5 rounded-md border border-ink-200 bg-surface px-3 py-2 text-[12.5px] font-medium text-ink-700 shadow-card hover:bg-ink-100"
          >
            <Download size={14} />
            Template CSV
          </button>

          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-1.5 rounded-md border border-ink-200 bg-surface px-3 py-2 text-[12.5px] font-medium text-ink-700 shadow-card hover:bg-ink-100"
          >
            <Upload size={14} />
            Upload CSV
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-md bg-accent-600 px-3 py-2 text-[12.5px] font-medium text-white shadow-card hover:bg-accent-500"
          >
            <Download size={14} />
            Export Data
          </button>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 rounded-md border border-ink-200 bg-surface px-3 py-2 text-[12.5px] font-medium text-ink-500 shadow-card hover:bg-ink-100"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Import feedback */}
      {importNote && (
        <div
          className={`flex items-start justify-between gap-3 rounded-md border px-3.5 py-2.5 text-[12.5px] ${
            importNote.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : importNote.tone === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <span>{importNote.text}</span>
          <button
            onClick={() => setImportNote(null)}
            className="shrink-0 text-[12px] font-medium opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <p className="text-[12px] text-ink-500">
        Showing {currentCounts.filtered} of {currentCounts.total} {currentCounts.noun}
        {activeTab === 'categories' && categoryView === 'monthly' && monthFilter !== 'All' && (
          <span className="ml-1 text-ink-400">· filtered to {monthFilter}</span>
        )}
      </p>

      {/* Table */}
      {activeTab === 'records' && (
        <DataTable columns={RECORD_COLUMNS} rows={filteredRecords} emptyMessage="No records match your search." />
      )}

      {activeTab === 'categories' && categoryView === 'annual' && (
        <DataTable columns={CATEGORY_ANNUAL_COLUMNS} rows={filteredCategoriesAnnual} emptyMessage="No categories match your search." />
      )}

      {activeTab === 'categories' && categoryView === 'monthly' && (
        <MonthlyCategoryPivot rows={filteredCategoriesMonthly} monthFilter={monthFilter} />
      )}
    </div>
  );
}