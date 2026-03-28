import { AgentAction } from "@/types";
import { Bot, FileJson2 } from "lucide-react";

interface Props {
  action: AgentAction | null;
}

export default function ActionPanel({ action }: Props) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="panel-title">Execution input</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Agent proposal</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-200">
          <Bot className="h-5 w-5" />
        </div>
      </div>

      {!action ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-slate-400">
          Select a scenario or compose a custom action to inspect the agent payload.
        </div>
      ) : (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="card-soft p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Agent</p>
              <p className="mt-2 text-sm font-medium text-white">{action.agent_id}</p>
            </div>
            <div className="card-soft p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tool</p>
              <p className="mt-2 text-sm font-medium text-white">{action.tool}</p>
            </div>
            <div className="card-soft p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Role</p>
              <p className="mt-2 text-sm font-medium text-white">{action.user_role ?? "Unknown"}</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-[#030712]/70 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <FileJson2 className="h-4 w-4" />
              JSON payload
            </div>
            <pre className="overflow-x-auto text-sm leading-6 text-slate-200">
              {JSON.stringify(action, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
