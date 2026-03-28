"use client";

import { AgentAction } from "@/types";
import { ShieldCheck, AlertTriangle, Siren } from "lucide-react";

interface Props {
  onSelect: (action: AgentAction) => void;
  safe: AgentAction;
  suspicious: AgentAction;
  dangerous: AgentAction;
}

const scenarios = [
  {
    key: "safe",
    title: "Safe Request",
    subtitle: "Internal calendar operation with low policy friction.",
    icon: ShieldCheck,
    tone: "text-emerald-200 border-emerald-400/20 bg-emerald-400/8"
  },
  {
    key: "suspicious",
    title: "Suspicious Request",
    subtitle: "External sharing that should escalate to approval.",
    icon: AlertTriangle,
    tone: "text-amber-200 border-amber-400/20 bg-amber-400/8"
  },
  {
    key: "dangerous",
    title: "Dangerous Request",
    subtitle: "High-risk action with destructive or exfiltration signals.",
    icon: Siren,
    tone: "text-rose-200 border-rose-400/20 bg-rose-400/8"
  }
] as const;

export default function ScenarioButtons({ onSelect, safe, suspicious, dangerous }: Props) {
  const actions = { safe, suspicious, dangerous };

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="panel-title">Guided demo flows</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">One-click scenarios</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-400">
          Use prebuilt requests to show how the same product handles routine operations, escalations, and obviously unsafe calls.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <button
              key={scenario.key}
              onClick={() => onSelect(actions[scenario.key])}
              className={`rounded-[24px] border p-5 text-left transition hover:-translate-y-0.5 hover:border-white/20 ${scenario.tone}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300/90">
                  Demo
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{scenario.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
