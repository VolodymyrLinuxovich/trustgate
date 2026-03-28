export type Decision = "ALLOW" | "REQUIRE_APPROVAL" | "BLOCK";

export type AgentTool =
  | "send_email"
  | "calendar_create_event"
  | "http_request"
  | "db_query"
  | "slack_post_message";

export interface PolicyConfig {
  block_external_email: boolean;
  require_approval_for_sensitive_content: boolean;
  block_suspicious_domains: boolean;
  block_destructive_intent: boolean;
  detect_prompt_injection: boolean;
}

export interface AgentAction {
  agent_id: string;
  tool: AgentTool;
  action: string;
  params: Record<string, unknown>;
  user_role?: string;
  context?: {
    session_id?: string;
    user_intent?: string;
  };
}

export interface ScoreBreakdownItem {
  label: string;
  delta: number;
}

export interface EvaluationMetrics {
  policy_compliance_score: number;
  risk_awareness_score: number;
  reliability_score: number;
  oversight_score: number;
  auditability_score: number;
  trust_score: number;
  breakdown: {
    policy_compliance: ScoreBreakdownItem[];
    risk_awareness: ScoreBreakdownItem[];
    reliability: ScoreBreakdownItem[];
    oversight: ScoreBreakdownItem[];
    auditability: ScoreBreakdownItem[];
  };
}

export interface PolicyResult {
  risk_score: number;
  decision: Decision;
  reasons: string[];
  trace: string[];
}

export interface EvaluateResponse extends PolicyResult {
  evaluation: EvaluationMetrics;
  trust_score: number;
  action_id?: number;
}

export interface AuditLogRow {
  id: number;
  created_at: string;
  action_id: number | null;
  tool: string;
  decision: Decision;
  risk_score: number;
  reasons: string[];
  approved: boolean;
  evaluation: EvaluationMetrics;
  trust_score: number;
}

export interface AgentActionRecord {
  id: number;
  created_at: string;
  agent_id: string;
  tool: string;
  action: string;
  params: Record<string, unknown>;
  user_role: string | null;
  status: string;
  risk_score: number;
  decision: Decision;
  reasons: string[];
  evaluation: EvaluationMetrics;
  trust_score: number;
}
