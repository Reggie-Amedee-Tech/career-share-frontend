"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_LABELS,
  type ResourceCategory,
} from "@/types/resource";

export default function ResourceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    const query = params.toString();
    router.push(`/resources${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label
        htmlFor="resource-category-filter"
        className="text-sm font-medium text-foreground"
      >
        Filter by type
      </label>
      <select
        id="resource-category-filter"
        value={
          RESOURCE_CATEGORIES.includes(currentCategory as ResourceCategory)
            ? currentCategory
            : ""
        }
        onChange={handleChange}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent sm:min-w-52 sm:w-auto"
      >
        <option value="">All types</option>
        {RESOURCE_CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {RESOURCE_CATEGORY_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  );
}
