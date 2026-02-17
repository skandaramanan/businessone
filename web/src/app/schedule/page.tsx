"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { WeekAvailabilityGrid } from "@/components/availability/WeekAvailabilityGrid";
import { formatSlotKey } from "@/lib/availability/slots";
import { formatWeekDate, getWeekDates } from "@/lib/availability/weekConfig";
import {
  getBlockedSlotLabels,
  getBookedSlotsForPair,
  getInterviewerName,
  getSharedSlots,
} from "@/lib/scheduler";
import { TEAMS, getMemberColour, type Team } from "@/lib/teams";
import { useSchedulerStore } from "@/lib/store/schedulerStore";

export default function SchedulePage() {
  const { state, bookCandidateSlot } = useSchedulerStore();
  const [interviewerAId, setInterviewerAId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | "">("");
  const [interviewerBId, setInterviewerBId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [firstPreference, setFirstPreference] = useState<string>("");
  const [secondPreference, setSecondPreference] = useState<string>("");
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>("");
  const [message, setMessage] = useState("");
  const weekDates = getWeekDates();

  const teamMembers = useMemo(() => {
    if (!selectedTeam) return [];
    return state.interviewersByTeam[selectedTeam] ?? [];
  }, [selectedTeam, state.interviewersByTeam]);

  useEffect(() => {
    if (state.interviewers.length >= 1 && !interviewerAId) {
      setInterviewerAId(state.interviewers[0].id);
    }
  }, [state.interviewers, interviewerAId]);

  useEffect(() => {
    if (selectedTeam && interviewerBId) {
      const inTeam = teamMembers.some((m) => m.id === interviewerBId);
      if (!inTeam) setInterviewerBId("");
    }
  }, [selectedTeam, interviewerBId, teamMembers]);

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
    if (!selectedTeam) {
      setMessage("Select a team for Interviewer B.");
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
      team: selectedTeam,
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
      <div className="min-h-screen bg-[var(--background)]">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-sm text-stone-600">Loading...</p>
        </main>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-sm text-red-600">{state.error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppHeader
        rightContent={
          <p className="text-right font-body text-sm text-[#353535]/70">
            {formatWeekDate(weekDates[0])} – {formatWeekDate(weekDates[weekDates.length - 1])}
          </p>
        }
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="schedule-layout">
          <aside className="schedule-layout-sidebar panel p-6">
            <h1 className="text-xl font-semibold text-stone-900">Schedule a Candidate</h1>
            <p className="mt-2 text-sm text-stone-600">
              Select yourself, choose a team and co-interviewer, add candidate info, then pick a
              slot.
            </p>

            <label className="mt-5 block text-sm font-medium text-stone-700">
              You (Interviewer A)
            </label>
            <select
              className="input mt-2"
              value={interviewerAId}
              onChange={(event) => setInterviewerAId(event.target.value)}
            >
              <option value="">Select yourself…</option>
              {state.interviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.full_name}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-medium text-stone-700">
              Team (for Interviewer B)
            </label>
            <select
              className="input mt-2"
              value={selectedTeam}
              onChange={(event) => {
                setSelectedTeam(event.target.value as Team | "");
                setInterviewerBId("");
              }}
            >
              <option value="">Select team…</option>
              {TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
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
                {interviewerBId
                  ? getInterviewerName(state.interviewers, interviewerBId)
                  : "—"}
              </p>
              <p className="mt-1">
                {sharedSlots.length - blockedSlots.length} slots available
              </p>
              <p className="mt-1 text-stone-600">
                Black = available, Orange = your selection, Gray = booked
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

          <aside className="schedule-layout-key panel p-4">
            {selectedTeam && teamMembers.length > 0 ? (
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Key
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  Prioritize PLDs. Pick someone with fewer interviews.
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                  {teamMembers.map((member, index) => {
                    const colour = getMemberColour(member.id, index);
                    const count = state.interviewCountByInterviewer[member.id] ?? 0;
                    const isSelected = interviewerBId === member.id;
                    return (
                      <li key={member.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setInterviewerBId(isSelected ? "" : member.id)
                          }
                          className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition ${
                            isSelected
                              ? "border-stone-700 bg-stone-100 ring-1 ring-stone-700"
                              : "border-transparent hover:bg-white/60"
                          }`}
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: colour }}
                          />
                          {member.full_name} — {count} booked
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                Select a team to choose Interviewer B and view the key.
              </p>
            )}
          </aside>
        </section>

        <section className="panel mt-6 p-6">
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
                  {booking.team ? (
                    <span className="text-stone-600"> — {booking.team}</span>
                  ) : null}
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
