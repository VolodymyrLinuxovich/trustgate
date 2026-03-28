export default function HomePage() {
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
        </div>
      </section>
    </main>
  );
}
