const loadingCategories = [
  {
    key: "llm",
    title: "LLM APIs"
  },
  {
    key: "weather",
    title: "Weather APIs"
  },
  {
    key: "data",
    title: "Data APIs"
  }
] as const;

function LoadingCard() {
  return (
    <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4">
      <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />
      <div className="mt-3 h-4 w-48 animate-pulse rounded-full bg-white/5" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-3 py-3">
          <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="mt-3 h-6 w-24 animate-pulse rounded-full bg-white/5" />
        </div>
        <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-3 py-3">
          <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="mt-3 h-6 w-16 animate-pulse rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full space-y-6">
        <div className="card overflow-hidden px-8 py-10 lg:px-10 lg:py-12">
          <div className="badge w-fit bg-white/[0.03] text-cyan-200">
            Public API trust layer
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
            <div className="space-y-5">
              <div className="h-12 w-full max-w-3xl animate-pulse rounded-[24px] bg-white/10" />
              <div className="h-6 w-full max-w-2xl animate-pulse rounded-full bg-white/5" />
              <div className="h-6 w-full max-w-xl animate-pulse rounded-full bg-white/5" />
            </div>
            <div className="card-soft glow-ring space-y-4 px-6 py-6">
              <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-3">
                <div className="h-5 w-full animate-pulse rounded-full bg-white/5" />
                <div className="h-5 w-4/5 animate-pulse rounded-full bg-white/5" />
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <article key={index} className="card-soft h-full px-6 py-6">
              <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="mt-4 h-10 w-28 animate-pulse rounded-full bg-white/5" />
              <div className="mt-4 h-5 w-full animate-pulse rounded-full bg-white/5" />
              <div className="mt-2 h-5 w-5/6 animate-pulse rounded-full bg-white/5" />
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="panel-title">Category rankings</p>
              <div className="mt-2 h-8 w-80 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="hidden h-5 w-72 animate-pulse rounded-full bg-white/5 md:block" />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {loadingCategories.map((category) => (
              <section key={category.key} className="card-soft h-full px-6 py-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="panel-title">{category.key}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {category.title}
                    </h3>
                  </div>
                  <span className="badge bg-white/[0.02] text-slate-200">
                    Loading
                  </span>
                </div>
                <div className="mt-6 space-y-3">
                  <LoadingCard />
                  <LoadingCard />
                </div>
              </section>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
