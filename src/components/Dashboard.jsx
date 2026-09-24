// src/components/Dashboard.jsx
import Header from './Header';
import KPICard from './KPICard';
import ReportGenerator from './ReportGenerator';
import { TrendingUp, Wallet, Target, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Header 
        title="Business Performance Dashboard" 
        subtitle="Reporting Period: January – December 2025"
        onMenuClick={() => {}}
      />
      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard 
            label="Revenue" 
            value="$2.84M" 
            change={8.4} 
            icon={TrendingUp}
            to="/revenue"
          />
          <KPICard 
            label="Operating Expenses" 
            value="$1.91M" 
            change={4.2} 
            icon={Wallet}
            to="/expenses"
          />
          <KPICard 
            label="Net Profit" 
            value="$930K" 
            change={18.2} 
            icon={Target}
            to="/performance"
          />
          <KPICard 
            label="Budget Utilisation" 
            value="91.5%" 
            change={-8.5} 
            icon={BarChart3}
            positiveIsGood={false}
            to="/expenses"
          />
        </div>

        {/* Report Generator */}
        <div className="max-w-sm">
          <ReportGenerator />
        </div>
      </div>
    </div>
  );
}