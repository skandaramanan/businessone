"use client";

import Link from "next/link";
import { WeekAvailabilityGrid } from "@/components/availability/WeekAvailabilityGrid";
import { formatWeekDate, getWeekDates } from "@/lib/availability/weekConfig";
import { defaultInterviewers } from "@/lib/scheduler";
import { useSchedulerStore } from "@/lib/store/schedulerStore";

export default function AvailabilityPage() {
  const { state, setCurrentInterviewer, setInterviewerSlots } = useSchedulerStore();
  const selectedSlots = state.availabilityByInterviewer[state.currentInterviewerId] ?? [];
  const interviewerName =
    defaultInterviewers.find((item) => item.id === state.currentInterviewerId)?.name ??
    "Unknown interviewer";
  const weekDates = getWeekDates();

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <main className="mx-auto flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-stone-700 hover:text-stone-900">
            Back
          </Link>
          <p className="text-sm text-stone-600">
            Window: {formatWeekDate(weekDates[0])} - {formatWeekDate(weekDates[weekDates.length - 1])}
          </p>
        </div>

        <section className="schedule-layout">
          <aside className="schedule-layout-sidebar panel p-5">
            <h1 className="text-xl font-semibold text-stone-900">Add My Availabilities</h1>
            <p className="mt-2 text-sm text-stone-600">
              Drag across the grid to quickly mark available time blocks.
            </p>

            <label className="mt-5 block text-sm font-medium text-stone-700">Interviewer</label>
            <select
              className="input mt-2"
              value={state.currentInterviewerId}
              onChange={(event) => setCurrentInterviewer(event.target.value)}
            >
              {defaultInterviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.name}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-700">
              <p className="font-medium text-stone-900">{interviewerName}</p>
              <p className="mt-1">{selectedSlots.length} slots selected</p>
            </div>

            <button
              type="button"
              className="button-secondary mt-4 w-full"
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
