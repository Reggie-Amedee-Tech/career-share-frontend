import { Shimmer } from "@/components/Shimmer";

export function JourneySidebarShimmer({ count = 3 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-2" role="status" aria-label="Loading journeys">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <div
            className="rounded-lg border border-border bg-surface px-4 py-3"
            aria-hidden="true"
          >
            <Shimmer className="h-4 w-3/4 rounded" />
            <Shimmer className="mt-2 h-3 w-1/2 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function JourneyInsightsShimmer() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading skill insights">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <article
            key={index}
            className="rounded-xl border border-border bg-surface px-4 py-4 shadow-sm"
          >
            <Shimmer className="h-3 w-20 rounded" />
            <Shimmer className="mt-3 h-7 w-16 rounded" />
            <Shimmer className="mt-2 h-4 w-full rounded" />
            <Shimmer className="mt-1 h-4 w-4/5 rounded" />
          </article>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2" aria-hidden="true">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
          <Shimmer className="h-5 w-40 rounded" />
          <Shimmer className="mt-4 h-56 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
          <Shimmer className="h-5 w-48 rounded" />
          <Shimmer className="mt-4 h-56 w-full rounded-lg" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5" aria-hidden="true">
        <Shimmer className="h-5 w-36 rounded" />
        <Shimmer className="mt-4 h-72 w-full rounded-lg" />
      </div>
    </div>
  );
}
