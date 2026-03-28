import { AgentAction, PolicyConfig, PolicyResult } from "@/types";
import {
  includesDestructiveIntent,
  includesPromptInjection,
  includesSensitiveKeyword,
  isExternalEmail,
  isSuspiciousDomain
} from "./utils";

export const DEFAULT_POLICY_CONFIG: PolicyConfig = {
  block_external_email: true,
  require_approval_for_sensitive_content: true,
  block_suspicious_domains: true,
  block_destructive_intent: true,
  detect_prompt_injection: true
};

export function evaluateTrustPolicy(
  action: AgentAction,
  config: PolicyConfig = DEFAULT_POLICY_CONFIG
): PolicyResult {
  let riskScore = 0;
  const reasons: string[] = [];
  const trace: string[] = [];

  const actionText = `${action.action} ${JSON.stringify(action.params)}`;
  trace.push("Parsed action payload and started policy evaluation");

  if (!action.user_role || !action.context?.session_id) {
    riskScore += 15;
    reasons.push("Missing user role or session context");
    trace.push("Context rule triggered: +15 risk");
  } else {
    trace.push("Context rule passed");
  }

  if (action.tool === "send_email") {
    const to = String(action.params.to ?? "");
    if (to && isExternalEmail(to)) {
      riskScore += 35;
      reasons.push("External email recipient detected");
      trace.push("External email rule triggered: +35 risk");
      if (config.block_external_email) {
        riskScore += 15;
        trace.push("Strict external email policy enabled: +15 risk");
      }
    } else {
      trace.push("External email rule passed");
    }
  }

  if (includesSensitiveKeyword(actionText)) {
    riskScore += 30;
    reasons.push("Sensitive content detected");
    trace.push("Sensitive content rule triggered: +30 risk");
    if (config.require_approval_for_sensitive_content) {
      riskScore += 10;
      trace.push("Sensitive-content approval policy enabled: +10 risk");
    }
  } else {
    trace.push("Sensitive content rule passed");
  }

  if (action.tool === "http_request") {
    const url = String(action.params.url ?? "");
    if (url && isSuspiciousDomain(url)) {
      riskScore += 50;
      reasons.push("Untrusted or suspicious domain detected");
      trace.push("Suspicious domain rule triggered: +50 risk");
      if (config.block_suspicious_domains) {
        riskScore += 10;
        trace.push("Strict suspicious-domain policy enabled: +10 risk");
      }
    } else {
      trace.push("Suspicious domain rule passed");
    }
  }

  if (action.tool === "db_query") {
    const query = String(action.params.query ?? "");
    if (includesDestructiveIntent(query)) {
      riskScore += 80;
      reasons.push("Destructive database query detected");
      trace.push("DB destructive query rule triggered: +80 risk");
    } else if (query.toLowerCase().startsWith("update") || query.toLowerCase().startsWith("insert")) {
      riskScore += 35;
      reasons.push("Write database query requires review");
      trace.push("DB write rule triggered: +35 risk");
    } else {
      trace.push("DB query safety rule passed");
    }
  }

  if (includesDestructiveIntent(actionText)) {
    riskScore += 80;
    reasons.push("Destructive intent detected");
    trace.push("Destructive intent rule triggered: +80 risk");
    if (config.block_destructive_intent) {
      riskScore += 10;
      trace.push("Strict destructive-action policy enabled: +10 risk");
    }
  } else {
    trace.push("Destructive intent rule passed");
  }

  if (config.detect_prompt_injection && includesPromptInjection(actionText)) {
    riskScore += 60;
    reasons.push("Prompt injection or approval bypass attempt detected");
    trace.push("Prompt injection rule triggered: +60 risk");
  } else {
    trace.push("Prompt injection rule passed");
  }

  let decision: PolicyResult["decision"] = "ALLOW";
  if (riskScore > 75) {
    decision = "BLOCK";
    trace.push("Final verdict: BLOCK");
  } else if (riskScore > 40) {
    decision = "REQUIRE_APPROVAL";
    trace.push("Final verdict: REQUIRE_APPROVAL");
  } else {
    trace.push("Final verdict: ALLOW");
  }

  if (reasons.length === 0) {
    reasons.push("No major trust policy violations detected");
  }

  return {
    risk_score: riskScore,
    decision,
    reasons,
    trace
  };
}
