import { describe, expect, it } from "vitest";
import {
  getSeededApiRecord,
  listSeededApiRecordsByCategory,
  seededApiRecords
} from "../src/seeded-apis.js";

describe("seeded demo APIs", () => {
  it("defines the nine seeded demo API records across the MVP categories", () => {
    expect(seededApiRecords).toEqual([
      {
        apiId: "openai-v1-responses",
        provider: "OpenAI",
        endpoint: "/v1/responses",
        category: "llm"
      },
      {
        apiId: "groq-openai-v1-chat-completions",
        provider: "Groq",
        endpoint: "/openai/v1/chat/completions",
        category: "llm"
      },
      {
        apiId: "gemini-v1beta-models-gemini-2-0-flash-generatecontent",
        provider: "Gemini",
        endpoint: "/v1beta/models/gemini-2.0-flash:generateContent",
        category: "llm"
      },
      {
        apiId: "open-meteo-v1-forecast",
        provider: "Open-Meteo",
        endpoint: "/v1/forecast",
        category: "weather"
      },
      {
        apiId: "openweathermap-data-2-5-weather",
        provider: "OpenWeatherMap",
        endpoint: "/data/2.5/weather",
        category: "weather"
      },
      {
        apiId: "noaa-weather-gov-points",
        provider: "NOAA weather.gov",
        endpoint: "/points",
        category: "weather"
      },
      {
        apiId: "coindesk-v1-bpi-currentprice-json",
        provider: "CoinDesk",
        endpoint: "/v1/bpi/currentprice.json",
        category: "data"
      },
      {
        apiId: "nationalize-io",
        provider: "Nationalize.io",
        endpoint: "/",
        category: "data"
      },
      {
        apiId: "datausa-api-searchlegacy",
        provider: "DataUSA",
        endpoint: "/api/searchLegacy/",
        category: "data"
      }
    ]);
  });

  it("supports category filtering and apiId lookups for later ranking/detail fallbacks", () => {
    expect(listSeededApiRecordsByCategory("weather").map((record) => record.provider)).toEqual([
      "Open-Meteo",
      "OpenWeatherMap",
      "NOAA weather.gov"
    ]);

    expect(getSeededApiRecord("open-meteo-v1-forecast")).toEqual({
      apiId: "open-meteo-v1-forecast",
      provider: "Open-Meteo",
      endpoint: "/v1/forecast",
      category: "weather"
    });
    expect(getSeededApiRecord("missing-api")).toBeNull();
  });
});
