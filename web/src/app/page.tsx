import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-16 md:px-8">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="panel p-7 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            BusinessOne Internal Tool
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            Interview Scheduling
          </h1>
          <p className="mt-3 text-sm text-stone-600 md:text-base">
            Choose an action to continue.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/availability"
            className="panel block rounded-2xl p-6 transition hover:translate-y-[-1px]"
          >
            <h2 className="text-xl font-semibold text-stone-900">Add My Availabilities</h2>
            <p className="mt-2 text-sm text-stone-600">
              Open the weekly drag grid to set your available interview slots.
            </p>
          </Link>

          <Link
            href="/schedule"
            className="panel block rounded-2xl p-6 transition hover:translate-y-[-1px]"
          >
            <h2 className="text-xl font-semibold text-stone-900">Schedule a Candidate</h2>
            <p className="mt-2 text-sm text-stone-600">
              Pick interviewer A and B and view shared available times in the same grid.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}
