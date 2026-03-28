import { AuditLogRow } from "@/types";

interface Props {
  logs: AuditLogRow[];
}

function tone(decision: string) {
  if (decision === "ALLOW") return "bg-emerald-400/10 border-emerald-400/20 text-emerald-200";
  if (decision === "REQUIRE_APPROVAL") return "bg-amber-400/10 border-amber-400/20 text-amber-200";
  return "bg-rose-400/10 border-rose-400/20 text-rose-200";
}

export default function AuditLogPanel({ logs }: Props) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="panel-title">Activity feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Audit timeline</h2>
        </div>
        <p className="text-sm text-slate-400">Every evaluation, escalation, and approval is preserved here.</p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-slate-400">
          No audit entries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={log.id} className="grid gap-4 md:grid-cols-[28px_1fr] md:gap-5">
              <div className="relative hidden md:block">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
                <div className="relative z-10 mx-auto mt-2 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.7)]" />
              </div>
              <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className={`badge ${tone(log.decision)}`}>{log.decision}</div>
                    <p className="mt-3 text-lg font-semibold text-white">{log.tool}</p>
                    <p className="mt-1 text-sm text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="card-soft px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Risk</p>
                      <p className="mt-1 text-lg font-semibold text-white">{log.risk_score}</p>
                    </div>
                    <div className="card-soft px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Trust</p>
                      <p className="mt-1 text-lg font-semibold text-white">{log.trust_score}</p>
                    </div>
                    <div className="card-soft px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Approved</p>
                      <p className="mt-1 text-lg font-semibold text-white">{log.approved ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(log.reasons ?? []).map((reason) => (
                    <span key={reason} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
