"use client";

import { useState } from "react";
import {
  resolveInitialStateValue,
  US_STATES,
} from "@/lib/usStates";
import type {
  ChartConfig,
  JourneyInput,
  JourneyRole,
  ProfessionalJourney,
} from "@/types/journey";

interface JourneyFormProps {
  journey?: ProfessionalJourney | null;
  roles: JourneyRole[];
  rolesLoading?: boolean;
  prefill?: {
    roleId?: string;
    name?: string;
    reason?: string;
  };
  onSubmit: (data: JourneyInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const CHART_LIMIT_OPTIONS = [5, 8, 10, 12, 15] as const;

function resolveTargetJobRoleId(
  selected: string,
  availableRoles: JourneyRole[],
  preferredRoleId?: string,
): string {
  if (availableRoles.length === 0) {
    return selected;
  }
  if (selected && availableRoles.some((role) => role.id === selected)) {
    return selected;
  }
  if (
    preferredRoleId &&
    availableRoles.some((role) => role.id === preferredRoleId)
  ) {
    return preferredRoleId;
  }
  return availableRoles[0]?.id ?? "";
}

export default function JourneyForm({
  journey,
  roles,
  rolesLoading = false,
  prefill,
  onSubmit,
  onCancel,
  submitLabel,
}: JourneyFormProps) {
  const [name, setName] = useState(journey?.name ?? prefill?.name ?? "");
  const [selectedRoleId, setSelectedRoleId] = useState(
    journey?.targetJobRoleId ?? prefill?.roleId ?? "",
  );
  const targetJobRoleId = resolveTargetJobRoleId(
    selectedRoleId,
    roles,
    journey?.targetJobRoleId ?? prefill?.roleId,
  );
  const [targetJobLocation, setTargetJobLocation] = useState(
    resolveInitialStateValue(journey?.targetJobLocation ?? ""),
  );
  const [topSkillsLimit, setTopSkillsLimit] = useState(
    journey?.chartConfig.topSkillsLimit ?? 10,
  );
  const [topLocationsLimit, setTopLocationsLimit] = useState(
    journey?.chartConfig.topLocationsLimit ?? 6,
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        targetJobRoleId,
        targetJobLocation: targetJobLocation.trim(),
        chartConfig: {
          topSkillsLimit,
          topLocationsLimit,
        } satisfies ChartConfig,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save journey");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {journey ? "Edit journey" : "Create a journey"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Give your journey a name, then choose a target market so we can match
          jobs and generate skill insights for that role and location.
        </p>
        <div
          className="mt-3 rounded-lg border border-accent/30 bg-background px-3 py-3 sm:px-4"
          role="note"
        >
          <p className="text-sm font-medium text-foreground">
            Target market required
          </p>
          <p className="mt-1 text-sm text-muted">
            Every journey needs a job title and state. We use that market to
            find relevant postings and build your skill demand charts — you
            cannot save without both.
          </p>
        </div>
        {prefill?.reason ? (
          <p className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted">
            {prefill.reason}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="journey-name"
            className="text-sm font-medium text-foreground"
          >
            Journey name
          </label>
          <input
            id="journey-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="e.g. NYC Data Analyst path"
          />
        </div>

        <fieldset className="flex flex-col gap-4 rounded-xl border border-accent/40 bg-background/60 p-4">
          <legend className="px-1 text-sm font-semibold text-foreground">
            Target market
            <span className="ml-1.5 font-normal text-muted">(required)</span>
          </legend>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="journey-title"
              className="text-sm font-medium text-foreground"
            >
              Job title
              <span className="text-accent" aria-hidden="true">
                {" "}
                *
              </span>
            </label>
            <p className="text-xs text-muted">
              The role you are targeting — used to match postings and skill
              trends.
            </p>
            <select
              id="journey-title"
              required
              value={targetJobRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              disabled={rolesLoading || roles.length === 0}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
            >
              {rolesLoading ? (
                <option value="">Loading roles...</option>
              ) : roles.length === 0 ? (
                <option value="">No roles available</option>
              ) : (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="journey-location"
              className="text-sm font-medium text-foreground"
            >
              State / focus market
              <span className="text-accent" aria-hidden="true">
                {" "}
                *
              </span>
            </label>
            <p className="text-xs text-muted">
              Where you want to work — insights and charts are scoped to this
              market only.
            </p>
            <select
              id="journey-location"
              required
              value={targetJobLocation}
              onChange={(e) => setTargetJobLocation(e.target.value)}
              className={`rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent ${
                targetJobLocation ? "border-border" : "border-accent/60"
              }`}
            >
              <option value="" disabled>
                Select a state — required
              </option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {!targetJobLocation ? (
              <p className="text-xs font-medium text-accent">
                Choose a state to unlock skill insights for this journey.
              </p>
            ) : null}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="top-skills-limit"
              className="text-sm font-medium text-foreground"
            >
              Skills shown in charts
            </label>
            <select
              id="top-skills-limit"
              value={topSkillsLimit}
              onChange={(e) => setTopSkillsLimit(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            >
              {CHART_LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Top {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="top-locations-limit"
              className="text-sm font-medium text-foreground"
            >
              Locations shown in charts
            </label>
            <select
              id="top-locations-limit"
              value={topLocationsLimit}
              onChange={(e) => setTopLocationsLimit(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            >
              {CHART_LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Top {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="submit"
            disabled={submitting || rolesLoading || !targetJobRoleId || !targetJobLocation}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 sm:w-auto"
          >
            {submitting
              ? "Saving..."
              : (submitLabel ?? (journey ? "Save journey" : "Create journey"))}
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background sm:w-auto"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
