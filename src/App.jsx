import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { FilterProvider } from './context/FilterContext';
import { DataProvider } from './context/DataContext';   // <-- NEW
import Dashboard from './pages/Dashboard';
import RevenueAnalysis from './pages/RevenueAnalysis';
import AccountsReceivable from './pages/AccountsReceivable';
import Expenses from './pages/Expenses';
import Performance from './pages/Performance';
import Insights from './pages/Insights';
import DataManagement from './pages/DataManagement';
import Settings from './pages/Settings';
import ProfilePage from './components/ProfilePage';

const PAGE_META = {
  '/': { title: 'Business Performance Dashboard', subtitle: 'Reporting Period: January – December 2025' },
  '/revenue': { title: 'Revenue Analysis', subtitle: 'Monthly trends, targets and business unit mix' },
  '/receivable': { title: 'Accounts Receivable', subtitle: 'Aging analysis and outstanding invoices' },
  '/expenses': { title: 'Expense Performance', subtitle: 'Budget vs. actual by month and category' },
  '/performance': { title: 'KPI Performance', subtitle: 'Actuals against annual targets' },
  '/insights': { title: 'Business Insights', subtitle: 'Findings, impact and recommended actions' },
  '/data': { title: 'Data Management', subtitle: 'Underlying business records' },
  '/settings': { title: 'Settings', subtitle: 'Workspace and account preferences' },
  '/profile': { title: 'User Profile', subtitle: 'Your account details' },
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: 'Business Performance Dashboard' };

  return (
    <FilterProvider>
      <DataProvider>                                        {/* <-- NEW */}
        <div className="flex min-h-screen bg-canvas">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/revenue" element={<RevenueAnalysis />} />
                <Route path="/receivable" element={<AccountsReceivable />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/data" element={<DataManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
          </div>
        </div>
      </DataProvider>                                       {/* <-- NEW */}
    </FilterProvider>
  );
}