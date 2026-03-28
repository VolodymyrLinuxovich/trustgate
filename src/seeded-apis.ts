import {
  normalizeApiId,
  type ReportCategory
} from "./reports.js";

export interface SeededApiRecord {
  apiId: string;
  provider: string;
  endpoint: string;
  category: ReportCategory;
}

function createSeededApiRecord(
  provider: string,
  endpoint: string,
  category: ReportCategory
): SeededApiRecord {
  return {
    apiId: normalizeApiId(provider, endpoint),
    provider,
    endpoint,
    category
  };
}

export const seededApiRecords: SeededApiRecord[] = [
  createSeededApiRecord("OpenAI", "/v1/responses", "llm"),
  createSeededApiRecord("Groq", "/openai/v1/chat/completions", "llm"),
  createSeededApiRecord(
    "Gemini",
    "/v1beta/models/gemini-2.0-flash:generateContent",
    "llm"
  ),
  createSeededApiRecord("Open-Meteo", "/v1/forecast", "weather"),
  createSeededApiRecord("OpenWeatherMap", "/data/2.5/weather", "weather"),
  createSeededApiRecord("NOAA weather.gov", "/points", "weather"),
  createSeededApiRecord("CoinDesk", "/v1/bpi/currentprice.json", "data"),
  createSeededApiRecord("Nationalize.io", "/", "data"),
  createSeededApiRecord("DataUSA", "/api/searchLegacy/", "data")
];

export function listSeededApiRecordsByCategory(category: ReportCategory) {
  return seededApiRecords.filter((record) => record.category === category);
}

export function getSeededApiRecord(apiId: string) {
  return seededApiRecords.find((record) => record.apiId === apiId) ?? null;
}
