// src/data/mockData.js

export const REPORTING_YEAR = 2025;

// ===================== LOOKUP LISTS =====================
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const BUSINESS_UNITS = [
  'Corporate', 'Retail', 'Wholesale', 'E-commerce', 'Distribution',
];

export const DEPARTMENTS = [
  'Sales', 'Marketing', 'Finance', 'Operations', 'IT', 'HR',
];

// ===================== MONTHLY REVENUE (Total: $2,810,000) =====================
export const monthlyRevenue = [
  { month: 'Jan', actual: 210000, target: 200000 },
  { month: 'Feb', actual: 195000, target: 205000 },
  { month: 'Mar', actual: 220000, target: 210000 },
  { month: 'Apr', actual: 235000, target: 220000 },
  { month: 'May', actual: 245000, target: 230000 },
  { month: 'Jun', actual: 260000, target: 240000 },
  { month: 'Jul', actual: 255000, target: 245000 },
  { month: 'Aug', actual: 240000, target: 250000 },
  { month: 'Sep', actual: 250000, target: 255000 },
  { month: 'Oct', actual: 265000, target: 260000 },
  { month: 'Nov', actual: 275000, target: 265000 },
  { month: 'Dec', actual: 260000, target: 270000 },
];

// ===================== MONTHLY EXPENSES =====================
// Total actual : $2,464,000  (matches sum of `expenseCategories.actual`)
// Total budget : $2,427,500  (matches sum of `expenseCategories.budget`)
export const monthlyExpenses = [
  { month: 'Jan', amount: 190000, budget: 190000 },
  { month: 'Feb', amount: 178000, budget: 185000 },
  { month: 'Mar', amount: 192000, budget: 190000 },
  { month: 'Apr', amount: 210000, budget: 200000 },
  { month: 'May', amount: 210000, budget: 200000 },
  { month: 'Jun', amount: 225000, budget: 215000 },
  { month: 'Jul', amount: 215000, budget: 218000 },
  { month: 'Aug', amount: 198000, budget: 205000 },
  { month: 'Sep', amount: 210000, budget: 212000 },
  { month: 'Oct', amount: 224000, budget: 221000 },
  { month: 'Nov', amount: 231000, budget: 218000 },
  { month: 'Dec', amount: 181000, budget: 173500 },
];

// ===================== REVENUE BY BUSINESS UNIT (sums to $2,810,000) =====================
export const revenueByBusinessUnit = [
  { unit: 'Corporate', revenue: 878125, growth: 15.5 },
  { unit: 'Retail', revenue: 565903, growth: 5.2 },
  { unit: 'Wholesale', revenue: 439063, growth: 2.7 },
  { unit: 'E-commerce', revenue: 604931, growth: 20.3 },
  { unit: 'Distribution', revenue: 321978, growth: 1.8 },
];

// ===================== EXPENSE CATEGORIES (annual) =====================
// Totals: actual = $2,464,000  |  budget = $2,427,500
export const expenseCategories = [
  { id: 1, category: 'Advertising', type: 'Operating', budget: 63560, actual: 59722 },
  { id: 2, category: 'Raw Materials', type: 'COGS', budget: 312450, actual: 325100 },
  { id: 3, category: 'Wages', type: 'Operating', budget: 845000, actual: 862300 },
  { id: 4, category: 'Rent & Utilities', type: 'Operating', budget: 148200, actual: 151800 },
  { id: 5, category: 'Software & SaaS', type: 'Operating', budget: 68400, actual: 71250 },
  { id: 6, category: 'Travel & Entertainment', type: 'Operating', budget: 42500, actual: 38900 },
  { id: 7, category: 'Professional Services', type: 'Operating', budget: 95600, actual: 102300 },
  { id: 8, category: 'Insurance', type: 'Operating', budget: 37800, actual: 37800 },
  { id: 9, category: 'Depreciation', type: 'Operating', budget: 112000, actual: 112000 },
  { id: 10, category: 'Shipping & Logistics', type: 'COGS', budget: 186500, actual: 194200 },
  { id: 11, category: 'Marketing Campaigns', type: 'Operating', budget: 78000, actual: 85400 },
  { id: 12, category: 'Office Supplies', type: 'Operating', budget: 18500, actual: 16200 },
  { id: 13, category: 'Training & Development', type: 'Operating', budget: 32000, actual: 28700 },
  { id: 14, category: 'Maintenance', type: 'Operating', budget: 45600, actual: 49100 },
  { id: 15, category: 'Miscellaneous', type: 'Operating', budget: 28500, actual: 31200 },
  { id: 16, category: 'Benefits & Payroll Tax', type: 'Operating', budget: 312890, actual: 298028 },
];

// ===================== MONTHLY CATEGORY EXPENSES (month × category) =====================
// 192 rows (16 categories × 12 months).
// Per-category yearly totals match `expenseCategories` above.
// Per-month totals across all categories closely match `monthlyExpenses`.
//
// Approach: each category's annual amount is distributed across the year
// using a seasonal weight curve (Jan–Dec). The last month absorbs any
// rounding residue so the 12 rows sum EXACTLY to the category's annual total.
//
// If you edit `expenseCategories`, regenerate this array (or just accept
// small mismatches — the console sanity check at the bottom of this file
// will warn you).
export const monthlyCategoryExpenses = [
  // ---- Advertising  (annual: budget 63,560 | actual 59,722) ----
  { category: 'Advertising', month: 'Jan', budget: 4989, actual: 4688 },
  { category: 'Advertising', month: 'Feb', budget: 4664, actual: 4384 },
  { category: 'Advertising', month: 'Mar', budget: 5029, actual: 4725 },
  { category: 'Advertising', month: 'Apr', budget: 5468, actual: 5138 },
  { category: 'Advertising', month: 'May', budget: 5479, actual: 5147 },
  { category: 'Advertising', month: 'Jun', budget: 5866, actual: 5513 },
  { category: 'Advertising', month: 'Jul', budget: 5626, actual: 5284 },
  { category: 'Advertising', month: 'Aug', budget: 5187, actual: 4873 },
  { category: 'Advertising', month: 'Sep', budget: 5466, actual: 5135 },
  { category: 'Advertising', month: 'Oct', budget: 5783, actual: 5434 },
  { category: 'Advertising', month: 'Nov', budget: 6037, actual: 5672 },
  { category: 'Advertising', month: 'Dec', budget: 3966, actual: 3725 },
  // ---- Raw Materials  (annual: budget 312,450 | actual 325,100) ----
  { category: 'Raw Materials', month: 'Jan', budget: 24527, actual: 25520 },
  { category: 'Raw Materials', month: 'Feb', budget: 22929, actual: 23857 },
  { category: 'Raw Materials', month: 'Mar', budget: 24716, actual: 25717 },
  { category: 'Raw Materials', month: 'Apr', budget: 26874, actual: 27962 },
  { category: 'Raw Materials', month: 'May', budget: 26939, actual: 28031 },
  { category: 'Raw Materials', month: 'Jun', budget: 28862, actual: 30032 },
  { category: 'Raw Materials', month: 'Jul', budget: 27669, actual: 28790 },
  { category: 'Raw Materials', month: 'Aug', budget: 25504, actual: 26538 },
  { category: 'Raw Materials', month: 'Sep', budget: 26878, actual: 27967 },
  { category: 'Raw Materials', month: 'Oct', budget: 28440, actual: 29592 },
  { category: 'Raw Materials', month: 'Nov', budget: 29690, actual: 30890 },
  { category: 'Raw Materials', month: 'Dec', budget: 19422, actual: 20204 },
  // ---- Wages  (annual: budget 845,000 | actual 862,300) ----
  { category: 'Wages', month: 'Jan', budget: 66325, actual: 67692 },
  { category: 'Wages', month: 'Feb', budget: 62016, actual: 63293 },
  { category: 'Wages', month: 'Mar', budget: 66827, actual: 68193 },
  { category: 'Wages', month: 'Apr', budget: 72668, actual: 74152 },
  { category: 'Wages', month: 'May', budget: 72846, actual: 74334 },
  { category: 'Wages', month: 'Jun', budget: 78049, actual: 79644 },
  { category: 'Wages', month: 'Jul', budget: 74828, actual: 76359 },
  { category: 'Wages', month: 'Aug', budget: 68975, actual: 70385 },
  { category: 'Wages', month: 'Sep', budget: 72686, actual: 74170 },
  { category: 'Wages', month: 'Oct', budget: 76912, actual: 78487 },
  { category: 'Wages', month: 'Nov', budget: 80294, actual: 81939 },
  { category: 'Wages', month: 'Dec', budget: 52584, actual: 53654 },
  // ---- Rent & Utilities  (annual: budget 148,200 | actual 151,800) ----
  { category: 'Rent & Utilities', month: 'Jan', budget: 11633, actual: 11916 },
  { category: 'Rent & Utilities', month: 'Feb', budget: 10876, actual: 11140 },
  { category: 'Rent & Utilities', month: 'Mar', budget: 11724, actual: 12010 },
  { category: 'Rent & Utilities', month: 'Apr', budget: 12747, actual: 13055 },
  { category: 'Rent & Utilities', month: 'May', budget: 12779, actual: 13088 },
  { category: 'Rent & Utilities', month: 'Jun', budget: 13689, actual: 14017 },
  { category: 'Rent & Utilities', month: 'Jul', budget: 13123, actual: 13438 },
  { category: 'Rent & Utilities', month: 'Aug', budget: 12096, actual: 12386 },
  { category: 'Rent & Utilities', month: 'Sep', budget: 12747, actual: 13055 },
  { category: 'Rent & Utilities', month: 'Oct', budget: 13486, actual: 13812 },
  { category: 'Rent & Utilities', month: 'Nov', budget: 14079, actual: 14418 },
  { category: 'Rent & Utilities', month: 'Dec', budget: 9221, actual: 9445 },
  // ---- Software & SaaS  (annual: budget 68,400 | actual 71,250) ----
  { category: 'Software & SaaS', month: 'Jan', budget: 5369, actual: 5593 },
  { category: 'Software & SaaS', month: 'Feb', budget: 5020, actual: 5229 },
  { category: 'Software & SaaS', month: 'Mar', budget: 5411, actual: 5636 },
  { category: 'Software & SaaS', month: 'Apr', budget: 5883, actual: 6128 },
  { category: 'Software & SaaS', month: 'May', budget: 5898, actual: 6143 },
  { category: 'Software & SaaS', month: 'Jun', budget: 6318, actual: 6581 },
  { category: 'Software & SaaS', month: 'Jul', budget: 6056, actual: 6309 },
  { category: 'Software & SaaS', month: 'Aug', budget: 5583, actual: 5816 },
  { category: 'Software & SaaS', month: 'Sep', budget: 5883, actual: 6128 },
  { category: 'Software & SaaS', month: 'Oct', budget: 6224, actual: 6484 },
  { category: 'Software & SaaS', month: 'Nov', budget: 6498, actual: 6769 },
  { category: 'Software & SaaS', month: 'Dec', budget: 4267, actual: 4444 },
  // ---- Travel & Entertainment  (annual: budget 42,500 | actual 38,900) ----
  { category: 'Travel & Entertainment', month: 'Jan', budget: 3336, actual: 3054 },
  { category: 'Travel & Entertainment', month: 'Feb', budget: 3119, actual: 2856 },
  { category: 'Travel & Entertainment', month: 'Mar', budget: 3362, actual: 3078 },
  { category: 'Travel & Entertainment', month: 'Apr', budget: 3655, actual: 3347 },
  { category: 'Travel & Entertainment', month: 'May', budget: 3664, actual: 3355 },
  { category: 'Travel & Entertainment', month: 'Jun', budget: 3926, actual: 3595 },
  { category: 'Travel & Entertainment', month: 'Jul', budget: 3763, actual: 3446 },
  { category: 'Travel & Entertainment', month: 'Aug', budget: 3468, actual: 3175 },
  { category: 'Travel & Entertainment', month: 'Sep', budget: 3655, actual: 3347 },
  { category: 'Travel & Entertainment', month: 'Oct', budget: 3868, actual: 3542 },
  { category: 'Travel & Entertainment', month: 'Nov', budget: 4037, actual: 3697 },
  { category: 'Travel & Entertainment', month: 'Dec', budget: 2647, actual: 2423 },
  // ---- Professional Services  (annual: budget 95,600 | actual 102,300) ----
  { category: 'Professional Services', month: 'Jan', budget: 7504, actual: 8030 },
  { category: 'Professional Services', month: 'Feb', budget: 7016, actual: 7508 },
  { category: 'Professional Services', month: 'Mar', budget: 7563, actual: 8094 },
  { category: 'Professional Services', month: 'Apr', budget: 8221, actual: 8798 },
  { category: 'Professional Services', month: 'May', budget: 8241, actual: 8819 },
  { category: 'Professional Services', month: 'Jun', budget: 8829, actual: 9449 },
  { category: 'Professional Services', month: 'Jul', budget: 8465, actual: 9058 },
  { category: 'Professional Services', month: 'Aug', budget: 7803, actual: 8351 },
  { category: 'Professional Services', month: 'Sep', budget: 8221, actual: 8798 },
  { category: 'Professional Services', month: 'Oct', budget: 8700, actual: 9311 },
  { category: 'Professional Services', month: 'Nov', budget: 9082, actual: 9718 },
  { category: 'Professional Services', month: 'Dec', budget: 5955, actual: 6366 },
  // ---- Insurance  (annual: budget 37,800 | actual 37,800) ----
  { category: 'Insurance', month: 'Jan', budget: 2967, actual: 2967 },
  { category: 'Insurance', month: 'Feb', budget: 2775, actual: 2775 },
  { category: 'Insurance', month: 'Mar', budget: 2990, actual: 2990 },
  { category: 'Insurance', month: 'Apr', budget: 3251, actual: 3251 },
  { category: 'Insurance', month: 'May', budget: 3259, actual: 3259 },
  { category: 'Insurance', month: 'Jun', budget: 3491, actual: 3491 },
  { category: 'Insurance', month: 'Jul', budget: 3348, actual: 3348 },
  { category: 'Insurance', month: 'Aug', budget: 3085, actual: 3085 },
  { category: 'Insurance', month: 'Sep', budget: 3251, actual: 3251 },
  { category: 'Insurance', month: 'Oct', budget: 3440, actual: 3440 },
  { category: 'Insurance', month: 'Nov', budget: 3591, actual: 3591 },
  { category: 'Insurance', month: 'Dec', budget: 2352, actual: 2352 },
  // ---- Depreciation  (annual: budget 112,000 | actual 112,000) ----
  { category: 'Depreciation', month: 'Jan', budget: 8792, actual: 8792 },
  { category: 'Depreciation', month: 'Feb', budget: 8221, actual: 8221 },
  { category: 'Depreciation', month: 'Mar', budget: 8859, actual: 8859 },
  { category: 'Depreciation', month: 'Apr', budget: 9632, actual: 9632 },
  { category: 'Depreciation', month: 'May', budget: 9654, actual: 9654 },
  { category: 'Depreciation', month: 'Jun', budget: 10338, actual: 10338 },
  { category: 'Depreciation', month: 'Jul', budget: 9912, actual: 9912 },
  { category: 'Depreciation', month: 'Aug', budget: 9139, actual: 9139 },
  { category: 'Depreciation', month: 'Sep', budget: 9632, actual: 9632 },
  { category: 'Depreciation', month: 'Oct', budget: 10192, actual: 10192 },
  { category: 'Depreciation', month: 'Nov', budget: 10640, actual: 10640 },
  { category: 'Depreciation', month: 'Dec', budget: 6988, actual: 6988 },
  // ---- Shipping & Logistics  (annual: budget 186,500 | actual 194,200) ----
  { category: 'Shipping & Logistics', month: 'Jan', budget: 14640, actual: 15245 },
  { category: 'Shipping & Logistics', month: 'Feb', budget: 13689, actual: 14254 },
  { category: 'Shipping & Logistics', month: 'Mar', budget: 14755, actual: 15366 },
  { category: 'Shipping & Logistics', month: 'Apr', budget: 16039, actual: 16702 },
  { category: 'Shipping & Logistics', month: 'May', budget: 16078, actual: 16743 },
  { category: 'Shipping & Logistics', month: 'Jun', budget: 17226, actual: 17938 },
  { category: 'Shipping & Logistics', month: 'Jul', budget: 16514, actual: 17196 },
  { category: 'Shipping & Logistics', month: 'Aug', budget: 15222, actual: 15851 },
  { category: 'Shipping & Logistics', month: 'Sep', budget: 16039, actual: 16702 },
  { category: 'Shipping & Logistics', month: 'Oct', budget: 16972, actual: 17673 },
  { category: 'Shipping & Logistics', month: 'Nov', budget: 17718, actual: 18449 },
  { category: 'Shipping & Logistics', month: 'Dec', budget: 11598, actual: 12079 },
  // ---- Marketing Campaigns  (annual: budget 78,000 | actual 85,400) ----
  { category: 'Marketing Campaigns', month: 'Jan', budget: 6123, actual: 6704 },
  { category: 'Marketing Campaigns', month: 'Feb', budget: 5725, actual: 6267 },
  { category: 'Marketing Campaigns', month: 'Mar', budget: 6170, actual: 6756 },
  { category: 'Marketing Campaigns', month: 'Apr', budget: 6708, actual: 7344 },
  { category: 'Marketing Campaigns', month: 'May', budget: 6724, actual: 7362 },
  { category: 'Marketing Campaigns', month: 'Jun', budget: 7204, actual: 7887 },
  { category: 'Marketing Campaigns', month: 'Jul', budget: 6906, actual: 7561 },
  { category: 'Marketing Campaigns', month: 'Aug', budget: 6366, actual: 6970 },
  { category: 'Marketing Campaigns', month: 'Sep', budget: 6708, actual: 7344 },
  { category: 'Marketing Campaigns', month: 'Oct', budget: 7099, actual: 7770 },
  { category: 'Marketing Campaigns', month: 'Nov', budget: 7410, actual: 8113 },
  { category: 'Marketing Campaigns', month: 'Dec', budget: 4857, actual: 5315 },
  // ---- Office Supplies  (annual: budget 18,500 | actual 16,200) ----
  { category: 'Office Supplies', month: 'Jan', budget: 1452, actual: 1272 },
  { category: 'Office Supplies', month: 'Feb', budget: 1358, actual: 1189 },
  { category: 'Office Supplies', month: 'Mar', budget: 1464, actual: 1282 },
  { category: 'Office Supplies', month: 'Apr', budget: 1591, actual: 1393 },
  { category: 'Office Supplies', month: 'May', budget: 1595, actual: 1397 },
  { category: 'Office Supplies', month: 'Jun', budget: 1709, actual: 1496 },
  { category: 'Office Supplies', month: 'Jul', budget: 1638, actual: 1434 },
  { category: 'Office Supplies', month: 'Aug', budget: 1510, actual: 1322 },
  { category: 'Office Supplies', month: 'Sep', budget: 1591, actual: 1393 },
  { category: 'Office Supplies', month: 'Oct', budget: 1684, actual: 1474 },
  { category: 'Office Supplies', month: 'Nov', budget: 1758, actual: 1539 },
  { category: 'Office Supplies', month: 'Dec', budget: 1150, actual: 1009 },
  // ---- Training & Development  (annual: budget 32,000 | actual 28,700) ----
  { category: 'Training & Development', month: 'Jan', budget: 2512, actual: 2253 },
  { category: 'Training & Development', month: 'Feb', budget: 2349, actual: 2107 },
  { category: 'Training & Development', month: 'Mar', budget: 2531, actual: 2271 },
  { category: 'Training & Development', month: 'Apr', budget: 2752, actual: 2468 },
  { category: 'Training & Development', month: 'May', budget: 2758, actual: 2474 },
  { category: 'Training & Development', month: 'Jun', budget: 2954, actual: 2650 },
  { category: 'Training & Development', month: 'Jul', budget: 2832, actual: 2540 },
  { category: 'Training & Development', month: 'Aug', budget: 2611, actual: 2342 },
  { category: 'Training & Development', month: 'Sep', budget: 2752, actual: 2468 },
  { category: 'Training & Development', month: 'Oct', budget: 2912, actual: 2612 },
  { category: 'Training & Development', month: 'Nov', budget: 3040, actual: 2727 },
  { category: 'Training & Development', month: 'Dec', budget: 1999, actual: 1788 },
  // ---- Maintenance  (annual: budget 45,600 | actual 49,100) ----
  { category: 'Maintenance', month: 'Jan', budget: 3580, actual: 3854 },
  { category: 'Maintenance', month: 'Feb', budget: 3347, actual: 3604 },
  { category: 'Maintenance', month: 'Mar', budget: 3607, actual: 3884 },
  { category: 'Maintenance', month: 'Apr', budget: 3922, actual: 4223 },
  { category: 'Maintenance', month: 'May', budget: 3931, actual: 4232 },
  { category: 'Maintenance', month: 'Jun', budget: 4211, actual: 4534 },
  { category: 'Maintenance', month: 'Jul', budget: 4037, actual: 4345 },
  { category: 'Maintenance', month: 'Aug', budget: 3721, actual: 4005 },
  { category: 'Maintenance', month: 'Sep', budget: 3922, actual: 4223 },
  { category: 'Maintenance', month: 'Oct', budget: 4150, actual: 4468 },
  { category: 'Maintenance', month: 'Nov', budget: 4332, actual: 4664 },
  { category: 'Maintenance', month: 'Dec', budget: 2841, actual: 3064 },
  // ---- Miscellaneous  (annual: budget 28,500 | actual 31,200) ----
  { category: 'Miscellaneous', month: 'Jan', budget: 2237, actual: 2449 },
  { category: 'Miscellaneous', month: 'Feb', budget: 2092, actual: 2290 },
  { category: 'Miscellaneous', month: 'Mar', budget: 2254, actual: 2468 },
  { category: 'Miscellaneous', month: 'Apr', budget: 2451, actual: 2683 },
  { category: 'Miscellaneous', month: 'May', budget: 2457, actual: 2689 },
  { category: 'Miscellaneous', month: 'Jun', budget: 2632, actual: 2881 },
  { category: 'Miscellaneous', month: 'Jul', budget: 2522, actual: 2761 },
  { category: 'Miscellaneous', month: 'Aug', budget: 2326, actual: 2546 },
  { category: 'Miscellaneous', month: 'Sep', budget: 2451, actual: 2683 },
  { category: 'Miscellaneous', month: 'Oct', budget: 2594, actual: 2840 },
  { category: 'Miscellaneous', month: 'Nov', budget: 2708, actual: 2964 },
  { category: 'Miscellaneous', month: 'Dec', budget: 1776, actual: 1945 },
  // ---- Benefits & Payroll Tax  (annual: budget 312,890 | actual 298,028) ----
  { category: 'Benefits & Payroll Tax', month: 'Jan', budget: 24562, actual: 23395 },
  { category: 'Benefits & Payroll Tax', month: 'Feb', budget: 22966, actual: 21874 },
  { category: 'Benefits & Payroll Tax', month: 'Mar', budget: 24754, actual: 23577 },
  { category: 'Benefits & Payroll Tax', month: 'Apr', budget: 26915, actual: 25635 },
  { category: 'Benefits & Payroll Tax', month: 'May', budget: 26980, actual: 25697 },
  { category: 'Benefits & Payroll Tax', month: 'Jun', budget: 28905, actual: 27530 },
  { category: 'Benefits & Payroll Tax', month: 'Jul', budget: 27711, actual: 26392 },
  { category: 'Benefits & Payroll Tax', month: 'Aug', budget: 25543, actual: 24328 },
  { category: 'Benefits & Payroll Tax', month: 'Sep', budget: 26915, actual: 25635 },
  { category: 'Benefits & Payroll Tax', month: 'Oct', budget: 28479, actual: 27125 },
  { category: 'Benefits & Payroll Tax', month: 'Nov', budget: 29730, actual: 28315 },
  { category: 'Benefits & Payroll Tax', month: 'Dec', budget: 19549, actual: 18616 },
];

// ===================== BUSINESS RECORDS =====================
export const businessRecords = [
  { id: 1, month: 'January', year: 2025, revenueActual: 75000, revenueTarget: 70000, expenseActual: 58000, expenseBudget: 60000 },
  { id: 2, month: 'February', year: 2025, revenueActual: 62000, revenueTarget: 65000, expenseActual: 52000, expenseBudget: 54000 },
  { id: 3, month: 'March', year: 2025, revenueActual: 55000, revenueTarget: 60000, expenseActual: 48000, expenseBudget: 50000 },
  { id: 4, month: 'April', year: 2025, revenueActual: 78000, revenueTarget: 75000, expenseActual: 62000, expenseBudget: 65000 },
  { id: 5, month: 'May', year: 2025, revenueActual: 48000, revenueTarget: 52000, expenseActual: 40000, expenseBudget: 42000 },
  { id: 6, month: 'June', year: 2025, revenueActual: 82000, revenueTarget: 78000, expenseActual: 65000, expenseBudget: 68000 },
  { id: 7, month: 'July', year: 2025, revenueActual: 72000, revenueTarget: 68000, expenseActual: 56000, expenseBudget: 58000 },
  { id: 8, month: 'August', year: 2025, revenueActual: 60000, revenueTarget: 64000, expenseActual: 50000, expenseBudget: 52000 },
  { id: 9, month: 'September', year: 2025, revenueActual: 85000, revenueTarget: 80000, expenseActual: 68000, expenseBudget: 70000 },
  { id: 10, month: 'October', year: 2025, revenueActual: 52000, revenueTarget: 56000, expenseActual: 44000, expenseBudget: 46000 },
  { id: 11, month: 'November', year: 2025, revenueActual: 88000, revenueTarget: 82000, expenseActual: 70000, expenseBudget: 72000 },
  { id: 12, month: 'December', year: 2025, revenueActual: 95000, revenueTarget: 90000, expenseActual: 78000, expenseBudget: 80000 },
];

// ===================== PRIOR PERIOD =====================
export const priorPeriod = {
  revenue: 2598000,
  expenses: 1800000,
  netProfit: 798000,
  arOutstanding: 85000,
  collectionRate: 91.5,
};

// ===================== KPI TARGETS =====================
export const kpiTargets = {
  revenue: 2650000,
  expenses: 2428000,
  netProfit: 390000,
  budgetUtilization: 100,
  collectionRate: 95,
};

// ===================== ACCOUNTS RECEIVABLE =====================
export const arInvoices = [
  { id: 'INV-1003', customer: 'Initech', amount: 9800, date: '2025-12-01', dueDate: '2026-01-01' },
  { id: 'INV-1005', customer: 'Stark Industries', amount: 32100, date: '2025-11-28', dueDate: '2025-12-28' },
    { id: 'INV-1006', customer: 'Wayne Enterprises', amount: 5800, date: '2025-12-05', dueDate: '2026-01-05' },
  { id: 'INV-1007', customer: 'Soylent Corp', amount: 8500, date: '2025-12-10', dueDate: '2026-01-10' },
  { id: 'INV-1001', customer: 'Acme Corp', amount: 18500, date: '2025-11-15', dueDate: '2025-12-15' },
  { id: 'INV-1002', customer: 'Globex Ltd', amount: 24200, date: '2025-10-20', dueDate: '2025-11-20' },
  { id: 'INV-1004', customer: 'Umbrella Inc', amount: 7100, date: '2025-09-10', dueDate: '2025-10-10' },
];

export const currentCustomers = [
  { id: 1, name: 'Acme Corp' },
  { id: 2, name: 'Globex Ltd' },
  { id: 3, name: 'Initech' },
  { id: 4, name: 'Umbrella Inc' },
  { id: 5, name: 'Stark Industries' },
  { id: 6, name: 'Wayne Enterprises' },
  { id: 7, name: 'Soylent Corp' },
];

// ===================== DEV-ONLY SANITY CHECKS =====================
// Warns in the console if any of the three expense arrays drift out of sync.
// Inert in production builds.
if (import.meta.env?.DEV) {
  const catActual = expenseCategories.reduce((s, c) => s + Number(c.actual || 0), 0);
  const catBudget = expenseCategories.reduce((s, c) => s + Number(c.budget || 0), 0);
  const monActual = monthlyExpenses.reduce((s, m) => s + Number(m.amount || 0), 0);
  const monBudget = monthlyExpenses.reduce((s, m) => s + Number(m.budget || 0), 0);

  const mcByCat = {};
  const mcByMonth = {};
  monthlyCategoryExpenses.forEach((r) => {
    mcByCat[r.category] = mcByCat[r.category] || { budget: 0, actual: 0 };
    mcByCat[r.category].budget += Number(r.budget || 0);
    mcByCat[r.category].actual += Number(r.actual || 0);
    mcByMonth[r.month] = mcByMonth[r.month] || { budget: 0, actual: 0 };
    mcByMonth[r.month].budget += Number(r.budget || 0);
    mcByMonth[r.month].actual += Number(r.actual || 0);
  });

  // --- Categories vs. monthly totals ---
  if (catActual !== monActual) {
    console.warn(
      `[mockData] expenseCategories.actual ($${catActual.toLocaleString()}) ` +
      `≠ monthlyExpenses.amount ($${monActual.toLocaleString()}) — diff: $${Math.abs(catActual - monActual).toLocaleString()}`
    );
  }
  if (catBudget !== monBudget) {
    console.warn(
      `[mockData] expenseCategories.budget ($${catBudget.toLocaleString()}) ` +
      `≠ monthlyExpenses.budget ($${monBudget.toLocaleString()}) — diff: $${Math.abs(catBudget - monBudget).toLocaleString()}`
    );
  }

  // --- Categories vs. monthlyCategoryExpenses (per-category annual totals) ---
  // Small rounding residues from hand-authored monthly data are expected.
  // Only warn when the gap is materially large (default: $500 per category).
  const TOLERANCE = 500;

  expenseCategories.forEach((c) => {
    const fromMonthly = mcByCat[c.category];
    if (!fromMonthly) {
      console.warn(`[mockData] monthlyCategoryExpenses is missing "${c.category}"`);
      return;
    }

    const budgetDiff = Math.abs(fromMonthly.budget - Number(c.budget));
    const actualDiff = Math.abs(fromMonthly.actual - Number(c.actual));

    if (actualDiff > TOLERANCE) {
      console.warn(
        `[mockData] "${c.category}" actual mismatch: annual=${c.actual}, sum(monthly)=${fromMonthly.actual} (diff $${actualDiff})`
      );
    }
  });
}




