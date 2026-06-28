"use client";

import { useState, type ReactNode, type SVGProps } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  useMapContext,
} from "react-simple-maps";
import type { JobLocationPoint, MapJob } from "@/types/insights";

const US_STATES_GEO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 450;

interface JobLocationMapProps {
  locations: JobLocationPoint[];
  role: string;
}

interface PlottedPoint {
  location: string;
  jobCount: number;
  latitude: number;
  longitude: number;
  radius: number;
  jobs: MapJob[];
}

interface SafeMapMarkerProps extends SVGProps<SVGGElement> {
  coordinates: [number, number];
  children: ReactNode;
}

function isLikelyUsCoordinate(longitude: number, latitude: number) {
  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude <= -50 &&
    longitude >= -172 &&
    latitude >= 18 &&
    latitude <= 72
  );
}

function SafeMapMarker({
  coordinates,
  children,
  ...props
}: SafeMapMarkerProps) {
  const { projection } = useMapContext();

  if (!projection) {
    return null;
  }

  const projected = projection(coordinates);

  if (
    !projected ||
    !Number.isFinite(projected[0]) ||
    !Number.isFinite(projected[1])
  ) {
    return null;
  }

  const [x, y] = projected;

  return (
    <g transform={`translate(${x}, ${y})`} {...props}>
      {children}
    </g>
  );
}

function bubbleRadius(jobCount: number, maxCount: number) {
  const minRadius = 8;
  const maxRadius = 22;
  if (maxCount <= 1) {
    return minRadius;
  }

  const ratio = Math.sqrt(jobCount / maxCount);
  return minRadius + ratio * (maxRadius - minRadius);
}

function computePlottedLocations(locations: JobLocationPoint[]) {
  const geocoded = locations.filter(
    (entry) =>
      entry.latitude !== null &&
      entry.longitude !== null &&
      Number.isFinite(entry.latitude) &&
      Number.isFinite(entry.longitude),
  );

  const plottable = geocoded.filter((entry) =>
    isLikelyUsCoordinate(
      entry.longitude as number,
      entry.latitude as number,
    ),
  );

  if (plottable.length === 0) {
    return {
      plotted: [] as PlottedPoint[],
      unmapped: locations,
      maxCount: 0,
    };
  }

  const maxJobCount = Math.max(...plottable.map((entry) => entry.jobCount), 1);
  const plotted = plottable.map((entry) => ({
    location: entry.location,
    jobCount: entry.jobCount,
    latitude: entry.latitude as number,
    longitude: entry.longitude as number,
    radius: bubbleRadius(entry.jobCount, maxJobCount),
    jobs: entry.jobs ?? [],
  }));

  const mappedNames = new Set(plottable.map((entry) => entry.location));

  return {
    plotted,
    unmapped: locations.filter((entry) => !mappedNames.has(entry.location)),
    maxCount: maxJobCount,
  };
}

function LocationJobList({
  location,
  jobs,
  onClose,
}: {
  location: string;
  jobs: MapJob[];
  onClose: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{location}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {jobs.length} open role{jobs.length === 1 ? "" : "s"} to apply to
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          Close
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          No individual postings are available for this area yet.
        </p>
      ) : (
        <ul className="mt-3 flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {jobs.map((job) => (
            <li key={`${job.boardToken}-${job.id}`}>
              <a
                href={job.absoluteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-medium text-accent">{job.title}</p>
                <p className="mt-0.5 text-xs text-foreground">{job.companyName}</p>
                {job.location !== location ? (
                  <p className="mt-0.5 text-xs text-muted">{job.location}</p>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function JobLocationMap({
  locations,
  role,
}: JobLocationMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const { plotted, unmapped, maxCount } = computePlottedLocations(locations);
  const locationByName = new Map(
    locations.map((entry) => [entry.location, entry]),
  );

  const selectedEntry = selectedLocation
    ? (locationByName.get(selectedLocation) ?? null)
    : null;
  const selectedPoint =
    plotted.find((point) => point.location === selectedLocation) ?? null;

  const totalMappedJobs = plotted.reduce(
    (sum, point) => sum + point.jobCount,
    0,
  );

  function selectLocation(location: string) {
    setSelectedLocation(location);
  }

  function clearSelection() {
    setSelectedLocation(null);
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Where these roles are hiring
        </h2>
        <p className="mt-1 text-sm text-muted">
          Open {role} postings plotted by city across the United States. Larger
          circles mean more matching roles in that area. Click a pin or hiring
          area to see the postings behind it.
          {plotted.length > 0
            ? ` ${totalMappedJobs.toLocaleString()} role${totalMappedJobs === 1 ? "" : "s"} mapped across ${plotted.length} location${plotted.length === 1 ? "" : "s"}.`
            : " We could not map these locations yet — see the list below."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.8fr)]">
        <div className="relative overflow-hidden rounded-xl border border-border bg-[#eef2ea]">
          <ComposableMap
            projection="geoAlbersUsa"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            className="h-auto w-full"
            aria-label="United States job locations map"
          >
            <Geographies geography={US_STATES_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={(geo as { rsmKey: string }).rsmKey}
                    geography={geo}
                    fill="#f8faf7"
                    stroke="#b8c7b2"
                    strokeWidth={0.75}
                  />
                ))
              }
            </Geographies>

            {plotted.map((point) => {
              const isHovered = hoveredLocation === point.location;
              const isSelected = selectedLocation === point.location;
              const isActive = isHovered || isSelected;

              return (
                <SafeMapMarker
                  key={point.location}
                  coordinates={[point.longitude, point.latitude]}
                  role="button"
                  tabIndex={0}
                  aria-label={`${point.location}, ${point.jobCount} open roles`}
                  aria-pressed={isSelected}
                  onMouseEnter={() => setHoveredLocation(point.location)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onFocus={() => setHoveredLocation(point.location)}
                  onBlur={() => setHoveredLocation(null)}
                  onClick={() => selectLocation(point.location)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectLocation(point.location);
                    }
                  }}
                  className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <circle
                    r={point.radius + (isActive ? 4 : 0)}
                    fill="#588157"
                    fillOpacity={isActive ? 0.22 : 0.12}
                  />
                  <circle
                    r={point.radius}
                    fill={isSelected ? "#3a5a40" : isHovered ? "#466d4a" : "#588157"}
                    fillOpacity={0.85}
                    stroke={isSelected ? "#344e41" : "#ffffff"}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    textAnchor="middle"
                    y={4}
                    fontSize={10}
                    fontWeight={600}
                    fill="#ffffff"
                    pointerEvents="none"
                  >
                    {point.jobCount}
                  </text>
                </SafeMapMarker>
              );
            })}
          </ComposableMap>

          {selectedPoint ? (
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-border bg-surface/95 px-3 py-2 text-sm shadow-sm backdrop-blur">
              <p className="font-medium text-foreground">
                {selectedPoint.location}
              </p>
              <p className="text-muted">
                {selectedPoint.jobCount} open role
                {selectedPoint.jobCount === 1 ? "" : "s"} · see postings on
                the right
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex max-h-[450px] flex-col gap-4 overflow-y-auto">
          {selectedEntry ? (
            <LocationJobList
              location={selectedEntry.location}
              jobs={selectedEntry.jobs ?? []}
              onClose={clearSelection}
            />
          ) : null}

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {selectedEntry ? "Other hiring areas" : "Top hiring areas"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {selectedEntry
                ? "Select another area to browse its postings."
                : "Select an area to browse matching postings."}
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {[...locations]
                .sort((left, right) => right.jobCount - left.jobCount)
                .slice(0, 8)
                .map((entry) => {
                  const width =
                    maxCount > 0
                      ? Math.max(12, (entry.jobCount / maxCount) * 100)
                      : 12;
                  const isSelected = selectedLocation === entry.location;

                  return (
                    <li key={entry.location}>
                      <button
                        type="button"
                        onClick={() => selectLocation(entry.location)}
                        className={`w-full rounded-lg px-1 py-1 text-left transition-colors hover:bg-background ${
                          isSelected ? "bg-background" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span
                            className={`truncate ${
                              isSelected
                                ? "font-medium text-foreground"
                                : "text-foreground"
                            }`}
                            title={entry.location}
                          >
                            {entry.location}
                          </span>
                          <span className="shrink-0 text-muted">
                            {entry.jobCount}
                          </span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-background">
                          <div
                            className={`h-2 rounded-full ${
                              isSelected ? "bg-primary" : "bg-primary/70"
                            }`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>

          {unmapped.length > 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-background px-3 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                Not shown on map
              </h3>
              <p className="mt-1 text-xs text-muted">
                Remote or broad regions are listed here instead of map pins.
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {unmapped.map((entry) => {
                  const isSelected = selectedLocation === entry.location;

                  return (
                    <li key={entry.location}>
                      <button
                        type="button"
                        onClick={() => selectLocation(entry.location)}
                        className={`w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-surface ${
                          isSelected ? "bg-surface font-medium" : ""
                        }`}
                      >
                        {entry.location} · {entry.jobCount} role
                        {entry.jobCount === 1 ? "" : "s"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
