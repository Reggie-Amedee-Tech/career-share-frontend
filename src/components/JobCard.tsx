"use client";

import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
import { getJob } from "@/lib/api";
import type { Job } from "@/types/job";

const DESCRIPTION_PREVIEW_LENGTH = 200;

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<Job | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const description = (detail?.description ?? job.description)?.trim() ?? "";
  const descriptionHtml = (detail?.descriptionHtml ?? job.descriptionHtml)?.trim() ?? "";
  const canLoadDetail = !detail && !detailError;
  const canExpand =
    description.length > DESCRIPTION_PREVIEW_LENGTH ||
    Boolean(descriptionHtml) ||
    canLoadDetail;

  const sanitizedHtml = useMemo(() => {
    if (!descriptionHtml) {
      return "";
    }

    return DOMPurify.sanitize(descriptionHtml, {
      USE_PROFILES: { html: true },
    });
  }, [descriptionHtml]);

  const hasDescription = Boolean(description || sanitizedHtml || canLoadDetail);

  async function handleToggleExpanded() {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    if (
      !nextExpanded ||
      detail ||
      detailLoading ||
      descriptionHtml ||
      description.length > DESCRIPTION_PREVIEW_LENGTH
    ) {
      return;
    }

    setDetailLoading(true);
    setDetailError(null);

    try {
      const response = await getJob(job.boardToken, job.id);
      setDetail(response.job);
    } catch (error) {
      setDetailError(
        error instanceof Error ? error.message : "Failed to load job details",
      );
      setExpanded(false);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <a
            href={job.absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {job.title}
          </a>
          <p className="mt-1 text-sm font-medium text-foreground">
            {job.companyName}
          </p>
          <p className="mt-1 text-sm text-muted">{job.location}</p>

          {hasDescription ? (
            <div className="mt-3">
              {detailLoading ? (
                <p className="text-sm text-muted">Loading description…</p>
              ) : expanded && sanitizedHtml ? (
                <div
                  className="job-description rounded-lg border border-border bg-background p-4 sm:p-5"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              ) : description ? (
                <p
                  className={`text-sm leading-relaxed text-muted ${
                    !expanded && canExpand ? "line-clamp-3" : ""
                  }`}
                >
                  {description}
                </p>
              ) : null}
              {canExpand ? (
                <button
                  type="button"
                  onClick={() => void handleToggleExpanded()}
                  disabled={detailLoading}
                  className="mt-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover disabled:opacity-60"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              ) : null}
              {detailError ? (
                <p className="mt-2 text-sm text-red-600">{detailError}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <span className="shrink-0 text-xs text-muted">
          Updated{" "}
          {new Date(job.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
