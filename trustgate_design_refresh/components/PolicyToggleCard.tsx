"use client";

import { PolicyConfig } from "@/types";
import { Shield, Sparkles } from "lucide-react";

interface Props {
  value: PolicyConfig;
  onChange: (next: PolicyConfig) => void;
}

function ToggleRow({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-black/20 px-4 py-4 text-left transition hover:border-white/16 hover:bg-white/[0.04]"
    >
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <span className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${checked ? "bg-cyan-400/80" : "bg-white/10"}`}>
        <span className={`absolute left-1 h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

export default function PolicyToggleCard({ value, onChange }: Props) {
  function setKey<K extends keyof PolicyConfig>(key: K) {
    onChange({ ...value, [key]: !value[key] });
  }

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="panel-title">Governance studio</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Policy controls</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.18em] text-cyan-200">
          <Shield className="h-3.5 w-3.5" />
          Live
        </div>
      </div>

      <div className="mb-5 rounded-[24px] border border-cyan-400/15 bg-cyan-400/8 px-4 py-4 text-sm leading-6 text-slate-200">
        <div className="mb-2 flex items-center gap-2 text-cyan-200">
          <Sparkles className="h-4 w-4" />
          Policy changes affect every new evaluation instantly.
        </div>
        Tune guardrails live to show judges how the same action receives a different verdict under different governance settings.
      </div>

      <div className="space-y-3">
        <ToggleRow label="Block external email" description="Escalate or stop outbound communication to non-internal domains." checked={value.block_external_email} onToggle={() => setKey("block_external_email")} />
        <ToggleRow label="Require approval for sensitive content" description="Insert a human checkpoint whenever internal or confidential data appears." checked={value.require_approval_for_sensitive_content} onToggle={() => setKey("require_approval_for_sensitive_content")} />
        <ToggleRow label="Block suspicious domains" description="Reject requests targeting unknown webhooks, tunnels, and non-trusted endpoints." checked={value.block_suspicious_domains} onToggle={() => setKey("block_suspicious_domains")} />
        <ToggleRow label="Block destructive intent" description="Stop wipe, delete, or drop operations before they reach production systems." checked={value.block_destructive_intent} onToggle={() => setKey("block_destructive_intent")} />
        <ToggleRow label="Detect prompt injection" description="Penalize requests that try to bypass controls, logs, or prior instructions." checked={value.detect_prompt_injection} onToggle={() => setKey("detect_prompt_injection")} />
      </div>
    </div>
  );
}
