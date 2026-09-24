import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Wallet,
  Target,
  Lightbulb,
  Database,
  Settings,
  CircleUser,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/revenue', label: 'Revenue Analysis', icon: TrendingUp },
  { to: '/receivable', label: 'Accounts Receivable', icon: Receipt },
  { to: '/expenses', label: 'Expenses', icon: Wallet },
  { to: '/performance', label: 'Performance', icon: Target },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
  { to: '/data', label: 'Data', icon: Database },
];

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'User Profile', icon: CircleUser },
];

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              'flex h-8 w-1 -ml-3 rounded-r-full transition-colors',
              isActive ? 'bg-accent-500' : 'bg-transparent',
            ].join(' ')}
            aria-hidden="true"
          />
          <Icon size={17} strokeWidth={2} className="shrink-0 -ml-1" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy-950/60 lg:hidden"
        />
      )}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-navy-950 transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-600">
            <BarChart3 size={18} className="text-white" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="text-[13.5px] font-semibold text-white">Meridian Analytics</p>
            <p className="text-[11px] text-slate-500">Business Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-white/10 px-3 py-3">
          {bottomItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </div>
      </aside>
    </>
  );
}