"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type LocationFilter = "all" | "near_me" | "custom";

const RADIUS_OPTIONS = [10, 25, 50, 100, 250] as const;
const DEFAULT_RADIUS_MILES = 50;

function parseLocationFilter(
  nearMe: string | null,
  location: string | null,
): LocationFilter {
  if (nearMe === "true") {
    return "near_me";
  }
  if (location) {
    return "custom";
  }
  return "all";
}

function parseRadiusMiles(value: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_RADIUS_MILES;
  }

  return RADIUS_OPTIONS.includes(parsed as (typeof RADIUS_OPTIONS)[number])
    ? parsed
    : DEFAULT_RADIUS_MILES;
}

export default function JobSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [skills, setSkills] = useState(searchParams.get("skills") ?? "");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(
    parseLocationFilter(
      searchParams.get("nearMe"),
      searchParams.get("location"),
    ),
  );
  const [customLocation, setCustomLocation] = useState(
    searchParams.get("location") ?? "",
  );
  const [radiusMiles, setRadiusMiles] = useState(
    parseRadiusMiles(searchParams.get("radiusMiles")),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    const trimmedSearch = search.trim();
    const trimmedSkills = skills.trim();

    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }

    if (trimmedSkills) {
      params.set("skills", trimmedSkills);
    }

    if (locationFilter === "near_me") {
      params.set("nearMe", "true");
      params.set("radiusMiles", String(radiusMiles));
    } else if (locationFilter === "custom") {
      const trimmedLocation = customLocation.trim();
      if (trimmedLocation) {
        params.set("location", trimmedLocation);
      }
    }

    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ""}`);
  }

  function handleLocationFilterChange(value: LocationFilter) {
    setLocationFilter(value);
    if (value !== "custom") {
      setCustomLocation("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="job-search" className="text-sm font-medium text-foreground">
            Keywords
          </label>
          <input
            id="job-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. software engineer, designer, remote"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="job-skills" className="text-sm font-medium text-foreground">
            Skills
          </label>
          <input
            id="job-skills"
            type="search"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Python, React, SQL"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="job-location-filter"
            className="text-sm font-medium text-foreground"
          >
            Location
          </label>
          <select
            id="job-location-filter"
            value={locationFilter}
            onChange={(e) =>
              handleLocationFilterChange(e.target.value as LocationFilter)
            }
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="all">All locations</option>
            <option value="near_me">On-site jobs near me</option>
            <option value="custom">Custom location</option>
          </select>
        </div>

        {locationFilter === "near_me" ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="job-radius-miles"
              className="text-sm font-medium text-foreground"
            >
              Within
            </label>
            <select
              id="job-radius-miles"
              value={radiusMiles}
              onChange={(e) => setRadiusMiles(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            >
              {RADIUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} miles
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {locationFilter === "custom" ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="job-custom-location"
              className="text-sm font-medium text-foreground"
            >
              City, state, or region
            </label>
            <input
              id="job-custom-location"
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="e.g. Chicago, Austin, remote"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:w-auto"
        >
          Search jobs
        </button>
      </div>
    </form>
  );
}
