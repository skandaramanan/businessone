"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WeekAvailabilityGrid } from "@/components/availability/WeekAvailabilityGrid";
import { formatSlotKey } from "@/lib/availability/slots";
import { formatWeekDate, getWeekDates } from "@/lib/availability/weekConfig";
import {
  getBlockedSlotLabels,
  getBookedSlotsForPair,
  getInterviewerName,
  getSharedSlots,
} from "@/lib/scheduler";
import { TEAMS } from "@/lib/teams";
import { useSchedulerStore } from "@/lib/store/schedulerStore";

export default function SchedulePage() {
  const { state, bookCandidateSlot } = useSchedulerStore();
  const [interviewerAId, setInterviewerAId] = useState("");
  const [interviewerBId, setInterviewerBId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [firstPreference, setFirstPreference] = useState<string>("");
  const [secondPreference, setSecondPreference] = useState<string>("");

  useEffect(() => {
    if (state.interviewers.length >= 2 && !interviewerAId && !interviewerBId) {
      setInterviewerAId(state.interviewers[0].id);
      setInterviewerBId(state.interviewers[1].id);
    }
  }, [state.interviewers, interviewerAId, interviewerBId]);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>("");
  const [message, setMessage] = useState("");
  const weekDates = getWeekDates();

  const blockedSlots = useMemo(() => {
    if (interviewerAId === interviewerBId) return [];
    return getBookedSlotsForPair(state.bookings, interviewerAId, interviewerBId);
  }, [interviewerAId, interviewerBId, state.bookings]);

  const blockedSlotLabels = useMemo(
    () => getBlockedSlotLabels(state.bookings, interviewerAId, interviewerBId),
    [state.bookings, interviewerAId, interviewerBId],
  );

  const sharedSlots = useMemo(() => {
    if (interviewerAId === interviewerBId) return [];
    const interviewerASlots = state.availabilityByInterviewer[interviewerAId] ?? [];
    const interviewerBSlots = state.availabilityByInterviewer[interviewerBId] ?? [];
    return getSharedSlots(interviewerASlots, interviewerBSlots);
  }, [interviewerAId, interviewerBId, state.availabilityByInterviewer]);

  function bookSelectedSlot() {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      setMessage("Add candidate name and email before booking.");
      return;
    }
    if (interviewerAId === interviewerBId) {
      setMessage("Interviewer A and B must be different.");
      return;
    }
    if (!selectedSlotKey) {
      setMessage("Select a slot from the shared availability grid.");
      return;
    }
    if (blockedSlots.includes(selectedSlotKey)) {
      setMessage("That slot is already booked out for both interviewers.");
      return;
    }

    bookCandidateSlot({
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      interviewerAId,
      interviewerBId,
      slotKey: selectedSlotKey,
      firstPreference: firstPreference || null,
      secondPreference: secondPreference || null,
    });

    setMessage("Candidate scheduled. The selected slot has been blocked.");
    setSelectedSlotKey("");
    setCandidateName("");
    setCandidateEmail("");
    setFirstPreference("");
    setSecondPreference("");
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-8">
        <main className="mx-auto flex w-full flex-col gap-5">
          <p className="text-sm text-stone-600">Loading...</p>
        </main>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-8">
        <main className="mx-auto flex w-full flex-col gap-5">
          <p className="text-sm text-red-600">{state.error}</p>
        </main>
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold text-stone-900">Schedule a Candidate</h1>
            <p className="mt-2 text-sm text-stone-600">
              Choose interviewers, add candidate info, then select a slot from the grid.
            </p>

            <label className="mt-5 block text-sm font-medium text-stone-700">Interviewer A</label>
            <select
              className="input mt-2"
              value={interviewerAId}
              onChange={(event) => setInterviewerAId(event.target.value)}
            >
              {state.interviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.full_name}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-medium text-stone-700">Interviewer B</label>
            <select
              className="input mt-2"
              value={interviewerBId}
              onChange={(event) => setInterviewerBId(event.target.value)}
            >
              {state.interviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.full_name}
                </option>
              ))}
            </select>

            <hr className="my-5 border-stone-200" />
            <p className="text-sm font-medium text-stone-700">Candidate info</p>

            <label className="mt-4 block text-sm font-medium text-stone-700">Name</label>
            <input
              className="input mt-2"
              value={candidateName}
              onChange={(event) => setCandidateName(event.target.value)}
              placeholder="e.g. Priya Nair"
            />

            <label className="mt-4 block text-sm font-medium text-stone-700">Email</label>
            <input
              className="input mt-2"
              value={candidateEmail}
              onChange={(event) => setCandidateEmail(event.target.value)}
              placeholder="candidate@email.com"
              type="email"
            />

            <label className="mt-4 block text-sm font-medium text-stone-700">
              First preference (team)
            </label>
            <select
              className="input mt-2"
              value={firstPreference}
              onChange={(event) => setFirstPreference(event.target.value)}
            >
              <option value="">Select…</option>
              {TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-medium text-stone-700">
              Second preference (team)
            </label>
            <select
              className="input mt-2"
              value={secondPreference}
              onChange={(event) => setSecondPreference(event.target.value)}
            >
              <option value="">Select…</option>
              {TEAMS.map((team) => (
                <option key={team} value={team} disabled={team === firstPreference}>
                  {team}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-700">
              <p className="font-medium text-stone-900">
                {getInterviewerName(state.interviewers, interviewerAId)} +{" "}
                {getInterviewerName(state.interviewers, interviewerBId)}
              </p>
              <p className="mt-1">
                {sharedSlots.length - blockedSlots.length} slots available
              </p>
              <p className="mt-1 text-stone-600">
                Black = available, Green = your selection, Gray = booked
              </p>
              <p className="mt-1">
                Selected: {selectedSlotKey ? formatSlotKey(selectedSlotKey) : "None"}
              </p>
            </div>

            <button type="button" className="button-primary mt-4 w-full" onClick={bookSelectedSlot}>
              Confirm booking
            </button>

            {message ? (
              <p className="mt-3 text-sm text-stone-700">{message}</p>
            ) : null}
          </aside>

          <section className="schedule-layout-grid panel p-4">
            {interviewerAId && interviewerBId && interviewerAId === interviewerBId ? (
              <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-red-700">
                Interviewer A and B must be different to view overlap.
              </div>
            ) : (
              <WeekAvailabilityGrid
                selectedSlots={sharedSlots}
                selectableSlots={sharedSlots}
                blockedSlots={blockedSlots}
                blockedSlotLabels={blockedSlotLabels}
                activeSlotKey={selectedSlotKey}
                onSelectSlot={setSelectedSlotKey}
                mode="booking"
              />
            )}
          </section>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-semibold text-stone-900">Booked interviews</h2>
          <ul className="mt-3 space-y-2">
            {state.bookings.length === 0 ? (
              <li className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
                No bookings yet.
              </li>
            ) : (
              state.bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700"
                >
                  <span className="font-medium text-stone-900">{booking.candidateName}</span> (
                  {booking.candidateEmail})
                  {booking.firstPreference || booking.secondPreference ? (
                    <span className="text-stone-600">
                      {" "}
                      — {[booking.firstPreference, booking.secondPreference]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  ) : null}{" "}
                  — {getInterviewerName(state.interviewers, booking.interviewerAId)} +{" "}
                  {getInterviewerName(state.interviewers, booking.interviewerBId)} —{" "}
                  {formatSlotKey(booking.slotKey)}
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
