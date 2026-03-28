import { getRankings } from "@/lib/api";
import type { ApiCategory } from "@/types";

export const dynamic = "force-dynamic";

const categories: ApiCategory[] = ["llm", "weather", "data"];
const defaultBackendBaseUrl = "http://127.0.0.1:3000";

async function loadRankingCounts() {
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
      } else {
        summary.failedCategories.push(categories[index]);
      }

      return summary;
    },
    {
      loadedCategories: 0,
      apiCount: 0,
      failedCategories: [] as ApiCategory[]
    }
  );
}

export default async function HomePage() {
  const rankingSummary = await loadRankingCounts();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="card w-full px-8 py-10 lg:px-10 lg:py-12">
        <div className="badge w-fit bg-white/[0.03] text-cyan-200">
          Trustgate frontend
        </div>
        <div className="mt-6 max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            The legacy action-evaluation demo routes have been removed.
          </h1>
          <p className="text-base leading-7 text-slate-300">
            This frontend is being migrated to the Trustgate API review model. The
            next step is wiring the homepage to live ranking data from the backend
            `GET /rankings` endpoint.
          </p>
          <p className="text-sm leading-6 text-slate-400">
            Homepage data flow now reads ranking payloads for all three MVP
            categories and has loaded {rankingSummary.apiCount} APIs across{" "}
            {rankingSummary.loadedCategories} successful ranking responses.
          </p>
          {rankingSummary.failedCategories.length > 0 ? (
            <p className="text-sm leading-6 text-amber-300">
              Ranking requests still failed for:{" "}
              {rankingSummary.failedCategories.join(", ")}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
