import { Shimmer } from "@/components/Shimmer";

export default function JobCardShimmer() {
  return (
    <div
      className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <Shimmer className="h-6 w-3/4 rounded" />
          <Shimmer className="h-4 w-1/3 rounded" />
          <Shimmer className="h-4 w-1/2 rounded" />
          <div className="mt-3 space-y-2">
            <Shimmer className="h-3 w-full rounded" />
            <Shimmer className="h-3 w-full rounded" />
            <Shimmer className="h-3 w-2/3 rounded" />
          </div>
        </div>
        <Shimmer className="h-3 w-20 shrink-0 rounded" />
      </div>
    </div>
  );
}

export function JobsListShimmer({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading jobs">
      <Shimmer className="mb-1 h-4 w-48 rounded" />
      {Array.from({ length: count }, (_, index) => (
        <JobCardShimmer key={index} />
      ))}
    </div>
  );
}
