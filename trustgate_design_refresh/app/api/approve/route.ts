import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { action_id } = (await req.json()) as { action_id?: number };

    if (!action_id) {
      return NextResponse.json(
        { error: "action_id is required" },
        { status: 400 }
      );
    }

    const { data: actionRow, error: fetchError } = await supabase
      .from("agent_actions")
      .select("*")
      .eq("id", action_id)
      .single();

    if (fetchError || !actionRow) {
      return NextResponse.json(
        { error: fetchError?.message || "Action not found" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("agent_actions")
      .update({
        status: "approved"
      })
      .eq("id", action_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const { error: logError } = await supabase.from("audit_logs").insert([
      {
        action_id,
        tool: actionRow.tool,
        decision: "ALLOW",
        risk_score: actionRow.risk_score,
        reasons: ["Human approval granted"],
        approved: true,
        evaluation: actionRow.evaluation,
        trust_score: actionRow.trust_score
      }
    ]);

    if (logError) {
      return NextResponse.json(
        { error: logError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action_id,
      status: "approved"
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
