\# Business Performance \& Financial Analytics Dashboard



!\[Tests](https://img.shields.io/badge/tests-35%20passing-brightgreen)

!\[React](https://img.shields.io/badge/React-18-61dafb)

!\[Vite](https://img.shields.io/badge/Vite-6-646cff)

!\[License](https://img.shields.io/badge/license-MIT-blue)



\*\*\[Live Demo](https://businessperformancedashboard.vercel.app)\*\* · \*\*\[Source Code](https://github.com/Morganliew97/Business-Performance-Dashboard)\*\*



!\[Dashboard screenshot](docs/screenshot.png)



\---



\### Project Overview



This is a portfolio project that demonstrates business analytics, financial reporting, KPI monitoring, data visualization, and decision support in the form of an internal-style management reporting application. It simulates the kind of dashboard a finance or business operations team would use to monitor revenue, expenses, receivables, and key performance indicators over a reporting period, and to translate that data into concrete, prioritized recommendations for management.



The application ships with realistic, internally-consistent mock data for fiscal year 2025 and computes every KPI, variance, and alert directly from that data — nothing is hard-coded as a display-only percentage.



\---



\### About the Data



This project ships with \*\*mock data\*\* for fiscal year 2025 (`src/data/mockData.js`). The data is internally consistent — revenue, expenses, AR aging, and monthly splits all reconcile — but it is \*\*not\*\* a live connection to a real ERP, accounting system, or database.



The purpose is to demonstrate the \*\*business logic layer\*\*: how KPIs are derived, how aging buckets are computed, how variance is calculated, and how anomalies are surfaced to decision-makers.



The architecture deliberately isolates the data source:



\- Everything reads from `DataContext.jsx` via the `useData()` hook

\- Every calculation lives in `utils/calculations.js` as a pure function

\- Swapping the mock data for a REST API, a database, or a live CSV feed is a single-file change in `DataContext.jsx` — no components, pages, or calculations need to change



\*\*Real data path:\*\* The app includes a working \*\*CSV import\*\* on the Data Management page. In production, a company would export expense and invoice data from their ERP (NetSuite, QuickBooks, SAP) as CSV, upload it, and immediately see the analysis. Both annual and monthly category data can be imported with schema validation and localStorage persistence.



\---



\### Key Features



\- \*\*Executive KPI dashboard\*\* — revenue, operating expenses, net profit, accounts receivable, collection rate, and budget utilisation at a glance

\- \*\*Revenue analysis\*\* — monthly actual vs. target trends and a business-unit revenue breakdown

\- \*\*Expense analysis\*\* — monthly actual vs. budget performance and a category-level variance table that flags overspend

\- \*\*AR aging analysis\*\* — outstanding receivables by age bucket and a searchable, filterable invoice register

\- \*\*KPI performance monitoring\*\* — actuals vs. targets with attainment progress bars and status bands (On Target / At Risk / Off Track)

\- \*\*Business insights\*\* — a Finding → Evidence → Business Impact → Recommended Action framework generated from the data

\- \*\*Automated alerts\*\* — budget overruns, aging receivables, and revenue shortfalls surfaced automatically

\- \*\*CSV data import/export\*\* — import records from a CSV file and export the currently filtered data set

\- \*\*Interactive filtering\*\* — reporting year, month, business unit, and department filters that update charts and tables



\---



\### The Interesting Part: Data Reconciliation



The same metric appeared in three places — a bar chart, a data table, and a KPI card. When they disagreed, users lost trust in the whole dashboard.



Every metric in this app now derives from a \*\*single source of truth\*\*:



\- All AR aging buckets are computed from the raw invoice list (`arInvoices`)

\- Expense variance is derived from `expenseCategories`

\- The Expenses page shows a \*\*mismatch warning banner\*\* whenever category totals and monthly totals drift apart

\- \*\*Dev-only sanity checks\*\* in `mockData.js` warn in the console when mock data disagrees with itself



That last point caught several real bugs during development — including one where collection rate could exceed 100% because of an incorrect formula.



\---



\### Testing



\*\*35 unit tests\*\* cover the calculation layer using \*\*Vitest\*\*:



```bash

npm run test:run    # run once

npm test            # watch mode

