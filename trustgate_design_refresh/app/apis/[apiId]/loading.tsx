function LoadingStatCard() {
  return (
    <article className="card-soft h-full px-6 py-6">
      <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
      <div className="mt-3 h-9 w-24 animate-pulse rounded-full bg-white/5" />
      <div className="mt-3 h-5 w-full animate-pulse rounded-full bg-white/5" />
      <div className="mt-2 h-5 w-4/5 animate-pulse rounded-full bg-white/5" />
    </article>
  );
}

function LoadingReviewCard() {
  return (
    <article className="card-soft px-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="mt-2 h-4 w-28 animate-pulse rounded-full bg-white/5" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="h-8 w-32 animate-pulse rounded-full bg-white/5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4"
          >
            <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-6 w-16 animate-pulse rounded-full bg-white/5" />
          </div>
        ))}
      </div>

      <div className="mt-5 h-20 animate-pulse rounded-2xl border border-white/6 bg-white/[0.02]" />
    </article>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full space-y-6">
        <section className="card overflow-hidden px-8 py-10 lg:px-10 lg:py-12">
          <div className="badge w-fit bg-white/[0.03] text-cyan-200">
            API trust profile
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
            <div className="space-y-5">
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/10" />
              <div className="h-12 w-full max-w-sm animate-pulse rounded-[24px] bg-white/10" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
              <div className="h-6 w-full max-w-2xl animate-pulse rounded-full bg-white/5" />
              <div className="h-6 w-full max-w-xl animate-pulse rounded-full bg-white/5" />
              <div className="h-20 w-full max-w-2xl animate-pulse rounded-[24px] bg-white/[0.03]" />
              <div className="flex flex-wrap gap-3">
                <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="h-8 w-48 animate-pulse rounded-full bg-white/5" />
              </div>
            </div>

            <aside className="card-soft glow-ring px-6 py-6">
              <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="mt-4 space-y-4">
                <div>
                  <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
                  <div className="mt-3 h-12 w-32 animate-pulse rounded-full bg-white/5" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {Array.from({ length: 2 }, (_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4"
                    >
                      <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                      <div className="mt-3 h-8 w-16 animate-pulse rounded-full bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <LoadingStatCard key={index} />
          ))}
        </section>

        <section className="card-soft flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-5 w-full max-w-lg animate-pulse rounded-full bg-white/5" />
            <div className="mt-2 h-5 w-4/5 max-w-md animate-pulse rounded-full bg-white/5" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-full bg-white/10" />
        </section>

        <section className="grid gap-4">
          <LoadingReviewCard />
          <LoadingReviewCard />
        </section>
      </section>
    </main>
  );
}
