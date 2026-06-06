"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_LABELS,
  type ResourceCategory,
  type ResourceInput,
} from "@/types/resource";
import { createResource, updateResource } from "@/lib/api";

interface ResourceFormProps {
  initialData?: ResourceInput;
  resourceId?: string;
}

export default function ResourceForm({
  initialData,
  resourceId,
}: ResourceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(resourceId);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [category, setCategory] = useState<ResourceCategory | "">(
    initialData?.category ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError("Please select a resource type.");
      return;
    }

    setSubmitting(true);

    const data: ResourceInput = { title, description, url, category };

    try {
      if (isEditing && resourceId) {
        await updateResource(resourceId, data);
        router.push(`/resources/${resourceId}`);
      } else {
        const resource = await createResource(data);
        router.push(`/resources/${resource.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="Resource title"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="Brief description of this resource"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="category"
          className="text-sm font-medium text-foreground"
        >
          Type <span className="text-red-600">*</span>
        </label>
        <select
          id="category"
          required
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value === "" ? "" : (e.target.value as ResourceCategory),
            )
          }
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="" disabled>
            Select a type
          </option>
          {RESOURCE_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {RESOURCE_CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="text-sm font-medium text-foreground">
          URL
        </label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 sm:w-auto"
        >
          {submitting
            ? "Saving..."
            : isEditing
              ? "Update Resource"
              : "Create Resource"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-background sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
