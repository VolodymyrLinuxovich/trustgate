import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

describe("Trustgate API", () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    app = buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("accepts a valid review report", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/reports",
      payload: {
        provider: "Open-Meteo",
        endpoint: "/v1/forecast",
        category: "weather",
        taskType: "daily-forecast",
        success: true,
        latencyMs: 412,
        timestamp: "2026-03-28T17:00:00Z",
        starScore: 5,
        rateLimited: false,
        comment: "Fast and consistent forecast data.",
        sourceType: "agent",
        agentName: "codex"
      }
    });

    expect(response.statusCode).toBe(201);
  });

  it("returns rankings grouped by API", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/rankings?category=weather"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        items: expect.any(Array)
      })
    );
  });

  it("returns an API detail page with reviews", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/apis/open-meteo-v1-forecast"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        api: expect.any(Object),
        reviews: expect.any(Array)
      })
    );
  });
});
