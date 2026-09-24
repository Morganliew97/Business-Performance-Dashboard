// src/pages/Dashboard.jsx
import KPICard from '../components/KPICard';
import ReportGenerator from '../components/ReportGenerator';
import { TrendingUp, Wallet, Target, BarChart3, Receipt, CheckCircle } from 'lucide-react';
import {
  getTotalRevenue,
  getTotalExpenses,
  getNetProfit,
  getBudgetUtilization,
  getTotalAR,
  getCollectionRate,
  getRevenueGrowth,
  getExpenseGrowth,
  getNetProfitGrowth,
  getARGrowth,
  getBusinessAlerts,
  formatCurrency,
} from '../utils/calculations';

export default function Dashboard() {
  const revenue = getTotalRevenue();
  const expenses = getTotalExpenses();
  const netProfit = getNetProfit();
  const budgetUtil = getBudgetUtilization();
  const totalAR = getTotalAR();
  const collectionRate = getCollectionRate();
  const alerts = getBusinessAlerts();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6">
        {/* KPI Cards - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            label="Revenue"
            value={formatCurrency(revenue)}
            change={getRevenueGrowth()}
            icon={TrendingUp}
            to="/revenue"
          />
          <KPICard
            label="Operating Expenses"
            value={formatCurrency(expenses)}
            change={getExpenseGrowth()}
            icon={Wallet}
            to="/expenses"
          />
          <KPICard
            label="Net Profit"
            value={formatCurrency(netProfit)}
            change={getNetProfitGrowth()}
            icon={Target}
            to="/performance"
          />
          <KPICard
            label="Budget Utilisation"
            value={`${budgetUtil.toFixed(1)}%`}
            change={budgetUtil - 100}
            icon={BarChart3}
            positiveIsGood={false}
            to="/expenses"
          />
        </div>

        {/* KPI Cards - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <KPICard
            label="Accounts Receivable"
            value={formatCurrency(totalAR)}
            change={getARGrowth()}
            icon={Receipt}
            to="/receivable"
          />
          <KPICard
            label="Collection Rate"
            value={`${collectionRate.toFixed(1)}%`}
            change={collectionRate - 91.5}
            icon={CheckCircle}
            to="/receivable"
          />
        </div>

        {/* Alerts + Report Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-ink-200 p-6 h-full shadow-sm">
              <h3 className="text-sm font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span>
                Business Alerts
              </h3>
              <div className="space-y-2">
                {alerts.length > 0 ? (
                  alerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-ink-700">
                      <span className={alert.type === 'warning' ? 'text-yellow-500' : 'text-green-500'}>
                        {alert.type === 'warning' ? '•' : '✅'}
                      </span>
                      <span>{alert.message}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink-500">No alerts at this time.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ReportGenerator />
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="bg-white rounded-xl border border-ink-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Financial Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-ink-500">Net Profit</p>
              <p className="text-lg font-semibold text-ink-900">{formatCurrency(netProfit)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Operating Expenses</p>
              <p className="text-lg font-semibold text-ink-900">{formatCurrency(expenses)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Collection Rate</p>
              <p className="text-lg font-semibold text-ink-900">{collectionRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Budget Utilisation</p>
              <p className="text-lg font-semibold text-ink-900">{budgetUtil.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Accounts Receivable</p>
              <p className="text-lg font-semibold text-ink-900">{formatCurrency(totalAR)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}