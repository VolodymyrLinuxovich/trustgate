import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_POLICY_CONFIG, evaluateTrustPolicy } from "@/lib/trust-engine";
import { evaluateAgentBehavior } from "@/lib/evaluation";
import { AgentAction, PolicyConfig } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action: AgentAction; policyConfig?: Partial<PolicyConfig> };
    const mergedConfig: PolicyConfig = {
      ...DEFAULT_POLICY_CONFIG,
      ...(body.policyConfig ?? {})
    };

    const policy = evaluateTrustPolicy(body.action, mergedConfig);
    const evaluation = evaluateAgentBehavior(body.action, policy);

    const { data: actionRow, error: actionError } = await supabase
      .from("agent_actions")
      .insert([
        {
          agent_id: body.action.agent_id,
          tool: body.action.tool,
          action: body.action.action,
          params: {
            ...body.action.params,
            policy_config: mergedConfig,
            trace: policy.trace
          },
          user_role: body.action.user_role ?? null,
          status:
            policy.decision === "REQUIRE_APPROVAL" ? "pending_approval" : "evaluated",
          risk_score: policy.risk_score,
          decision: policy.decision,
          reasons: policy.reasons,
          evaluation,
          trust_score: evaluation.trust_score
        }
      ])
      .select()
      .single();

    if (actionError) {
      return NextResponse.json(
        { error: actionError.message },
        { status: 500 }
      );
    }

    const { error: logError } = await supabase.from("audit_logs").insert([
      {
        action_id: actionRow.id,
        tool: body.action.tool,
        decision: policy.decision,
        risk_score: policy.risk_score,
        reasons: policy.reasons,
        approved: false,
        evaluation,
        trust_score: evaluation.trust_score
      }
    ]);

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    return NextResponse.json({
      risk_score: policy.risk_score,
      decision: policy.decision,
      reasons: policy.reasons,
      trace: policy.trace,
      evaluation,
      trust_score: evaluation.trust_score,
      action_id: actionRow.id
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
