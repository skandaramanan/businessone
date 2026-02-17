"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultInterviewers, type InterviewBooking } from "@/lib/scheduler";
import type { SchedulerContextValue, SchedulerState } from "@/lib/store/types";

const storageKey = "businessone.scheduler.v1";

const initialState: SchedulerState = {
  currentInterviewerId: defaultInterviewers[0].id,
  availabilityByInterviewer: {},
  bookings: [],
};

const SchedulerContext = createContext<SchedulerContextValue | null>(null);

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SchedulerState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(storageKey);
      if (rawState) {
        const parsed = JSON.parse(rawState) as SchedulerState;
        setState(parsed);
      }
    } catch {
      setState(initialState);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [isLoaded, state]);

  const value = useMemo<SchedulerContextValue>(() => {
    return {
      state,
      setCurrentInterviewer(interviewerId) {
        setState((current) => ({ ...current, currentInterviewerId: interviewerId }));
      },
      setInterviewerSlots(interviewerId, slots) {
        setState((current) => ({
          ...current,
          availabilityByInterviewer: {
            ...current.availabilityByInterviewer,
            [interviewerId]: slots,
          },
        }));
      },
      bookCandidateSlot(input) {
        const booking: InterviewBooking = {
          id: crypto.randomUUID(),
          candidateName: input.candidateName,
          candidateEmail: input.candidateEmail,
          interviewerAId: input.interviewerAId,
          interviewerBId: input.interviewerBId,
          slotKey: input.slotKey,
          createdAt: new Date().toISOString(),
        };

        setState((current) => ({
          ...current,
          bookings: [booking, ...current.bookings],
        }));
      },
    };
  }, [state]);

  return <SchedulerContext.Provider value={value}>{children}</SchedulerContext.Provider>;
}

export function useSchedulerStore(): SchedulerContextValue {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useSchedulerStore must be used inside SchedulerProvider.");
  }
  return context;
}
