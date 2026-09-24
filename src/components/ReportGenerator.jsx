// src/components/ReportGenerator.jsx
import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import {
  REPORTING_YEAR,
  monthlyRevenue,
  monthlyExpenses,
  expenseCategories,
  priorPeriod,
} from '../data/mockData';

export default function ReportGenerator() {
  const [isLoading, setIsLoading] = useState(false);

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.actual, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, m) => sum + m.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalBudget = monthlyExpenses.reduce((s, m) => s + m.budget, 0);
  const budgetUtilization = ((totalExpenses / totalBudget) * 100).toFixed(1);
  const revenueGrowth = (((totalRevenue - priorPeriod.revenue) / priorPeriod.revenue) * 100).toFixed(1);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
      const html = buildReport();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Business_Report_${REPORTING_YEAR}.html`;
      a.click();
      URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 800);
  };

  const buildReport = () => {
    // Build revenue table rows
    let revenueRows = '';
    monthlyRevenue.forEach((m) => {
      const variance = ((m.actual - m.target) / m.target * 100).toFixed(1);
      const color = variance >= 0 ? '#0e8a5f' : '#c7351f';
      revenueRows += `
        <tr>
          <td>${m.month}</td>
          <td style="text-align:right">$${m.actual.toLocaleString()}</td>
          <td style="text-align:right">$${m.target.toLocaleString()}</td>
          <td style="text-align:right;color:${color};font-weight:600">${variance >= 0 ? '+' : ''}${variance}%</td>
        </tr>`;
    });

    // Build expense table rows
    let expenseRows = '';
    expenseCategories.forEach((c) => {
      const over = c.actual > c.budget;
      const color = over ? '#c7351f' : '#0e8a5f';
      expenseRows += `
        <tr>
          <td>${c.category}</td>
          <td style="text-align:right">$${c.budget.toLocaleString()}</td>
          <td style="text-align:right">$${c.actual.toLocaleString()}</td>
          <td style="text-align:right;color:${color};font-weight:600">${over ? 'Over Budget' : 'On Track'}</td>
        </tr>`;
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Business Performance Report - ${REPORTING_YEAR}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: Arial, sans-serif; background: #f1f5f9; color: #0f172a; margin: 0; padding: 20px; }
    .page { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .subtitle { color: #64748b; margin-bottom: 30px; font-size: 14px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
    .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
    .kpi .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .kpi .value { font-size: 22px; font-weight: 700; margin: 6px 0 2px; }
    .positive { color: #0e8a5f; font-size: 13px; }
    .section { margin-bottom: 36px; }
    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
    .chart-box { height: 300px; background: #fafafa; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 12px; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #e2e8f0; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border-radius: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <h1>Business Performance Report</h1>
    <div class="subtitle">Meridian Analytics · Fiscal Year ${REPORTING_YEAR} · Combined Charts + Data</div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="label">Revenue</div>
        <div class="value">$${(totalRevenue / 1000000).toFixed(2)}M</div>
        <div class="positive">↑ ${revenueGrowth}% vs prior year</div>
      </div>
      <div class="kpi">
        <div class="label">Operating Expenses</div>
        <div class="value">$${(totalExpenses / 1000000).toFixed(2)}M</div>
      </div>
      <div class="kpi">
        <div class="label">Net Profit</div>
        <div class="value">$${(totalProfit / 1000000).toFixed(2)}M</div>
        <div class="positive">${profitMargin}% margin</div>
      </div>
      <div class="kpi">
        <div class="label">Budget Utilisation</div>
        <div class="value">${budgetUtilization}%</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Revenue Performance – Actual vs Target</div>
      <div class="chart-box"><canvas id="revenueChart"></canvas></div>
    </div>

    <div class="section">
      <div class="section-title">Expense Breakdown by Category</div>
      <div class="chart-box"><canvas id="expenseChart"></canvas></div>
    </div>

    <div class="section">
      <div class="section-title">Revenue Detail by Month</div>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th style="text-align:right">Actual</th>
            <th style="text-align:right">Target</th>
            <th style="text-align:right">Variance</th>
          </tr>
        </thead>
        <tbody>
          ${revenueRows}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Expense Detail by Category</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th style="text-align:right">Budget</th>
            <th style="text-align:right">Actual</th>
            <th style="text-align:right">Status</th>
          </tr>
        </thead>
        <tbody>
          ${expenseRows}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <div><strong style="color:#c7351f">CONFIDENTIAL</strong> · For internal use only · Meridian Analytics</div>
      <div>Generated ${new Date().toLocaleString()}</div>
    </div>
  </div>

  <div class="no-print" style="text-align:center; margin: 30px 0;">
    <button onclick="window.print()" style="padding:12px 28px; background:#2451CC; color:white; border:none; border-radius:8px; font-size:14px; cursor:pointer;">
      Print / Save as PDF
    </button>
  </div>

  <script>
    new Chart(document.getElementById('revenueChart'), {
      type: 'line',
      data: {
        labels: ${JSON.stringify(monthlyRevenue.map(m => m.month))},
        datasets: [
          {
            label: 'Actual Revenue',
            data: ${JSON.stringify(monthlyRevenue.map(m => m.actual))},
            borderColor: '#2451CC',
            backgroundColor: 'rgba(36,81,204,0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointRadius: 4
          },
          {
            label: 'Target Revenue',
            data: ${JSON.stringify(monthlyRevenue.map(m => m.target))},
            borderColor: '#94a3b8',
            borderWidth: 2,
            borderDash: [6,4],
            tension: 0.3,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { ticks: { callback: v => '$' + (v/1000) + 'K' } }
        }
      }
    });

    new Chart(document.getElementById('expenseChart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(expenseCategories.map(c => c.category))},
        datasets: [
          {
            label: 'Budget',
            data: ${JSON.stringify(expenseCategories.map(c => c.budget))},
            backgroundColor: '#cbd5e1',
            borderRadius: 4
          },
          {
            label: 'Actual',
            data: ${JSON.stringify(expenseCategories.map(c => c.actual))},
            backgroundColor: '#2451CC',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => '$' + (v/1000) + 'K' } }
        }
      }
    });
  </script>
</body>
</html>`;
  };

  return (
    <div className="bg-surface rounded-card border border-ink-200 p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-accent-500" />
          <h3 className="text-[13.5px] font-semibold text-ink-900">Generate Report</h3>
        </div>
        <span className="text-[11px] text-ink-400">Combined</span>
      </div>

      <p className="text-[12.5px] text-ink-500 mb-4">
        Charts + detailed data tables in one report. Ready for PDF.
      </p>

      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-accent-500 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Download size={16} /> Download Full Report
          </>
        )}
      </button>
    </div>
  );
}