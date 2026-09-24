// src/utils/csvUpload.js
// ---------------------------------------------------------------------------
// Parses an uploaded CSV file and validates it against the expected
// expense-category schema. Returns { valid, errors, rows }.
// ---------------------------------------------------------------------------

const EXPECTED_COLUMNS = ['id', 'category', 'type', 'budget', 'actual'];

export function parseExpenseCSV(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

      if (lines.length < 2) {
        resolve({ valid: false, errors: ['CSV is empty or missing data rows.'], rows: [] });
        return;
      }

      // Parse header
      const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const missing = EXPECTED_COLUMNS.filter((col) => !header.includes(col));
      if (missing.length > 0) {
        resolve({
          valid: false,
          errors: [`Missing required columns: ${missing.join(', ')}`],
          rows: [],
        });
        return;
      }

      // Parse rows
      const rows = [];
      const errors = [];
      const idIndex = header.indexOf('id');
      const categoryIndex = header.indexOf('category');
      const typeIndex = header.indexOf('type');
      const budgetIndex = header.indexOf('budget');
      const actualIndex = header.indexOf('actual');

      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map((c) => c.trim());
        const id = Number(cells[idIndex]);
        const category = cells[categoryIndex];
        const type = cells[typeIndex];
        const budget = Number(cells[budgetIndex]);
        const actual = Number(cells[actualIndex]);

        if (!id || !category) {
          errors.push(`Row ${i + 1}: missing id or category.`);
          continue;
        }
        if (isNaN(budget) || isNaN(actual)) {
          errors.push(`Row ${i + 1}: budget and actual must be numbers.`);
          continue;
        }

        rows.push({ id, category, type, budget, actual });
      }

      resolve({ valid: errors.length === 0, errors, rows });
    };

    reader.onerror = () => {
      resolve({ valid: false, errors: ['Failed to read file.'], rows: [] });
    };

    reader.readAsText(file);
  });
}

// ------------------- localStorage helpers -------------------
const STORAGE_KEY = 'meridian.expenseCategories';

export function loadExpenseOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveExpenseOverrides(rows) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // Quota exceeded or blocked — silently ignore
  }
}

export function clearExpenseOverrides() {
  localStorage.removeItem(STORAGE_KEY);
}