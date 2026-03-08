import type { Profile, ProfileInput } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "self-introduction-token";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(data?.message ?? "リクエストに失敗しました");
  }

  return response.json() as Promise<T>;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function fetchPublicProfile() {
  return request<Profile>("/api/profile");
}

export function login(loginId: string, password: string) {
  return request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password })
  });
}

export function fetchEditableProfile() {
  return request<Profile>("/api/admin/profile", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
}

export function updateEditableProfile(payload: ProfileInput) {
  return request<Profile>("/api/admin/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload)
  });
}
