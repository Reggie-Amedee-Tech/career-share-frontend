export interface ChartConfig {
  topSkillsLimit: number;
  topLocationsLimit: number;
}

export interface JourneyRole {
  id: string;
  label: string;
}

export interface ProfessionalJourney {
  id: string;
  name: string;
  targetJobRoleId: string;
  targetJobTitle: string;
  targetJobLocation: string;
  chartConfig: ChartConfig;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyInput {
  name: string;
  targetJobRoleId: string;
  targetJobLocation: string;
  chartConfig?: Partial<ChartConfig>;
}

export interface JourneyUpdateInput {
  name?: string;
  targetJobRoleId?: string;
  targetJobLocation?: string;
  chartConfig?: Partial<ChartConfig>;
}

export interface DiscoveryQuestionOption {
  id: string;
  label: string;
}

export interface DiscoveryQuestion {
  id: string;
  prompt: string;
  options: DiscoveryQuestionOption[];
}

export type DiscoveryAnswers = Record<string, string>;

export interface JourneyRoleRecommendation {
  roleId: string;
  label: string;
  score: number;
  reason: string;
}
