"use client";

import Link from "next/link";

interface JobPaginationProps {
  page: number;
  totalPages: number;
  totalMatches: number;
  search: string;
  skills: string;
  nearMe: boolean;
  location: string;
  radiusMiles: number;
}

function buildJobsUrl(
  {
    search,
    skills,
    nearMe,
    location,
    radiusMiles,
  }: Omit<JobPaginationProps, "page" | "totalPages" | "totalMatches">,
  page: number,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }

  if (skills) {
    params.set("skills", skills);
  }

  if (nearMe) {
    params.set("nearMe", "true");
    params.set("radiusMiles", String(radiusMiles));
  }

  if (location) {
    params.set("location", location);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return `/jobs${query ? `?${query}` : ""}`;
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export default function JobPagination({
  page,
  totalPages,
  totalMatches,
  search,
  skills,
  nearMe,
  location,
  radiusMiles,
}: JobPaginationProps) {
  if (totalMatches === 0) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < safeTotalPages ? page + 1 : null;
  const visiblePages = getVisiblePages(page, safeTotalPages);
  const urlContext = { search, skills, nearMe, location, radiusMiles };

  const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent";
  const disabledIconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted opacity-50";

  return (
    <nav
      aria-label="Job results pages"
      className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6"
    >
      <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
        {previousPage ? (
          <Link
            href={buildJobsUrl(urlContext, previousPage)}
            className={iconButtonClass}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </Link>
        ) : (
          <span className={disabledIconButtonClass} aria-hidden="true">
            <ChevronLeftIcon />
          </span>
        )}

        <div className="flex items-center gap-1">
          {visiblePages.map((pageNumber, index) => {
            const previousPageNumber = visiblePages[index - 1];
            const showEllipsis =
              index > 0 && previousPageNumber !== undefined
                ? pageNumber - previousPageNumber > 1
                : false;

            return (
              <span key={pageNumber} className="flex items-center gap-1">
                {showEllipsis ? (
                  <span className="px-1 text-sm text-muted">...</span>
                ) : null}
                {pageNumber === page ? (
                  <span
                    aria-current="page"
                    className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-accent px-3 text-sm font-medium text-white"
                  >
                    {pageNumber}
                  </span>
                ) : (
                  <Link
                    href={buildJobsUrl(urlContext, pageNumber)}
                    className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                    aria-label={`Page ${pageNumber}`}
                  >
                    {pageNumber}
                  </Link>
                )}
              </span>
            );
          })}
        </div>

        {nextPage ? (
          <Link
            href={buildJobsUrl(urlContext, nextPage)}
            className={iconButtonClass}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </Link>
        ) : (
          <span className={disabledIconButtonClass} aria-hidden="true">
            <ChevronRightIcon />
          </span>
        )}
      </div>

      <p className="text-sm text-muted">
        Page {page.toLocaleString()} of {safeTotalPages.toLocaleString()}
      </p>
    </nav>
  );
}
