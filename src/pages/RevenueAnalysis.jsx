// src/pages/RevenueAnalysis.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Target, Award, OctagonAlert } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import {
  getRevenueGrowth,
  getTotalRevenue,
  getTotalRevenueTarget,
  getMonthlyRevenueVariance,
  getBestRevenueMonth,
  getWorstRevenueMonth,
  formatCurrency,
} from '../utils/calculations';
import { useFilters } from '../context/FilterContext';

export default function RevenueAnalysis() {
  const { month, setMonth, monthOptions, businessUnit, setBusinessUnit, businessUnitOptions, reset } = useFilters();

  // Get data with error handling - using the SAME functions as dashboard
  const totalRevenue = getTotalRevenue();
  const totalTarget = getTotalRevenueTarget();
  const revenueGrowth = getRevenueGrowth();

  // Calculate target attainment correctly
  const targetAttainment = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;

  // Get monthly data
  const monthlyData = getMonthlyRevenueVariance() || [];
  const filteredMonthly = month === 'All' ? monthlyData : monthlyData.filter((m) => m.month === month);

  // Get best and worst months
  const best = getBestRevenueMonth() || { month: 'N/A', variancePct: 0 };
  const worst = getWorstRevenueMonth() || { month: 'N/A', variancePct: 0 };

  return (
    <div className="space-y-5">
      <FilterBar
        filters={[
          { key: 'month', label: 'Month', value: month, options: monthOptions || [], onChange: setMonth },
          { key: 'unit', label: 'Business Unit', value: businessUnit, options: businessUnitOptions || [], onChange: setBusinessUnit },
        ]}
        onReset={reset}
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={revenueGrowth}
          icon={TrendingUp}
        />
        <KPICard
          label="Target Attainment"
          value={`${targetAttainment.toFixed(1)}%`}
          changeLabel="of annual target"
          change={targetAttainment - 100}
          icon={Target}
        />
        <KPICard
          label="Best Month"
          value={best.month || 'N/A'}
          changeLabel="vs target"
          change={best.variancePct || 0}
          icon={Award}
        />
        <KPICard
          label="Weakest Month"
          value={worst.month || 'N/A'}
          changeLabel="vs target"
          change={worst.variancePct || 0}
          icon={OctagonAlert}
        />
      </div>

      <ChartCard title="Monthly Revenue vs Target" subtitle="Hover a point to see the exact figures for that month">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={filteredMonthly} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#EEF1F5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(v, { compact: false }), name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#E2E8F0' }}
            />
            <Legend
              formatter={(value) => <span className="text-[11.5px] text-ink-600">{value}</span>}
              iconType="circle"
              iconSize={8}
            />
            <Line type="monotone" dataKey="target" name="Target Revenue" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#2451CC" strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}