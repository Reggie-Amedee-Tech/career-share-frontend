"use client";

import type { SkillHeatmap } from "@/types/insights";

const HEAT_COLORS = [
  "#f0f4ef",
  "#dad7cd",
  "#a3b18a",
  "#6b8f71",
  "#588157",
  "#3a5a40",
  "#344e41",
];

interface SkillHeatmapChartProps {
  heatmap: SkillHeatmap;
  role: string;
}

function heatColor(percentage: number, maxPercentage: number) {
  if (percentage <= 0 || maxPercentage <= 0) {
    return HEAT_COLORS[0];
  }

  const ratio = percentage / maxPercentage;
  const index = Math.min(
    HEAT_COLORS.length - 1,
    Math.max(1, Math.round(ratio * (HEAT_COLORS.length - 1))),
  );
  return HEAT_COLORS[index];
}

function formatLocationLabel(location: string) {
  return location.length > 14 ? `${location.slice(0, 12)}…` : location;
}

export default function SkillHeatmapChart({ heatmap, role }: SkillHeatmapChartProps) {
  if (heatmap.rows.length === 0 || heatmap.locations.length === 0) {
    return null;
  }

  const maxPercentage = Math.max(
    ...heatmap.rows.flatMap((row) => row.values.map((cell) => cell.percentage)),
    1,
  );

  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Skill demand heatmap
        </h2>
        <p className="mt-1 text-sm text-muted">
          How often each skill appears in job postings across hiring hotspots for{" "}
          {role}. Darker cells mean a higher share of roles in that city mention the
          skill.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="min-w-[480px] w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-surface px-2 py-2 text-left font-medium text-foreground">
                Skill
              </th>
              {heatmap.locations.map((location) => (
                <th
                  key={location}
                  className="px-2 py-2 text-center font-medium text-foreground"
                  title={location}
                >
                  {formatLocationLabel(location)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.rows.map((row) => (
              <tr key={row.skill}>
                <th
                  className="sticky left-0 z-10 max-w-[120px] truncate bg-surface px-2 py-2 text-left font-medium text-foreground sm:max-w-none"
                  title={row.skill}
                >
                  {row.skill}
                </th>
                {row.values.map((cell) => (
                  <td key={`${row.skill}-${cell.location}`} className="p-0">
                    <div
                      className="flex min-h-12 min-w-16 flex-col items-center justify-center rounded-md px-2 py-2 text-center transition-transform hover:scale-[1.02]"
                      style={{
                        backgroundColor: heatColor(cell.percentage, maxPercentage),
                        color:
                          cell.percentage / maxPercentage > 0.55
                            ? "#ffffff"
                            : "#344e41",
                      }}
                      title={`${row.skill} in ${cell.location}: ${cell.count} posting${cell.count === 1 ? "" : "s"} (${cell.percentage}% of roles)`}
                    >
                      <span className="text-xs font-semibold">{cell.percentage}%</span>
                      <span className="text-[10px] opacity-80">
                        {cell.count} role{cell.count === 1 ? "" : "s"}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>Lower demand</span>
        {HEAT_COLORS.slice(1).map((color) => (
          <span
            key={color}
            className="h-3 w-8 rounded-sm border border-border"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>Higher demand</span>
      </div>
    </section>
  );
}
