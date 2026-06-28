"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import JobLocationMap from "@/components/JobLocationMap";
import SkillHeatmapChart from "@/components/SkillHeatmapChart";
import type { SkillInsightsResponse } from "@/types/insights";

const CHART_COLORS = [
  "#588157",
  "#3a5a40",
  "#a3b18a",
  "#344e41",
  "#6b8f71",
];

interface SkillInsightsChartsProps {
  insights: SkillInsightsResponse;
}

function formatSkillLabel(skill: string) {
  return skill.length > 18 ? `${skill.slice(0, 16)}…` : skill;
}

function formatLocationLabel(location: string) {
  return location.length > 16 ? `${location.slice(0, 14)}…` : location;
}

function InsightsSummary({ insights }: { insights: SkillInsightsResponse }) {
  const topSkill = insights.topSkills[0] ?? null;
  const topLocation = [...insights.skillsByLocation].sort(
    (left, right) => right.jobCount - left.jobCount,
  )[0];
  const mappedLocations = insights.jobLocations.filter(
    (entry) => entry.latitude !== null && entry.longitude !== null,
  ).length;

  const locationDetail = insights.locationExpanded
    ? `${insights.focusLocationMatches.toLocaleString()} in ${insights.focusLocation} · expanded nationwide to ${insights.totalJobsAnalyzed.toLocaleString()} roles`
    : insights.focusLocationMatches < insights.totalJobsAnalyzed
      ? `${insights.totalJobsAnalyzed.toLocaleString()} roles · ${insights.focusLocationMatches.toLocaleString()} in ${insights.focusLocation}`
      : `In ${insights.focusLocation}`;

  const matchDetail = insights.matchScopeExpanded
    ? `${insights.descriptionMatches.toLocaleString()} matched via job descriptions`
    : `${insights.totalTitleMatches.toLocaleString()} title matches`;

  const cards = [
    {
      label: "Roles analyzed",
      value: insights.totalJobsAnalyzed.toLocaleString(),
      detail:
        insights.relatedTitleMatches > 0 || insights.descriptionMatches > 0
          ? `${insights.exactTitleMatches} exact + ${insights.relatedTitleMatches} related · ${matchDetail} · ${locationDetail}`
          : `${matchDetail} · ${locationDetail}`,
    },
    {
      label: "Top skill",
      value: topSkill?.skill ?? "—",
      detail: topSkill
        ? `Mentioned in ${topSkill.count} role${topSkill.count === 1 ? "" : "s"} (${topSkill.percentage}%)`
        : "No skills detected yet",
    },
    {
      label: "Hottest market",
      value: topLocation?.location ?? "—",
      detail: topLocation
        ? `${topLocation.jobCount} matching role${topLocation.jobCount === 1 ? "" : "s"}`
        : "No location breakdown yet",
    },
    {
      label: "Mapped cities",
      value: mappedLocations.toLocaleString(),
      detail: `${insights.skillsByLocation.length} hiring area${insights.skillsByLocation.length === 1 ? "" : "s"} tracked`,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-xl border border-border bg-surface px-4 py-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {card.label}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">{card.value}</p>
          <p className="mt-1 text-sm text-muted">{card.detail}</p>
        </article>
      ))}
    </section>
  );
}

function OverallSkillsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { skill: string; count: number; percentage: number } }>;
}) {
  if (!active || !payload?.[0]) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-foreground">{data.skill}</p>
      <p className="text-muted">
        {data.count} posting{data.count === 1 ? "" : "s"} · {data.percentage}% of analyzed
        roles
      </p>
    </div>
  );
}

function LocationSkillsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
    payload: { location: string; jobCount: number };
  }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const location = payload[0]?.payload?.location ?? label ?? "";
  const jobCount = payload[0]?.payload?.jobCount ?? 0;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-foreground">{location}</p>
      <p className="mb-2 text-muted">
        {jobCount} open role{jobCount === 1 ? "" : "s"} in this market
      </p>
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-foreground">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="text-muted">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SkillInsightsCharts({ insights }: SkillInsightsChartsProps) {
  const [yAxisWidth, setYAxisWidth] = useState(110);

  useEffect(() => {
    function updateYAxisWidth() {
      setYAxisWidth(window.innerWidth < 640 ? 72 : 110);
    }

    updateYAxisWidth();
    window.addEventListener("resize", updateYAxisWidth);
    return () => window.removeEventListener("resize", updateYAxisWidth);
  }, []);

  const overallData = insights.topSkills.map((entry) => ({
    skill: entry.skill,
    label: formatSkillLabel(entry.skill),
    count: entry.count,
    percentage: entry.percentage,
  }));

  const topSkillsForComparison = insights.topSkills.slice(0, 5).map((entry) => entry.skill);
  const locationData = insights.skillsByLocation.map((entry) => {
    const row: Record<string, string | number> = {
      location: entry.location,
      label: formatLocationLabel(entry.location),
      jobCount: entry.jobCount,
    };

    for (const skill of topSkillsForComparison) {
      const match = entry.skills.find((item) => item.skill === skill);
      row[skill] = match?.count ?? 0;
    }

    return row;
  });

  if (insights.totalJobsAnalyzed === 0) {
    const noRoleMatches = insights.totalRoleMatches === 0;

    return (
      <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-muted">
          {noRoleMatches
            ? "No open roles matched your target job title yet."
            : `No open roles matched your target job title in ${insights.focusLocation}.`}
        </p>
        <p className="mt-2 text-sm text-muted">
          {noRoleMatches
            ? "Try a different curated role from the dropdown, then save your preferences again."
            : `${insights.totalRoleMatches.toLocaleString()} matching role${insights.totalRoleMatches === 1 ? "" : "s"} exist in other markets. Try a broader location such as a state, region, or remote.`}
        </p>
      </div>
    );
  }

  const analysisScopeLabel = insights.locationExpanded
    ? "nationwide tracked job boards"
    : insights.focusLocation;

  return (
    <div className="flex flex-col gap-8">
      {(insights.locationExpanded || insights.matchScopeExpanded) && (
        <p className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted">
          {insights.locationExpanded && insights.matchScopeExpanded
            ? `Only ${insights.focusLocationMatches.toLocaleString()} role${insights.focusLocationMatches === 1 ? "" : "s"} matched in ${insights.focusLocation}, so we expanded to nationwide title and description matches to analyze ${insights.totalJobsAnalyzed.toLocaleString()} roles.`
            : insights.locationExpanded
              ? `Only ${insights.focusLocationMatches.toLocaleString()} role${insights.focusLocationMatches === 1 ? "" : "s"} matched in ${insights.focusLocation}, so we expanded to nationwide title matches to analyze ${insights.totalJobsAnalyzed.toLocaleString()} roles.`
              : `We also included ${insights.descriptionMatches.toLocaleString()} role${insights.descriptionMatches === 1 ? "" : "s"} matched through job descriptions to reach ${insights.totalJobsAnalyzed.toLocaleString()} analyzed postings.`}
        </p>
      )}
      <InsightsSummary insights={insights} />

      <JobLocationMap locations={insights.jobLocations} role={insights.role} />

      <SkillHeatmapChart heatmap={insights.skillHeatmap} role={insights.role} />

      <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Most in-demand skills
          </h2>
          <p className="mt-1 text-sm text-muted">
            {insights.name} · Skills mentioned most often across{" "}
            {insights.totalJobsAnalyzed.toLocaleString()} open {insights.role} and
            related role{insights.totalJobsAnalyzed === 1 ? "" : "s"} across{" "}
            {analysisScopeLabel} from tracked job boards (
            {insights.totalBoardJobs.toLocaleString()} total postings
            {insights.totalRoleMatches > insights.totalJobsAnalyzed
              ? ` · ${insights.totalRoleMatches.toLocaleString()} total role matches available`
              : ""}
            ).
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="h-80 min-w-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overallData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dad7cd" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "#344e41", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={yAxisWidth}
                  tick={{ fill: "#344e41", fontSize: 11 }}
                />
              <Tooltip content={<OverallSkillsTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {overallData.map((entry, index) => (
                  <Cell
                    key={entry.skill}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {overallData.slice(0, 6).map((entry) => (
            <li
              key={entry.skill}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <span className="font-medium text-foreground">{entry.skill}</span>
              <span className="text-muted">
                {" "}
                · {entry.count} mention{entry.count === 1 ? "" : "s"} ({entry.percentage}
                %)
              </span>
            </li>
          ))}
        </ul>
      </section>

      {locationData.length > 0 ? (
        <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Skill mix by hiring market
            </h2>
            <p className="mt-1 text-sm text-muted">
              Compare how often the top skills show up in each active hiring location.
              Taller bars mean more postings in that city mention the skill.
            </p>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="h-96 min-w-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#dad7cd" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#344e41", fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: "#344e41", fontSize: 11 }} />
                  <Tooltip content={<LocationSkillsTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, lineHeight: "16px" }} />
                {topSkillsForComparison.map((skill, index) => (
                  <Bar
                    key={skill}
                    dataKey={skill}
                    name={skill}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
