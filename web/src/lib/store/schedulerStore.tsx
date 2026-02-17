"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createBooking,
  getAllAvailability,
  getBookings,
  getInterviewers,
  setInterviewerSlots as persistInterviewerSlots,
  type SchedulerBooking,
} from "@/lib/supabase/scheduler";
import type {
  InterviewBooking,
  SchedulerContextValue,
  SchedulerState,
} from "@/lib/store/types";

const storageKey = "businessone.scheduler.v1";
const currentInterviewerKey = "businessone.scheduler.currentInterviewer";

function mapToInterviewBooking(b: SchedulerBooking): InterviewBooking {
  return {
    id: b.id,
    candidateName: b.candidate_name,
    candidateEmail: b.candidate_email,
    interviewerAId: b.interviewer_a_id,
    interviewerBId: b.interviewer_b_id,
    slotKey: b.slot_key,
    createdAt: b.created_at,
    firstPreference: b.first_preference ?? null,
    secondPreference: b.second_preference ?? null,
  };
}

async function migrateFromLocalStorage(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as {
      availabilityByInterviewer?: Record<string, string[]>;
      bookings?: Array<{
        candidateName: string;
        candidateEmail: string;
        interviewerAId: string;
        interviewerBId: string;
        slotKey: string;
      }>;
    };

    let migrated = false;
    if (parsed.availabilityByInterviewer) {
      for (const [interviewerId, slots] of Object.entries(
        parsed.availabilityByInterviewer,
      )) {
        if (slots.length > 0) {
          await persistInterviewerSlots(interviewerId, slots);
          migrated = true;
        }
      }
    }
    if (parsed.bookings?.length) {
      for (const b of parsed.bookings) {
        await createBooking({
          candidate_name: b.candidateName,
          candidate_email: b.candidateEmail,
          interviewer_a_id: b.interviewerAId,
          interviewer_b_id: b.interviewerBId,
          slot_key: b.slotKey,
        });
        migrated = true;
      }
    }

    if (migrated) {
      window.localStorage.removeItem(storageKey);
    }
    return migrated;
  } catch {
    return false;
  }
}

const emptyState: SchedulerState = {
  interviewers: [],
  currentInterviewerId: "i-ava",
  availabilityByInterviewer: {},
  bookings: [],
  isLoading: true,
  error: null,
  availabilitySaveStatus: "idle",
};

const SchedulerContext = createContext<SchedulerContextValue | null>(null);

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SchedulerState>(emptyState);

  const saveAvailability = useCallback(async (interviewerId: string) => {
    const slots =
      state.availabilityByInterviewer[interviewerId] ?? [];
    setState((s) => ({ ...s, availabilitySaveStatus: "saving", error: null }));
    try {
      await persistInterviewerSlots(interviewerId, slots);
      setState((s) => ({ ...s, availabilitySaveStatus: "saved", error: null }));
      setTimeout(() => {
        setState((s) => ({ ...s, availabilitySaveStatus: "idle" }));
      }, 2000);
    } catch (err) {
      console.error("Supabase availability save error:", err);
      const msg =
        (err as { message?: string })?.message ??
        (err instanceof Error ? err.message : null) ??
        "Failed to save availability";
      setState((s) => ({
        ...s,
        availabilitySaveStatus: "idle",
        error: msg,
      }));
    }
  }, [state.availabilityByInterviewer]);

  const refetch = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const [interviewers, availability, bookings] = await Promise.all([
        getInterviewers(),
        getAllAvailability(),
        getBookings(),
      ]);

      const mappedBookings = bookings.map(mapToInterviewBooking);

      setState((s) => ({
        ...s,
        interviewers,
        availabilityByInterviewer: availability,
        bookings: mappedBookings,
        isLoading: false,
        error: null,
        availabilitySaveStatus: "idle",
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load scheduler data",
      }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await migrateFromLocalStorage();
        if (cancelled) return;

        const [interviewers, availability, bookings] = await Promise.all([
          getInterviewers(),
          getAllAvailability(),
          getBookings(),
        ]);

        if (cancelled) return;

        const mappedBookings = bookings.map(mapToInterviewBooking);

        const storedCurrent = typeof window !== "undefined"
          ? window.localStorage.getItem(currentInterviewerKey)
          : null;
        const currentInterviewerId =
          storedCurrent && interviewers.some((i) => i.id === storedCurrent)
            ? storedCurrent
            : interviewers[0]?.id ?? "i-ava";

        setState({
          interviewers,
          currentInterviewerId,
          availabilityByInterviewer: availability,
          bookings: mappedBookings,
          isLoading: false,
          error: null,
          availabilitySaveStatus: "idle",
        });
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            isLoading: false,
            error:
              err instanceof Error ? err.message : "Failed to load scheduler data",
          }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(currentInterviewerKey, state.currentInterviewerId);
  }, [state.currentInterviewerId]);

  const value = useMemo<SchedulerContextValue>(() => {
    return {
      state,
      setCurrentInterviewer(interviewerId) {
        setState((s) => ({
          ...s,
          currentInterviewerId: interviewerId,
          availabilitySaveStatus: "idle",
        }));
      },
      setInterviewerSlots(interviewerId, slots) {
        setState((s) => ({
          ...s,
          availabilityByInterviewer: {
            ...s.availabilityByInterviewer,
            [interviewerId]: slots,
          },
          availabilitySaveStatus: "idle",
        }));
      },
      saveAvailability,
      bookCandidateSlot(input) {
        createBooking({
          candidate_name: input.candidateName,
          candidate_email: input.candidateEmail,
          interviewer_a_id: input.interviewerAId,
          interviewer_b_id: input.interviewerBId,
          slot_key: input.slotKey,
          first_preference: input.firstPreference ?? null,
          second_preference: input.secondPreference ?? null,
        })
          .then((b) => {
            setState((s) => ({
              ...s,
              bookings: [mapToInterviewBooking(b), ...s.bookings],
              error: null,
            }));
          })
          .catch((err) => {
            const msg =
              (err as { message?: string })?.message ??
              (err instanceof Error ? err.message : null) ??
              "Failed to create booking";
            setState((s) => ({ ...s, error: msg }));
          });
      },
      refetch,
      clearError() {
        setState((s) => ({ ...s, error: null }));
      },
    };
  }, [state, refetch, saveAvailability]);

  return (
    <SchedulerContext.Provider value={value}>{children}</SchedulerContext.Provider>
  );
}

export function useSchedulerStore(): SchedulerContextValue {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useSchedulerStore must be used inside SchedulerProvider.");
  }
  return context;
}
