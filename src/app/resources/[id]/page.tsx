import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/api";
import AuthResourceActions from "@/components/AuthResourceActions";
import ResourceVoteButtons from "@/components/ResourceVoteButtons";
import { RESOURCE_CATEGORY_LABELS } from "@/types/resource";

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { id } = await params;

  let resource;
  try {
    resource = await getResource(id);
  } catch {
    notFound();
  }

  if (!resource) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/resources"
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent"
      >
        &larr; Back to Resources
      </Link>

      <div className="rounded-xl bg-surface p-4 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {resource.title}
            </h1>
            {resource.category[0] && (
              <p className="mt-2 text-sm font-medium text-muted">
                {RESOURCE_CATEGORY_LABELS[resource.category[0]]}
              </p>
            )}
          </div>
          <AuthResourceActions
            resourceId={resource.id}
            resourceTitle={resource.title}
          />
        </div>

        <p className="mb-6 leading-relaxed text-muted">{resource.description}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            Visit resource &rarr;
          </a>
          <ResourceVoteButtons
            resourceId={resource.id}
            initialUpvoteCount={resource.upvoteCount}
            initialDownvoteCount={resource.downvoteCount}
            initialUserVote={resource.userVote}
          />
        </div>
      </div>
    </div>
  );
}
