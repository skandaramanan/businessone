import type { InterviewBooking } from "@/lib/store/types";

export function computeInterviewCounts(
  bookings: InterviewBooking[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const b of bookings) {
    counts[b.interviewerAId] = (counts[b.interviewerAId] ?? 0) + 1;
    counts[b.interviewerBId] = (counts[b.interviewerBId] ?? 0) + 1;
  }
  return counts;
}

export function getSharedSlots(
  interviewerASlots: string[],
  interviewerBSlots: string[],
): string[] {
  const bSet = new Set(interviewerBSlots);
  return interviewerASlots.filter((slot) => bSet.has(slot));
}

export function getBookedSlotsForPair(
  bookings: InterviewBooking[],
  interviewerAId: string,
  interviewerBId: string,
): string[] {
  return bookings
    .filter((booking) => {
      const participants = [booking.interviewerAId, booking.interviewerBId];
      return (
        participants.includes(interviewerAId) || participants.includes(interviewerBId)
      );
    })
    .map((booking) => booking.slotKey);
}

export function getBlockedSlotLabels(
  bookings: InterviewBooking[],
  interviewerAId: string,
  interviewerBId: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const b of bookings) {
    const participants = [b.interviewerAId, b.interviewerBId];
    if (
      participants.includes(interviewerAId) ||
      participants.includes(interviewerBId)
    ) {
      result[b.slotKey] = b.candidateName;
    }
  }
  return result;
}

export function getInterviewerName(
  interviewers: { id: string; full_name: string }[],
  interviewerId: string,
): string {
  return (
    interviewers.find((i) => i.id === interviewerId)?.full_name ?? "Unknown interviewer"
  );
}
