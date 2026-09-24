// src/pages/Performance.jsx
import { useMemo } from 'react';
import { Target, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import PerformanceKpiCard from '../components/PerformanceKpiCard';
import {
  KPI_DEFINITIONS,
  KPI_GROUPS,
  evaluateKpi,
} from '../utils/kpiDefinitions';

export default function Performance() {
  const enriched = useMemo(
    () =>
      KPI_DEFINITIONS.map((def) => {
        const actual = def.compute();
        const evaluation = evaluateKpi(def, actual);
        return { def, actual, evaluation };
      }),
    []
  );

  const summary = useMemo(() => {
    const counts = { onTarget: 0, atRisk: 0, offTrack: 0 };
    enriched.forEach(({ evaluation }) => counts[evaluation.status]++);
    return counts;
  }, [enriched]);

  const byGroup = useMemo(() => {
    const map = {};
    KPI_GROUPS.forEach((g) => { map[g.key] = []; });
    enriched.forEach((e) => { map[e.def.group].push(e); });
    return map;
  }, [enriched]);

  const totalKpis = enriched.length;
  const onTargetPct = totalKpis > 0 ? (summary.onTarget / totalKpis) * 100 : 0;
  const health =
    onTargetPct >= 75 ? 'Strong' : onTargetPct >= 50 ? 'Fair' : 'Needs Attention';

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-card border border-ink-200 bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-ink-500">KPIs On Target</span>
            <Target size={16} className="text-ink-400" />
          </div>
          <p className="mt-1.5 text-[24px] font-semibold text-ink-900">
            {summary.onTarget}
            <span className="text-[16px] text-ink-400"> / {totalKpis}</span>
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${onTargetPct}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] text-ink-500">
            {onTargetPct.toFixed(0)}% of tracked metrics
          </p>
        </div>

        <div className="rounded-card border border-ink-200 bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-ink-500">At Risk</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <p className="mt-1.5 text-[24px] font-semibold text-amber-600">{summary.atRisk}</p>
          <p className="mt-2 text-[11px] text-ink-500">Within 5% of target but trending unfavorably</p>
        </div>

        <div className="rounded-card border border-ink-200 bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-ink-500">Off Track</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <p className="mt-1.5 text-[24px] font-semibold text-red-600">{summary.offTrack}</p>
          <p className="mt-2 text-[11px] text-ink-500">More than 5% outside the target band</p>
        </div>

        <div className="rounded-card border border-ink-200 bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-ink-500">Overall Health</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="mt-1.5 text-[24px] font-semibold text-ink-900">{health}</p>
          <p className="mt-2 text-[11px] text-ink-500">
            Based on {totalKpis} metrics across {KPI_GROUPS.length} categories
          </p>
        </div>
      </div>

      {/* Grouped KPI sections */}
      {KPI_GROUPS.map((group) => {
        const items = byGroup[group.key] || [];
        if (items.length === 0) return null;
        return (
          <ChartCard key={group.key} title={group.label} subtitle={group.description}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <PerformanceKpiCard
                  key={item.def.key}
                  definition={item.def}
                  actual={item.actual}
                  evaluation={item.evaluation}
                  to={item.def.to}
                />
              ))}
            </div>
          </ChartCard>
        );
      })}

      {/* Legend */}
      <ChartCard title="How to read this page" subtitle="Status bands and evaluation rules">
        <ul className="space-y-2 text-[12.5px] leading-relaxed text-ink-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span><span className="font-semibold text-emerald-700">On Target</span> — actual meets or beats the favorable direction of the target.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <span><span className="font-semibold text-amber-700">At Risk</span> — missed target by up to 5%. Worth monitoring.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span><span className="font-semibold text-red-700">Off Track</span> — missed target by more than 5%. Requires attention.</span>
          </li>
          <li className="pt-2 text-ink-500">
            For <span className="font-medium">revenue, margin, collection rate</span>, higher is better.
            For <span className="font-medium">expenses, AR days, cost ratio</span>, lower is better.
            Progress bars and status pills always reflect the favorable direction.
          </li>
        </ul>
      </ChartCard>
    </div>
  );
}