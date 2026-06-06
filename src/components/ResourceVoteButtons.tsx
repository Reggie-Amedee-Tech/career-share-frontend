"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateResource } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { ResourceVote } from "@/types/resource";

interface ResourceVoteButtonsProps {
  resourceId: string;
  initialUpvoteCount: number;
  initialDownvoteCount: number;
  initialUserVote: ResourceVote | null;
  compact?: boolean;
}

function voteButtonClass(active: boolean, compact: boolean) {
  if (compact) {
    return active
      ? "border-primary bg-primary/10 text-primary"
      : "border-transparent text-muted hover:border-border hover:bg-background hover:text-accent";
  }

  return active
    ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
    : "border-border text-muted hover:bg-background hover:text-accent";
}

export default function ResourceVoteButtons({
  resourceId,
  initialUpvoteCount,
  initialDownvoteCount,
  initialUserVote,
  compact = false,
}: ResourceVoteButtonsProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  const [downvoteCount, setDownvoteCount] = useState(initialDownvoteCount);
  const [userVote, setUserVote] = useState<ResourceVote | null>(initialUserVote);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVote(
    event: React.MouseEvent<HTMLButtonElement>,
    vote: ResourceVote,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const resource = await updateResource(resourceId, { vote });
      setUserVote(resource.userVote);
      setUpvoteCount(resource.upvoteCount);
      setDownvoteCount(resource.downvoteCount);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update vote");
    } finally {
      setSubmitting(false);
    }
  }

  const wrapperClass = compact
    ? "inline-flex items-center gap-1 text-sm"
    : "inline-flex items-center gap-2 rounded-full border border-border p-1 text-sm";

  if (loading) {
    return (
      <div className={`${wrapperClass} text-muted`}>
        <span className="inline-flex items-center gap-1 px-2 py-1">
          <span aria-hidden="true">▲</span>
          {upvoteCount}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1">
          <span aria-hidden="true">▼</span>
          {downvoteCount}
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={wrapperClass}>
        <Link
          href="/login"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-muted transition-colors hover:border-border hover:bg-background hover:text-accent"
          title="Log in to upvote this resource"
        >
          <span aria-hidden="true">▲</span>
          {upvoteCount}
        </Link>
        <Link
          href="/login"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-muted transition-colors hover:border-border hover:bg-background hover:text-accent"
          title="Log in to downvote this resource"
        >
          <span aria-hidden="true">▼</span>
          {downvoteCount}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className={wrapperClass}>
        <button
          type="button"
          onClick={(event) => handleVote(event, "up")}
          disabled={submitting}
          aria-pressed={userVote === "up"}
          aria-label="Upvote resource"
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-medium transition-colors disabled:opacity-50 ${voteButtonClass(userVote === "up", compact)}`}
        >
          <span aria-hidden="true">▲</span>
          {upvoteCount}
        </button>
        <button
          type="button"
          onClick={(event) => handleVote(event, "down")}
          disabled={submitting}
          aria-pressed={userVote === "down"}
          aria-label="Downvote resource"
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-medium transition-colors disabled:opacity-50 ${voteButtonClass(userVote === "down", compact)}`}
        >
          <span aria-hidden="true">▼</span>
          {downvoteCount}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
