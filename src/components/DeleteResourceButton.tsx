"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteResource } from "@/lib/api";

interface DeleteResourceButtonProps {
  resourceId: string;
  resourceTitle: string;
}

export default function DeleteResourceButton({
  resourceId,
  resourceTitle,
}: DeleteResourceButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      await deleteResource(resourceId);
      router.push("/resources");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">
          Delete &ldquo;{resourceTitle}&rdquo;? This cannot be undone.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
    >
      Delete
    </button>
  );
}
