"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import JobPagination from "@/components/JobPagination";
import JobCard from "@/components/JobCard";
import { JobsListShimmer } from "@/components/JobCardShimmer";
import JobSearchForm from "@/components/JobSearchForm";
import { getJobs } from "@/lib/api";
import type { Job } from "@/types/job";
import { useAuth } from "@/context/AuthContext";

function JobsPageFallback() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Find Jobs
        </h1>
        <p className="mt-1 text-muted">
          Search open roles from Greenhouse job boards by keyword, skills, and
          location
        </p>
      </div>
      <JobsListShimmer />
    </div>
  );
}

function JobsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const skills = searchParams.get("skills") ?? "";
  const nearMe = searchParams.get("nearMe") === "true";
  const location = searchParams.get("location") ?? "";
  const radiusMiles = Math.max(
    1,
    Number.parseInt(searchParams.get("radiusMiles") ?? "50", 10) || 50,
  );
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );
  const filtersKey = `${search}|${skills}|${nearMe}|${location}|${radiusMiles}|${page}`;

  const [result, setResult] = useState<{
    key: string;
    jobs: Job[];
    totalBoardJobs: number;
    totalMatches: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [error, setError] = useState<{
    key: string;
    message: string;
  } | null>(null);

  const activeError = error?.key === filtersKey ? error.message : null;
  const hasFilters = Boolean(search || skills || nearMe || location);
  const loading = (!result || result.key !== filtersKey) && !activeError;
  const jobs = result?.key === filtersKey ? result.jobs : [];
  const totalBoardJobs = result?.key === filtersKey ? result.totalBoardJobs : 0;
  const totalMatches = result?.key === filtersKey ? result.totalMatches : 0;
  const currentPage = result?.key === filtersKey ? result.page : page;
  const pageLimit = result?.key === filtersKey ? result.limit : 10;
  const totalPages =
    result?.key === filtersKey
      ? result.totalPages
      : Math.max(1, Math.ceil((totalMatches || totalBoardJobs) / pageLimit));

  useEffect(() => {
    let cancelled = false;

    getJobs({
      search: search || undefined,
      skills: skills || undefined,
      nearMe: nearMe || undefined,
      location: location || undefined,
      radiusMiles: nearMe ? radiusMiles : undefined,
      page,
    })
      .then((data) => {
        if (cancelled) {
          return;
        }
        const resolvedTotalMatches = data.totalMatches ?? data.totalBoardJobs;
        const resolvedLimit = data.limit || 10;
        const resolvedTotalPages =
          data.totalPages ??
          Math.max(1, Math.ceil(resolvedTotalMatches / resolvedLimit));

        setResult({
          key: filtersKey,
          jobs: data.jobs,
          totalBoardJobs: data.totalBoardJobs,
          totalMatches: resolvedTotalMatches,
          page: data.page || page,
          limit: resolvedLimit,
          totalPages: resolvedTotalPages,
        });
        setError(null);
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setError({
          key: filtersKey,
          message:
            err instanceof Error ? err.message : "Failed to load jobs",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [filtersKey, search, skills, nearMe, location, radiusMiles, page]);

  function describeResultSummary() {
    const resultCount = totalMatches || totalBoardJobs;
    if (resultCount === 0) {
      return null;
    }

    const start = (currentPage - 1) * pageLimit + 1;
    const end = Math.min(currentPage * pageLimit, resultCount);
    const range = `Showing ${start.toLocaleString()}-${end.toLocaleString()}`;

    if (!hasFilters) {
      return `${range} of ${totalBoardJobs.toLocaleString()} open roles`;
    }

    return `${range} of ${totalMatches.toLocaleString()} matching roles from ${totalBoardJobs.toLocaleString()} open roles`;
  }

  function describeFilters() {
    const parts: string[] = [];

    if (search) {
      parts.push(`"${search}"`);
    }

    if (skills) {
      parts.push(`skills: ${skills}`);
    }

    if (nearMe && user) {
      parts.push(`within ${radiusMiles} miles of ${user.city}, ${user.state}`);
    } else if (location) {
      parts.push(`in ${location}`);
    }

    return parts.join(" ");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Find Jobs
        </h1>
        <p className="mt-1 text-muted">
          Search open roles from Greenhouse job boards by keyword, skills, and
          location
        </p>
      </div>

      <div className="mb-6">
        <JobSearchForm />
      </div>

      {loading && <JobsListShimmer />}

      {activeError && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {activeError}
        </p>
      )}

      {!loading && !activeError && jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="text-muted">
            {hasFilters
              ? "No job postings matched your search."
              : "No job postings are available right now."}
          </p>
          {totalBoardJobs > 0 && hasFilters ? (
            <p className="mt-2 text-sm text-muted">
              We searched {totalBoardJobs} open role
              {totalBoardJobs === 1 ? "" : "s"}
              {describeFilters() ? ` for ${describeFilters()}` : ""} and found
              no matches.
            </p>
          ) : null}
        </div>
      ) : null}

      {!loading && !activeError && jobs.length > 0 ? (
        <>
          <p className="mb-4 break-words text-sm text-muted">
            {describeResultSummary()}
            {hasFilters && describeFilters() ? ` for ${describeFilters()}` : ""}
          </p>
          <ul className="flex flex-col gap-4">
            {jobs.map((job) => (
              <li key={`${job.boardToken}-${job.id}`}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
          <JobPagination
            page={currentPage}
            totalPages={totalPages}
            totalMatches={totalMatches}
            search={search}
            skills={skills}
            nearMe={nearMe}
            location={location}
            radiusMiles={radiusMiles}
          />
        </>
      ) : null}

      <p className="mt-8 text-center text-sm text-muted">
        Want to share a career resource instead?{" "}
        <Link
          href="/resources"
          className="text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          Browse resources
        </Link>
      </p>
    </div>
  );
}

export default function JobsPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<JobsPageFallback />}>
        <JobsContent />
      </Suspense>
    </RequireAuth>
  );
}
