import type { Interviewer } from "@/lib/supabase/scheduler";
import type { Team } from "@/lib/teams";

export type InterviewBooking = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  interviewerAId: string;
  interviewerBId: string;
  slotKey: string;
  createdAt: string;
  firstPreference?: string | null;
  secondPreference?: string | null;
  team?: Team | null;
};

export type SchedulerState = {
  interviewers: Interviewer[];
  interviewersByTeam: Record<Team, Interviewer[]>;
  interviewerTeamMemberships: Record<string, Team[]>;
  interviewCountByInterviewer: Record<string, number>;
  currentInterviewerId: string;
  availabilityByInterviewer: Record<string, string[]>;
  bookings: InterviewBooking[];
  isLoading: boolean;
  error: string | null;
  availabilitySaveStatus: "idle" | "saving" | "saved";
};

export type SchedulerContextValue = {
  state: SchedulerState;
  setCurrentInterviewer: (interviewerId: string) => void;
  setInterviewerSlots: (interviewerId: string, slots: string[]) => void;
  saveAvailability: (interviewerId: string) => Promise<void>;
  bookCandidateSlot: (input: {
    candidateName: string;
    candidateEmail: string;
    interviewerAId: string;
    interviewerBId: string;
    slotKey: string;
    firstPreference?: string | null;
    secondPreference?: string | null;
    team?: Team | null;
  }) => void;
  refetch: () => Promise<void>;
  clearError: () => void;
};
