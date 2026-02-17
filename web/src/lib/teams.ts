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
