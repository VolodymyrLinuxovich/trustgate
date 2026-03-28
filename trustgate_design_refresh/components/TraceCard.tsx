import { EvaluateResponse } from "@/types";
import { GitBranch } from "lucide-react";

interface Props {
  result: EvaluateResponse | null;
}

export default function TraceCard({ result }: Props) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="panel-title">Decision lineage</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Policy trace</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-200">
          <GitBranch className="h-5 w-5" />
        </div>
      </div>
      {!result ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-slate-400">
          No trace yet.
        </div>
      ) : (
        <ol className="space-y-3">
          {result.trace.map((step, index) => (
            <li key={`${index}-${step}`} className="flex gap-4 rounded-[22px] border border-white/8 bg-black/20 px-4 py-4 text-sm text-slate-200">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-200">
                {index + 1}
              </span>
              <span className="leading-6">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
