export const RESOURCE_CATEGORIES = [
  "CAREER_DEVELOPMENT",
  "JOB_SEARCH",
  "RESOURCES",
  "JOB_MARKETING",
  "INTERNSHIPS",
  "OTHER",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  CAREER_DEVELOPMENT: "Career Development",
  JOB_SEARCH: "Job Search",
  RESOURCES: "Resources",
  JOB_MARKETING: "Job Marketing",
  INTERNSHIPS: "Internships",
  OTHER: "Other",
};

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  userId: string | null;
  category: ResourceCategory[];
  upvoteCount: number;
  downvoteCount: number;
  userVote: "up" | "down" | null;
}

export interface ResourceInput {
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;
}

export type ResourceVote = "up" | "down";

export interface ResourceUpdateInput {
  title?: string;
  description?: string;
  url?: string;
  category?: ResourceCategory;
  vote?: ResourceVote;
}
