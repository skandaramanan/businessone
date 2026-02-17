export const TEAMS = [
  "Projects",
  "Events",
  "Sponsorships",
  "Marketing",
  "Content Creation",
  "HR",
  "Strategy",
] as const;

export type Team = (typeof TEAMS)[number];

/** Distinct colours for team-member key (accessible contrast) */
export const MEMBER_COLOURS = [
  "#2563eb",
  "#dc2626",
  "#059669",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#be185d",
  "#65a30d",
  "#4f46e5",
  "#0d9488",
] as const;

export function getMemberColour(interviewerId: string, indexInTeam: number): string {
  const hash = interviewerId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const idx = (hash + indexInTeam) % MEMBER_COLOURS.length;
  return MEMBER_COLOURS[idx];
}
