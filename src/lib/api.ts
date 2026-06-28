import type {
  Resource,
  ResourceCategory,
  ResourceInput,
  ResourceUpdateInput,
} from "@/types/resource";
import type { Job, JobFilters, JobsResponse } from "@/types/job";
import type { SkillInsightsResponse } from "@/types/insights";
import type {
  DiscoveryAnswers,
  DiscoveryQuestion,
  JourneyInput,
  JourneyRole,
  JourneyRoleRecommendation,
  JourneyUpdateInput,
  ProfessionalJourney,
} from "@/types/journey";
import type { LoginInput, SignupInput, User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.message || body.error || `Request failed with status ${res.status}`,
    );
  }

  return res.json();
}

export interface ResourceFilters {
  category?: ResourceCategory;
}

export function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  const params = new URLSearchParams();
  if (filters?.category) {
    params.set("category", filters.category);
  }
  const query = params.toString();
  return request<Resource[]>(`/resources${query ? `?${query}` : ""}`);
}

export function getResource(id: string): Promise<Resource | null> {
  return request<Resource | null>(`/resources/${id}`);
}

export function createResource(data: ResourceInput): Promise<Resource> {
  return request<Resource>("/resources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateResource(
  id: string,
  data: ResourceUpdateInput,
): Promise<Resource> {
  return request<Resource>(`/resources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteResource(id: string): Promise<Resource> {
  return request<Resource>(`/resources/${id}`, { method: "DELETE" });
}

export function getJob(
  boardToken: string,
  jobId: number,
): Promise<{ job: Job }> {
  return request<{ job: Job }>(`/api/jobs/${boardToken}/${jobId}`);
}

export function getJobs(filters?: JobFilters): Promise<JobsResponse> {
  const params = new URLSearchParams();
  if (filters?.search) {
    params.set("q", filters.search);
  }
  if (filters?.skills) {
    params.set("skills", filters.skills);
  }
  if (filters?.nearMe) {
    params.set("nearMe", "true");
  }
  if (filters?.nearMe && filters.radiusMiles) {
    params.set("radiusMiles", String(filters.radiusMiles));
  }
  if (filters?.location) {
    params.set("location", filters.location);
  }
  if (filters?.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  if (filters?.limit) {
    params.set("limit", String(filters.limit));
  }
  const query = params.toString();
  return request<JobsResponse>(`/api/jobs${query ? `?${query}` : ""}`);
}

export function getJourneyRoles(): Promise<{ roles: JourneyRole[] }> {
  return request<{ roles: JourneyRole[] }>("/api/journey-roles");
}

export function getJourneyDiscoveryQuestions(): Promise<{
  questions: DiscoveryQuestion[];
}> {
  return request<{ questions: DiscoveryQuestion[] }>(
    "/api/journey-discovery/questions",
  );
}

export function recommendJourneyRoles(
  answers: DiscoveryAnswers,
): Promise<{ recommendations: JourneyRoleRecommendation[] }> {
  return request<{ recommendations: JourneyRoleRecommendation[] }>(
    "/api/journey-discovery/recommend",
    {
      method: "POST",
      body: JSON.stringify({ answers }),
    },
  );
}

export function getJourneys(): Promise<{ journeys: ProfessionalJourney[] }> {
  return request<{ journeys: ProfessionalJourney[] }>("/api/journeys");
}

export function createJourney(
  data: JourneyInput,
): Promise<{ journey: ProfessionalJourney }> {
  return request<{ journey: ProfessionalJourney }>("/api/journeys", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateJourney(
  id: string,
  data: JourneyUpdateInput,
): Promise<{ journey: ProfessionalJourney }> {
  return request<{ journey: ProfessionalJourney }>(`/api/journeys/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteJourney(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/journeys/${id}`, {
    method: "DELETE",
  });
}

export function getJourneySkillInsights(
  journeyId: string,
): Promise<SkillInsightsResponse> {
  return request<SkillInsightsResponse>(
    `/api/journeys/${journeyId}/skill-insights`,
  );
}

export function signup(data: SignupInput): Promise<{ user: User }> {
  return request<{ user: User }>("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: LoginInput): Promise<{ user: User }> {
  return request<{ user: User }>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(): Promise<{ message: string }> {
  return request<{ message: string }>("/logout", { method: "POST" });
}

export async function getProfile(): Promise<User | null> {
  try {
    const data = await request<{ user: User }>("/profile");
    return data.user;
  } catch {
    return null;
  }
}
