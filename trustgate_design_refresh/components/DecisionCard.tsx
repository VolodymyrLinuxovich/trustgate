import { EvaluateResponse } from "@/types";
import { AlertTriangle, CheckCircle2, Lock, ShieldAlert } from "lucide-react";

interface Props {
  result: EvaluateResponse | null;
  onApprove?: () => void;
  approving?: boolean;
}

function decisionStyles(decision?: string) {
  if (decision === "ALLOW") return { tone: "text-emerald-200 bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle2 };
  if (decision === "REQUIRE_APPROVAL") return { tone: "text-amber-200 bg-amber-400/10 border-amber-400/20", icon: ShieldAlert };
  if (decision === "BLOCK") return { tone: "text-rose-200 bg-rose-400/10 border-rose-400/20", icon: Lock };
  return { tone: "text-slate-200 bg-white/[0.05] border-white/10", icon: AlertTriangle };
}

export default function DecisionCard({ result, onApprove, approving }: Props) {
  const style = decisionStyles(result?.decision);
  const Icon = style.icon;

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="panel-title">Policy output</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Trust decision</h2>
        </div>
        <div className={`rounded-2xl border p-3 ${style.tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {!result ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-slate-400">
          Evaluate an action to see the decision, policy reasons, and approval state.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className={`badge ${style.tone}`}>
                <Icon className="h-3.5 w-3.5" />
                {result.decision}
              </div>
              <p className="mt-4 text-sm text-slate-400">Computed risk score</p>
              <p className="mt-1 text-5xl font-semibold tracking-[-0.04em] text-white">{result.risk_score}</p>
            </div>
            <div className="card-soft min-w-[180px] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Execution state</p>
              <p className="mt-2 text-sm font-medium text-white">
                {result.decision === "ALLOW"
                  ? "Eligible for execution"
                  : result.decision === "REQUIRE_APPROVAL"
                    ? "Awaiting human approval"
                    : "Execution denied"}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Triggered reasons</p>
            <div className="flex flex-wrap gap-2">
              {result.reasons.map((reason) => (
                <span key={reason} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {result.decision === "REQUIRE_APPROVAL" && onApprove && (
            <button
              onClick={onApprove}
              disabled={approving}
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {approving ? "Approving..." : "Approve Action"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
