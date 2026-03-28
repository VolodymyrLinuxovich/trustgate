"use client";

import { useState } from "react";
import { AgentAction, AgentTool } from "@/types";

interface Props {
  onSubmit: (action: AgentAction) => void;
}

const defaultParams = {
  send_email: { to: "external@example.com", subject: "Hello", body: "Internal roadmap attached." },
  calendar_create_event: { title: "Team Sync", attendees: ["alex@company.com"], date: "2026-03-29", time: "15:00" },
  http_request: { method: "POST", url: "https://api.example.com/run", body: { message: "safe payload" } },
  db_query: { query: "SELECT * FROM users LIMIT 5;" },
  slack_post_message: { channel: "#ops", text: "Deployment completed" }
};

export default function CustomActionForm({ onSubmit }: Props) {
  const [tool, setTool] = useState<AgentTool>("send_email");
  const [agentId, setAgentId] = useState("custom-agent");
  const [actionText, setActionText] = useState("Send a message");
  const [userRole, setUserRole] = useState("member");
  const [sessionId, setSessionId] = useState("custom-session-001");
  const [paramsText, setParamsText] = useState(JSON.stringify(defaultParams.send_email, null, 2));
  const [error, setError] = useState<string | null>(null);

  function handleToolChange(nextTool: AgentTool) {
    setTool(nextTool);
    setParamsText(JSON.stringify(defaultParams[nextTool], null, 2));
  }

  function handleSubmit() {
    try {
      const parsed = JSON.parse(paramsText);
      setError(null);
      onSubmit({
        agent_id: agentId,
        tool,
        action: actionText,
        params: parsed,
        user_role: userRole,
        context: {
          session_id: sessionId,
          user_intent: actionText
        }
      });
    } catch {
      setError("Params must be valid JSON.");
    }
  }

  return (
    <div className="card p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="panel-title">Manual composer</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Craft your own action</h2>
        </div>
        <button onClick={handleSubmit} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
          Evaluate custom action
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <label className="block text-sm text-slate-300">
            Agent ID
            <input value={agentId} onChange={(e) => setAgentId(e.target.value)} className="mt-2 w-full rounded-[20px] border border-white/8 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-400/40" />
          </label>

          <label className="block text-sm text-slate-300">
            Tool
            <select value={tool} onChange={(e) => handleToolChange(e.target.value as AgentTool)} className="mt-2 w-full rounded-[20px] border border-white/8 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-400/40">
              <option value="send_email">send_email</option>
              <option value="calendar_create_event">calendar_create_event</option>
              <option value="http_request">http_request</option>
              <option value="db_query">db_query</option>
              <option value="slack_post_message">slack_post_message</option>
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            Action
            <input value={actionText} onChange={(e) => setActionText(e.target.value)} className="mt-2 w-full rounded-[20px] border border-white/8 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-400/40" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              User Role
              <input value={userRole} onChange={(e) => setUserRole(e.target.value)} className="mt-2 w-full rounded-[20px] border border-white/8 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-400/40" />
            </label>
            <label className="block text-sm text-slate-300">
              Session ID
              <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} className="mt-2 w-full rounded-[20px] border border-white/8 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-400/40" />
            </label>
          </div>
        </div>

        <label className="block text-sm text-slate-300">
          Params JSON
          <textarea value={paramsText} onChange={(e) => setParamsText(e.target.value)} className="mt-2 min-h-[320px] w-full rounded-[24px] border border-white/8 bg-[#030712]/70 px-4 py-4 font-mono text-sm leading-6 text-slate-200 outline-none transition focus:border-cyan-400/40" />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
    </div>
  );
}
