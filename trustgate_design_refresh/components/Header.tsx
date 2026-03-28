import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <section className="card glow-ring relative overflow-hidden px-8 py-10 lg:px-10 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_25%),radial-gradient(circle_at_left,rgba(59,130,246,0.18),transparent_20%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <div className="badge w-fit bg-white/[0.03] text-cyan-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trust Layer for AI Agents
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
              Govern and verify what AI agents do before they touch real systems.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              TrustGate intercepts agent actions, enforces policy, scores trustworthiness, and gives teams a reviewable control layer before any tool call reaches production.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
              Run Demo
            </button>
            <button className="rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]">
              Open Policy Studio
            </button>
          </div>
        </div>

        <div className="card-soft p-5">
          <div className="flex items-center justify-between">
            <p className="panel-title">Live workflow</p>
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Agent proposes a tool call",
              "TrustGate computes risk and trace",
              "Human approval triggers when needed",
              "Every step is logged for auditability"
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                  {index + 1}
                </div>
                <div className="flex items-center justify-between gap-2 text-sm text-slate-200">
                  <span>{step}</span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
