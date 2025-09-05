// src/lib/api.ts

// ========== Types ==========
export type Profile = {
  hackathon: string;
  name: string;
  contact: string;
  roles: string[];
  skills: string[];
  interests: string[];
  availability: string;
  blurb?: string;
};

export type Candidate = {
  name: string;
  contact: string;
  roles: string[];
  skills: string[];
  interests: string[];
  availability: string;
  blurb?: string;
};

export type Match = {
  candidate: Candidate;
  score: number;            // 0–95 or 0–100 depending on backend
  explanation: string;
  ai_raw_response?: string | null;
};

// ========== API base ==========
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL is not set. In dev, add it to Frontend/.env. In prod, set it in Vercel Project → Settings → Environment Variables."
    );
  }
  return API_URL;
}

// ========== Backend calls ==========
/** Single entry-point used by the app */
export async function fetchMatches(profile: Profile): Promise<Match[]> {
  const base = requireApiUrl();
  const res = await fetch(`${base}/match_all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend error ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  // expect shape: { matches: Match[] }
  return (data?.matches ?? []) as Match[];
}

// Optional thin alias (kept for backward compatibility)
export const getMatches = fetchMatches;

// ========== Re-exports ==========
export {
  HACKATHONS,
  ROLES,
