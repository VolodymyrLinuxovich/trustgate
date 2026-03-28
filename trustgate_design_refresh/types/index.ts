export type ApiCategory = "llm" | "weather" | "data";

export interface ApiReviewInput {
  provider: string;
  endpoint: string;
  category: ApiCategory;
  taskType: string;
  success: boolean;
  latencyMs: number;
  timestamp: string;
  starScore: number;
  rateLimited?: boolean;
  comment?: string;
  sourceType?: string;
  agentName?: string;
}

export interface ApiReview extends ApiReviewInput {
  apiId: string;
}

export interface ApiRankingItem {
  apiId: string;
  provider: string;
  endpoint: string;
  category: ApiCategory;
  avgStarScore: number;
  reviewCount: number;
  successRate: number;
  medianLatencyMs: number;
  rateLimitedCount: number;
}

export interface RankingsResponse {
  category: ApiCategory;
  taskType?: string;
  items: ApiRankingItem[];
}

export interface ApiDetailResponse {
  api: ApiRankingItem;
  reviews: ApiReview[];
}

export interface CreateReportResponse {
  report: ApiReview;
}
