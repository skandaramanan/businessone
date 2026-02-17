import type { InterviewBooking } from "@/lib/scheduler";

export type SchedulerState = {
  currentInterviewerId: string;
  availabilityByInterviewer: Record<string, string[]>;
  bookings: InterviewBooking[];
};

export type SchedulerContextValue = {
  state: SchedulerState;
  setCurrentInterviewer: (interviewerId: string) => void;
  setInterviewerSlots: (interviewerId: string, slots: string[]) => void;
  bookCandidateSlot: (input: {
    candidateName: string;
    candidateEmail: string;
    interviewerAId: string;
    interviewerBId: string;
    slotKey: string;
  }) => void;
};
