import Fastify from "fastify";
import { ZodError } from "zod";
import { createReportStore, type ReportStore } from "./report-store.js";
import { parseReportInput, rankingsQuerySchema } from "./reports.js";

interface BuildAppOptions {
  reportStore?: ReportStore;
}

export function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify();
  const reportStore = options.reportStore ?? createReportStore();

  app.get("/health", async () => ({ ok: true }));

  app.post("/reports", async (request, reply) => {
    try {
      const report = parseReportInput(request.body);
      const storedReport = await reportStore.createReport(report);

      return reply.code(201).send({ report: storedReport });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: "Invalid report payload",
          issues: error.issues.map(({ path, message }) => ({ path, message }))
        });
      }

      request.log.error({ error }, "Failed to persist report");
      return reply.code(500).send({ error: "Failed to persist report" });
    }
  });

  app.get("/rankings", async (request, reply) => {
    try {
      const filters = rankingsQuerySchema.parse(request.query);
      const reports = await reportStore.listReports(filters);
      const rankings = new Map<
        string,
        {
          apiId: string;
          provider: string;
          endpoint: string;
          category: string;
          reportCount: number;
          starScoreTotal: number;
          successCount: number;
          latencyTotal: number;
          latestTimestamp: string;
        }
      >();

      for (const report of reports) {
        const existing = rankings.get(report.apiId);

        if (existing) {
          existing.reportCount += 1;
          existing.starScoreTotal += report.starScore;
          existing.successCount += report.success ? 1 : 0;
          existing.latencyTotal += report.latencyMs;
          if (report.timestamp > existing.latestTimestamp) {
            existing.latestTimestamp = report.timestamp;
          }
          continue;
        }

        rankings.set(report.apiId, {
          apiId: report.apiId,
          provider: report.provider,
          endpoint: report.endpoint,
          category: report.category,
          reportCount: 1,
          starScoreTotal: report.starScore,
          successCount: report.success ? 1 : 0,
          latencyTotal: report.latencyMs,
          latestTimestamp: report.timestamp
        });
      }

      const items = Array.from(rankings.values())
        .map((ranking) => ({
          apiId: ranking.apiId,
          provider: ranking.provider,
          endpoint: ranking.endpoint,
          category: ranking.category,
          averageStarScore: ranking.starScoreTotal / ranking.reportCount,
          reportCount: ranking.reportCount,
          successRate: ranking.successCount / ranking.reportCount,
          averageLatencyMs: ranking.latencyTotal / ranking.reportCount,
          latestTimestamp: ranking.latestTimestamp
        }))
        .sort(
          (left, right) =>
            right.averageStarScore - left.averageStarScore ||
            right.reportCount - left.reportCount ||
            left.apiId.localeCompare(right.apiId)
        );

      return {
        category: filters.category,
        ...(filters.taskType ? { taskType: filters.taskType } : {}),
        items
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: "Invalid rankings query",
          issues: error.issues.map(({ path, message }) => ({ path, message }))
        });
      }

      request.log.error({ error }, "Failed to load rankings");
      return reply.code(500).send({ error: "Failed to load rankings" });
    }
  });

  app.get("/apis/:apiId", async () => {
    throw new Error("GET /apis/:apiId is not implemented yet");
  });

  return app;
}
