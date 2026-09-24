// src/pages/Settings.jsx
import { useState } from 'react';
import ChartCard from '../components/ChartCard';

const TOGGLES = [
  { key: 'emailAlerts', label: 'Email alerts for budget overruns', description: 'Send an email when a category exceeds its budget.' },
  { key: 'weeklyDigest', label: 'Weekly performance digest', description: 'A summary of KPI movement sent every Monday.' },
  { key: 'arReminders', label: 'AR collection reminders', description: 'Notify the finance team when invoices pass 60 days overdue.' },
];

// Fixed Toggle component
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 ${
        checked ? 'bg-accent-500' : 'bg-ink-400'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [state, setState] = useState({ 
    emailAlerts: true, 
    weeklyDigest: true, 
    arReminders: false 
  });
  const [currency, setCurrency] = useState('USD ($)');
  const [fiscalStart, setFiscalStart] = useState('January');

  return (
    <div className="max-w-2xl space-y-5">
      <ChartCard title="Notification Preferences" subtitle="Choose how the dashboard keeps you informed">
        <div className="divide-y divide-ink-100">
          {TOGGLES.map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex-1">
                <p className="text-[13px] font-medium text-ink-900">{t.label}</p>
                <p className="text-[12px] text-ink-500">{t.description}</p>
              </div>
              <Toggle 
                checked={state[t.key]} 
                onChange={() => setState((s) => ({ ...s, [t.key]: !s[t.key] }))} 
              />
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Workspace Settings" subtitle="Defaults applied across the dashboard">
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-medium text-ink-900">Display currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-md border border-ink-200 bg-canvas px-2.5 py-1.5 text-[12.5px] text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>SGD (S$)</option>      {/* ← Added */}
              <option>MYR (RM)</option>      {/* ← Added */}
            </select>
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-medium text-ink-900">Fiscal year start</span>
            <select
              value={fiscalStart}
              onChange={(e) => setFiscalStart(e.target.value)}
              className="rounded-md border border-ink-200 bg-canvas px-2.5 py-1.5 text-[12.5px] text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            >
              <option>January</option>
              <option>April</option>
              <option>July</option>
              <option>October</option>
            </select>
          </label>
        </div>
      </ChartCard>
    </div>
  );
}