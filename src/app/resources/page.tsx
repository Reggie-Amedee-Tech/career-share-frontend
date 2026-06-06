import Link from "next/link";
import { Suspense } from "react";
import { getResources } from "@/lib/api";
import ResourceFilter from "@/components/ResourceFilter";
import ResourceVoteButtons from "@/components/ResourceVoteButtons";
import type { Resource, ResourceCategory } from "@/types/resource";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_LABELS,
} from "@/types/resource";

interface ResourcesPageProps {
  searchParams: Promise<{ category?: string }>;
}

function parseCategoryFilter(
  category: string | undefined,
): ResourceCategory | undefined {
  if (!category) {
    return undefined;
  }

  return RESOURCE_CATEGORIES.includes(category as ResourceCategory)
    ? (category as ResourceCategory)
    : undefined;
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const { category: categoryParam } = await searchParams;
  const categoryFilter = parseCategoryFilter(categoryParam);

  let resources: Resource[] = [];
  let error: string | null = null;

  try {
    resources = await getResources(
      categoryFilter ? { category: categoryFilter } : undefined,
    );
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load resources";
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Resources
          </h1>
          <p className="mt-1 text-muted">
            Career resources shared by the community
          </p>
        </div>
        <Link
          href="/resources/new"
          className="w-full rounded-full bg-primary px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover sm:w-auto"
        >
          Add Resource
        </Link>
      </div>

      <div className="mb-6">
        <Suspense
          fallback={
            <div className="h-10 w-full max-w-xs animate-pulse rounded-lg bg-background" />
          }
        >
          <ResourceFilter />
        </Suspense>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {resources.length === 0 && !error ? (
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="text-muted">
            {categoryFilter
              ? `No resources found for ${RESOURCE_CATEGORY_LABELS[categoryFilter]}.`
              : "No resources yet. Be the first to share one!"}
          </p>
          {categoryFilter ? (
            <Link
              href="/resources"
              className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Clear filter
            </Link>
          ) : (
            <Link
              href="/resources/new"
              className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Add a resource
            </Link>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {resources.map((resource) => (
            <li key={resource.id}>
              <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <Link
                    href={`/resources/${resource.id}`}
                    className="min-w-0 flex-1 rounded-lg transition-colors hover:bg-background"
                  >
                    <h2 className="text-lg font-medium text-accent hover:text-accent-hover">
                      {resource.title}
                    </h2>
                    {resource.category[0] && (
                      <p className="mt-1 text-xs font-medium text-muted">
                        {RESOURCE_CATEGORY_LABELS[resource.category[0]]}
                      </p>
                    )}
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {resource.description}
                    </p>
                    <p className="mt-2 truncate text-xs text-muted/70">
                      {resource.url}
                    </p>
                  </Link>
                  <div className="shrink-0 self-start">
                    <ResourceVoteButtons
                      resourceId={resource.id}
                      initialUpvoteCount={resource.upvoteCount}
                      initialDownvoteCount={resource.downvoteCount}
                      initialUserVote={resource.userVote}
                      compact
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
