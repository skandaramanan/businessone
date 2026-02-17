"use client";

import Link from "next/link";
import { WeekAvailabilityGrid } from "@/components/availability/WeekAvailabilityGrid";
import { formatWeekDate, getWeekDates } from "@/lib/availability/weekConfig";
import { getInterviewerName } from "@/lib/scheduler";
import { useSchedulerStore } from "@/lib/store/schedulerStore";

export default function AvailabilityPage() {
  const { state, setCurrentInterviewer, setInterviewerSlots, saveAvailability, clearError } =
    useSchedulerStore();
  const selectedSlots = state.availabilityByInterviewer[state.currentInterviewerId] ?? [];
  const interviewerName = getInterviewerName(state.interviewers, state.currentInterviewerId);
  const weekDates = getWeekDates();

  if (state.isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-8">
        <main className="mx-auto flex w-full flex-col gap-5">
          <p className="text-sm text-stone-600">Loading...</p>
        </main>
      </div>
    );
  }

  if (state.error && state.interviewers.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-8">
        <main className="mx-auto flex w-full flex-col gap-5">
          <p className="text-sm text-red-600">{state.error}</p>
          <button type="button" className="button-secondary" onClick={clearError}>
            Dismiss
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <main className="mx-auto flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-stone-700 hover:text-stone-900">
              Back
            </Link>
            <p className="text-sm text-stone-600">
              Window: {formatWeekDate(weekDates[0])} - {formatWeekDate(weekDates[weekDates.length - 1])}
            </p>
          </div>
          {state.error ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-600">{state.error}</p>
              <button
                type="button"
                className="text-sm font-medium text-red-700 hover:text-red-900"
                onClick={clearError}
              >
                Dismiss
              </button>
            </div>
          ) : null}
        </div>

        <section className="schedule-layout">
          <aside className="schedule-layout-sidebar panel p-5">
            <h1 className="text-xl font-semibold text-stone-900">Add My Availabilities</h1>
            <p className="mt-2 text-sm text-stone-600">
              Drag across the grid to mark available time blocks, then confirm to save.
            </p>

            <label className="mt-5 block text-sm font-medium text-stone-700">Interviewer</label>
            <select
              className="input mt-2"
              value={state.currentInterviewerId}
              onChange={(event) => setCurrentInterviewer(event.target.value)}
            >
              {state.interviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.full_name}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-700">
              <p className="font-medium text-stone-900">{interviewerName}</p>
              <p className="mt-1">{selectedSlots.length} slots selected</p>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => saveAvailability(state.currentInterviewerId)}
              disabled={state.availabilitySaveStatus === "saving"}
            >
              {state.availabilitySaveStatus === "saving"
                ? "Saving…"
                : state.availabilitySaveStatus === "saved"
                  ? "Saved"
                  : "Confirm availability"}
            </button>

            <button
              type="button"
              className="button-secondary mt-3 w-full"
              onClick={() => setInterviewerSlots(state.currentInterviewerId, [])}
            >
              Clear all slots
            </button>
          </aside>

          <section className="schedule-layout-grid panel p-4">
            <WeekAvailabilityGrid
              selectedSlots={selectedSlots}
              onChangeSlots={(slots) => setInterviewerSlots(state.currentInterviewerId, slots)}
            />
          </section>
        </section>
      </main>
    </div>
  );
}
