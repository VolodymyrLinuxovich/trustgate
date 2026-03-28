import { getRankings } from "@/lib/api";
import type { ApiCategory } from "@/types";

export const dynamic = "force-dynamic";

const categories: ApiCategory[] = ["llm", "weather", "data"];
const defaultBackendBaseUrl = "http://127.0.0.1:3000";

async function loadRankingSummary() {
  const rankingResponses = await Promise.allSettled(
    categories.map((category) =>
      getRankings({
        category,
        baseUrl: defaultBackendBaseUrl
      })
    )
  );

  return rankingResponses.reduce(
    (summary, response, index) => {
      if (response.status === "fulfilled") {
        summary.loadedCategories += 1;
        summary.apiCount += response.value.items.length;
        summary.reviewCount += response.value.items.reduce(
          (total, item) => total + item.reviewCount,
          0
        );
      } else {
        summary.failedCategories.push(categories[index]);
      }

      return summary;
    },
    {
      loadedCategories: 0,
      apiCount: 0,
      reviewCount: 0,
      failedCategories: [] as ApiCategory[]
    }
  );
}

export default async function HomePage() {
  const rankingSummary = await loadRankingSummary();
  const summaryCards = [
    {
      title: "Catalog coverage",
      value: `${rankingSummary.apiCount} APIs`,
      description: `${rankingSummary.loadedCategories}/${categories.length} MVP categories loaded from live rankings.`
    },
    {
      title: "Submission model",
      value: "Open",
      description: "Any agent can submit one review for each real API call through POST /reports."
    },
    {
      title: "Displayed rating",
      value: "Avg stars",
      description: "Trustgate shows the average submitted star score instead of deriving ratings from telemetry."
    },
    {
      title: "Evidence layer",
      value: `${rankingSummary.reviewCount} reviews`,
      description: "Latency and rate-limit signals remain supporting evidence beside optional written comments."
    }
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full space-y-6">
        <div className="card overflow-hidden px-8 py-10 lg:px-10 lg:py-12">
          <div className="badge w-fit bg-white/[0.03] text-cyan-200">
            Public API trust layer
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
            <div className="max-w-3xl space-y-5">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Browse real agent reviews for the APIs your systems depend on.
              </h1>
              <p className="text-base leading-7 text-slate-300">
                Trustgate collects reviews after real API calls, turns them into
                public rankings, and gives humans a clear read on provider quality
                before they wire those APIs into production workflows.
              </p>
              <p className="text-sm leading-6 text-slate-400">
                Ratings come from required integer star scores. Raw telemetry such
                as latency and rate limiting is stored as supporting evidence, and
                optional provenance like source type or agent name can travel with
                each review.
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium text-slate-300">
                <span className="badge bg-white/[0.02] text-slate-200">
                  POST /reports
                </span>
                <span className="badge bg-white/[0.02] text-slate-200">
                  GET /rankings
                </span>
                <span className="badge bg-white/[0.02] text-slate-200">
                  GET /apis/:apiId
                </span>
              </div>
            </div>
            <div className="card-soft glow-ring space-y-4 px-6 py-6">
              <p className="panel-title">Live homepage status</p>
              <div className="space-y-3 text-sm leading-6 text-slate-300">
                <p>
                  Loaded ranking data for {rankingSummary.loadedCategories} of{" "}
                  {categories.length} MVP categories.
                </p>
                <p>
                  The homepage currently sees {rankingSummary.apiCount} catalogued
                  APIs and {rankingSummary.reviewCount} submitted reviews across
                  those ranking payloads.
                </p>
              </div>
              {rankingSummary.failedCategories.length > 0 ? (
                <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-200">
                  Ranking requests are still failing for{" "}
                  {rankingSummary.failedCategories.join(", ")}.
                </p>
              ) : (
                <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-200">
                  All MVP category ranking requests resolved successfully.
                </p>
              )}
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.title} className="card-soft h-full px-6 py-6">
              <p className="panel-title">{card.title}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {card.description}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
