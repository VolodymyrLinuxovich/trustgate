import type { ApiCategory, RankingsResponse } from "@/types";

export interface GetRankingsOptions {
  category: ApiCategory;
  taskType?: string;
  baseUrl?: string;
}

function buildRequestUrl(path: string, baseUrl?: string) {
  if (!baseUrl) {
    return path;
  }

  return new URL(path, baseUrl).toString();
}

export async function getRankings({
  category,
  taskType,
  baseUrl
}: GetRankingsOptions): Promise<RankingsResponse> {
  const searchParams = new URLSearchParams({ category });

  if (taskType) {
    searchParams.set("taskType", taskType);
  }

  const response = await fetch(
    buildRequestUrl(`/rankings?${searchParams.toString()}`, baseUrl),
    {
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load rankings (${response.status})`);
  }

  return (await response.json()) as RankingsResponse;
}
