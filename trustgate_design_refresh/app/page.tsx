"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ScenarioButtons from "@/components/ScenarioButtons";
import ActionPanel from "@/components/ActionPanel";
import DecisionCard from "@/components/DecisionCard";
import EvaluationCard from "@/components/EvaluationCard";
import AuditLogPanel from "@/components/AuditLogPanel";
import PolicyToggleCard from "@/components/PolicyToggleCard";
import CustomActionForm from "@/components/CustomActionForm";
import TraceCard from "@/components/TraceCard";
import { SAFE_SCENARIO, SUSPICIOUS_SCENARIO, DANGEROUS_SCENARIO } from "@/lib/scenarios";
import { DEFAULT_POLICY_CONFIG } from "@/lib/trust-engine";
import { Activity, AlertOctagon, CheckCheck, Shield } from "lucide-react";
import { AgentAction, AuditLogRow, EvaluateResponse, PolicyConfig } from "@/types";

const statsMeta = [
  { key: "avgTrust", label: "Average trust score", icon: Shield },
  { key: "blocked", label: "Blocked actions", icon: AlertOctagon },
  { key: "approvals", label: "Approval events", icon: CheckCheck },
  { key: "total", label: "Total evaluations", icon: Activity }
] as const;

export default function HomePage() {
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [policyConfig, setPolicyConfig] = useState<PolicyConfig>(DEFAULT_POLICY_CONFIG);

  async function fetchLogs() {
    const res = await fetch("/api/logs");
    const data = await res.json();
    setLogs(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  async function runScenario(action: AgentAction) {
    setSelectedAction(action);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, policyConfig })
      });

      const data = await res.json();
      setResult(data);
      await fetchLogs();
    } finally {
      setLoading(false);
    }
  }

  async function approveAction() {
    if (!result?.action_id) return;

    setApproving(true);
    try {
      await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_id: result.action_id })
      });

      await fetchLogs();
      setResult({
        ...result,
        decision: "ALLOW",
        reasons: ["Human approval granted"],
        trace: [...result.trace, "Human approval recorded", "Final status promoted to ALLOW"]
      });
    } finally {
      setApproving(false);
    }
  }

  const sessionSummary = useMemo(() => {
    if (logs.length === 0) {
      return { avgTrust: 0, blocked: 0, approvals: 0, total: 0 };
    }
    const avgTrust = Math.round(logs.reduce((sum, log) => sum + (log.trust_score ?? 0), 0) / logs.length);
    const blocked = logs.filter((log) => log.decision === "BLOCK").length;
    const approvals = logs.filter((log) => log.decision === "REQUIRE_APPROVAL" || log.approved).length;
    return { avgTrust, blocked, approvals, total: logs.length };
  }, [logs]);

  const statValues = {
    avgTrust: sessionSummary.avgTrust,
    blocked: sessionSummary.blocked,
    approvals: sessionSummary.approvals,
    total: sessionSummary.total
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <Header />

      <section className="grid gap-4 xl:grid-cols-4">
        {statsMeta.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="card px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="panel-title">{item.label}</p>
                  <p className="metric-value mt-3">{statValues[item.key]}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ScenarioButtons onSelect={runScenario} safe={SAFE_SCENARIO} suspicious={SUSPICIOUS_SCENARIO} dangerous={DANGEROUS_SCENARIO} />
        <PolicyToggleCard value={policyConfig} onChange={setPolicyConfig} />
      </section>

      <CustomActionForm onSubmit={runScenario} />

      {loading && (
        <div className="card px-5 py-4 text-sm text-slate-300">
          Evaluating action and generating policy trace...
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ActionPanel action={selectedAction} />
        <DecisionCard result={result} onApprove={approveAction} approving={approving} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <EvaluationCard evaluation={result?.evaluation ?? null} />
        <TraceCard result={result} />
      </section>

      <AuditLogPanel logs={logs} />
    </main>
  );
}
