export interface SkillInsight {
  skill: string;
  count: number;
  percentage: number;
}

export interface LocationSkillInsight {
  location: string;
  jobCount: number;
  skills: SkillInsight[];
}

export interface SkillHeatmapCell {
  location: string;
  count: number;
  percentage: number;
}

export interface SkillHeatmapRow {
  skill: string;
  values: SkillHeatmapCell[];
}

export interface SkillHeatmap {
  skills: string[];
  locations: string[];
  rows: SkillHeatmapRow[];
}

export interface MapJob {
  id: number;
  boardToken: string;
  title: string;
  companyName: string;
  location: string;
  absoluteUrl: string;
  updatedAt: string;
}

export interface JobLocationPoint {
  location: string;
  jobCount: number;
  latitude: number | null;
  longitude: number | null;
  jobs: MapJob[];
}

export interface SkillInsightsResponse {
  journeyId: string;
  name: string;
  role: string;
  focusLocation: string;
  chartConfig: {
    topSkillsLimit: number;
    topLocationsLimit: number;
  };
  totalBoardJobs: number;
  exactTitleMatches: number;
  relatedTitleMatches: number;
  totalTitleMatches: number;
  totalRoleMatches: number;
  totalLocationMatches: number;
  focusLocationMatches: number;
  descriptionMatches: number;
  analysisTarget: number;
  locationScope: "focus" | "nationwide";
  matchScope: "title" | "title-and-description";
  locationExpanded: boolean;
  matchScopeExpanded: boolean;
  totalJobsAnalyzed: number;
  topSkills: SkillInsight[];
  skillsByLocation: LocationSkillInsight[];
  skillHeatmap: SkillHeatmap;
  jobLocations: JobLocationPoint[];
}
