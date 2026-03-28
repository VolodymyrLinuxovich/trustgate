import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { buildApp } from "../src/app.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

describe.skipIf(!supabaseUrl || !supabaseKey)("integration: Supabase", () => {
  let app: ReturnType<typeof buildApp>;
  const supabase = createClient(supabaseUrl!, supabaseKey!);

  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await supabase.from("reports").delete().neq("id", 0);
  });

  it("round-trips a report through Supabase", async () => {
    const postRes = await app.inject({
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
      },
    });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.json().report).toEqual(
      expect.objectContaining({
        apiId: "open-meteo-v1-forecast",
        provider: "Open-Meteo",
        starScore: 5,
      })
    );

    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("apiId", "open-meteo-v1-forecast");

    expect(data).toHaveLength(1);
    expect(data![0].provider).toBe("Open-Meteo");
  });

  it("returns rankings from Supabase data", async () => {
    await app.inject({
      method: "POST",
      url: "/reports",
      payload: {
        provider: "Open-Meteo",
        endpoint: "/v1/forecast",
        category: "weather",
        taskType: "daily-forecast",
        success: true,
        latencyMs: 300,
        timestamp: "2026-03-28T16:00:00Z",
        starScore: 5,
      },
    });
    await app.inject({
      method: "POST",
      url: "/reports",
      payload: {
        provider: "Open-Meteo",
        endpoint: "/v1/forecast",
        category: "weather",
        taskType: "daily-forecast",
        success: false,
        latencyMs: 600,
        timestamp: "2026-03-28T17:00:00Z",
        starScore: 3,
        rateLimited: true,
      },
    });

    const res = await app.inject({
      method: "GET",
      url: "/rankings?category=weather",
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.category).toBe("weather");
    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          apiId: "open-meteo-v1-forecast",
          reviewCount: 2,
        }),
      ])
    );
  });

  it("returns API detail from Supabase data", async () => {
    await app.inject({
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
        comment: "Integration test review",
      },
    });

    const res = await app.inject({
      method: "GET",
      url: "/apis/open-meteo-v1-forecast",
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.api).toEqual(
      expect.objectContaining({
        apiId: "open-meteo-v1-forecast",
        reviewCount: 1,
      })
    );
    expect(body.reviews).toHaveLength(1);
    expect(body.reviews[0].comment).toBe("Integration test review");
  });
});
