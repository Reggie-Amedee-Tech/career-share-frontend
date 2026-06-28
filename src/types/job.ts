export interface Job {
  id: number;
  boardToken: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  descriptionHtml: string;
  absoluteUrl: string;
  updatedAt: string;
  firstPublished: string | null;
}

export interface JobFilters {
  search?: string;
  skills?: string;
  nearMe?: boolean;
  location?: string;
  radiusMiles?: number;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  totalBoardJobs: number;
  totalMatches: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    search: string;
    skills: string;
    nearMe: boolean;
    location: string;
    radiusMiles: number | null;
  };
}
