\# Business Performance \& Financial Analytics Dashboard



!\[Tests](https://img.shields.io/badge/tests-35%20passing-brightgreen)

!\[React](https://img.shields.io/badge/React-18-61dafb)

!\[Vite](https://img.shields.io/badge/Vite-6-646cff)

!\[License](https://img.shields.io/badge/license-MIT-blue)



\*\*\[Live Demo](https://your-app.vercel.app)\*\* · \*\*\[Source Code](https://github.com/yourname/finance-dashboard)\*\*



!\[Dashboard screenshot](docs/screenshot.png)



\---



\### Project Overview



This is a portfolio project that demonstrates business analytics, financial

reporting, KPI monitoring, data visualization, and decision support in the

form of an internal-style management reporting application. It simulates the

kind of dashboard a finance or business operations team would use to monitor

revenue, expenses, receivables, and key performance indicators over a

reporting period, and to translate that data into concrete, prioritized

recommendations for management.



The application ships with realistic, internally-consistent mock data for

fiscal year 2025 and computes every KPI, variance, and alert directly from

that data — nothing is hard-coded as a display-only percentage.



\---

\### About the Data



This project ships with \*\*mock data\*\* for fiscal year 2025 (`src/data/mockData.js`).

The data is realistic — revenue, expenses, AR aging, and monthly splits are all

internally consistent — but it is \*\*not\*\* a live connection to a real ERP or

accounting system.



The purpose is to demonstrate the \*\*business logic layer\*\*: how KPIs are derived,

how aging buckets are computed, how variance is calculated, and how anomalies

are surfaced. Swapping the mock data source for a real one (a REST API, a

database, or a CSV feed) is a single-file change in `DataContext.jsx` — no

component, page, or calculation needs to change.



This is deliberate scope: the app shows what a working FP\&A dashboard \*\*does\*\*,

without needing a working business behind it.

\### Key Features



\- \*\*Executive KPI dashboard\*\* — revenue, operating expenses, net profit,

&#x20; accounts receivable, collection rate, and budget utilisation at a glance

\- \*\*Revenue analysis\*\* — monthly actual vs. target trends and a

&#x20; business-unit revenue breakdown

\- \*\*Expense analysis\*\* — monthly actual vs. budget performance and a

&#x20; category-level variance table that flags overspend

\- \*\*AR aging analysis\*\* — outstanding receivables by age bucket and a

&#x20; searchable, filterable invoice register

\- \*\*KPI performance monitoring\*\* — actuals vs. targets with attainment

&#x20; progress bars and status bands (On Target / At Risk / Off Track)

\- \*\*Business insights\*\* — a Finding → Evidence → Business Impact →

&#x20; Recommended Action framework generated from the data

\- \*\*Automated alerts\*\* — budget overruns, aging receivables, and revenue

&#x20; shortfalls surfaced automatically

\- \*\*CSV data import/export\*\* — import records from a CSV file and export the

&#x20; currently filtered data set

\- \*\*Interactive filtering\*\* — reporting year, month, business unit, and

&#x20; department filters that update charts and tables



This project ships with \*\*mock data\*\* for fiscal year 2025 (`src/data/mockData.js`).

The data is internally consistent — revenue, expenses, AR aging, and monthly

splits all reconcile — but it is \*\*not\*\* a live connection to a real ERP,

accounting system, or database.



The purpose is to demonstrate the \*\*business logic layer\*\*: how KPIs are

derived, how aging buckets are computed, how variance is calculated, and how

anomalies are surfaced to decision-makers.



The architecture deliberately isolates the data source:



\- Everything reads from `DataContext.jsx` via the `useData()` hook

\- Every calculation lives in `utils/calculations.js` as a pure function

\- Swapping the mock data for a REST API, a database, or a live CSV feed is a

&#x20; single-file change in `DataContext.jsx` — no components, pages, or

&#x20; calculations need to change



\*\*Real data path:\*\* The app includes a working \*\*CSV import\*\* on the Data

Management page. In production, a company would export expense and invoice

data from their ERP (NetSuite, QuickBooks, SAP) as CSV, upload it, and

immediately see the analysis. Both annual and monthly category data can be

imported with schema validation and localStorage persistence.

\---



\### The Interesting Part: Data Reconciliation



The same metric appeared in three places — a bar chart, a data table, and a

KPI card. When they disagreed, users lost trust in the whole dashboard.



Every metric in this app now derives from a \*\*single source of truth\*\*:



\- All AR aging buckets are computed from the raw invoice list (`arInvoices`)

\- Expense variance is derived from `expenseCategories`

\- The Expenses page shows a \*\*mismatch warning banner\*\* whenever category

&#x20; totals and monthly totals drift apart

\- \*\*Dev-only sanity checks\*\* in `mockData.js` warn in the console when mock

&#x20; data disagrees with itself



That last point caught several real bugs during development — including one

where collection rate could exceed 100% because of an incorrect formula.



\---



\### Testing



\*\*35 unit tests\*\* cover the calculation layer using \*\*Vitest\*\*:



```bash

npm run test:run    # run once

npm test            # watch mode

```



The most valuable test is a \*\*regression test for `getCollectionRate`\*\* — it

verifies the value never exceeds 100%, which was a real bug fixed during

development.



Test coverage includes:



\- Formatting (currency, percent, edge cases)

\- Sum utilities

\- Revenue, expense, and profit calculations

\- Growth metrics

\- AR aging buckets and invoice status

\- Expense category variance and status



\---



\### Technology



\- \*\*React 18\*\* — UI and state

\- \*\*Vite 6\*\* — dev server and build

\- \*\*React Router\*\* — client-side routing

\- \*\*Tailwind CSS\*\* — styling

\- \*\*Recharts\*\* — all charts

\- \*\*PapaParse\*\* — CSV parsing

\- \*\*Vitest\*\* — unit tests



\---



\### Business Use Case



A dashboard like this helps management:



\- Monitor overall business performance against plan

\- Identify financial risks, such as aging receivables or budget overruns,

&#x20; before they compound

\- Track KPIs against annual targets in one place

\- Detect budget variances at the category level, not just in aggregate

\- Improve receivables collection by focusing effort on the highest-risk

&#x20; accounts

\- Support management decision-making with clear, evidence-backed

&#x20; recommendations rather than raw numbers alone



\---



\### Analytical Framework



The Insights section uses a consistent four-part framework for every

finding:



1\. \*\*Finding\*\* — what the data shows

2\. \*\*Evidence\*\* — the specific numbers that support the finding

3\. \*\*Business Impact\*\* — why it matters to the organization

4\. \*\*Recommended Action\*\* — what to do about it, with a priority level

&#x20;  (High, Medium, Low)



This framework is meant to mirror how a financial analyst would present

findings to management: not just "what happened," but "so what" and "now

what."



\---



\### Project Structure



```

src/

\\\&#x20; components/   Reusable UI building blocks (Sidebar, Header, KPICard,

\\\&#x20;               ChartCard, DataTable, StatusBadge, InsightCard, AlertCard,

\\\&#x20;               FilterBar, PerformanceKpiCard, MonthlyCategoryPivot)

\\\&#x20; pages/        One file per route (Dashboard, RevenueAnalysis,

\\\&#x20;               AccountsReceivable, Expenses, Performance, Insights,

\\\&#x20;               DataManagement, Settings, UserProfile)

\\\&#x20; data/         Mock business data — single source of truth

\\\&#x20; utils/        Pure business logic:

\\\&#x20;                 - calculations.js       derived KPIs, AR aging, variance

\\\&#x20;                 - calculations.test.js  35 unit tests

\\\&#x20;                 - kpiDefinitions.js     KPI metadata + evaluation rules

\\\&#x20; context/      Shared state:

\\\&#x20;                 - DataContext.jsx       editable data arrays

\\\&#x20;                 - FilterContext.jsx     global filter state

```



\---



\### Running the Project Locally



\*\*Prerequisites:\*\* Node.js 18 or later and npm.



```bash

\\\\# 1. Install dependencies

npm install



\\\\# 2. Start the development server

npm run dev



\\\\# 3. Open the app

\\\\# Vite will print a local URL (typically http://localhost:5173)

```



To build a production bundle:



```bash

npm run build

npm run preview   # serve the production build locally

```



To run the test suite:



```bash

npm run test:run

```



\---



\### What I Learned



\- \*\*Data reconciliation is the real work.\*\* Any dashboard can display

&#x20; numbers — the hard part is guaranteeing they're correct and consistent

&#x20; across every view.

\- \*\*Single source of truth beats duplicated state.\*\* Deriving AR buckets

&#x20; from raw invoices meant the chart, table, and KPIs could never disagree.

\- \*\*Tests make refactoring safe.\*\* When the mock data was split into shared

&#x20; context and a monthly category array was added, tests caught

&#x20; inconsistencies immediately.

\- \*\*`undefined` triggers default parameters; `null` doesn't.\*\* A subtle

&#x20; JavaScript behavior that produced a genuinely confusing test failure — and

&#x20; a good reminder that tests teach you your own language.

\- \*\*Warnings should have tolerance.\*\* Initial mismatch warnings fired on $4

&#x20; rounding residues. A threshold was added so they only trigger on

&#x20; materially large discrepancies.



\---



\### Future Improvements



\- \*\*Backend integration\*\* — replace mock data with REST API endpoints backed by

&#x20; PostgreSQL; the frontend is already architected for this (single-file change

&#x20; in `DataContext.jsx`)

\- \*\*Direct ERP connectors\*\* — NetSuite, QuickBooks, and SAP export APIs to

&#x20; eliminate manual CSV uploads

\- \*\*Live data refresh\*\* — scheduled syncs and real-time webhook updates from

&#x20; source systems

\- Power BI integration for enterprise reporting

\- Python data processing for more advanced ETL pipelines

\- Automated data refresh from source systems

\- User authentication and role-based access

\- Real-time business data via a connected backend

\- Advanced forecasting (e.g., revenue and cash-flow projections)

