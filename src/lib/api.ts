import type {
  Resource,
  ResourceCategory,
  ResourceInput,
  ResourceUpdateInput,
} from "@/types/resource";
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
