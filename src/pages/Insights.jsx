import InsightCard from '../components/InsightCard';
import AlertCard from '../components/AlertCard';
import ChartCard from '../components/ChartCard';
import { getBusinessInsights, getBusinessAlerts } from '../utils/calculations';

export default function Insights() {
  const insights = getBusinessInsights();
  const alerts = getBusinessAlerts();

  return (
    <div className="space-y-5">
      <ChartCard title="Business Alerts" subtitle="Automatically generated from current business data">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {alerts.map((alert, i) => (
            <AlertCard key={i} type={alert.type} message={alert.message} />
          ))}
        </div>
      </ChartCard>

      <div>
        <h2 className="mb-1 text-[15px] font-semibold text-ink-900">Insights &amp; Recommendations</h2>
        <p className="mb-3.5 text-[12.5px] text-ink-500">
          Each insight follows a Finding → Evidence → Business Impact → Recommended Action framework, generated from
          the underlying revenue, expense and receivables data.
        </p>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {insights.map((insight, i) => (
            <InsightCard key={i} {...insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
