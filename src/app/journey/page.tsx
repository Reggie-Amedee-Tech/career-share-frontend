"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import JourneyDiscoveryWizard, {
  type JourneyDiscoveryResult,
} from "@/components/JourneyDiscoveryWizard";
import JourneyForm from "@/components/JourneyForm";
import {
  JourneyInsightsShimmer,
  JourneySidebarShimmer,
} from "@/components/JourneyShimmer";
import SkillInsightsCharts from "@/components/SkillInsightsCharts";
import {
  createJourney,
  deleteJourney,
  getJourneyRoles,
  getJourneySkillInsights,
  getJourneys,
  updateJourney,
} from "@/lib/api";
import type { SkillInsightsResponse } from "@/types/insights";
import type { JourneyInput, JourneyRole, ProfessionalJourney } from "@/types/journey";

function JourneyContent() {
  const [journeys, setJourneys] = useState<ProfessionalJourney[]>([]);
  const [roles, setRoles] = useState<JourneyRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [discoveryPrefill, setDiscoveryPrefill] =
    useState<JourneyDiscoveryResult | null>(null);
  const [insights, setInsights] = useState<SkillInsightsResponse | null>(null);
  const [loadingJourneys, setLoadingJourneys] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedJourney =
    journeys.find((journey) => journey.id === selectedId) ?? null;

  const loadJourneys = useCallback(async () => {
    setLoadingJourneys(true);
    setError(null);

    try {
      const data = await getJourneys();
      setJourneys(data.journeys);
      setSelectedId((current) => {
        if (current && data.journeys.some((journey) => journey.id === current)) {
          return current;
        }
        return data.journeys[0]?.id ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load journeys");
    } finally {
      setLoadingJourneys(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getJourneyRoles()
      .then((data) => {
        if (!cancelled) {
          setRoles(data.roles);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load job roles");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingRoles(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadJourneys();
  }, [loadJourneys, refreshKey]);

  useEffect(() => {
    if (!selectedId) {
      setInsights(null);
      return;
    }

    let cancelled = false;
    setLoadingInsights(true);
    setError(null);

    getJourneySkillInsights(selectedId)
      .then((data) => {
        if (!cancelled) {
          setInsights(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load skill insights",
          );
          setInsights(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingInsights(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, refreshKey]);

  async function handleCreateJourney(data: JourneyInput) {
    const { journey } = await createJourney(data);
    setCreating(false);
    setDiscovering(false);
    setDiscoveryPrefill(null);
    setSelectedId(journey.id);
    setRefreshKey((current) => current + 1);
  }

  function handleDiscoveryComplete(result: JourneyDiscoveryResult) {
    setDiscoveryPrefill(result);
    setDiscovering(false);
    setCreating(true);
    setSelectedId(null);
  }

  async function handleUpdateJourney(data: JourneyInput) {
    if (!selectedJourney) {
      return;
    }

    await updateJourney(selectedJourney.id, data);
    setRefreshKey((current) => current + 1);
  }

  async function handleDeleteJourney() {
    if (!selectedJourney) {
      return;
    }

    if (!window.confirm(`Delete "${selectedJourney.name}"?`)) {
      return;
    }

    await deleteJourney(selectedJourney.id);
    setSelectedId(null);
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          My Professional Journey
        </h1>
        <p className="mt-1 text-muted">
          Save separate career paths — or use &quot;Help me choose&quot; to discover
          a role based on your interests.
        </p>
      </div>

      {error ? (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setCreating(true);
                setDiscovering(false);
                setDiscoveryPrefill(null);
                setSelectedId(null);
              }}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover lg:w-auto"
            >
              + New journey
            </button>
            <button
              type="button"
              onClick={() => {
                setDiscovering(true);
                setCreating(false);
                setDiscoveryPrefill(null);
                setSelectedId(null);
              }}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background lg:w-auto"
            >
              Help me choose
            </button>
          </div>

          {loadingJourneys ? (
            <JourneySidebarShimmer />
          ) : journeys.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted">
              No journeys yet. Create one to start tracking skill demand.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {journeys.map((journey) => {
                const isSelected = journey.id === selectedId && !creating && !discovering;
                return (
                  <li key={journey.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setCreating(false);
                        setDiscovering(false);
                        setDiscoveryPrefill(null);
                        setSelectedId(journey.id);
                      }}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-accent bg-background"
                          : "border-border bg-surface hover:bg-background"
                      }`}
                    >
                      <p className="truncate font-medium text-foreground">{journey.name}</p>
                      <p className="mt-1 truncate text-xs text-muted">
                        {journey.targetJobTitle} · {journey.targetJobLocation}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <div className="flex flex-col gap-6">
          {discovering ? (
            <JourneyDiscoveryWizard
              onComplete={handleDiscoveryComplete}
              onCancel={() => {
                setDiscovering(false);
                setSelectedId(journeys[0]?.id ?? null);
              }}
            />
          ) : creating ? (
            <JourneyForm
              roles={roles}
              rolesLoading={loadingRoles}
              prefill={
                discoveryPrefill
                  ? {
                      roleId: discoveryPrefill.roleId,
                      name: discoveryPrefill.suggestedName,
                      reason: discoveryPrefill.reason,
                    }
                  : undefined
              }
              onSubmit={handleCreateJourney}
              onCancel={() => {
                setCreating(false);
                setDiscoveryPrefill(null);
                setSelectedId(journeys[0]?.id ?? null);
              }}
              submitLabel="Create journey"
            />
          ) : selectedJourney ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedJourney.name}
                  </h2>
                  <p className="text-sm text-muted">
                    Tracking {selectedJourney.targetJobTitle} in{" "}
                    {selectedJourney.targetJobLocation}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteJourney}
                  className="w-full shrink-0 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 sm:w-auto"
                >
                  Delete journey
                </button>
              </div>

              <JourneyForm
                key={selectedJourney.id}
                journey={selectedJourney}
                roles={roles}
                rolesLoading={loadingRoles}
                onSubmit={handleUpdateJourney}
                submitLabel="Save changes"
              />

              {loadingInsights ? (
                <JourneyInsightsShimmer />
              ) : null}

              {!loadingInsights && insights ? (
                <SkillInsightsCharts insights={insights} />
              ) : null}

              {selectedJourney ? (
                <p className="text-center text-sm text-muted">
                  Ready to browse matching roles?{" "}
                  <Link
                    href={`/jobs?q=${encodeURIComponent(selectedJourney.targetJobTitle)}&location=${encodeURIComponent(selectedJourney.targetJobLocation)}`}
                    className="text-accent underline underline-offset-4 hover:text-accent-hover"
                  >
                    Search jobs
                  </Link>
                </p>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="text-muted">
                Select a journey from the sidebar or create a new one to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <RequireAuth>
      <JourneyContent />
    </RequireAuth>
  );
}
