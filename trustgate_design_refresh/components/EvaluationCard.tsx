import { EvaluationMetrics } from "@/types";

interface Props {
  evaluation: EvaluationMetrics | null;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/6">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function BreakdownList({ title, items }: { title: string; items: { label: string; delta: number }[] }) {
  return (
    <div className="card-soft p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <div className="space-y-2 text-sm">
        {items.length === 0 ? (
          <div className="text-slate-400">No penalties</div>
        ) : (
          items.map((item, index) => (
            <div key={`${title}-${index}-${item.label}`} className="flex items-center justify-between gap-3 text-slate-300">
              <span>{item.label}</span>
              <span className={item.delta < 0 ? "text-rose-300" : "text-emerald-300"}>{item.delta}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function EvaluationCard({ evaluation }: Props) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="panel-title">Trust metrics</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Agent evaluation</h2>
        </div>
        {evaluation && (
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">Final trust score</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-white">{evaluation.trust_score}</p>
          </div>
        )}
      </div>

      {!evaluation ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-slate-400">
          Run a scenario to populate evaluation dimensions and score breakdowns.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <ScoreBar label="Policy Compliance" value={evaluation.policy_compliance_score} />
            <ScoreBar label="Risk Awareness" value={evaluation.risk_awareness_score} />
            <ScoreBar label="Reliability" value={evaluation.reliability_score} />
            <ScoreBar label="Oversight" value={evaluation.oversight_score} />
            <div className="lg:col-span-2">
              <ScoreBar label="Auditability" value={evaluation.auditability_score} />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            <BreakdownList title="Policy breakdown" items={evaluation.breakdown.policy_compliance} />
            <BreakdownList title="Risk breakdown" items={evaluation.breakdown.risk_awareness} />
            <BreakdownList title="Reliability breakdown" items={evaluation.breakdown.reliability} />
            <BreakdownList title="Oversight breakdown" items={evaluation.breakdown.oversight} />
            <BreakdownList title="Auditability breakdown" items={evaluation.breakdown.auditability} />
          </div>
        </div>
      )}
    </div>
  );
}
