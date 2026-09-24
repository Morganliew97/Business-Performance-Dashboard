// src/pages/AccountsReceivable.jsx
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Receipt } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import FilterBar from '../components/FilterBar';
import {
  getTotalAR,
  getARBucket,
  getInvoicesWithStatus,
  getARAgingBucketsFromInvoices,
  formatCurrency,
  formatDate,
} from '../utils/calculations';

const BUCKET_COLORS = {
  Current: '#0E8A5F',
  '1-30 Days': '#3B63D9',
  '31-60 Days': '#B4720B',
  '61-90 Days': '#DB6A1F',
  '90+ Days': '#C7351F',
};

export default function AccountsReceivable() {
  const [status, setStatus] = useState('All');
  const invoices = getInvoicesWithStatus();

  // Derive aging buckets from the same invoice data that powers the table.
  // This guarantees the chart, KPI cards, and table all reconcile.
  const arAgingBuckets = useMemo(() => getARAgingBucketsFromInvoices(), []);

  // Build status options dynamically from real data
  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set(invoices.map((i) => i.status))];
    return ['All', ...uniqueStatuses];
  }, [invoices]);

  const filtered = status === 'All'
    ? invoices
    : invoices.filter((i) => i.status === status);

  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'id', label: 'Invoice' },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (r) => formatCurrency(r.amount, { compact: false }),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (r) => formatDate(r.dueDate),
    },
    {
      key: 'agingDays',
      label: 'Aging',
      align: 'right',
      render: (r) => (r.agingDays < 0 ? 'Not yet due' : `${r.agingDays} days`),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'right',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
        <KPICard label="Total Outstanding" value={formatCurrency(getTotalAR())} icon={Receipt} />
        <KPICard label="Current" value={formatCurrency(getARBucket('Current'))} />
        <KPICard label="1–30 Days" value={formatCurrency(getARBucket('1-30 Days'))} />
        <KPICard label="31–60 Days" value={formatCurrency(getARBucket('31-60 Days'))} />
        <KPICard label="61–90 Days" value={formatCurrency(getARBucket('61-90 Days'))} />
        <KPICard label="90+ Days" value={formatCurrency(getARBucket('90+ Days'))} />
      </div>

      {/* Aging Chart */}
      <ChartCard title="AR Aging Analysis" subtitle="Outstanding receivables grouped by age">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={arAgingBuckets} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#EEF1F5" vertical={false} />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v / 1000}K`}
            />
            <Tooltip
              formatter={(v) => formatCurrency(v, { compact: false })}
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#E2E8F0' }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={64}>
              {arAgingBuckets.map((b) => (
                <Cell key={b.bucket} fill={BUCKET_COLORS[b.bucket]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Filter */}
      <FilterBar
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: status,
            options: ['All', 'Current', 'Due Soon', 'Overdue', 'Critical'],
            onChange: setStatus,
          },
        ]}
        onReset={() => setStatus('All')}
      />

      {/* Invoice Table */}
      <DataTable
        columns={columns}
        rows={filtered}
        emptyMessage="No invoices match this status."
      />
    </div>
  );
}